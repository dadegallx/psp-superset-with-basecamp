# Superset Deployment Guide

## Infrastructure Architecture
- **Server**: DigitalOcean Droplet (`superset-server`) in `lon1`.
- **Database**: Managed Postgres (`superset-db`) in `lon1`.
- **Registry**: DigitalOcean Container Registry (`psp-superset-registry`).
- **Proxy**: Caddy (Auto-SSL) + Local Redis.

## Deployment Workflow
**We use GitHub Actions for "Click-to-Deploy".**

1.  **Commit Code**: Push changes to `main` branch.
2.  **CI Pipeline**:
    *   GitHub Action builds the Docker image.
    *   Pushes it to `registry.digitalocean.com/psp-superset-registry`.
3.  **CD Pipeline**:
    *   Action SSHs into `superset-server`.
    *   Pulls the new image.
    *   Restarts the stack.

## Initial Setup (One-Time)

### 1. Configure GitHub Secrets
Go to your GitHub Repo -> Settings -> Secrets and Variables -> Actions -> New Repository Secret.

Add these 3 secrets:
*   `DIGITALOCEAN_ACCESS_TOKEN`: Your DO API Token (read/write).
*   `HOST_IP`: **143.110.163.195**
*   `HOST_SSH_KEY`: The **Private Key** matching the public key you uploaded (`id_rsa`).

### 2. Configure Server Envrionment
SSH into the server:
```bash
ssh root@143.110.163.195
```

Navigate to the app directory:
```bash
cd /opt/superset
```

Create/Edit the `.env` file:
```bash
nano .env
```
*(Copy contents from `.env.production.template` and fill in your DB credentials and `SUPERSET_SECRET_KEY`)*.

### 3. First Manual Run (Optional)
To verify everything before the first CI deployment:
```bash
export TAG=latest
docker compose -f docker-compose.prod.yml up -d
```

## Monitoring
- **Logs**: `ssh root@... "cd /opt/superset && docker compose -f docker-compose.prod.yml logs -f"`
- **Status**: `ssh root@... "docker ps"`
