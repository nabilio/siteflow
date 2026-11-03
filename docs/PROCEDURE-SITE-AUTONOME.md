# Procédure — Site autonome (hébergement séparé chez le client)

> **Le guide principal est désormais `docs/INSTALLATION-CHEZ-LE-CLIENT.md`** (aussi dans le Studio : Guide → Installer chez l'hébergeur du client). Ce document ne garde que les commandes SSH (import en ligne de commande, VPS).

Cas d'usage : le client veut **son propre serveur** (il ne veut pas dépendre du Studio). On installe la même application en **mode site unique** : elle ne sert que son site et son administration sur `/admin`.

Pré-requis : le domaine du client et soit un **hébergement Hostinger Node.js** (méthode simple, ci-dessous), soit un VPS Ubuntu.

## 0. Sur un hébergement mutualisé Hostinger (méthode recommandée)
Même procédure que `docs/PROCEDURE-DEPLOIEMENT.md` (partie A) avec un déploiement dédié au client : import Git de `nabilio/siteflow`, base MySQL propre, et ces variables : `DATABASE_URL`, `SESSION_SECRET`, `STUDIO_HOSTS` (vide ou domaine technique), `SINGLE_SITE_SLUG` = slug du site, `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`. Puis importer le zip (étape 1) via le Studio, ou à la main avec `npm run site:import`. Les étapes VPS ci-dessous ne concernent que les serveurs avec accès SSH.

## 1. Exporter le site depuis le Studio
Studio → site → **Mise en ligne → Exporter ce site**. On obtient `siteflow-<slug>.zip` (contenu + médias).

## 2. Installer l'application sur le serveur du client
```bash
curl -fsSL https://raw.githubusercontent.com/nabilio/siteflow/main/deploy/setup-vps.sh -o setup-vps.sh
sudo STUDIO_DOMAIN=www.entreprise.ma PORT=3020 bash setup-vps.sh
```
Puis passer en mode site unique :
```bash
sudo sed -i 's/^SINGLE_SITE_SLUG=.*/SINGLE_SITE_SLUG="entreprise"/' /opt/siteflow/.env
```
(`entreprise` = identifiant que l'on choisit ; il sera utilisé à l'import.)

## 3. Importer le site
Transférer le zip sur le serveur (depuis votre PC : `scp siteflow-<slug>.zip root@IP:/root/`), puis :
```bash
cd /opt/siteflow
set -a; source .env; set +a
npm run site:import -- /root/siteflow-<slug>.zip --slug entreprise --domain www.entreprise.ma
pm2 restart siteflow
```

## 4. Domaine + HTTPS
DNS du client : A `@` et A `www` → IP du serveur, puis :
```bash
sudo /opt/siteflow/deploy/add-domain.sh www.entreprise.ma
```

## 5. Comptes
Le super-admin créé à l'installation (`.env` → `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`) se connecte sur `https://www.entreprise.ma/admin`. Créer ensuite le compte du client dans **Accès** (rôle Client) et changer le mot de passe admin.

## 6. Mises à jour
Le serveur du client suit le même dépôt : `sudo bash /opt/siteflow/deploy/update.sh` applique la dernière version (ou configurer GitHub Actions avec ses propres secrets, voir PROCEDURE-DEPLOIEMENT.md §B).

## Rapatrier un site autonome vers le Studio
Sur le serveur du client : `cd /opt/siteflow && set -a && source .env && set +a && npm run site:export -- entreprise`, puis dans le Studio → **Importer un site** avec le zip obtenu.
