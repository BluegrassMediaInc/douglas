
Frontend: https://yourapp.vercel.app/
API:      https://yourapp.vercel.app/api/*
Worker:   https://yourapp.vercel.app/worker


```
# Required
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-keygit

# Optional (for custom domains)  
FRONTEND_URL=https://your-domain.com
PRODUCTION_URL=https://your-production-domain.com
```


repo-root/
├─ apps/
│  ├─ web/               # Next.js 15 (+ App Router) • TypeScript
│  └─ worker/            # Python 3.11 (WeasyPrint, LangChain)
│
├─ infra/                # Terraform
│  ├─ backend.tf
│  ├─ variables.tf
│  ├─ main.tf
│  └─ outputs.tf
│
├─ docker/               # Dev-only images / compose
│  ├─ Dockerfile.web.dev
│  ├─ Dockerfile.worker.dev
│  └─ docker-compose.yml
│
├─ scripts/              # Helper shell / Python snippets
├─ .envrc                # direnv-managed ENV (NON-secrets)
├─ .env.sample           # template for secrets (not committed)
├─ package.json          # Turborepo + scripts
└─ pnpm-workspace.yaml   # or yarn workspaces


### A practical mono-repo layout

*(works well for a two-service Go-To-Market stack: **Next.js UI/API**, **Python PDF worker**, plus **Infra as Code**)*

```
repo-root/
├─ apps/
│  ├─ web/               # Next.js 15 (+ App Router) • TypeScript
│  └─ worker/            # Python 3.11 (WeasyPrint, LangChain)
│
├─ infra/                # Terraform
│  ├─ backend.tf
│  ├─ variables.tf
│  ├─ main.tf
│  └─ outputs.tf
│
├─ docker/               # Dev-only images / compose
│  ├─ Dockerfile.web.dev
│  ├─ Dockerfile.worker.dev
│  └─ docker-compose.yml
│
├─ scripts/              # Helper shell / Python snippets
├─ .envrc                # direnv-managed ENV (NON-secrets)
├─ .env.sample           # template for secrets (not committed)
├─ package.json          # Turborepo + scripts
└─ pnpm-workspace.yaml   # or yarn workspaces
```

---

## 1 — Workspace & task-runner

| Tool                                   | Why                                                                                                                   |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Turborepo** (`package.json` in root) | One command set (`turbo dev`, `turbo build`) orchestrates *web* and *worker* builds, lints and tests; caches results. |
| **pnpm** workspaces                    | Fast, deterministic installs; single lockfile. (Yarn 4 is fine too.)                                                  |
| **direnv**                             | Autoload `.envrc` so Docker, pnpm scripts and Terraform share the same vars.                                          |

<details><summary>Minimal <code>package.json</code> snippet</summary>

```json
{
  "name": "legal-platform",
  "private": true,
  "packageManager": "pnpm@9.1.0",
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

</details>

`pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
```

---

## 2 — Local infrastructure with **Docker Compose**

`docker/docker-compose.yml`

```yaml
version: "3.9"
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
    ports: ["5432:5432"]
    volumes: ["db_data:/var/lib/postgresql/data"]

  s3:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minio
      MINIO_ROOT_PASSWORD: minio123
    volumes: ["minio:/data"]
    ports: ["9000:9000", "9001:9001"]

  mail:
    image: mailhog/mailhog   # SMTP capture
    ports: ["8025:8025"]

  web:
    build:
      context: ../..
      dockerfile: docker/Dockerfile.web.dev
    env_file: ../../.env.local
    depends_on: [db, s3]
    ports: ["3000:3000"]

  worker:
    build:
      context: ../..
      dockerfile: docker/Dockerfile.worker.dev
    env_file: ../../.env.local
    depends_on: [db, s3]

volumes:
  db_data:
  minio:
```

*MinIO* emulates S3, MailHog emulates SES; your app uses the **same SDK** URLs (`http://s3:9000`, SMTP `mail:1025`) that the production code uses.

---

## 3 — Development Dockerfiles (hot-reload)

`docker/Dockerfile.web.dev`

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY apps/web ./apps/web
CMD ["pnpm","--filter","web","dev"]
```

`docker/Dockerfile.worker.dev`

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY apps/worker/pyproject.toml apps/worker/pip.lock ./
RUN pip install -r apps/worker/pip.lock
COPY apps/worker .
CMD ["python","worker.py","--dev-watch"]
```

Bind-mount code when you `docker compose up` so edits trigger Next.js / `watchdog` reload.

---

## 4 — Environment variable strategy

| File                              | Loaded by                  | Contains                                                           |
| --------------------------------- | -------------------------- | ------------------------------------------------------------------ |
| `.envrc`                          | direnv & Docker build ARGs | Non-secret config (`AWS_REGION`, `S3_ENDPOINT=http://s3:9000`)     |
| `.env.local`                      | Docker compose & Next.js   | **Secrets** for local use (`POSTGRES_PASSWORD`, `OPENAI_API_KEY`)  |
| Parameter Store / Secrets Manager | Runtime in AWS             | Production secrets injected by App Runner & ECS task-def overrides |

Use the same variable names everywhere so code doesn’t change between local and prod:

```bash
# .envrc
export DATABASE_URL=postgres://postgres:secret@localhost:5432/postgres
export S3_ENDPOINT=http://localhost:9000
export AWS_REGION=us-east-1
```

---

## 5 — Local workflow cheat-sheet

```bash
direnv allow            # loads env vars
docker compose up -d    # boots DB, MinIO, Mailhog, services
pnpm dev                # runs turbo dev outside containers if you prefer
# access:
#   UI        → http://localhost:3000
#   Mailhog   → http://localhost:8025
#   MinIO UI  → http://localhost:9001  (minio/minio123)
```

Database migrations (`drizzle-kit push`) and Terraform remain outside Docker so they keep the same CLI tooling you use in CI.

---

## 6 — CI / CD alignment

* **GitHub Actions** workflow matrix:

  * `lint`, `test`, `turbo build` on push
  * `docker/build-push-action` builds two images → pushes to ECR
  * `terraform fmt && terraform validate && terraform apply -auto-approve` on `main` (with OIDC to AWS)

* **Branch-preview**: use **App Runner automatic deployments** off a staging ECR tag plus `terraform workspace staging`.

---

### Key benefits of this layout

* **Same developer entry-point** (`docker compose up`) for every role—no global Python/Node mismatch.
* **Immutable runtime parity**: You build two images for dev; the release pipeline rebuilds those images with prod flags and the same Dockerfiles.
* **Tight feedback loop**: Turbo-repo caching + bind-mounts = sub-second reload even inside containers.
* **Single point of truth** for secrets in prod (AWS Secrets Manager) while still keeping local `.env` simple.

Spin it up locally, verify you can complete one name-change flow end-to-end, then the same repo pushes straight to the Terraform stack we generated earlier.
