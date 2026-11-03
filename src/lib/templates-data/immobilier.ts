import { makeBlock as B } from "../blocks";
import type { Template } from "../templates";
import { contactPage, tplImg } from "./_helpers";

const I = (n: string) => tplImg("immobilier", n);

export const immobilier: Template = {
  id: "immobilier",
  name: "Domus — Agence immobilière",
  sector: "Agence immobilière, promoteur, syndic, gestion locative",
  description: "Élégant et rassurant : biens à vendre et à louer, services, étapes d'un projet, avis clients.",
  highlights: ["Catalogue de biens", "Fiches détaillées", "Estimation gratuite", "Accompagnement complet"],
  theme: { primary: "#1E3A5F", accent: "#C8A24A", dark: "#0F1B2D", font: "serif", radius: "md", headerStyle: "dark" },
  demo: {
    name: "Domus Immobilier",
    tagline: "Vendre, acheter, louer en toute confiance",
    phone: "+212 5 22 00 77 88",
    whatsapp: "+212600007788",
    email: "contact@domus-demo.ma",
    address: "Boulevard d'Anfa, Casablanca",
    footerText: "Site de démonstration — modèle SiteFlow.",
  },
  preview: I("hero"),
  pages: [
    {
      slug: "", title: "Accueil", blocks: [
        B("hero", {
          layout: "split", badge: "Agence indépendante", title: "Trouvez le lieu où votre vie commence",
          subtitle: "Appartements, villas, bureaux : nous vous accompagnons de la première visite à la remise des clés, avec transparence et expertise du marché local.",
          image: I("hero"), ctaLabel: "Voir les biens", ctaUrl: "/biens", cta2Label: "Estimer mon bien", cta2Url: "/contact",
          badges: [{ text: "Estimation gratuite" }, { text: "Visites accompagnées" }, { text: "Suivi juridique" }],
        }),
        B("stats", { items: [{ value: "850+", label: "biens vendus" }, { value: "12 ans", label: "d'expertise" }, { value: "98%", label: "clients satisfaits" }, { value: "45 j", label: "délai moyen de vente" }] }),
        B("products", { mode: "featured", title: "Nos biens à la une", intro: "Une sélection de biens disponibles à la vente et à la location.", ctaLabel: "Tous les biens" }),
        B("features", { title: "Nos services", style: "icons", columns: "3", tone: "soft", items: [
          { icon: "🏠", title: "Vente", text: "Estimation, mise en valeur, diffusion, négociation : nous gérons tout." },
          { icon: "🔑", title: "Location & gestion", text: "Recherche de locataires, état des lieux, gestion des loyers." },
          { icon: "📈", title: "Investissement", text: "Conseil patrimonial et sélection de biens à fort potentiel." },
          { icon: "📄", title: "Accompagnement juridique", text: "Compromis, titre foncier, notaire : un dossier sécurisé." },
          { icon: "📸", title: "Valorisation", text: "Visuels soignés et description précise pour mieux vendre." },
          { icon: "🤝", title: "Conseil personnalisé", text: "Un seul interlocuteur du début à la fin de votre projet." },
        ] }),
        B("steps", { title: "Votre projet en 4 étapes", items: [
          { title: "Écoute", text: "Nous définissons ensemble votre besoin et votre budget." },
          { title: "Sélection", text: "Nous vous présentons les biens qui correspondent vraiment." },
          { title: "Visites & offre", text: "Visites accompagnées et négociation à votre place." },
          { title: "Signature", text: "Compromis, financement et remise des clés, sans stress." },
        ] }),
        B("testimonials", { title: "Ils ont signé avec nous", items: [
          { quote: "Notre appartement a été vendu en trois semaines, au prix espéré. Équipe sérieuse et très réactive.", name: "Houda M.", role: "Vendeuse, Casablanca" },
          { quote: "Un accompagnement complet pour notre premier achat. Chaque étape nous a été expliquée.", name: "Mehdi & Sara", role: "Acquéreurs" },
          { quote: "Gestion locative sans souci depuis cinq ans. Je recommande vivement.", name: "Abdelali F.", role: "Propriétaire bailleur" },
        ] }),
        B("cta", { title: "Quelle est la valeur de votre bien ?", text: "Recevez une estimation gratuite sous 48 heures.", ctaLabel: "Estimer mon bien" }),
      ],
    },
    {
      slug: "biens", title: "Nos biens", blocks: [
        B("richText", { title: "Biens à vendre et à louer", text: "Cliquez sur un bien pour consulter sa fiche complète et organiser une visite.", narrow: false }),
        B("products", { mode: "all", limit: 60, title: "", ctaLabel: "" }),
        B("cta", { title: "Vous ne trouvez pas votre bien idéal ?", text: "Dites-nous ce que vous cherchons : nous le trouvons pour vous.", ctaLabel: "Lancer ma recherche" }),
      ],
    },
    {
      slug: "services", title: "Services", blocks: [
        B("features", { title: "Un accompagnement complet", intro: "De l'estimation à la remise des clés.", style: "cards", columns: "3", items: [
          { icon: "🏷️", title: "Estimation offerte", text: "Analyse du marché et du quartier pour fixer le juste prix." },
          { icon: "🔎", title: "Recherche ciblée", text: "Nous cherchons pour vous les biens avant leur diffusion." },
          { icon: "🧾", title: "Financement", text: "Mise en relation avec nos banques partenaires." },
        ] }),
        B("pricing", { title: "Nos honoraires", intro: "Transparents et annoncés dès le départ.", tone: "soft", items: [
          { name: "Vente", price: "2,5 %", period: "du prix de vente", features: "Estimation offerte\nPhotos et diffusion\nVisites accompagnées\nSuivi jusqu'à la signature", highlight: false, ctaLabel: "Mettre en vente", ctaUrl: "/contact" },
          { name: "Gestion locative", price: "6 %", period: "des loyers", features: "Recherche de locataire\nÉtat des lieux\nQuittances et relances\nSuivi des travaux", highlight: true, ctaLabel: "Confier ma gestion", ctaUrl: "/contact" },
          { name: "Location seule", price: "1 mois", period: "de loyer", features: "Annonce et visites\nSélection du dossier\nRédaction du bail", highlight: false, ctaLabel: "Louer mon bien", ctaUrl: "/contact" },
        ] }),
        B("faq", { items: [
          { q: "Combien de temps faut-il pour vendre ?", a: "En moyenne 45 jours, selon le quartier et le prix. Une estimation réaliste est la clé." },
          { q: "Les honoraires sont-ils négociables ?", a: "Ils sont transparents et définis dès la signature du mandat." },
          { q: "Faut-il un mandat exclusif ?", a: "Ce n'est pas obligatoire, mais il permet un meilleur accompagnement et une communication renforcée." },
        ] }),
      ],
    },
    {
      slug: "a-propos", title: "À propos", blocks: [
        B("textImage", { title: "Une agence à taille humaine", image: I("a1"), imageSide: "right", text: "**{{nom}}** est née d'une idée simple : traiter chaque bien, chaque client, comme s'il était unique. Notre équipe connaît chaque quartier et vous guide avec franchise." }),
        B("textImage", { title: "Notre méthode", image: I("a2"), imageSide: "left", tone: "soft", text: "Nous investissons du temps dans la préparation : étude du marché, dossier complet, visuels soignés. Résultat : des ventes plus rapides et des clients sereins.", bullets: [{ text: "Transparence totale sur les honoraires" }, { text: "Compte rendu après chaque visite" }, { text: "Réseau de notaires et de banques partenaires" }] }),
      ],
    },
    contactPage([], "Estimation, visite, renseignement : nous vous répondons sous 24 h."),
  ],
  categories: ["À vendre", "À louer"],
  products: [
    { name: "Villa 4 chambres avec piscine", category: "À vendre", summary: "Quartier résidentiel calme, jardin paysager, 320 m².", image: I("p1"), price: "4 200 000 DH", featured: true, description: "Belle villa contemporaine sur 600 m² de terrain : séjour double hauteur, cuisine équipée, quatre chambres dont une suite parentale, piscine et jardin.", specs: [{ label: "Surface", value: "320 m²" }, { label: "Chambres", value: "4" }, { label: "Terrain", value: "600 m²" }, { label: "Piscine", value: "Oui" }] },
    { name: "Appartement 3 pièces vue mer", category: "À vendre", summary: "Résidence sécurisée avec parking, 110 m².", image: I("p2"), price: "1 850 000 DH", featured: true, description: "Appartement lumineux au 5e étage avec balcon et vue dégagée, cuisine ouverte, deux chambres, deux salles de bains.", specs: [{ label: "Surface", value: "110 m²" }, { label: "Chambres", value: "2" }, { label: "Étage", value: "5" }] },
    { name: "Duplex moderne centre-ville", category: "À vendre", summary: "Finitions haut de gamme, terrasse privative.", image: I("p3"), price: "2 450 000 DH", featured: true, description: "Duplex de 145 m² avec grande terrasse, domotique et deux places de parking.", specs: [{ label: "Surface", value: "145 m²" }, { label: "Terrasse", value: "30 m²" }] },
    { name: "Studio meublé proche tramway", category: "À louer", summary: "Idéal étudiant ou jeune actif, charges comprises.", image: I("p4"), price: "4 500 DH / mois", featured: true, description: "Studio entièrement meublé, internet inclus, à deux minutes de la station de tramway.", specs: [{ label: "Surface", value: "32 m²" }, { label: "Meublé", value: "Oui" }] },
    { name: "Bureau open space 120 m²", category: "À louer", summary: "Immeuble de standing, climatisé, parking.", image: I("p5"), price: "15 000 DH / mois", featured: true, description: "Plateau de bureaux modulable avec salle de réunion, fibre optique et gardiennage.", specs: [{ label: "Surface", value: "120 m²" }] },
    { name: "Riad rénové en pleine médina", category: "À vendre", summary: "Patio, six chambres, idéal maison d'hôtes.", image: I("p6"), price: "3 600 000 DH", featured: true, description: "Riad authentique entièrement rénové, patio central, terrasse panoramique, six chambres avec salle d'eau.", specs: [{ label: "Chambres", value: "6" }, { label: "Terrasse", value: "Panoramique" }] },
  ],
  posts: [
    { kind: "NEWS", title: "Marché immobilier : ce qu'il faut savoir cette année", excerpt: "Prix, taux, quartiers porteurs : notre analyse du marché local.", image: I("g1"), daysAgo: 10 },
    { kind: "EVENT", title: "Portes ouvertes : nouvelle résidence", excerpt: "Visitez l'appartement témoin et rencontrez nos conseillers.", image: I("g2"), daysAgo: -9, location: "Casablanca" },
  ],
};
