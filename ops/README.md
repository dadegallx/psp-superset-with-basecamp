# Operations Scripts

Scripts for managing the production Superset deployment.

## Server Details

- **Server:** `root@143.110.163.195`
- **Superset Directory:** `/opt/superset`
- **Main Container:** `superset-superset-1`

## Available Scripts

### reset-password.sh

Reset a user's password:

```bash
./ops/reset-password.sh <username> <new_password>

# Example
./ops/reset-password.sh Rick PSP2025!Welcome
```

## Common Manual Commands

SSH into server:
```bash
ssh root@143.110.163.195
```

### Container Management

```bash
# View running containers
docker compose -f /opt/superset/docker-compose.prod.yml ps

# View logs
docker logs superset-superset-1 --tail 100 -f

# Restart a service
docker compose -f /opt/superset/docker-compose.prod.yml restart superset
```

### Superset CLI Commands

All commands run via: `docker exec superset-superset-1 superset <command>`

```bash
# List users
docker exec superset-superset-1 superset fab list-users

# Create a new user
docker exec superset-superset-1 superset fab create-user \
  --username newuser \
  --firstname First \
  --lastname Last \
  --email user@example.com \
  --password SecurePass123 \
  --role Admin

# Reset password
docker exec superset-superset-1 superset fab reset-password \
  --username USERNAME \
  --password NEWPASSWORD

# Run database migrations
docker exec superset-superset-1 superset db upgrade

# Re-initialize (after config changes)
docker exec superset-superset-1 superset init
```
