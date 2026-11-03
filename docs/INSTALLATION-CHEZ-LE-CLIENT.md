# Installer un site chez l'hébergeur du client

Ce guide explique comment livrer un site créé dans le Studio **sur l'hébergement choisi et payé par le client**, sans rien héberger chez FlowTechnologie. Il est écrit pour un admin non-développeur : chaque étape est une action précise.

## 1. Le principe

On installe chez le client **la même application SiteFlow en « mode site unique »** : elle ne sert que le site du client et son administration sur `https://son-domaine/admin`. Trois éléments sont nécessaires :

- **le code** de l'application (dépôt GitHub `nabilio/siteflow`, branche `main`) ;
- **une base de données MySQL** créée chez l'hébergeur (les images et PDF sont stockés dedans, il n'y a pas de dossier de fichiers à gérer) ;
- **le fichier d'export du site** (`siteflow-….zip`), produit par le Studio.

Durée : 30 à 45 minutes, dont le temps de construction de l'application (2 à 7 minutes) et la propagation du domaine (de quelques minutes à 24 h).

## 2. Avant de commencer : l'hébergement du client convient-il ?

Demander au client (ou à son hébergeur) ces cinq points. **S'il manque l'un des deux premiers, l'installation est impossible** sur cette offre.

- **Node.js version 20 ou plus** (rubrique « Applications Node.js », « Setup Node.js App », « Node.js Apps »…). Un hébergement PHP seul ne convient pas.
- **Une base MySQL ou MariaDB** (version 5.7 / 10.4 ou plus) accessible depuis l'application.
- **Mémoire suffisante pour construire l'application** : environ 1 Go de RAM disponible pendant le build. Les offres d'entrée de gamme très limitées peuvent échouer.
- **Un nom de domaine** dont on peut modifier la zone DNS (ou que l'hébergeur gère).
- **HTTPS gratuit** (Let's Encrypt) ou un certificat fourni par l'hébergeur.

| Type d'hébergement | Statut | Méthode |
|---|---|---|
| Hostinger mutualisé (Premium, Business, Cloud) avec « Node.js Apps » | ✅ Testé en réel | A |
| Hébergement cPanel / CloudLinux avec « Setup Node.js App » | ⚠️ Procédure standard, non encore testée en réel : faire un essai avant d'engager un délai de livraison | B |
| VPS Linux (Ubuntu 22.04 / 24.04) chez n'importe quel fournisseur | ✅ Scripts fournis | C |
| Hébergement PHP seul, sans Node.js | ❌ Impossible | Demander au client une offre avec Node.js, ou un petit VPS |

> Règle pratique : si le client n'a pas encore acheté son hébergement, lui recommander **Hostinger Business ou Cloud avec Node.js** : c'est la seule méthode éprouvée de bout en bout.

## 3. Étape commune : préparer les trois éléments depuis le Studio

1. **Terminer le site** dans le Studio et vérifier le rendu sur mobile.
2. **Exporter le site** : ouvrir le site → **Mise en ligne** → **Exporter ce site**. Conserver le fichier `siteflow-….zip`.
3. **Générer la configuration** : sur la même page, le bloc **Configuration pour l'hébergeur du client** produit les variables d'environnement prêtes à copier (mot de passe de la base, clé secrète, compte administrateur…). Renseigner le nom, l'utilisateur et le mot de passe de la base **après les avoir créés chez l'hébergeur** (étape suivante).
4. **Le code** : `https://github.com/nabilio/siteflow` (si l'hébergeur n'accepte pas Git : bouton *Code → Download ZIP*).
5. **Demander au client** : l'accès à son panneau d'hébergement (ou le faire ensemble en visio) et l'accès à la gestion DNS de son domaine.

### Les variables d'environnement

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | `mysql://UTILISATEUR:MOTDEPASSE@127.0.0.1:3306/NOMBASE` — toujours `127.0.0.1`, jamais `localhost` |
| `SESSION_SECRET` | chaîne aléatoire de 64 caractères (fournie par le générateur) |
| `SINGLE_SITE_SLUG` | l'identifiant du site (ex. `entreprise`) — **active le mode site unique** |
| `SEED_ADMIN_EMAIL` | e-mail du compte administrateur initial |
| `SEED_ADMIN_PASSWORD` | mot de passe initial (à changer à la première connexion) |

Ne **pas** définir `NODE_ENV` ni `PORT` : l'hébergeur les fournit. Toute modification des variables nécessite de **relancer le déploiement** (ou redémarrer l'application).

## 4. Méthode A — Hostinger mutualisé (testée)

1. **hPanel → Websites → Add website → Node.js Apps → Import Git repository** : choisir `nabilio/siteflow`, branche `main`. Réglages : Node **22**, framework **Next.js**, répertoire racine `./`, commande de build `build`, gestionnaire `npm`. *(Si GitHub n'est pas relié au compte du client : hPanel → Websites → Git → connecter GitHub, ou envoyer l'archive ZIP du code via l'option d'envoi de fichiers.)*
2. **Créer la base** : hPanel → Databases → Management → nouvelle base + utilisateur. Noter le nom de la base, l'utilisateur et le mot de passe (ils commencent par un préfixe du type `u123456789_`).
3. **Variables d'environnement** : hPanel → le site → Node.js → *Environment variables* → coller les cinq variables du générateur.
4. **Lancer le déploiement** (*Deploy* / *Redeploy*). Le premier build dure 2 à 7 minutes ; suivre le journal dans hPanel.
5. **Domaine** : le domaine du client doit être le domaine principal du site hPanel (le saisir dès la création du site, ou Domains → remplacer le domaine temporaire). Si le domaine est enregistré ailleurs, hPanel indique l'enregistrement DNS à créer (A ou CNAME). Le HTTPS s'active tout seul une fois le DNS propagé (sinon : hPanel → SSL → Installer).
6. Passer à la section **7. Premier lancement**.

## 5. Méthode B — cPanel avec « Setup Node.js App » (non encore testée)

> À valider sur un premier client. Si une étape échoue, ne pas insister : passer à la méthode C (VPS) ou à Hostinger.

1. **Envoyer le code** : cPanel → Gestionnaire de fichiers → créer un dossier `siteflow` (hors `public_html`), y envoyer le ZIP du code puis l'extraire.
2. **cPanel → Setup Node.js App → Create Application** : version Node **22** (ou 20), mode *Production*, *Application root* = `siteflow`, *Application URL* = le domaine du client, *Application startup file* = **`app.cjs`**.
3. **Variables** : dans le même écran, *Environment variables* → ajouter les cinq variables du générateur.
4. **Installer et construire** : bouton *Run NPM Install*, puis dans le **Terminal** de cPanel (copier la commande « source … » affichée en haut de la page de l'application pour entrer dans l'environnement Node) :
   ```bash
   cd ~/siteflow
   npm run build
   ```
   Si le terminal n'est pas disponible sur l'offre du client, cette méthode est impossible : choisir une autre offre.
5. **Redémarrer** l'application (bouton *Restart*).
6. Si le message `Killed` apparaît pendant le build : la limite de mémoire de l'offre est atteinte. Demander à l'hébergeur de l'augmenter ou passer à un VPS.
7. Passer à la section **7. Premier lancement**.

## 6. Méthode C — VPS Linux

Pré-requis : accès SSH root, Ubuntu 22.04 ou 24.04, domaine du client avec un enregistrement DNS **A** (`@` et `www`) vers l'IP du serveur.

```bash
curl -fsSL https://raw.githubusercontent.com/nabilio/siteflow/main/deploy/setup-vps.sh -o setup-vps.sh
sudo STUDIO_DOMAIN=www.entreprise.ma PORT=3020 bash setup-vps.sh
sudo sed -i 's/^SINGLE_SITE_SLUG=.*/SINGLE_SITE_SLUG="entreprise"/' /opt/siteflow/.env
sudo pm2 restart siteflow
```

Le script installe Node.js, MySQL, Nginx, le certificat HTTPS et affiche à la fin le mot de passe administrateur initial. Si le serveur utilise **CloudPanel**, utiliser `deploy/setup-cloudpanel.sh` à la place (voir `docs/vps/PROCEDURE-VPS.md`). Puis passer à la section **7. Premier lancement**.

## 7. Premier lancement : importer le site (toutes méthodes, 5 minutes)

Aucun terminal n'est nécessaire.

1. Ouvrir `https://domaine-du-client/` : la page « Installation en cours » s'affiche. Cliquer sur **importer le site** (ou aller directement sur `/setup`).
2. Se connecter avec `SEED_ADMIN_EMAIL` et `SEED_ADMIN_PASSWORD`.
3. Choisir le fichier `siteflow-….zip` exporté à l'étape 3, puis **Importer et ouvrir le site**.
4. Vous arrivez dans l'administration (`/admin`). Le domaine du site est déjà renseigné ; vérifier la page d'accueil du site sur ordinateur **et sur téléphone**.
5. **Sécuriser les accès** : *Accès* → modifier le compte administrateur pour changer son mot de passe ; créer le **compte du client** (rôle *Client*). Retirer ensuite `SEED_ADMIN_PASSWORD` des variables d'environnement (il ne sert qu'à la création du premier compte).
6. Conserver un compte FlowTech pour la maintenance, ou le supprimer en fin de mission selon l'accord avec le client.

## 8. Recette avant livraison

- [ ] Le site s'ouvre en **HTTPS**, avec et sans `www`.
- [ ] Page d'accueil, produits, contact : affichage correct sur **mobile** et ordinateur.
- [ ] Le **formulaire de contact** fonctionne : le message apparaît dans *Messages* de l'administration (les messages sont consultés dans l'administration, il n'y a pas d'envoi par e-mail).
- [ ] Le client se connecte à `https://son-domaine/admin` avec son compte et peut modifier un texte et ajouter une image.
- [ ] Le logo, le favicon, le téléphone, WhatsApp et l'adresse sont corrects.

## 9. Remise au client

Envoyer : l'adresse du site, l'adresse de l'administration (`/admin`), son e-mail et son mot de passe. Il peut gérer seul : textes des pages, produits, actualités, photos, coordonnées, messages reçus.

**Sauvegardes** : tout (contenu et images) est dans la base MySQL. Recommander au client l'export mensuel de sa base depuis son panneau (phpMyAdmin → Exporter), ou d'activer les sauvegardes automatiques de l'hébergeur. L'export du site depuis l'administration (*Mise en ligne → Exporter ce site*, compte FlowTech) donne aussi une copie complète.

## 10. Maintenance

- **Mises à jour** : une installation suit la branche `main`. Tester d'abord la nouvelle version sur le Studio, puis la déployer chez le client : *Redeploy* (Hostinger / cPanel après `git pull` ou nouveau ZIP + `npm run build`) ou `sudo bash /opt/siteflow/deploy/update.sh` (VPS). Les nouvelles tables sont créées automatiquement au redémarrage.
- **Rapatrier un site vers le Studio** : sur l'installation du client, *Mise en ligne → Exporter ce site*, puis dans le Studio **Importer un site**.

## 11. Dépannage

| Symptôme | Cause probable et solution |
|---|---|
| La page affiche « Installation en cours » | L'import n'est pas fait : aller sur `/setup` (section 7). |
| Erreur 503 / page blanche | Vérifier `DATABASE_URL` (hôte `127.0.0.1`, nom de base et utilisateur avec leur préfixe exact), puis relancer le déploiement. Consulter le journal de l'application dans le panneau. |
| Impossible de se connecter | Le compte administrateur n'est créé que si la base ne contient aucun utilisateur. Si le mot de passe est perdu : dans phpMyAdmin, vider la table `User`, puis redémarrer l'application : le compte est recréé avec `SEED_ADMIN_*`. |
| Le build échoue ou affiche `Killed` | Mémoire insuffisante : demander à l'hébergeur d'augmenter la limite, ou passer à une offre supérieure / un VPS. |
| Les changements de variables ne sont pas pris en compte | Relancer un déploiement (*Redeploy*) ou redémarrer l'application. |
| Navigateur : « connexion non sécurisée » | Le certificat n'est pas encore émis : attendre la propagation DNS, puis activer/installer le SSL dans le panneau de l'hébergeur. |
| L'import échoue | Vérifier que le fichier est un export SiteFlow (`siteflow-….zip`) et que sa taille ne dépasse pas la limite d'envoi de l'hébergeur ; sinon utiliser la commande `npm run site:import` en SSH (voir `docs/PROCEDURE-SITE-AUTONOME.md`). |
| Envoi d'image refusé | Maximum 20 Mo ; formats jpg, png, webp, gif, svg, pdf, mp4, webm. |
