/**
 * Catalogue des blocs disponibles dans l'éditeur de pages.
 * Chaque bloc est décrit par un schéma de champs : l'éditeur du Studio
 * génère automatiquement le formulaire, aucune ligne de code à écrire.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "image"
  | "url"
  | "number"
  | "boolean"
  | "select"
  | "color"
  | "list"; // liste d'objets, avec sous-champs

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  options?: { value: string; label: string }[];
  fields?: Field[]; // pour type "list"
  default?: unknown;
};

export type BlockDef = {
  type: string;
  label: string;
  description: string;
  icon: string; // emoji simple
  fields: Field[];
};

export type Block = { id: string; type: string; props: Record<string, unknown> };

const align = { key: "align", label: "Alignement", type: "select" as const, options: [
  { value: "left", label: "Gauche" }, { value: "center", label: "Centré" } ], default: "center" };

export const BLOCKS: BlockDef[] = [
  {
    type: "hero",
    label: "Bannière d'accueil",
    description: "Grand titre, sous-titre, boutons et image ou vidéo de fond.",
    icon: "🖼️",
    fields: [
      { key: "layout", label: "Disposition", type: "select", options: [
        { value: "left", label: "Texte à gauche (image en fond)" }, { value: "center", label: "Texte centré (image en fond)" }, { value: "split", label: "Texte + grande image à droite" } ], default: "left" },
      { key: "badge", label: "Petit label au-dessus du titre", type: "text" },
      { key: "title", label: "Titre", type: "text", default: "Votre partenaire de confiance" },
      { key: "subtitle", label: "Sous-titre", type: "textarea", default: "Une phrase qui résume votre activité et ce que vous apportez à vos clients." },
      { key: "image", label: "Image de fond", type: "image" },
      { key: "videoUrl", label: "Vidéo (lien YouTube ou fichier .mp4)", type: "url", help: "Si renseigné, la vidéo remplace l'image." },
      { key: "ctaLabel", label: "Bouton principal", type: "text", default: "Découvrir nos produits" },
      { key: "ctaUrl", label: "Lien du bouton", type: "url", default: "/produits" },
      { key: "cta2Label", label: "Bouton secondaire", type: "text", default: "Nous contacter" },
      { key: "cta2Url", label: "Lien secondaire", type: "url", default: "/contact" },
      { key: "overlay", label: "Assombrir l'image", type: "boolean", default: true },
      { key: "badges", label: "Points de réassurance (puces)", type: "list", fields: [
        { key: "text", label: "Texte", type: "text" },
      ], default: [] },
      { key: "light", label: "Fond clair (disposition « Texte + image » uniquement)", type: "boolean", default: false },
      { key: "height", label: "Hauteur", type: "select", options: [
        { value: "md", label: "Moyenne" }, { value: "lg", label: "Grande" }, { value: "full", label: "Plein écran" } ], default: "lg" },
    ],
  },
  {
    type: "features",
    label: "Points forts",
    description: "Grille de 3 à 6 arguments avec icône, titre et texte.",
    icon: "⭐",
    fields: [
      { key: "title", label: "Titre de la section", type: "text", default: "Pourquoi nous choisir" },
      { key: "intro", label: "Introduction", type: "textarea" },
      { key: "columns", label: "Colonnes", type: "select", options: [
        { value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" } ], default: "3" },
      { key: "style", label: "Style", type: "select", options: [
        { value: "cards", label: "Cartes" }, { value: "icons", label: "Icônes dans une pastille" }, { value: "plain", label: "Sobre (sans cadre)" } ], default: "cards" },
      { key: "tone", label: "Fond de la section", type: "select", options: [
        { value: "", label: "Automatique" }, { value: "white", label: "Blanc" }, { value: "soft", label: "Gris clair" }, { value: "dark", label: "Foncé" }, { value: "primary", label: "Couleur principale" } ], default: "" },
      { key: "items", label: "Arguments", type: "list", fields: [
        { key: "icon", label: "Icône (emoji)", type: "text", default: "✅" },
        { key: "title", label: "Titre", type: "text" },
        { key: "text", label: "Texte", type: "textarea" },
      ], default: [
        { icon: "🚚", title: "Livraison rapide", text: "Stock permanent et livraison dans tout le pays." },
        { icon: "🏆", title: "Qualité certifiée", text: "Produits conformes aux normes en vigueur." },
        { icon: "🤝", title: "Accompagnement", text: "Une équipe disponible pour vous conseiller." },
      ] },
    ],
  },
  {
    type: "textImage",
    label: "Texte + image",
    description: "Un paragraphe à côté d'une image, image à gauche ou à droite.",
    icon: "📝",
    fields: [
      { key: "title", label: "Titre", type: "text", default: "À propos de nous" },
      { key: "text", label: "Texte", type: "richtext", default: "Présentez votre entreprise, son histoire et ses valeurs en quelques lignes." },
      { key: "image", label: "Image", type: "image" },
      { key: "imageSide", label: "Position de l'image", type: "select", options: [
        { value: "right", label: "Droite" }, { value: "left", label: "Gauche" } ], default: "right" },
      { key: "ctaLabel", label: "Bouton (optionnel)", type: "text" },
      { key: "ctaUrl", label: "Lien du bouton", type: "url" },
      { key: "bullets", label: "Liste à puces (optionnel)", type: "list", fields: [
        { key: "text", label: "Texte", type: "text" },
      ], default: [] },
      { key: "tone", label: "Fond de la section", type: "select", options: [
        { value: "", label: "Automatique" }, { value: "white", label: "Blanc" }, { value: "soft", label: "Gris clair" }, { value: "dark", label: "Foncé" }, { value: "primary", label: "Couleur principale" } ], default: "" },
    ],
  },
  {
    type: "richText",
    label: "Texte libre",
    description: "Un bloc de texte simple (titres, paragraphes, listes).",
    icon: "📄",
    fields: [
      { key: "title", label: "Titre", type: "text" },
      { key: "text", label: "Contenu", type: "richtext", default: "Votre texte ici." },
      { key: "narrow", label: "Largeur réduite (lecture)", type: "boolean", default: true },
      { key: "tone", label: "Fond de la section", type: "select", options: [
        { value: "", label: "Automatique" }, { value: "white", label: "Blanc" }, { value: "soft", label: "Gris clair" }, { value: "dark", label: "Foncé" }, { value: "primary", label: "Couleur principale" } ], default: "" },
    ],
  },
  {
    type: "gallery",
    label: "Galerie défilante",
    description: "Carrousel d'images qui défile automatiquement.",
    icon: "🎞️",
    fields: [
      { key: "title", label: "Titre", type: "text", default: "En images" },
      { key: "items", label: "Images", type: "list", fields: [
        { key: "image", label: "Image", type: "image" },
        { key: "caption", label: "Légende", type: "text" },
      ], default: [] },
      { key: "layout", label: "Affichage", type: "select", options: [
        { value: "carousel", label: "Carrousel" }, { value: "grid", label: "Mosaïque" } ], default: "carousel" },
      { key: "autoplay", label: "Défilement automatique (carrousel)", type: "boolean", default: true },
      { key: "interval", label: "Intervalle (secondes)", type: "number", default: 4 },
    ],
  },
  {
    type: "products",
    label: "Produits / services",
    description: "Affiche les produits du catalogue (gérés dans l'onglet Produits).",
    icon: "📦",
    fields: [
      { key: "title", label: "Titre", type: "text", default: "Nos produits" },
      { key: "intro", label: "Introduction", type: "textarea" },
      { key: "mode", label: "Afficher", type: "select", options: [
        { value: "featured", label: "Produits mis en avant" }, { value: "all", label: "Tout le catalogue" }, { value: "categories", label: "Les catégories" } ], default: "featured" },
      { key: "limit", label: "Nombre maximum", type: "number", default: 6 },
      { key: "ctaLabel", label: "Bouton « voir tout »", type: "text", default: "Voir tout le catalogue" },
    ],
  },
  {
    type: "posts",
    label: "Actualités / salons",
    description: "Cartes d'actualités ou d'événements avec image et lien.",
    icon: "📰",
    fields: [
      { key: "title", label: "Titre", type: "text", default: "Actualités & salons" },
      { key: "kind", label: "Type", type: "select", options: [
        { value: "all", label: "Actualités et événements" }, { value: "NEWS", label: "Actualités uniquement" }, { value: "EVENT", label: "Événements / salons uniquement" } ], default: "all" },
      { key: "limit", label: "Nombre maximum", type: "number", default: 3 },
    ],
  },
  {
    type: "stats",
    label: "Chiffres clés",
    description: "Bandeau de 3 à 4 chiffres (années d'expérience, clients…).",
    icon: "📊",
    fields: [
      { key: "items", label: "Chiffres", type: "list", fields: [
        { key: "value", label: "Valeur", type: "text" },
        { key: "label", label: "Libellé", type: "text" },
      ], default: [
        { value: "15+", label: "années d'expérience" },
        { value: "500+", label: "clients accompagnés" },
        { value: "2 000", label: "références en stock" },
        { value: "24h", label: "délai de réponse" },
      ] },
    ],
  },
  {
    type: "cta",
    label: "Appel à l'action",
    description: "Bandeau coloré avec un titre et un bouton.",
    icon: "📣",
    fields: [
      { key: "title", label: "Titre", type: "text", default: "Un projet ? Parlons-en." },
      { key: "text", label: "Texte", type: "textarea", default: "Notre équipe vous répond sous 24h." },
      { key: "ctaLabel", label: "Bouton", type: "text", default: "Demander un devis" },
      { key: "ctaUrl", label: "Lien", type: "url", default: "/contact" },
    ],
  },
  {
    type: "video",
    label: "Vidéo",
    description: "Une vidéo YouTube ou un fichier .mp4 avec un titre.",
    icon: "▶️",
    fields: [
      { key: "title", label: "Titre", type: "text", default: "Découvrez-nous en vidéo" },
      { key: "videoUrl", label: "Lien YouTube ou fichier .mp4", type: "url" },
      { key: "text", label: "Texte sous la vidéo", type: "textarea" },
    ],
  },
  {
    type: "faq",
    label: "Questions fréquentes",
    description: "Liste de questions / réponses dépliables.",
    icon: "❓",
    fields: [
      { key: "title", label: "Titre", type: "text", default: "Questions fréquentes" },
      { key: "tone", label: "Fond de la section", type: "select", options: [
        { value: "", label: "Automatique" }, { value: "white", label: "Blanc" }, { value: "soft", label: "Gris clair" }, { value: "dark", label: "Foncé" }, { value: "primary", label: "Couleur principale" } ], default: "" },
      { key: "items", label: "Questions", type: "list", fields: [
        { key: "q", label: "Question", type: "text" },
        { key: "a", label: "Réponse", type: "textarea" },
      ], default: [
        { q: "Livrez-vous dans tout le pays ?", a: "Oui, nous livrons partout avec nos partenaires transporteurs." },
        { q: "Comment obtenir un devis ?", a: "Utilisez le formulaire de contact ou appelez-nous directement." },
      ] },
    ],
  },
  {
    type: "team",
    label: "Équipe / partenaires",
    description: "Cartes avec photo, nom et fonction (ou logos partenaires).",
    icon: "👥",
    fields: [
      { key: "title", label: "Titre", type: "text", default: "Notre équipe" },
      { key: "items", label: "Membres", type: "list", fields: [
        { key: "image", label: "Photo / logo", type: "image" },
        { key: "name", label: "Nom", type: "text" },
        { key: "role", label: "Fonction", type: "text" },
      ], default: [] },
    ],
  },
  {
    type: "steps",
    label: "Étapes / processus",
    description: "Étapes numérotées (comment ça marche, notre méthode…).",
    icon: "🪜",
    fields: [
      { key: "title", label: "Titre", type: "text", default: "Comment ça marche" },
      { key: "intro", label: "Introduction", type: "textarea" },
      { key: "tone", label: "Fond de la section", type: "select", options: [
        { value: "", label: "Automatique" }, { value: "white", label: "Blanc" }, { value: "soft", label: "Gris clair" }, { value: "dark", label: "Foncé" }, { value: "primary", label: "Couleur principale" } ], default: "" },
      { key: "items", label: "Étapes", type: "list", fields: [
        { key: "title", label: "Titre", type: "text" },
        { key: "text", label: "Texte", type: "textarea" },
      ], default: [
        { title: "Vous nous contactez", text: "Décrivez votre besoin en quelques lignes." },
        { title: "Nous étudions", text: "Nous revenons vers vous avec une proposition claire." },
        { title: "Nous réalisons", text: "Mise en œuvre rapide, suivi et livraison." },
      ] },
    ],
  },
  {
    type: "testimonials",
    label: "Témoignages",
    description: "Avis de clients avec nom et fonction.",
    icon: "💬",
    fields: [
      { key: "title", label: "Titre", type: "text", default: "Ils nous font confiance" },
      { key: "tone", label: "Fond de la section", type: "select", options: [
        { value: "", label: "Automatique" }, { value: "white", label: "Blanc" }, { value: "soft", label: "Gris clair" }, { value: "dark", label: "Foncé" }, { value: "primary", label: "Couleur principale" } ], default: "" },
      { key: "items", label: "Témoignages", type: "list", fields: [
        { key: "quote", label: "Citation", type: "textarea" },
        { key: "name", label: "Nom", type: "text" },
        { key: "role", label: "Fonction / entreprise", type: "text" },
      ], default: [
        { quote: "Un service réactif et un travail soigné. Nous recommandons.", name: "Prénom N.", role: "Client" },
      ] },
    ],
  },
  {
    type: "pricing",
    label: "Offres / tarifs",
    description: "Cartes d'offres avec prix, liste d'avantages et bouton.",
    icon: "🏷️",
    fields: [
      { key: "title", label: "Titre", type: "text", default: "Nos offres" },
      { key: "intro", label: "Introduction", type: "textarea" },
      { key: "tone", label: "Fond de la section", type: "select", options: [
        { value: "", label: "Automatique" }, { value: "white", label: "Blanc" }, { value: "soft", label: "Gris clair" }, { value: "dark", label: "Foncé" }, { value: "primary", label: "Couleur principale" } ], default: "" },
      { key: "items", label: "Offres", type: "list", fields: [
        { key: "name", label: "Nom de l'offre", type: "text" },
        { key: "price", label: "Prix", type: "text" },
        { key: "period", label: "Période (ex. / mois)", type: "text" },
        { key: "features", label: "Avantages (un par ligne)", type: "textarea" },
        { key: "highlight", label: "Mettre en avant", type: "boolean" },
        { key: "ctaLabel", label: "Bouton", type: "text", default: "Choisir" },
        { key: "ctaUrl", label: "Lien", type: "url", default: "/contact" },
      ], default: [
        { name: "Essentiel", price: "990 DH", period: "", features: "Prestation de base\nSuivi par e-mail", highlight: false, ctaLabel: "Choisir", ctaUrl: "/contact" },
        { name: "Premium", price: "1 990 DH", period: "", features: "Tout l'essentiel\nSuivi prioritaire\nRapport détaillé", highlight: true, ctaLabel: "Choisir", ctaUrl: "/contact" },
      ] },
    ],
  },
  {
    type: "priceList",
    label: "Carte / liste de prix",
    description: "Liste claire de prestations ou de plats avec prix (menu, soins, tarifs).",
    icon: "🍽️",
    fields: [
      { key: "title", label: "Titre", type: "text", default: "Nos tarifs" },
      { key: "intro", label: "Introduction", type: "textarea" },
      { key: "tone", label: "Fond de la section", type: "select", options: [
        { value: "", label: "Automatique" }, { value: "white", label: "Blanc" }, { value: "soft", label: "Gris clair" }, { value: "dark", label: "Foncé" }, { value: "primary", label: "Couleur principale" } ], default: "" },
      { key: "items", label: "Lignes", type: "list", fields: [
        { key: "group", label: "Rubrique (optionnel, ex. Entrées)", type: "text" },
        { key: "name", label: "Nom", type: "text" },
        { key: "text", label: "Description", type: "text" },
        { key: "price", label: "Prix", type: "text" },
      ], default: [
        { group: "", name: "Prestation 1", text: "Courte description", price: "200 DH" },
        { group: "", name: "Prestation 2", text: "Courte description", price: "350 DH" },
      ] },
    ],
  },
  {
    type: "hours",
    label: "Horaires & infos pratiques",
    description: "Horaires d'ouverture à côté d'une image ou d'un texte d'accueil.",
    icon: "🕒",
    fields: [
      { key: "title", label: "Titre", type: "text", default: "Horaires d'ouverture" },
      { key: "text", label: "Texte", type: "textarea" },
      { key: "image", label: "Image (optionnelle)", type: "image" },
      { key: "tone", label: "Fond de la section", type: "select", options: [
        { value: "", label: "Automatique" }, { value: "white", label: "Blanc" }, { value: "soft", label: "Gris clair" }, { value: "dark", label: "Foncé" }, { value: "primary", label: "Couleur principale" } ], default: "" },
      { key: "items", label: "Horaires", type: "list", fields: [
        { key: "day", label: "Jour(s)", type: "text" },
        { key: "time", label: "Horaires", type: "text" },
      ], default: [
        { day: "Lundi – Vendredi", time: "9h00 – 18h00" },
        { day: "Samedi", time: "9h00 – 13h00" },
        { day: "Dimanche", time: "Fermé" },
      ] },
    ],
  },
  {
    type: "badges",
    label: "Bandeau de logos / mentions",
    description: "Une ligne de marques, certifications ou mentions (texte ou logos).",
    icon: "🏅",
    fields: [
      { key: "title", label: "Légende (optionnelle)", type: "text" },
      { key: "items", label: "Éléments", type: "list", fields: [
        { key: "image", label: "Logo (optionnel)", type: "image" },
        { key: "text", label: "Texte", type: "text" },
      ], default: [] },
    ],
  },
  {
    type: "contact",
    label: "Formulaire de contact",
    description: "Formulaire + coordonnées + carte (depuis les paramètres du site).",
    icon: "✉️",
    fields: [
      { key: "title", label: "Titre", type: "text", default: "Contactez-nous" },
      { key: "intro", label: "Introduction", type: "textarea", default: "Une question, un devis ? Écrivez-nous, nous répondons rapidement." },
      { key: "showMap", label: "Afficher la carte", type: "boolean", default: true },
    ],
  },
  {
    type: "spacer",
    label: "Espace",
    description: "Un espace vertical ou une ligne de séparation.",
    icon: "↕️",
    fields: [
      { key: "size", label: "Taille", type: "select", options: [
        { value: "sm", label: "Petit" }, { value: "md", label: "Moyen" }, { value: "lg", label: "Grand" } ], default: "md" },
      { key: "line", label: "Afficher une ligne", type: "boolean", default: false },
    ],
  },
];

export const blockDef = (type: string) => BLOCKS.find((b) => b.type === type);

export function newId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function defaultProps(type: string): Record<string, unknown> {
  const def = blockDef(type);
  const props: Record<string, unknown> = {};
  def?.fields.forEach((f) => {
    if (f.default !== undefined) props[f.key] = structuredClone(f.default);
    else if (f.type === "list") props[f.key] = [];
    else if (f.type === "boolean") props[f.key] = false;
    else props[f.key] = "";
  });
  return props;
}

export function makeBlock(type: string, props: Record<string, unknown> = {}): Block {
  return { id: newId(), type, props: { ...defaultProps(type), ...props } };
}
