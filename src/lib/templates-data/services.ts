import { makeBlock as B } from "../blocks";
import type { Template } from "../templates";
import { contactPage, tplImg } from "./_helpers";

const I = (n: string) => tplImg("services", n);

export const services: Template = {
  id: "services",
  name: "Nexa — Agence / Services aux entreprises",
  sector: "Agence digitale, bureau d'études, conseil, formation, IT",
  description: "Moderne et orienté conversion : offres, process, résultats chiffrés, témoignages et FAQ.",
  highlights: ["Offres & tarifs", "Process en étapes", "Résultats chiffrés", "FAQ & contact"],
  theme: { primary: "#4F46E5", accent: "#06B6D4", dark: "#0F172A", font: "sans", radius: "xl", headerStyle: "light" },
  demo: {
    name: "Nexa Digital",
    tagline: "Nous transformons vos idées en résultats concrets",
    phone: "+212 5 22 00 45 45",
    whatsapp: "+212600004545",
    email: "hello@nexa-demo.ma",
    address: "Technopark, Casablanca",
    footerText: "Site de démonstration — modèle SiteFlow.",
  },
  preview: I("hero"),
  pages: [
    {
      slug: "", title: "Accueil", blocks: [
        B("hero", {
          layout: "split", badge: "Conseil · Digital · Formation", title: "Des solutions sur mesure pour faire grandir votre entreprise",
          subtitle: "Nous aidons les PME à gagner en visibilité, en efficacité et en clients grâce à des équipes expertes et des méthodes éprouvées.",
          image: I("hero"), ctaLabel: "Réserver un audit gratuit", ctaUrl: "/contact", cta2Label: "Nos offres", cta2Url: "/offres",
          badges: [{ text: "Audit offert" }, { text: "Équipe dédiée" }, { text: "Résultats mesurables" }],
        }),
        B("badges", { title: "Ils nous font confiance", items: [{ text: "ATLAS+" }, { text: "Medina Group" }, { text: "Sahara Tech" }, { text: "OuedFlow" }, { text: "Kasbah Co." }] }),
        B("products", { mode: "featured", title: "Nos expertises", intro: "Un accompagnement complet, de la stratégie à l'exécution.", ctaLabel: "Toutes nos expertises" }),
        B("stats", { items: [{ value: "180+", label: "clients accompagnés" }, { value: "+240 %", label: "de trafic moyen" }, { value: "12", label: "experts dédiés" }, { value: "4,9/5", label: "satisfaction clients" }] }),
        B("steps", { title: "Notre méthode, simple et efficace", items: [
          { title: "Diagnostic", text: "Audit de votre situation et définition d'objectifs mesurables." },
          { title: "Plan d'action", text: "Feuille de route claire, priorisée et chiffrée." },
          { title: "Exécution", text: "Mise en œuvre par nos experts, avec points hebdomadaires." },
          { title: "Résultats", text: "Tableaux de bord et optimisation continue." },
        ] }),
        B("textImage", { title: "Pourquoi choisir {{nom}} ?", image: I("a1"), imageSide: "right", tone: "soft", text: "Nous ne vendons pas des prestations : nous vous aidons à atteindre vos objectifs. Chaque mission démarre par un cadrage précis et se termine par des résultats mesurés.", bullets: [{ text: "Un interlocuteur unique qui connaît votre activité" }, { text: "Transparence totale : rapports clairs, pas de jargon" }, { text: "Engagement sur des indicateurs concrets" }] }),
        B("pricing", { title: "Nos offres", intro: "Des formules claires, sans engagement de durée.", items: [
          { name: "Démarrage", price: "3 900 DH", period: "/ mois", features: "Audit et plan d'action\n1 canal d'acquisition\nRapport mensuel", highlight: false, ctaLabel: "Choisir", ctaUrl: "/contact" },
          { name: "Croissance", price: "7 900 DH", period: "/ mois", features: "Stratégie multi-canaux\nContenus et publicité\nPoint hebdomadaire\nTableau de bord en direct", highlight: true, ctaLabel: "Choisir", ctaUrl: "/contact" },
          { name: "Sur mesure", price: "Sur devis", period: "", features: "Équipe dédiée\nProjets spécifiques\nFormation de vos équipes", highlight: false, ctaLabel: "Nous consulter", ctaUrl: "/contact" },
        ] }),
        B("testimonials", { title: "Ce que disent nos clients", items: [
          { quote: "En six mois, notre trafic a triplé et les demandes de devis ont doublé. Une équipe réactive et très claire.", name: "Meryem A.", role: "Directrice marketing" },
          { quote: "Un vrai partenaire : ils challengent nos idées et livrent dans les délais.", name: "Yassine K.", role: "Fondateur, e-commerce" },
          { quote: "La formation de nos équipes a changé notre façon de travailler.", name: "Fatima Z.", role: "DRH" },
        ] }),
        B("faq", { tone: "soft", items: [
          { q: "L'audit initial est-il vraiment gratuit ?", a: "Oui : une heure d'échange et un diagnostic écrit, sans engagement." },
          { q: "Quels délais pour voir des résultats ?", a: "Les premiers résultats apparaissent généralement sous 6 à 8 semaines selon les actions." },
          { q: "Travaillez-vous avec de petites structures ?", a: "Oui, nos offres sont conçues pour les PME, TPE et indépendants." },
        ] }),
        B("cta", { title: "Prêt à passer à la vitesse supérieure ?", text: "Réservez votre audit gratuit de 60 minutes.", ctaLabel: "Réserver mon audit" }),
      ],
    },
    {
      slug: "offres", title: "Expertises", blocks: [
        B("richText", { title: "Nos expertises", text: "Cliquez sur une expertise pour découvrir notre approche et nos livrables.", narrow: false }),
        B("products", { mode: "all", limit: 60, title: "", ctaLabel: "" }),
        B("cta", { title: "Un besoin spécifique ?", text: "Parlons-en : nous construisons une offre adaptée.", ctaLabel: "Nous contacter" }),
      ],
    },
    {
      slug: "a-propos", title: "À propos", blocks: [
        B("textImage", { title: "Une équipe d'experts passionnés", image: I("a2"), imageSide: "left", text: "**{{nom}}** réunit consultants, développeurs et formateurs autour d'une même exigence : des résultats concrets pour nos clients. Nous travaillons en mode projet, avec des équipes réduites et senior." }),
        B("features", { title: "Nos valeurs", tone: "soft", style: "icons", columns: "3", items: [
          { icon: "🎯", title: "Orientation résultats", text: "Chaque action est reliée à un objectif mesurable." },
          { icon: "🔍", title: "Transparence", text: "Rapports clairs, décisions expliquées." },
          { icon: "🚀", title: "Agilité", text: "Cycles courts, ajustements rapides." },
        ] }),
        B("team", { title: "Quelques visages", items: [
          { image: I("g1"), name: "Sara El Idrissi", role: "Directrice générale" }, { image: I("g2"), name: "Amine Tahiri", role: "Responsable technique" },
          { image: I("g3"), name: "Ghita Mourad", role: "Cheffe de projet" }, { image: I("g4"), name: "Younes Lahlou", role: "Consultant senior" },
        ] }),
      ],
    },
    contactPage([], "Parlez-nous de votre projet : nous vous répondons sous 24 h avec une proposition d'audit."),
  ],
  categories: ["Marketing & croissance", "Technologie", "Formation & conseil"],
  products: [
    { name: "Stratégie digitale", category: "Marketing & croissance", summary: "Audit, positionnement, plan d'action sur 12 mois.", image: I("p1"), featured: true, description: "Nous analysons votre marché, vos concurrents et vos clients pour construire une feuille de route claire et chiffrée." },
    { name: "Création de site & e-commerce", category: "Technologie", summary: "Sites rapides, soignés et conçus pour convertir.", image: I("p2"), featured: true, description: "Conception et développement de sites vitrines et boutiques en ligne, optimisés pour le mobile et le référencement." },
    { name: "Publicité & réseaux sociaux", category: "Marketing & croissance", summary: "Campagnes ciblées et contenus qui engagent.", image: I("p3"), featured: true, description: "Gestion de vos campagnes publicitaires et création de contenus adaptés à chaque plateforme." },
    { name: "Cybersécurité & conformité", category: "Technologie", summary: "Audit, sauvegardes, sensibilisation des équipes.", image: I("p4"), featured: true, description: "Protégez vos données : audit de sécurité, plan de sauvegarde et sensibilisation des collaborateurs." },
    { name: "Conseil & organisation", category: "Formation & conseil", summary: "Processus, outils, pilotage de la performance.", image: I("p5"), featured: true, description: "Optimisation de vos processus, choix d'outils et mise en place d'indicateurs de pilotage." },
    { name: "Formation de vos équipes", category: "Formation & conseil", summary: "Ateliers pratiques et accompagnement continu.", image: I("p6"), featured: true, description: "Formations sur mesure en présentiel ou en ligne pour rendre vos équipes autonomes." },
  ],
  posts: [
    { kind: "NEWS", title: "5 leviers pour doubler vos demandes de devis", excerpt: "Les actions les plus rentables pour une PME en 2026.", image: I("g5"), daysAgo: 5 },
    { kind: "EVENT", title: "Webinaire : réussir son e-commerce", excerpt: "Une heure pour comprendre les bonnes pratiques, avec séance de questions.", image: I("g6"), daysAgo: -11, location: "En ligne" },
  ],
};
