import { makeBlock, type Block } from "./blocks";

export type Theme = {
  primary: string;
  accent: string;
  dark: string;
  font: "sans" | "serif" | "rounded";
  radius: "none" | "md" | "xl";
  headerStyle: "light" | "dark" | "transparent";
};

export const FONTS: { value: Theme["font"]; label: string }[] = [
  { value: "sans", label: "Moderne (sans-serif)" },
  { value: "serif", label: "Élégant (serif)" },
  { value: "rounded", label: "Arrondi / chaleureux" },
];

export type TemplatePage = { slug: string; title: string; navLabel?: string; inNav?: boolean; blocks: Block[] };

export type Template = {
  id: string;
  name: string;
  description: string;
  sector: string;
  theme: Theme;
  pages: TemplatePage[];
  sampleProducts?: { name: string; summary: string; category: string }[];
};

const contactPage = (): TemplatePage => ({
  slug: "contact",
  title: "Contact",
  blocks: [makeBlock("contact")],
});

export const TEMPLATES: Template[] = [
  {
    id: "distribution",
    name: "Distributeur / Industrie",
    sector: "Négoce, matériaux, tubes, pièces, équipements",
    description: "Site vitrine B2B avec catalogue produits, catalogues PDF, salons et actualités. Idéal distributeurs et industriels.",
    theme: { primary: "#0B4F8A", accent: "#F59E0B", dark: "#0F172A", font: "sans", radius: "md", headerStyle: "light" },
    pages: [
      {
        slug: "", title: "Accueil", blocks: [
          makeBlock("hero", { title: "Distributeur de solutions techniques", subtitle: "Un stock permanent, des produits certifiés et une équipe à votre écoute pour vos chantiers et vos projets industriels." }),
          makeBlock("stats"),
          makeBlock("products", { mode: "categories", title: "Nos gammes" }),
          makeBlock("features", { title: "Pourquoi travailler avec nous" }),
          makeBlock("gallery", { title: "Nos réalisations" }),
          makeBlock("posts", { title: "Actualités & salons" }),
          makeBlock("cta"),
        ],
      },
      {
        slug: "produits", title: "Produits", blocks: [
          makeBlock("richText", { title: "Notre catalogue", text: "Retrouvez l'ensemble de nos gammes. Cliquez sur un produit pour voir sa fiche technique.", narrow: false }),
          makeBlock("products", { mode: "all", limit: 60, title: "", ctaLabel: "" }),
        ],
      },
      {
        slug: "a-propos", title: "À propos", blocks: [
          makeBlock("textImage", { title: "Notre histoire" }),
          makeBlock("features", { title: "Nos engagements" }),
          makeBlock("team", { title: "Nos partenaires" }),
        ],
      },
      {
        slug: "actualites", title: "Actualités", blocks: [
          makeBlock("posts", { title: "Toutes nos actualités", limit: 30 }),
        ],
      },
      contactPage(),
    ],
    sampleProducts: [
      { name: "Produit A", summary: "Description courte du produit A.", category: "Gamme 1" },
      { name: "Produit B", summary: "Description courte du produit B.", category: "Gamme 1" },
      { name: "Produit C", summary: "Description courte du produit C.", category: "Gamme 2" },
    ],
  },
  {
    id: "services",
    name: "Entreprise de services",
    sector: "Cabinet, agence, artisan, bureau d'études, conseil",
    description: "Site vitrine orienté prise de contact : prestations, points forts, équipe, témoignages, formulaire.",
    theme: { primary: "#0F766E", accent: "#F97316", dark: "#111827", font: "sans", radius: "xl", headerStyle: "light" },
    pages: [
      {
        slug: "", title: "Accueil", blocks: [
          makeBlock("hero", { title: "Des experts à votre service", subtitle: "Nous accompagnons les entreprises et les particuliers avec des prestations sur mesure.", ctaLabel: "Nos prestations", ctaUrl: "/prestations" }),
          makeBlock("features", { title: "Nos prestations" }),
          makeBlock("textImage", { title: "Qui sommes-nous ?" }),
          makeBlock("stats"),
          makeBlock("faq"),
          makeBlock("cta", { ctaLabel: "Prendre rendez-vous" }),
        ],
      },
      {
        slug: "prestations", title: "Prestations", blocks: [
          makeBlock("richText", { title: "Nos prestations", text: "Détaillez ici chacune de vos prestations." }),
          makeBlock("products", { mode: "all", title: "", limit: 30, ctaLabel: "" }),
        ],
      },
      { slug: "equipe", title: "Équipe", blocks: [makeBlock("team")] },
      contactPage(),
    ],
    sampleProducts: [
      { name: "Prestation 1", summary: "Décrivez cette prestation.", category: "Prestations" },
      { name: "Prestation 2", summary: "Décrivez cette prestation.", category: "Prestations" },
    ],
  },
  {
    id: "boutique",
    name: "Commerce / Restaurant",
    sector: "Boutique, restaurant, café, salon, showroom",
    description: "Site chaleureux avec galerie, carte ou produits, horaires et localisation.",
    theme: { primary: "#9A3412", accent: "#D97706", dark: "#1C1917", font: "rounded", radius: "xl", headerStyle: "transparent" },
    pages: [
      {
        slug: "", title: "Accueil", blocks: [
          makeBlock("hero", { title: "Bienvenue chez nous", subtitle: "Une adresse conviviale au cœur de la ville.", ctaLabel: "Voir la carte", ctaUrl: "/carte", height: "full" }),
          makeBlock("textImage", { title: "Notre histoire" }),
          makeBlock("gallery", { title: "L'ambiance" }),
          makeBlock("products", { mode: "featured", title: "Nos incontournables", ctaLabel: "Voir toute la carte" }),
          makeBlock("posts", { title: "Événements", kind: "EVENT" }),
          makeBlock("contact", { title: "Nous trouver", intro: "Réservez ou passez nous voir." }),
        ],
      },
      { slug: "carte", title: "Carte", navLabel: "La carte", blocks: [makeBlock("products", { mode: "all", title: "Notre carte", limit: 100, ctaLabel: "" })] },
      contactPage(),
    ],
    sampleProducts: [
      { name: "Spécialité 1", summary: "Description et prix.", category: "Plats" },
      { name: "Spécialité 2", summary: "Description et prix.", category: "Desserts" },
    ],
  },
  {
    id: "sante",
    name: "Santé / Cabinet",
    sector: "Clinique, cabinet médical, dentiste, paramédical",
    description: "Site rassurant : spécialités, praticiens, horaires, prise de contact rapide.",
    theme: { primary: "#1D4ED8", accent: "#06B6D4", dark: "#0F172A", font: "sans", radius: "xl", headerStyle: "light" },
    pages: [
      {
        slug: "", title: "Accueil", blocks: [
          makeBlock("hero", { title: "Votre santé, notre priorité", subtitle: "Une équipe de praticiens qualifiés et un accueil attentif.", ctaLabel: "Prendre rendez-vous", ctaUrl: "/contact", cta2Label: "Nos spécialités", cta2Url: "/specialites" }),
          makeBlock("features", { title: "Nos spécialités" }),
          makeBlock("team", { title: "Nos praticiens" }),
          makeBlock("faq"),
          makeBlock("cta", { title: "Besoin d'un rendez-vous ?", ctaLabel: "Nous appeler" }),
        ],
      },
      { slug: "specialites", title: "Spécialités", blocks: [makeBlock("products", { mode: "all", title: "Nos spécialités", limit: 30, ctaLabel: "" })] },
      contactPage(),
    ],
    sampleProducts: [
      { name: "Spécialité 1", summary: "Décrivez cette spécialité.", category: "Spécialités" },
    ],
  },
  {
    id: "vierge",
    name: "Page blanche",
    sector: "Tout type d'activité",
    description: "Un site vide avec seulement une page d'accueil et une page contact. Vous composez tout vous-même.",
    theme: { primary: "#2563EB", accent: "#111827", dark: "#111827", font: "sans", radius: "md", headerStyle: "light" },
    pages: [
      { slug: "", title: "Accueil", blocks: [makeBlock("hero"), makeBlock("cta")] },
      contactPage(),
    ],
  },
];

export const templateById = (id: string) => TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
