# Procédure de mise en production — SiteFlow

Cette procédure installe **le Studio** (une seule fois) puis explique comment **mettre en ligne chaque site client** (à chaque nouveau client). Elle est écrite pour un admin non-développeur : chaque étape est une action précise.

---

## A0. Serveur Hostinger avec CloudPanel (votre cas : VPS 72.61.93.30)

Le VPS utilise **CloudPanel** : il gère déjà Nginx, la base MySQL et les certificats des autres apps (ColiCo, SyndicFlow…). Il faut donc utiliser le script CloudPanel, qui **ne touche à aucune autre app** (le script `setup-vps.sh` refuse d'ailleurs de tourner ici).

1. **DNS** (chez le registrar de `flowtechnologie.ma`) : enregistrement **A** `studio` → `72.61.93.30`.
2. **hPanel → VPS → Terminal du navigateur** (ou SSH root), copier-coller :
   ```bash
   git clone https://github.com/nabilio/siteflow /opt/siteflow
   sudo STUDIO_DOMAIN=studio.flowtechnologie.ma bash /opt/siteflow/deploy/setup-cloudpanel.sh
   ```
   Le script choisit un port libre (3020 si disponible), crée via CloudPanel le site reverse-proxy `studio.flowtechnologie.ma` et la base `siteflow`, construit l'application, la lance avec PM2 et demande le certificat HTTPS. À la fin il affiche le **mot de passe admin initial**.
3. Ouvrir `https://studio.flowtechnologie.ma/login`, se connecter, changer le mot de passe (Utilisateurs → Modifier).
4. **Chaque domaine client** : `sudo /opt/siteflow/deploy/add-domain.sh www.entreprise.ma` (crée le site reverse-proxy dans CloudPanel + certificat). Les clients apparaissent dans CloudPanel comme des sites « Reverse Proxy » pointant vers SiteFlow ; ne pas les supprimer depuis CloudPanel.
5. Si, sur un domaine client, la page affiche « Aucun site n'est configuré pour ce domaine » avec un domaine reçu inattendu, c'est que le vhost ne transmet pas le nom de domaine d'origine : le champ « Domaine reçu » indique ce que l'application a vu.

Les sections suivantes décrivent le cas d'un serveur vierge sans CloudPanel (`setup-vps.sh`).

---

## A. Installation du Studio sur un VPS vierge (une seule fois, ~15 min)

### Pré-requis
- Un VPS Hostinger (KVM 1 suffit) sous **Ubuntu 22.04 ou 24.04**, avec accès SSH root.
- Un sous-domaine pour le Studio, ex. `studio.flowtechnologie.ma`.
- Le dépôt GitHub `siteflow` accessible (public, ou clé de déploiement ajoutée sur le VPS).

### Étapes
1. **DNS** : chez le registrar de `flowtechnologie.ma`, créer un enregistrement **A** `studio` → IP du VPS.
2. **Se connecter au VPS** (hPanel → VPS → Terminal du navigateur, ou `ssh root@IP`).
3. **Lancer l'installation** (copier-coller tel quel) :
   ```bash
   curl -fsSL https://raw.githubusercontent.com/nabilio/siteflow/main/deploy/setup-vps.sh -o setup-vps.sh
   sudo STUDIO_DOMAIN=studio.flowtechnologie.ma bash setup-vps.sh
   ```
   Le script installe Node 22, MariaDB, Nginx, PM2, clone le dépôt dans `/opt/siteflow`, crée la base, le fichier `.env`, le compte super-admin, construit et démarre l'application. Il affiche le **mot de passe admin initial** à la fin (aussi dans `/opt/siteflow/.env`, ligne `SEED_ADMIN_PASSWORD`).
4. **Activer HTTPS du Studio** :
   ```bash
   sudo /opt/siteflow/deploy/add-domain.sh studio.flowtechnologie.ma
   ```
5. Ouvrir `https://studio.flowtechnologie.ma/login`, se connecter, **changer le mot de passe** (Utilisateurs → Modifier).
6. Créer un compte pour chaque admin FlowTech (Utilisateurs → Ajouter, rôle *Admin FlowTech*).

> Le VPS héberge déjà d'autres apps PM2 (ColiCo port 3000, SyndicFlow 3011…) ? SiteFlow utilise le **port 3020** par défaut ; si ce port est pris, lancer le script avec `PORT=3021` et adapter.

---

## B. Déploiement automatique des mises à jour (GitHub Actions)

À faire une fois pour que chaque `git push` sur `main` mette le serveur à jour :

1. Sur le VPS, créer une clé dédiée : `ssh-keygen -t ed25519 -f /root/.ssh/gh_deploy -N ""` puis `cat /root/.ssh/gh_deploy.pub >> /root/.ssh/authorized_keys`.
2. Afficher la clé privée : `cat /root/.ssh/gh_deploy` (à copier intégralement).
3. Sur GitHub → dépôt `siteflow` → *Settings → Secrets and variables → Actions* → ajouter :
   - `VPS_HOST` = IP du VPS
   - `VPS_USER` = `root`
   - `VPS_SSH_KEY` = contenu de la clé privée
   - `VPS_PORT` = `22` (facultatif)
4. Le workflow `.github/workflows/deploy.yml` fait : vérification TypeScript → connexion SSH → `deploy/update.sh` (git pull, migrations, build, redémarrage PM2).

Mise à jour manuelle possible à tout moment : `sudo bash /opt/siteflow/deploy/update.sh`.

---

## C. Mettre en ligne un site client (à chaque client, ~10 min + DNS)

Tout se fait depuis le Studio, page **Mise en ligne** du site, qui vérifie chaque étape automatiquement.

1. **Créer et personnaliser le site** dans le Studio (voir `docs/GUIDE-ADMIN.md`).
2. **Paramètres → Domaine** : saisir le domaine du client, ex. `www.entreprise.ma`.
3. **DNS du client** (chez son registrar) : deux enregistrements **A** :
   | Type | Nom | Valeur |
   |---|---|---|
   | A | `@` | IP du VPS |
   | A | `www` | IP du VPS |
   Propagation : de 5 minutes à 24 h. La page *Mise en ligne* indique quand c'est bon.
4. **Certificat HTTPS** (sur le VPS, une commande) :
   ```bash
   sudo /opt/siteflow/deploy/add-domain.sh www.entreprise.ma
   ```
5. **Publier** : bouton *Publier le site* (page Mise en ligne ou Tableau de bord).
6. **Vérifier** : ouvrir `https://www.entreprise.ma` sur mobile et PC, envoyer un message test via le formulaire de contact, vérifier qu'il arrive dans *Messages*.
7. **Livrer au client** : son site + son accès `https://www.entreprise.ma/admin` (compte créé dans *Accès*).

### Changer le domaine d'un site déjà en ligne
Paramètres → Domaine → nouveau domaine, puis relancer `add-domain.sh nouveau-domaine`. L'ancien bloc Nginx peut être supprimé : `sudo rm /etc/nginx/sites-enabled/site-ancien-domaine && sudo systemctl reload nginx`.

### Retirer un site
Paramètres → État = *Archivé* (le domaine affiche « site en préparation »), ou *Supprimer définitivement*.

---

## D. Sauvegardes

- **Base de données** (tous les sites) : `mysqldump siteflow > /root/siteflow-$(date +%F).sql`
- **Médias** : dossier `/opt/siteflow/uploads/`
- Sauvegarde quotidienne automatique (cron root) :
  ```bash
  (crontab -l 2>/dev/null; echo "15 3 * * * mysqldump siteflow | gzip > /root/backups/db-\$(date +\%F).sql.gz && tar czf /root/backups/uploads-\$(date +\%F).tgz -C /opt/siteflow uploads && find /root/backups -mtime +14 -delete") | crontab -
  mkdir -p /root/backups
  ```
- Hostinger propose aussi les snapshots VPS hebdomadaires (hPanel → VPS → Snapshots).

---

## E. Dépannage rapide

| Symptôme | Que faire |
|---|---|
| Le domaine affiche « Aucun site n'est configuré » | Le domaine saisi dans Paramètres ne correspond pas au domaine tapé. Vérifier l'orthographe (www ou pas, les deux marchent). |
| « Site en préparation » | Le site est en brouillon → Publier. |
| Pas de HTTPS / avertissement sécurité | Relancer `add-domain.sh domaine`. Si échec : DNS pas encore propagé. |
| Le site ne répond pas du tout | `pm2 status` puis `pm2 logs siteflow --lines 50`. Redémarrer : `pm2 restart siteflow`. |
| Après un push GitHub, rien ne change | GitHub → onglet Actions : voir si le workflow a échoué. Sinon `sudo bash /opt/siteflow/deploy/update.sh` à la main. |
| Upload refusé | Max 50 Mo par fichier ; formats : jpg, png, webp, gif, svg, pdf, mp4, webm. |
| Mot de passe admin perdu | Sur le VPS : `cd /opt/siteflow && npx tsx -e "import('./src/lib/auth').then(async a=>{const {prisma}=await import('./src/lib/db');await prisma.user.update({where:{email:'admin@flowtechnologie.ma'},data:{passwordHash:await a.hashPassword('NouveauMdp')}});console.log('ok');process.exit()})"` |
