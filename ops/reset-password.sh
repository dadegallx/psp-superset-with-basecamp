#!/bin/bash
#
# Reset a Superset user's password on the production server
#
# Usage:
#   ./ops/reset-password.sh <username> <new_password>
#
# Examples:
#   ./ops/reset-password.sh Rick PSP2025!Welcome
#   ./ops/reset-password.sh admin NewSecurePass123
#

set -e

# Configuration
SERVER="root@143.110.163.195"
SUPERSET_DIR="/opt/superset"
CONTAINER="superset-superset-1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Check arguments
if [ $# -ne 2 ]; then
    echo -e "${RED}Error: Missing arguments${NC}"
    echo ""
    echo "Usage: $0 <username> <new_password>"
    echo ""
    echo "Examples:"
    echo "  $0 Rick PSP2025!Welcome"
    echo "  $0 admin NewSecurePass123"
    exit 1
fi

USERNAME="$1"
PASSWORD="$2"

echo "Resetting password for user: $USERNAME"
echo "Server: $SERVER"
echo ""

# Execute password reset
ssh "$SERVER" "docker exec $CONTAINER superset fab reset-password --username $USERNAME --password $PASSWORD"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}Password successfully reset for user: $USERNAME${NC}"
else
    echo ""
    echo -e "${RED}Failed to reset password${NC}"
    exit 1
fi
