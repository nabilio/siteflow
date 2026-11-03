# SiteFlow

Générateur et hébergeur de sites vitrines pour les clients de FlowTechnologie. Les admins créent des sites **sans code et sans IA** depuis un Studio ; chaque site a son propre back-office client sur `son-domaine/admin`.

- **Studio** (`/studio`) : création de sites par modèle, éditeur de pages par blocs, produits, actualités/salons, médias, messages, paramètres, accès, mise en ligne guidée.
- **Sites clients** : un domaine par site, servis par la même application (multi-sites). Export possible en « site autonome » (mode site unique sur un autre serveur).
- **Stack** : Next.js 16 (App Router) · Prisma · MySQL/MariaDB · Tailwind 4 · hébergement mutualisé Hostinger (Node.js, déploiement Git) · variante VPS.

## Documentation
| Document | Pour qui |
|---|---|
| [docs/GUIDE-ADMIN.md](docs/GUIDE-ADMIN.md) | Admins : créer et livrer un site client |
| [docs/PROCEDURE-DEPLOIEMENT.md](docs/PROCEDURE-DEPLOIEMENT.md) | Installation du Studio, mise en ligne d'un domaine, sauvegardes, dépannage |
| [docs/INSTALLATION-CHEZ-LE-CLIENT.md](docs/INSTALLATION-CHEZ-LE-CLIENT.md) | **Installer un site chez l'hébergeur du client** (Hostinger, cPanel, VPS) |
| [docs/PROCEDURE-SITE-AUTONOME.md](docs/PROCEDURE-SITE-AUTONOME.md) | Commandes SSH complémentaires |

## Développement local
```bash
cp .env.example .env        # renseigner DATABASE_URL (MySQL local)
npm install
npx prisma migrate dev
npm run db:seed             # crée admin@flowtechnologie.ma + un site de démo (/s/demo)
npm run dev                 # http://localhost:3000/login
```
Simuler un domaine client en local : ajouter `127.0.0.1 www.client.test` dans le fichier hosts, mettre `client.test` comme domaine du site, ouvrir `http://www.client.test:3000`.

## Structure
```
src/app/studio/…           Back-office (Studio + admin client via /admin)
src/app/sf-site/…          Rendu public des sites (routé par domaine dans src/proxy.ts)
src/app/s/[slug]/…         Aperçu d'un site depuis le Studio
src/components/site/       En-tête, pied de page, rendu des blocs
src/lib/blocks.ts          Catalogue des blocs (schéma = formulaire généré automatiquement)
src/lib/templates.ts       Modèles de sites (thème + pages par défaut)
src/lib/actions/           Server actions (sites, pages, contenu)
prisma/schema.prisma       Modèle de données
deploy/                    Scripts de la variante VPS (voir docs/vps)
scripts/                   Export / import d'un site
```

## Ajouter un type de bloc
1. Décrire ses champs dans `src/lib/blocks.ts` (le formulaire de l'éditeur est généré automatiquement).
2. Ajouter son rendu dans `src/components/site/Blocks.tsx`.

## Variables d'environnement
Voir `.env.example`. `STUDIO_HOSTS` = domaine(s) du Studio ; tout autre domaine est traité comme un site client. `SINGLE_SITE_SLUG` active le mode site autonome.
