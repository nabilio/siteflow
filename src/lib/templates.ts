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

export type TemplateProduct = {
  name: string;
  summary: string;
  description?: string;
  category: string;
  image: string;
  price?: string;
  featured?: boolean;
  specs?: { label: string; value: string }[];
};

export type TemplatePost = {
  kind: "NEWS" | "EVENT";
  title: string;
  excerpt: string;
  body?: string;
  image: string;
  daysAgo: number;
  location?: string;
};

export type Template = {
  id: string;
  name: string;
  sector: string;
  description: string;
  /** Points forts affichés dans la galerie de modèles. */
  highlights: string[];
  theme: Theme;
  /** Identité de la démonstration (remplacée par celle du client à la création). */
  demo: { name: string; tagline: string; phone: string; whatsapp?: string; email: string; address: string; footerText?: string };
  /** Image d'aperçu (carte de la galerie). */
  preview: string;
  pages: TemplatePage[];
  categories?: string[];
  products?: TemplateProduct[];
  posts?: TemplatePost[];
};

export { tplImg, contactPage } from "./templates-data/_helpers";
import { contactPage } from "./templates-data/_helpers";

import { distribution } from "./templates-data/distribution";
import { restaurant } from "./templates-data/restaurant";
import { clinique } from "./templates-data/clinique";
import { immobilier } from "./templates-data/immobilier";
import { cabinet } from "./templates-data/cabinet";
import { btp } from "./templates-data/btp";
import { beaute } from "./templates-data/beaute";
import { services } from "./templates-data/services";

const vierge: Template = {
  id: "vierge",
  name: "Page blanche",
  sector: "Partir de zéro",
  description: "Une page d'accueil vide à composer avec les blocs. Pour les besoins très spécifiques.",
  highlights: ["Aucun contenu imposé", "Tous les blocs disponibles"],
  theme: { primary: "#2563EB", accent: "#F59E0B", dark: "#0F172A", font: "sans", radius: "md", headerStyle: "light" },
  demo: { name: "Mon site", tagline: "", phone: "", email: "", address: "" },
  preview: "",
  pages: [
    { slug: "", title: "Accueil", blocks: [makeBlock("hero", { title: "Bienvenue", subtitle: "Modifiez cette page depuis le Studio." })] },
    contactPage(),
  ],
};

export const TEMPLATES: Template[] = [distribution, restaurant, clinique, immobilier, cabinet, btp, beaute, services, vierge];

export const templateById = (id: string) => TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
