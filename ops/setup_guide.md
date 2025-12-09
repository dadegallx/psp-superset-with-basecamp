# DevOps Guide for Superset on DigitalOcean

## 1. Repository Structure
You should **Fork** this repository so you own your own copy on GitHub/GitLab.
- **Upstream**: The official `apache/superset` repo. You pull from here to get updates.
- **Origin**: Your fork. You push your config and custom code here.

### Suggested Workflow
1.  `git remote add upstream https://github.com/apache/superset.git`
2.  `git fetch upstream`
3.  **Rebase** your changes on top of upstream releases: `git rebase upstream/master` (or specific tags like `6.0.0rc1`).

## 2. Configuration Strategy (The "Overlay" Pattern)
Avoid modifying core files like `superset/config.py` or `docker-compose.yml` directly. This causes merge conflicts.

### A. Environment Variables (Secrets)
- **Local**: Create `docker/.env-local`. This file is git-ignored. Put your local passwords and keys here.
- **Production**: Set these as actual Environment Variables in your DigitalOcean Droplet or App Platform console.

### B. Python Config (Superset tweaking)
- Config is loaded from `docker/pythonpath_dev/superset_config.py`.
- That file attempts to import `superset_config_docker.py`.
- **Action**: Create `docker/pythonpath_dev/superset_config_docker.py`. Put your custom logic there (e.g. Auth settings, Feature Flags).

### C. Infrastructure (Docker Compose)
- Docker Compose automatically reads `docker-compose.override.yml` if it exists.
- **Action**: Create `docker-compose.override.yml` in the root (and git-ignore it!). Use this to change ports, add volumes, or change image tags for local testing without touching the main `docker-compose.yml`.

## 3. Staging vs Production
- **Branches**: 
    - `main`: Deploy to Staging.
    - `production`: Deploy to Production (Promote from main).
- **Config Separation**:
    - Build a single Docker Image (or use the official one).
    - Inject config ONLY via Environment Variables (`DATABASE_URI`, `REDIS_HOST`, etc).
    - **NEVER** bake secrets into the image.

## 4. Deploying to DigitalOcean (Simple Path: Droplet)
1.  **Provision a Droplet** (Ubuntu Docker image is easiest).
2.  **Database**: Managed Postgres (Recommended) or run Postgres in Docker (Cheaper, harder to manage).
3.  **Cache**: Managed Redis (Recommended) or Redis in Docker.
4.  **Clone your fork** on the server.
5.  **Setup `.env`**: Copy your production secrets to `.env` on the server.
6.  **Run**: `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
    - *Note: `docker-compose.prod.yml` is a file you create to remove dev-only services (like node-dev) and set restart policies.*

## 5. Deployment Checklist
- [ ] Set `SECRET_KEY` (Rotated, cryptographically secure).
- [ ] Set `sqlalchemy.url` to point to Managed DB.
- [ ] Set `GUNI_WORKERS` for concurrency.
