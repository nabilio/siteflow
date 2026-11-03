#!/usr/bin/env bash
# Mise à jour de SiteFlow sur le serveur (appelé par GitHub Actions, ou à la main : sudo bash deploy/update.sh)
set -euo pipefail
cd /opt/siteflow
git fetch --all
git reset --hard origin/main
npm ci --no-audit --no-fund
npx prisma migrate deploy
npm run build
pm2 restart siteflow --update-env || pm2 start ecosystem.config.cjs --only siteflow
pm2 save
echo "✔ SiteFlow mis à jour : $(git rev-parse --short HEAD)"
