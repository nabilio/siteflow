#!/usr/bin/env bash
# =============================================================================
#  SiteFlow — Active un domaine client sur le serveur (Nginx + certificat HTTPS)
#  Usage :  sudo /opt/siteflow/deploy/add-domain.sh www.entreprise.ma [email@contact]
#  Pré-requis : le DNS du domaine (@ et www) pointe déjà vers l'IP de ce serveur.
# =============================================================================
set -euo pipefail

RAW="${1:-}"
EMAIL="${2:-${CERTBOT_EMAIL:-admin@flowtechnologie.ma}}"
[[ -z "$RAW" ]] && { echo "Usage : add-domain.sh www.entreprise.ma [email]"; exit 1; }

DOMAIN="$(echo "$RAW" | sed -E 's#^https?://##; s#/.*$##; s#^www\.##' | tr 'A-Z' 'a-z')"
PORT="$(grep -E '^PORT=' /opt/siteflow/.env | cut -d= -f2 | tr -d '"' || echo 3020)"
PORT="${PORT:-3020}"
CONF="/etc/nginx/sites-available/site-$DOMAIN"

echo "== Domaine : $DOMAIN (et www.$DOMAIN)"

# Vérification DNS (avertissement seulement)
IP="$(curl -s -4 https://ifconfig.me || true)"
for H in "$DOMAIN" "www.$DOMAIN"; do
  R="$(getent ahostsv4 "$H" | awk '{print $1}' | sort -u | tr '\n' ' ')"
  if [[ -n "$IP" && "$R" != *"$IP"* ]]; then
    echo "   ⚠ $H pointe vers [$R], pas vers $IP. Le certificat échouera tant que le DNS n'est pas propagé."
  fi
done

# Bloc Nginx dédié (nécessaire pour que certbot sache où mettre le certificat)
cat > "$CONF" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
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
ln -sf "$CONF" "/etc/nginx/sites-enabled/site-$DOMAIN"
nginx -t && systemctl reload nginx

echo "== Certificat Let's Encrypt"
if certbot --nginx -n --agree-tos --redirect -m "$EMAIL" -d "$DOMAIN" -d "www.$DOMAIN"; then
  echo "✔ HTTPS actif : https://$DOMAIN"
else
  echo "✘ Échec du certificat pour www.$DOMAIN ou $DOMAIN. Nouvel essai sans www…"
  certbot --nginx -n --agree-tos --redirect -m "$EMAIL" -d "$DOMAIN" && echo "✔ HTTPS actif (sans www) : https://$DOMAIN"
fi
nginx -t && systemctl reload nginx
echo "== Terminé. Dans le Studio : Paramètres → Domaine = $DOMAIN (ou www.$DOMAIN), puis Publier."
