############################################
#  Providers & global settings
############################################
terraform {
  required_version = ">= 1.7"
  required_providers {
    aws    = { source = "hashicorp/aws"  version = ">= 5.40" }
    random = { source = "hashicorp/random" version = "~> 3.6" }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags = {
    Application = var.project_name
    Environment = var.environment
  }
}

data "aws_availability_zones" "azs" {}
data "aws_caller_identity"    "me"  {}

############################################
#  1  Networking
############################################
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.5.0"

  name = "${var.project_name}-vpc"
  cidr = "10.0.0.0/16"

  azs             = slice(data.aws_availability_zones.azs.names, 0, 2)
  public_subnets  = ["10.0.0.0/24", "10.0.1.0/24"]
  private_subnets = ["10.0.10.0/24", "10.0.11.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true
}

############################################
#  2  Aurora PostgreSQL (queue + OLTP)
############################################
module "aurora" {
  source  = "terraform-aws-modules/rds-aurora/aws"
  version = "8.6.0"

  name            = "${var.project_name}-pg"
  engine          = "aurora-postgresql"
  engine_mode     = "serverless-v2"
  engine_version  = "15.4"
  instance_class  = "db.serverless"
  vpc_id          = module.vpc.vpc_id
  db_subnet_group_name   = module.vpc.database_subnet_group_name
  vpc_security_group_ids = [module.vpc.default_security_group_id]

  manage_master_user_password = true
  username                    = "postgres"

  scaling_configuration = {
    auto_pause   = true
    min_capacity = 0.5
    max_capacity = 2
  }
}

############################################
#  3  ECR repository (container images)
############################################
module "ecr" {
  source  = "terraform-aws-modules/ecr/aws"
  version = "1.6.0"
  name    = var.project_name
}

############################################
#  4  S3 bucket + CloudFront
############################################
resource "random_id" "suffix" { byte_length = 4 }

resource "aws_s3_bucket" "docs" {
  bucket        = "${var.project_name}-docs-${random_id.suffix.hex}"
  force_destroy = true

  versioning { enabled = true }

  lifecycle_rule {
    id      = "archive-old"
    enabled = true
    transition { days = 90  storage_class = "STANDARD_IA" }
    transition { days = 365 storage_class = "GLACIER" }
  }
}

resource "aws_cloudfront_origin_access_identity" "oai" { comment = var.project_name }

resource "aws_s3_bucket_policy" "docs_policy" {
  bucket = aws_s3_bucket.docs.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = { AWS = aws_cloudfront_origin_access_identity.oai.iam_arn },
      Action = ["s3:GetObject"],
      Resource = "${aws_s3_bucket.docs.arn}/*"
    }]
  })
}

resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  default_root_object = "index.html"

  origins {
    domain_name = aws_s3_bucket.docs.bucket_regional_domain_name
    origin_id   = "docsS3"
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "docsS3"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }
  }

  restrictions { geo_restriction { restriction_type = "none" } }
  viewer_certificate { cloudfront_default_certificate = true }
}

############################################
#  5  IAM for containers
############################################
data "aws_iam_policy_document" "ecs_tasks" {
  statement {
    actions = ["sts:AssumeRole"]
    principals { type = "Service" identifiers = ["ecs-tasks.amazonaws.com","build.apprunner.amazonaws.com"] }
  }
}
resource "aws_iam_role" "task_exec_role" {
  name               = "${var.project_name}-task-exec"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks.json
}
resource "aws_iam_role_policy_attachment" "task_s3" {
  role       = aws_iam_role.task_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}
resource "aws_iam_role_policy_attachment" "task_rds" {
  role       = aws_iam_role.task_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonRDSDataFullAccess"
}

############################################
# 6  App Runner UI + API
############################################
resource "aws_apprunner_service" "ui" {
  service_name = "${var.project_name}-ui"

  source_configuration {
    authentication_configuration { access_role_arn = aws_iam_role.task_exec_role.arn }
    image_repository {
      image_identifier      = "${module.ecr.repository_url}:latest"
      image_repository_type = "ECR"
    }
    auto_deployments_enabled = true
  }

  instance_configuration {
    cpu    = "${var.app_cpu} vCPU"
    memory = "${var.app_memory} GB"
  }

  health_check_configuration {
    protocol = "HTTP"
    path     = "/api/health"
    interval = 10
    timeout  = 5
  }
}

############################################
# 7  ECS Fargate PDF worker
############################################
module "ecs_worker" {
  source  = "terraform-aws-modules/ecs-fargate/aws"
  version = "5.4.0"

  name   = "${var.project_name}-worker"
  cpu    = var.worker_cpu
  memory = var.worker_mem
  container_insights      = true
  task_exec_iam_role_name = aws_iam_role.task_exec_role.name

  container_definitions = jsonencode([{
    name  = "pdf-worker"
    image = "${module.ecr.repository_url}:worker-latest"
    essential = true
    command   = ["python","worker.py"]
    environment = [
      { name = "DATABASE_URL", value = module.aurora.writer_endpoint },
      { name = "S3_BUCKET",    value = aws_s3_bucket.docs.bucket     },
      { name = "AWS_REGION",   value = var.aws_region                }
    ]
    logConfiguration = {
      logDriver = "awslogs",
      options   = {
        awslogs-group         = "/ecs/${var.project_name}-worker",
        awslogs-region        = var.aws_region,
        awslogs-stream-prefix = "ecs"
      }
    }
  }])

  desired_count                   = 1
  capacity_provider_strategies    = [{ capacity_provider = "FARGATE_SPOT", weight = 1 }]
  target_cpu_utilization_percent  = 50
  autoscaling_max_capacity        = 4
  subnet_ids                      = module.vpc.private_subnets
  security_group_ids              = [module.vpc.default_security_group_id]
}

############################################
# 8  SES domain verification
############################################
resource "aws_route53_zone" "domain" { name = var.domain_name }

resource "aws_ses_domain_identity" "ses" { domain = var.domain_name }

resource "aws_route53_record" "ses_verification" {
  zone_id = aws_route53_zone.domain.zone_id
  name    = "_amazonses.${var.domain_name}"
  type    = "TXT"
  ttl     = 600
  records = [aws_ses_domain_identity.ses.verification_token]
}

resource "aws_ses_domain_dkim" "dkim" { domain = var.domain_name }

resource "aws_route53_record" "dkim" {
  for_each = toset(aws_ses_domain_dkim.dkim.dkim_tokens)
  zone_id  = aws_route53_zone.domain.zone_id
  name     = "${each.value}._domainkey.${var.domain_name}"
  type     = "CNAME"
  ttl      = 600
  records  = ["${each.value}.dkim.amazonses.com"]
}

############################################
# 9  (Optional) CloudWatch alarm example
############################################
resource "aws_cloudwatch_metric_alarm" "worker_backlog" {
  alarm_name          = "PDFJobBacklog"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "JobsPending"
  namespace           = "Custom/PDFWorker"
  period              = 60
  statistic           = "Average"
  threshold           = 10
}
