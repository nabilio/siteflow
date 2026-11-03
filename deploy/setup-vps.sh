#!/usr/bin/env bash
# =============================================================================
#  SiteFlow — Installation initiale sur un VPS Ubuntu (Hostinger KVM, 22.04/24.04)
#  À lancer UNE SEULE FOIS, en root :  sudo bash setup-vps.sh
#  Idempotent : peut être relancé sans casser l'existant.
# =============================================================================
set -euo pipefail

APP_DIR="/opt/siteflow"
REPO="${REPO:-https://github.com/nabilio/siteflow.git}"   # modifier si besoin
STUDIO_DOMAIN="${STUDIO_DOMAIN:-studio.flowtechnologie.ma}"
PORT="${PORT:-3020}"
DB_NAME="siteflow"
DB_USER="siteflow"

echo "== 1/7 Paquets système"
apt-get update -qq
apt-get install -y -qq curl git nginx certbot python3-certbot-nginx mariadb-server ufw unzip >/dev/null

echo "== 2/7 Node.js 22 + PM2"
if ! command -v node >/dev/null || [[ "$(node -v | cut -c2-3)" -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null
  apt-get install -y -qq nodejs >/dev/null
fi
npm install -g pm2 >/dev/null 2>&1 || true

echo "== 3/7 Base de données MariaDB"
systemctl enable --now mariadb
DB_PASS_FILE="/root/.siteflow-db-pass"
if [[ ! -f "$DB_PASS_FILE" ]]; then
  openssl rand -hex 16 > "$DB_PASS_FILE"; chmod 600 "$DB_PASS_FILE"
fi
DB_PASS="$(cat "$DB_PASS_FILE")"
mysql -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER IF NOT EXISTS '$DB_USER'@'127.0.0.1' IDENTIFIED BY '$DB_PASS';"
mysql -e "ALTER USER '$DB_USER'@'127.0.0.1' IDENTIFIED BY '$DB_PASS';"
mysql -e "GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'127.0.0.1'; FLUSH PRIVILEGES;"

echo "== 4/7 Code de l'application"
if [[ ! -d "$APP_DIR/.git" ]]; then
  git clone "$REPO" "$APP_DIR"
fi
cd "$APP_DIR"
mkdir -p uploads
if [[ ! -f .env ]]; then
  cat > .env <<EOF
DATABASE_URL="mysql://$DB_USER:$DB_PASS@127.0.0.1:3306/$DB_NAME"
SESSION_SECRET="$(openssl rand -hex 32)"
STUDIO_HOSTS="$STUDIO_DOMAIN"
UPLOAD_DIR="$APP_DIR/uploads"
PORT=$PORT
PUBLIC_SERVER_IP="$(curl -s -4 https://ifconfig.me || echo "")"
SEED_ADMIN_EMAIL="admin@flowtechnologie.ma"
SEED_ADMIN_PASSWORD="$(openssl rand -base64 12)"
SINGLE_SITE_SLUG=""
EOF
  chmod 600 .env
  echo "   -> .env créé. Mot de passe admin initial : $(grep SEED_ADMIN_PASSWORD .env | cut -d'"' -f2)"
fi

echo "== 5/7 Build + base + compte admin"
npm ci --no-audit --no-fund
npx prisma migrate deploy
npm run build
set -a; source .env; set +a
SEED_DEMO=0 npm run db:seed || true

echo "== 6/7 PM2"
pm2 start ecosystem.config.cjs --only siteflow 2>/dev/null || pm2 restart siteflow
pm2 save
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true

echo "== 7/7 Nginx + pare-feu"
sed "s/__PORT__/$PORT/g; s/__STUDIO_DOMAIN__/$STUDIO_DOMAIN/g" deploy/nginx-siteflow.conf > /etc/nginx/sites-available/siteflow
ln -sf /etc/nginx/sites-available/siteflow /etc/nginx/sites-enabled/siteflow
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
ufw allow OpenSSH >/dev/null; ufw allow 'Nginx Full' >/dev/null; ufw --force enable >/dev/null

echo
echo "=================================================================="
echo " SiteFlow installé."
echo " 1) Pointez le DNS de $STUDIO_DOMAIN vers ce serveur (enregistrement A)."
echo " 2) Puis :  sudo $APP_DIR/deploy/add-domain.sh $STUDIO_DOMAIN"
echo " 3) Ouvrez https://$STUDIO_DOMAIN/login"
echo "    Compte : $(grep SEED_ADMIN_EMAIL .env | cut -d'"' -f2)  /  mot de passe : voir .env (SEED_ADMIN_PASSWORD)"
echo "=================================================================="
