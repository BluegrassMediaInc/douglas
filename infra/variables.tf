variable "aws_region" {
  description = "Primary AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project/service prefix"
  type        = string
  default     = "legal-platform"
}

variable "environment" {
  description = "Environment label (dev|prod)"
  type        = string
  default     = "prod"
}

variable "domain_name" {
  description = "Root domain for portal & email"
  type        = string
}

# --- optional tuning flags ---

variable "app_cpu"    { type = number default = 0.25 }   # App Runner
variable "app_memory" { type = number default = 0.5 }
variable "worker_cpu" { type = number default = 256 }    # Fargate
variable "worker_mem" { type = number default = 512 }
