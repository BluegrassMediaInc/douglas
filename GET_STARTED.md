# Getting Started – AI‑Powered Legal Platform

Welcome! This guide brings a fresh checkout of the mono‑repo to a running local stack in **≤ 10 minutes**.

---

## 1 Prerequisites

| Tool                    | Version | Purpose                                           |
| ----------------------- | ------- | ------------------------------------------------- |
| **Node**                |  20 LTS |  Next.js UI & Turborepo                           |
| **pnpm**                |  9.x    |  Fast JS workspace manager (via Corepack)         |
| **Python**              |  3.11   |  PDF worker & scripts                             |
| **Docker & Compose**    |  ≥ 24   |  Spin up local DB/S3/mail + hot‑reload containers |
| **direnv** *(optional)* |  v2     |  Auto‑load env vars / venv                        |

> macOS: `brew install node direnv docker docker-compose pyenv` ; Ubuntu: `sudo apt install nodejs direnv docker.io docker-compose python3.11 python3.11-venv`

---

## 2 Clone & bootstrap

```bash
# Clone
$ git clone git@github.com:your-org/legal-platform.git
$ cd legal-platform

# Load shared env (direnv)
$ direnv allow                # or manually source .envrc later

# Install JS deps for all apps
$ corepack enable && pnpm install

# Python virtualenv for worker
$ python3 -m venv .venv && source .venv/bin/activate
$ pip install -r apps/worker/requirements.txt
```

---

## 3 Spin up the local stack

```bash
$ cd docker
$ docker compose up -d    # Postgres, MinIO, Mailhog, web, worker
```

[http://localhost:3000](http://localhost:3000) → UI  |   [http://localhost:8025](http://localhost:8025) → Mailhog   |   [http://localhost:9001](http://localhost:9001) → MinIO Console (minio / minio123)

Edit code ➜ Next.js & the Python worker reload automatically inside their respective containers.

To halt the stack: `docker compose down`.

---

## 4 Common dev scripts

```bash
pnpm dev     # turbo dev (UI + tests)
pnpm lint    # eslint + mypy
pnpm test    # jest + pytest
pnpm build   # prod compile for UI & worker

# start the web app onlyi

# ensure local Postgres is up (docker compose up -d db)
pnpm --filter api run db:generate     # writes ./migrations/20250807_01_initial.sql
pnpm --filter api run db:migrate         # executes it on localhost db

pnpm --filter api run db:generate --check   # (supported drizzle-kit flag)
```


Add dependecies

```bash

pnpm --filter api add -D drizzle-kit
```

```bash
pnpm --filter api run dev
pnpm --filter web run dev
```



---

## 5 Deploying to AWS (simplified)

```bash
$ cd infra
$ terraform init   # configures remote state backend (edit backend.tf first)
$ terraform apply  # provision VPC, Aurora, S3, CloudFront, App Runner, Fargate
```

Push to `main` triggers GitHub Actions → builds two Docker images → pushes to ECR → re‑deploys App Runner & ECS worker.

---

## 6 ENV Vars quick reference

| Name             | Local value (\*.envrc)                        |  Prod source                       |
| ---------------- | --------------------------------------------- | ---------------------------------- |
| `DATABASE_URL`   | `postgres://postgres:secret@db:5432/postgres` | RDS secret via **Secrets Manager** |
| `S3_BUCKET`      | `legal-docs` (local MinIO)                    |  Actual S3 bucket ARN              |
| `OPENAI_API_KEY` |  *your test key*                              |  Secrets Manager                   |
| `AWS_REGION`     |  `us-east-1`                                  |  `us-east-1`                       |

---

## 7 Next steps

1. Update container tags in `infra/main.tf` (`latest` → CI digests).
2. Request SES production access → verify DKIM records.
3. Add Stripe keys to Secrets Manager & `.envrc`.
4. Run first migration: `pnpm drizzle push` (inside UI container).

Happy coding! 🚀
