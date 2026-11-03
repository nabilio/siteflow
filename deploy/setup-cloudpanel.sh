#!/usr/bin/env bash
# =============================================================================
#  SiteFlow — Installation sur un VPS géré par CloudPanel (Hostinger "Ubuntu + CloudPanel")
#  À lancer UNE SEULE FOIS, en root :
#     sudo STUDIO_DOMAIN=studio.flowtechnologie.ma bash /opt/siteflow/deploy/setup-cloudpanel.sh
#  Ne touche PAS aux autres sites : pas de changement Nginx global, pas d'UFW, pas d'installation de MariaDB.
#  Utilise CloudPanel (clpctl) pour le vhost, la base et le certificat. Idempotent.
# =============================================================================
set -euo pipefail

command -v clpctl >/dev/null 2>&1 || { echo "CloudPanel introuvable : utilisez deploy/setup-vps.sh (serveur vierge)."; exit 1; }
[[ $EUID -eq 0 ]] || { echo "Lancer en root (sudo)."; exit 1; }

APP_DIR="/opt/siteflow"
REPO="${REPO:-https://github.com/nabilio/siteflow.git}"
STUDIO_DOMAIN="${STUDIO_DOMAIN:-studio.flowtechnologie.ma}"
CREDS="/root/.siteflow-credentials"

echo "== 1/7 Prérequis (Node >= 20, PM2)"
if ! command -v node >/dev/null || [[ "$(node -v | sed 's/v//' | cut -d. -f1)" -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null
  apt-get install -y -qq nodejs >/dev/null
fi
command -v pm2 >/dev/null || npm install -g pm2 >/dev/null 2>&1
command -v git >/dev/null || apt-get install -y -qq git >/dev/null
echo "   node $(node -v), pm2 $(pm2 -v 2>/dev/null | tail -1)"

echo "== 2/7 Code"
if [[ ! -d "$APP_DIR/.git" ]]; then
  git clone "$REPO" "$APP_DIR"
else
  git -C "$APP_DIR" fetch --all -q && git -C "$APP_DIR" reset --hard origin/main -q
fi
mkdir -p "$APP_DIR/uploads"

echo "== 3/7 Port libre (les autres apps du serveur ne sont pas touchées)"
if [[ -f "$APP_DIR/.env" ]] && grep -q '^PORT=' "$APP_DIR/.env"; then
  PORT="$(grep '^PORT=' "$APP_DIR/.env" | cut -d= -f2 | tr -d '"')"
else
  PORT="${PORT:-3020}"
  while ss -ltn 2>/dev/null | awk '{print $4}' | grep -qE "[:.]${PORT}$"; do PORT=$((PORT+1)); done
fi
echo "   SiteFlow utilisera le port $PORT"

echo "== 4/7 Site CloudPanel (reverse proxy) + base de données"
if [[ ! -f "$CREDS" ]]; then
  { echo "SITE_PASS=$(openssl rand -hex 12)"; echo "DB_PASS=$(openssl rand -hex 16)"; } > "$CREDS"
  chmod 600 "$CREDS"
fi
# shellcheck disable=SC1090
source "$CREDS"
if [[ ! -f "/etc/nginx/sites-enabled/${STUDIO_DOMAIN}.conf" ]]; then
  clpctl site:add:reverse-proxy --domainName="$STUDIO_DOMAIN" --reverseProxyUrl="http://127.0.0.1:${PORT}" \
    --siteUser="siteflow" --siteUserPassword="$SITE_PASS"
else
  echo "   vhost $STUDIO_DOMAIN déjà présent"
fi
clpctl db:add --domainName="$STUDIO_DOMAIN" --databaseName="siteflow" --databaseUserName="siteflow" \
  --databaseUserPassword="$DB_PASS" 2>&1 | tail -2 || echo "   (base déjà créée ?)"

echo "== 5/7 Configuration (.env)"
if [[ ! -f "$APP_DIR/.env" ]]; then
  ADMIN_PASS="$(openssl rand -base64 12 | tr -d '/+=')"
  cat > "$APP_DIR/.env" <<EOF
DATABASE_URL="mysql://siteflow:${DB_PASS}@127.0.0.1:3306/siteflow"
SESSION_SECRET="$(openssl rand -hex 32)"
STUDIO_HOSTS="${STUDIO_DOMAIN}"
UPLOAD_DIR="${APP_DIR}/uploads"
PORT=${PORT}
PUBLIC_SERVER_IP="$(curl -s -4 https://ifconfig.me || echo "")"
SEED_ADMIN_EMAIL="admin@flowtechnologie.ma"
SEED_ADMIN_PASSWORD="${ADMIN_PASS}"
SINGLE_SITE_SLUG=""
EOF
  chmod 600 "$APP_DIR/.env"
fi

echo "== 6/7 Build, migrations, compte admin, démarrage PM2"
cd "$APP_DIR"
npm ci --no-audit --no-fund
npx prisma migrate deploy
npm run build
set -a; source .env; set +a
SEED_DEMO=0 npm run db:seed || true
if pm2 describe siteflow >/dev/null 2>&1; then pm2 restart siteflow --update-env; else pm2 start ecosystem.config.cjs --only siteflow; fi
pm2 save >/dev/null

echo "== 7/7 Certificat HTTPS du Studio (nécessite que le DNS pointe déjà ici)"
if clpctl lets-encrypt:install:certificate --domainName="$STUDIO_DOMAIN"; then
  echo "   ✔ HTTPS actif"
else
  echo "   ⚠ Certificat non émis (DNS pas encore propagé ?). Relancez plus tard :"
  echo "     clpctl lets-encrypt:install:certificate --domainName=$STUDIO_DOMAIN"
fi

echo
echo "=================================================================="
echo " SiteFlow installé (port $PORT). Autres sites du serveur non modifiés."
echo " Studio : https://$STUDIO_DOMAIN/login"
echo " Compte : $(grep SEED_ADMIN_EMAIL .env | cut -d'"' -f2)"
echo " Mot de passe initial : $(grep SEED_ADMIN_PASSWORD .env | cut -d'"' -f2)   (à changer dans Utilisateurs)"
echo "=================================================================="
