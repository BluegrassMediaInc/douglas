Below is a clean **four-file breakup** of the stack I scaffolded.
Copy each block into its own file under `infra/` so your directory looks like:

```
repo-root/
└─ infra/
   ├─ backend.tf      # remote-state backend
   ├─ variables.tf    # all inputs
   ├─ main.tf         # resources & modules
   └─ outputs.tf      # values for CI / other code
```

**Next steps**

1. Add the files under `infra/`, commit, and run:

```bash
cd infra
terraform init     # downloads providers & configures backend
terraform apply    # review plan, then “yes”
```

2. Point your CI build to push two images to the ECR repo
   (`web:latest`, `worker-latest`) so App Runner & ECS pull the new code.

3. After DNS TTLs, verify:

   * `terraform output ui_url` loads the portal
   * PDFs upload to S3 and stream through `cdn_url`
   * SES is out of sandbox (request production access).

Ping me when you’re ready for IAM hardening, database migrations, or GitHub Actions YAML, and we’ll continue refining.
