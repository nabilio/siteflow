# Procédure de mise en production — SiteFlow (hébergement mutualisé Hostinger)

SiteFlow s'installe **une seule fois** (le *Studio*) sur un hébergement mutualisé Hostinger avec Node.js. Chaque client est ensuite un site créé dans le Studio, rattaché à son nom de domaine.
Tout se fait dans **hPanel** (navigateur), sans terminal.

> Variante VPS (CloudPanel ou serveur vierge) : `docs/vps/PROCEDURE-VPS.md`.

---

## A. Installation du Studio (une seule fois, ~15 min)

### Pré-requis
- Un hébergement Hostinger **mutualisé/Business** avec Node.js (Websites → Add website → *Node.js Apps*).
- Le dépôt GitHub `nabilio/siteflow` (public) et l'application GitHub Hostinger connectée (hPanel → Websites → Git).

### Étapes
1. **hPanel → Websites → Add website → Node.js Apps → Import Git repository** : choisir `nabilio/siteflow`, branche `main`. Réglages : Node **22**, framework **Next.js**, répertoire racine `./`, commande de build `build`, gestionnaire `npm`.
   *(Le premier build prend 2 à 3 minutes : le serveur n'a pas le compilateur natif, SiteFlow est déjà préparé pour cela.)*
2. **Créer la base MySQL** : hPanel → Databases → MySQL → créer une base et un utilisateur (noter nom, utilisateur, mot de passe).
3. **Variables d'environnement** : hPanel → le site → Node.js → *Environment variables* :

   | Variable | Valeur |
   |---|---|
   | `DATABASE_URL` | `mysql://UTILISATEUR:MOTDEPASSE@127.0.0.1:3306/NOMBASE` (toujours `127.0.0.1`, jamais `localhost`) |
   | `SESSION_SECRET` | une longue chaîne aléatoire (64 caractères) |
   | `STUDIO_HOSTS` | le domaine du Studio, ex. `studio.flowtechnologie.ma` (plusieurs : séparés par des virgules) |
   | `SEED_ADMIN_EMAIL` | l'e-mail du super-admin |
   | `SEED_ADMIN_PASSWORD` | son mot de passe initial (à changer ensuite) |

   Ne **pas** définir `NODE_ENV`. Après modification : relancer un déploiement (*Redeploy*).
4. **Au premier démarrage**, l'application crée toute seule les tables et le compte super-admin (aucune commande à lancer).
5. Ouvrir `https://DOMAINE-DU-STUDIO/login`, se connecter, **changer le mot de passe** (Utilisateurs → Modifier), puis créer un compte par admin FlowTech (rôle *Admin FlowTech*).
6. **Domaine du Studio** : hPanel → le site → Domains → remplacer le domaine temporaire par `studio.flowtechnologie.ma` (DNS : enregistrement A/CNAME indiqué par hPanel), puis mettre ce domaine dans `STUDIO_HOSTS`.

Les médias (images, PDF) sont stockés **dans la base de données** (max 20 Mo par fichier) : ils survivent aux redéploiements et sont sauvegardés avec la base.

## B. Mises à jour
Chaque `git push` sur `main` met le Studio à jour (auto-déploiement Hostinger). Les nouvelles tables sont créées automatiquement au redémarrage. Sinon : hPanel → Node.js → *Redeploy*.

## C. Mettre en ligne un site client
1. Créer et personnaliser le site dans le Studio (`docs/GUIDE-ADMIN.md`), renseigner **Paramètres → Domaine**.
2. **Rattacher le domaine du client au Studio** : hPanel → le site du Studio → Domains → *Parked domain / Alias* → ajouter `www.entreprise.ma` (ou `entreprise.ma`), puis pointer le DNS du client (A `@` et `www`) vers l'adresse IP indiquée par hPanel.
3. Publier le site (page *Mise en ligne*), vérifier sur mobile et PC, tester le formulaire de contact.
4. Donner au client : `https://www.entreprise.ma/admin` (compte créé dans *Accès*).

> ⚠️ Le rattachement d'un domaine « alias » à une application Node.js dépend de l'offre Hostinger : à valider avec un premier domaine réel. Si l'alias n'atteint pas l'application, utiliser le **site autonome** (`docs/PROCEDURE-SITE-AUTONOME.md`) : un déploiement SiteFlow dédié par client.

## D. Sauvegardes
hPanel → Databases → phpMyAdmin → Exporter (tous les sites + médias dans une seule base), ou sauvegardes automatiques Hostinger. Un site seul : Mise en ligne → *Exporter* (zip).

## E. Dépannage
| Symptôme | Que faire |
|---|---|
| Build en échec | hPanel → Node.js → journal du build ; le message d'analyse indique la cause. |
| « Aucun site n'est configuré pour ce domaine » | Le domaine saisi dans Paramètres ne correspond pas au domaine reçu (affiché sur la page). |
| Page blanche / 503 après modification des variables | *Redeploy*. Vérifier `DATABASE_URL` (hôte `127.0.0.1`). |
| Impossible de se connecter | Vérifier `SEED_ADMIN_*` (le compte n'est créé que si la base n'a aucun utilisateur). |
| Upload refusé | Max 20 Mo ; formats jpg, png, webp, gif, svg, pdf, mp4, webm. |
