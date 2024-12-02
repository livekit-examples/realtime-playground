#!/bin/bash

set -e

# run agent
echo "###agent###"
cd /app/realtime/agent
python main.py start > data.log 2>&1 &

echo "###web###"
cd /app/realtime/web
pnpm start > data.log 2>&1 &

# Keep the container running
tail -f /dev/null