import { makeBlock as B } from "../blocks";
import type { Template } from "../templates";
import { contactPage, tplImg } from "./_helpers";

const I = (n: string) => tplImg("btp", n);

export const btp: Template = {
  id: "btp",
  name: "Bâtis — BTP / Construction",
  sector: "Construction, rénovation, électricité, plomberie, aménagement",
  description: "Robuste et direct : métiers, réalisations, process de chantier, engagements et demande de devis.",
  highlights: ["Métiers & réalisations", "Process de chantier", "Chiffres & garanties", "Devis rapide"],
  theme: { primary: "#EA580C", accent: "#FACC15", dark: "#1F2937", font: "sans", radius: "none", headerStyle: "dark" },
  demo: {
    name: "Bâtisseurs du Sud",
    tagline: "Construction, rénovation et aménagement clé en main",
    phone: "+212 5 28 00 12 34",
    whatsapp: "+212600001234",
    email: "devis@batisseurs-demo.ma",
    address: "Zone industrielle Tassila, Agadir",
    footerText: "Site de démonstration — modèle SiteFlow.",
  },
  preview: I("hero"),
  pages: [
    {
      slug: "", title: "Accueil", blocks: [
        B("hero", {
          layout: "split", badge: "Construction · Rénovation · Aménagement", title: "Nous construisons ce qui dure",
          subtitle: "Villas, immeubles, locaux professionnels : une équipe de maîtres d'œuvre et d'ouvriers qualifiés pour livrer vos projets dans les délais et le budget.",
          image: I("hero"), ctaLabel: "Demander un devis", ctaUrl: "/contact", cta2Label: "Nos réalisations", cta2Url: "/realisations",
          badges: [{ text: "Garantie décennale" }, { text: "Devis gratuit sous 48 h" }, { text: "Suivi de chantier" }],
        }),
        B("stats", { items: [{ value: "250+", label: "chantiers livrés" }, { value: "18 ans", label: "d'expérience" }, { value: "60", label: "compagnons" }, { value: "100 %", label: "délais respectés" }] }),
        B("products", { mode: "featured", title: "Nos métiers", intro: "Tous les corps d'état réunis pour un chantier maîtrisé.", ctaLabel: "Tous nos métiers" }),
        B("steps", { title: "Un chantier, quatre étapes", tone: "soft", items: [
          { title: "Étude & devis", text: "Visite du site, étude technique, devis détaillé gratuit." },
          { title: "Planification", text: "Planning clair, équipes affectées, approvisionnement sécurisé." },
          { title: "Réalisation", text: "Chantier propre, contrôles qualité et comptes rendus réguliers." },
          { title: "Livraison", text: "Réception avec vous, levée des réserves et garanties." },
        ] }),
        B("gallery", { title: "Réalisations récentes", layout: "grid", items: [
          { image: I("g1"), caption: "Résidence R+4" }, { image: I("g2"), caption: "Gros œuvre" }, { image: I("g3"), caption: "Villa individuelle" },
          { image: I("g4"), caption: "Maçonnerie" }, { image: I("g5"), caption: "Sécurité chantier" }, { image: I("g6"), caption: "Finitions" },
        ] }),
        B("features", { title: "Nos engagements", tone: "dark", style: "icons", columns: "4", items: [
          { icon: "⏱️", title: "Délais tenus", text: "Planning contractuel et pénalités de retard assumées." },
          { icon: "💰", title: "Budget maîtrisé", text: "Devis détaillé, pas de supplément caché." },
          { icon: "🦺", title: "Sécurité", text: "Équipements, formation et chantier balisé." },
          { icon: "🛡️", title: "Garanties", text: "Décennale, parfait achèvement et assurance chantier." },
        ] }),
        B("testimonials", { title: "Ils nous ont confié leur chantier", items: [
          { quote: "Villa livrée dans les délais, finitions impeccables. Une équipe sérieuse du début à la fin.", name: "Rachid H.", role: "Propriétaire, Agadir" },
          { quote: "Rénovation de nos bureaux sans interrompre l'activité. Très professionnel.", name: "Sanae D.", role: "Directrice, société de services" },
          { quote: "Devis clair, avancement documenté chaque semaine. Je recommande.", name: "Omar Z.", role: "Promoteur" },
        ] }),
        B("cta", { title: "Un projet de construction ou de rénovation ?", text: "Décrivez-le nous : devis gratuit sous 48 heures.", ctaLabel: "Demander un devis" }),
      ],
    },
    {
      slug: "metiers", title: "Métiers", blocks: [
        B("richText", { title: "Nos métiers", text: "Un seul interlocuteur pour tous les corps d'état.", narrow: false }),
        B("products", { mode: "all", limit: 60, title: "", ctaLabel: "" }),
      ],
    },
    {
      slug: "realisations", title: "Réalisations", blocks: [
        B("gallery", { title: "Nos chantiers", layout: "grid", items: [
          { image: I("g1"), caption: "Résidence R+4" }, { image: I("g2"), caption: "Gros œuvre" }, { image: I("g3"), caption: "Villa individuelle" },
          { image: I("g4"), caption: "Maçonnerie" }, { image: I("g5"), caption: "Sécurité chantier" }, { image: I("g6"), caption: "Finitions" },
        ] }),
        B("posts", { title: "Actualités chantier", tone: "soft" }),
      ],
    },
    {
      slug: "a-propos", title: "L'entreprise", blocks: [
        B("textImage", { title: "Une entreprise de bâtisseurs", image: I("a1"), imageSide: "right", text: "Depuis 2007, **{{nom}}** construit et rénove dans toute la région. Nos équipes allient savoir-faire traditionnel et méthodes modernes pour des ouvrages durables.", bullets: [{ text: "Bureau d'études intégré" }, { text: "Matériel et équipes en propre" }, { text: "Certifications qualité et sécurité" }] }),
        B("textImage", { title: "Qualité et sécurité avant tout", image: I("a2"), imageSide: "left", tone: "soft", text: "Chaque chantier est piloté par un chef de projet dédié, avec contrôles qualité à chaque étape et un plan de prévention des risques." }),
      ],
    },
    contactPage([], "Décrivez votre projet (type de bâtiment, surface, localisation) : nous revenons vers vous sous 48 h avec une première estimation."),
  ],
  categories: ["Construction", "Rénovation", "Second œuvre"],
  products: [
    { name: "Construction de villas", category: "Construction", summary: "De l'étude à la remise des clés, clé en main.", image: I("p1"), featured: true, description: "Conception, permis, gros œuvre, finitions : nous construisons votre villa avec un interlocuteur unique." },
    { name: "Immeubles & promotion", category: "Construction", summary: "Résidences et locaux commerciaux jusqu'à R+6.", image: I("p2"), featured: true, description: "Réalisation d'immeubles collectifs et locaux professionnels pour promoteurs et investisseurs." },
    { name: "Gros œuvre & maçonnerie", category: "Construction", summary: "Fondations, structures béton, élévation.", image: I("p3"), featured: true, description: "Terrassement, fondations, ossature en béton armé et maçonnerie." },
    { name: "Rénovation complète", category: "Rénovation", summary: "Appartements, villas, bureaux, boutiques.", image: I("p4"), featured: true, description: "Rénovation globale ou partielle : démolition, reprise de structure, aménagement et décoration." },
    { name: "Électricité & plomberie", category: "Second œuvre", summary: "Installations neuves, mises aux normes.", image: I("p5"), featured: true, description: "Installation et mise aux normes électriques, réseaux de plomberie et sanitaires." },
    { name: "Carrelage, peinture, menuiserie", category: "Second œuvre", summary: "Finitions soignées et durables.", image: I("p6"), featured: true, description: "Pose de carrelage et de faïence, peinture intérieure et extérieure, menuiserie bois et aluminium." },
  ],
  posts: [
    { kind: "NEWS", title: "Livraison de la résidence Les Palmiers", excerpt: "24 logements livrés avec deux mois d'avance sur le planning.", image: I("g1"), daysAgo: 9 },
    { kind: "NEWS", title: "Nouvelle certification sécurité", excerpt: "Nos équipes ont suivi une formation sécurité renforcée.", image: I("g5"), daysAgo: 40 },
  ],
};
