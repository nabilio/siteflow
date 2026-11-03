#!/usr/bin/env bash
# =============================================================================
#  SiteFlow — Active un domaine client sur le serveur (vhost + certificat HTTPS)
#  Usage :  sudo /opt/siteflow/deploy/add-domain.sh www.entreprise.ma [email@contact]
#  Pré-requis : le DNS du domaine (@ et www) pointe déjà vers l'IP de ce serveur.
#  Détecte CloudPanel (clpctl) et l'utilise ; sinon Nginx + certbot (serveur vierge).
#  Un sous-domaine (ex. studio.flowtechnologie.ma) est traité seul, sans "www.".
# =============================================================================
set -euo pipefail

RAW="${1:-}"
EMAIL="${2:-${CERTBOT_EMAIL:-admin@flowtechnologie.ma}}"
[[ -z "$RAW" ]] && { echo "Usage : add-domain.sh www.entreprise.ma [email]"; exit 1; }

HOST="$(echo "$RAW" | sed -E 's#^https?://##; s#/.*$##' | tr 'A-Z' 'a-z')"
BARE="${HOST#www.}"

# Sous-domaine ? (>= 3 libellés, en tenant compte des suffixes comme co.ma / com.ma)
LABELS="$(echo "$BARE" | awk -F. '{print NF}')"
if echo "$BARE" | grep -qE '\.(co|com|org|net|gov|ac)\.ma$'; then LABELS=$((LABELS-1)); fi
if [[ "$HOST" != www.* && "$LABELS" -ge 3 ]]; then
  SITE="$BARE"; SAN=""          # sous-domaine : un seul nom
else
  SITE="www.$BARE"; SAN="$BARE" # domaine principal : www + sans www
fi

PORT="$(grep -E '^PORT=' /opt/siteflow/.env 2>/dev/null | cut -d= -f2 | tr -d '"' || true)"
PORT="${PORT:-3020}"
echo "== Domaine : $SITE ${SAN:+(+ $SAN)} → application sur le port $PORT"

IP="$(curl -s -4 https://ifconfig.me || true)"
for H in $SITE $SAN; do
  R="$(getent ahostsv4 "$H" | awk '{print $1}' | sort -u | tr '\n' ' ')"
  if [[ -n "$IP" && "$R" != *"$IP"* ]]; then
    echo "   ⚠ $H pointe vers [$R], pas vers $IP. Le certificat échouera tant que le DNS n'est pas propagé."
  fi
done

# ----------------------------------------------------------------- CloudPanel
if command -v clpctl >/dev/null 2>&1; then
  if [[ -f "/etc/nginx/sites-enabled/${SITE}.conf" ]]; then
    echo "== Vhost CloudPanel déjà présent pour $SITE"
  else
    echo "== Création du vhost CloudPanel (reverse proxy)"
    USER_NAME="sf$(echo "$BARE" | tr -dc 'a-z0-9' | cut -c1-12)"
    clpctl site:add:reverse-proxy --domainName="$SITE" --reverseProxyUrl="http://127.0.0.1:${PORT}" \
      --siteUser="$USER_NAME" --siteUserPassword="$(openssl rand -hex 12)"
  fi
  echo "== Certificat Let's Encrypt (CloudPanel)"
  if [[ -n "$SAN" ]]; then
    clpctl lets-encrypt:install:certificate --domainName="$SITE" --subjectAlternativeName="$SAN"
  else
    clpctl lets-encrypt:install:certificate --domainName="$SITE"
  fi
  echo "✔ Terminé. Dans le Studio : Paramètres → Domaine = $BARE, puis Publier."
  echo "  Contrôle : https://$SITE doit afficher le site (ou « Aucun site configuré pour ce domaine » + le domaine reçu)."
  exit 0
fi

# ------------------------------------------------------------ Nginx + certbot
CONF="/etc/nginx/sites-available/site-$BARE"
cat > "$CONF" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $SITE $SAN;
    client_max_body_size 60m;
    location /_next/static/ {
        proxy_pass http://127.0.0.1:$PORT;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 120s;
    }
}
EOF
ln -sf "$CONF" "/etc/nginx/sites-enabled/site-$BARE"
nginx -t && systemctl reload nginx

echo "== Certificat Let's Encrypt"
CB_NAMES=(-d "$SITE"); [[ -n "$SAN" ]] && CB_NAMES+=(-d "$SAN")
if certbot --nginx -n --agree-tos --redirect -m "$EMAIL" "${CB_NAMES[@]}"; then
  echo "✔ HTTPS actif : https://$SITE"
else
  echo "✘ Échec du certificat (DNS pas propagé ?). Relancez la commande plus tard."
  exit 1
fi
nginx -t && systemctl reload nginx
echo "== Terminé. Dans le Studio : Paramètres → Domaine = $BARE, puis Publier."
