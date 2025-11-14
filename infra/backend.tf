terraform {
  backend "s3" {
    bucket         = "tf-state-legal-platform"      # ← create once
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "tf-state-locks"               # optional state lock
    encrypt        = true
  }
}
