output "ui_url" {
  value       = aws_apprunner_service.ui.service_url
  description = "Public URL of Next.js UI/API"
}

output "cdn_url" {
  value       = "https://${aws_cloudfront_distribution.cdn.domain_name}"
  description = "Public CloudFront URL for generated PDFs"
}

output "s3_bucket" {
  value = aws_s3_bucket.docs.bucket
}

output "database_writer_endpoint" {
  value = module.aurora.writer_endpoint
}

output "ses_domain_identity_arn" {
  value = aws_ses_domain_identity.ses.arn
}
