#!/usr/bin/env bash
set -e
echo "🔧 Installing Node.js 24.x..."
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt-get install -y nodejs
echo "✅ Versions:"
node -v
pnpm -v
