import { makeBlock as B } from "../blocks";
import type { Template } from "../templates";
import { contactPage, tplImg } from "./_helpers";

const I = (n: string) => tplImg("distribution", n);

export const distribution: Template = {
  id: "distribution",
  name: "Industria — Distributeur / Industrie",
  sector: "Négoce, matériaux, tubes, pièces, équipements",
  description: "Site B2B complet : gammes de produits, fiches techniques, chiffres clés, réalisations et actualités salons.",
  highlights: ["Catalogue par gammes", "Fiches produit", "Salons & actualités", "Devis en 1 clic"],
  theme: { primary: "#0B4F8A", accent: "#F59E0B", dark: "#0B1B33", font: "sans", radius: "md", headerStyle: "light" },
  demo: {
    name: "Industria Pro",
    tagline: "Distribution de solutions techniques pour l'industrie et le bâtiment",
    phone: "+212 5 22 00 11 22",
    whatsapp: "+212600001122",
    email: "contact@industria-demo.ma",
    address: "Zone industrielle Ouled Salah, Casablanca",
    footerText: "Site de démonstration — modèle SiteFlow.",
  },
  preview: I("hero"),
  pages: [
    {
      slug: "", title: "Accueil", blocks: [
        B("hero", {
          layout: "split", badge: "Distributeur depuis 2008", title: "Tout pour vos chantiers et vos lignes de production",
          subtitle: "Tubes, raccords, outillage et équipements techniques : un stock permanent, des produits certifiés et une équipe qui vous répond vite.",
          image: I("hero"), ctaLabel: "Voir le catalogue", ctaUrl: "/produits", cta2Label: "Demander un devis", cta2Url: "/contact",
          badges: [{ text: "Stock permanent" }, { text: "Livraison sous 48 h" }, { text: "Produits certifiés" }],
        }),
        B("badges", { title: "Normes & partenaires", items: [{ text: "ISO 9001" }, { text: "NM EN 1452" }, { text: "CE" }, { text: "ATG" }, { text: "NF" }] }),
        B("products", { mode: "categories", title: "Nos gammes", intro: "Trois grandes familles de produits, disponibles en stock et sur commande." }),
        B("features", {
          title: "Pourquoi travailler avec {{nom}}", intro: "Plus qu'un fournisseur : un partenaire qui sécurise vos approvisionnements.", style: "icons", columns: "3",
          items: [
            { icon: "📦", title: "Stock permanent", text: "Plus de 2 000 références disponibles immédiatement dans nos entrepôts." },
            { icon: "🚚", title: "Livraison rapide", text: "Flotte dédiée : livraison sous 48 h dans les grandes villes du Royaume." },
            { icon: "🛠️", title: "Conseil technique", text: "Nos ingénieurs vous aident à choisir la bonne solution pour votre projet." },
            { icon: "✅", title: "Qualité certifiée", text: "Produits conformes aux normes marocaines et européennes, avec certificats." },
            { icon: "💼", title: "Comptes professionnels", text: "Conditions négociées, facturation mensuelle et suivi dédié." },
            { icon: "🔁", title: "Service après-vente", text: "Retours simplifiés et assistance sur toute la durée de vie du produit." },
          ],
        }),
        B("stats", { items: [{ value: "15+", label: "années d'expérience" }, { value: "1 200", label: "clients professionnels" }, { value: "2 000+", label: "références en stock" }, { value: "48 h", label: "délai de livraison" }] }),
        B("steps", { title: "Commander en 3 étapes", tone: "soft", items: [
          { title: "Demandez un devis", text: "Envoyez votre liste de besoins par formulaire, e-mail ou WhatsApp." },
          { title: "Validez l'offre", text: "Vous recevez un devis détaillé avec prix, délais et conditions." },
          { title: "Recevez votre commande", text: "Livraison sur chantier ou en entrepôt, avec bon de livraison et certificats." },
        ] }),
        B("gallery", { title: "En images", layout: "grid", items: [
          { image: I("g1"), caption: "Entrepôt central" }, { image: I("g2"), caption: "Gamme tubes" }, { image: I("g3"), caption: "Logistique" },
          { image: I("g4"), caption: "Pièces techniques" }, { image: I("g5"), caption: "Outillage" }, { image: I("g6"), caption: "Raccords" },
        ] }),
        B("testimonials", { title: "Ils nous font confiance", items: [
          { quote: "Des délais tenus et un vrai conseil technique. Notre approvisionnement chantier n'a jamais été aussi fluide.", name: "Karim B.", role: "Directeur travaux, entreprise de BTP" },
          { quote: "Le stock est large et la réactivité exemplaire. Les certificats sont fournis sans qu'on ait à les réclamer.", name: "Salma E.", role: "Responsable achats, industrie agroalimentaire" },
          { quote: "Un interlocuteur unique pour tous nos besoins en tuyauterie. Gain de temps considérable.", name: "Youssef A.", role: "Gérant, société de plomberie" },
        ] }),
        B("posts", { title: "Actualités & salons", tone: "soft" }),
        B("cta", { title: "Un projet ? Obtenez votre devis sous 24 h.", text: "Envoyez-nous votre liste, nous vous répondons rapidement.", ctaLabel: "Demander un devis" }),
      ],
    },
    {
      slug: "produits", title: "Produits", blocks: [
        B("richText", { title: "Notre catalogue", text: "Retrouvez l'ensemble de nos gammes. Cliquez sur un produit pour consulter sa fiche technique et demander un devis.", narrow: false }),
        B("products", { mode: "all", limit: 60, title: "", ctaLabel: "" }),
        B("cta", { title: "Vous ne trouvez pas une référence ?", text: "Nous pouvons la commander pour vous.", ctaLabel: "Nous consulter" }),
      ],
    },
    {
      slug: "a-propos", title: "À propos", blocks: [
        B("textImage", { title: "Notre histoire", image: I("a1"), imageSide: "right", text: "Depuis plus de quinze ans, **{{nom}}** accompagne les entreprises du bâtiment et de l'industrie avec une offre large et fiable.\n\nNous sommes partis d'un petit dépôt et d'une conviction : un bon distributeur, c'est d'abord un stock disponible et des conseils honnêtes. Aujourd'hui, notre équipe de 40 collaborateurs sert plus de mille clients professionnels.", bullets: [{ text: "Équipe technique à votre écoute" }, { text: "Partenariats avec des fabricants reconnus" }, { text: "Engagement qualité et traçabilité" }] }),
        B("features", { title: "Nos engagements", tone: "soft", style: "plain", columns: "3", items: [
          { icon: "🤝", title: "Transparence", text: "Prix clairs, délais annoncés, pas de mauvaise surprise." },
          { icon: "🌱", title: "Responsabilité", text: "Emballages réduits, tournées optimisées, produits durables." },
          { icon: "⚡", title: "Réactivité", text: "Une réponse à chaque demande en moins de 24 heures." },
        ] }),
        B("textImage", { title: "Une logistique pensée pour vous", image: I("a2"), imageSide: "left", text: "Deux entrepôts, une flotte de livraison et un système de gestion de stock en temps réel : nous préparons et expédions vos commandes le jour même." }),
        B("stats"),
      ],
    },
    { slug: "actualites", title: "Actualités", blocks: [B("posts", { title: "Toutes nos actualités", limit: 30 })] },
    contactPage([], "Demande de devis, question technique, rendez-vous : écrivez-nous, nous répondons sous 24 h."),
  ],
  categories: ["Tubes & tuyaux", "Raccords", "Outillage & accessoires"],
  products: [
    { name: "Tube PVC pression Ø 63", category: "Tubes & tuyaux", summary: "Tube PVC-U pour adduction d'eau, barres de 6 m.", image: I("p1"), featured: true, description: "Tube en PVC non plastifié pour réseaux d'adduction d'eau sous pression. Résistant à la corrosion, léger et facile à poser.\n\n- Longueur : barre de 6 m\n- Assemblage : emboîture à joint\n- Livré avec certificat de conformité", specs: [{ label: "Diamètre", value: "63 mm" }, { label: "Pression nominale", value: "PN 10 / PN 16" }, { label: "Longueur", value: "6 m" }] },
    { name: "Tube PEHD rouleau Ø 32", category: "Tubes & tuyaux", summary: "Polyéthylène haute densité en couronnes de 100 m.", image: I("p2"), featured: true, description: "Tube PEHD flexible pour irrigation et distribution d'eau potable. Excellente tenue aux chocs et aux UV.", specs: [{ label: "Diamètre", value: "32 mm" }, { label: "Conditionnement", value: "Couronne 100 m" }, { label: "Norme", value: "NM EN 12201" }] },
    { name: "Coude PVC 90° à coller", category: "Raccords", summary: "Raccord coudé pour évacuation, plusieurs diamètres.", image: I("p3"), featured: true, description: "Coude 90° en PVC à coller, pour installations d'évacuation et de ventilation.", specs: [{ label: "Angle", value: "90°" }, { label: "Diamètres", value: "32 à 160 mm" }] },
    { name: "Vanne à boisseau sphérique", category: "Raccords", summary: "Vanne laiton à passage intégral, manette papillon.", image: I("p4"), featured: true, description: "Vanne à boisseau sphérique en laiton, passage intégral, pour circuits d'eau froide et chaude.", specs: [{ label: "Matière", value: "Laiton" }, { label: "Raccordement", value: "Fileté F/F" }] },
    { name: "Coffret d'outillage plombier", category: "Outillage & accessoires", summary: "42 pièces : clés, coupe-tube, pinces, étau.", image: I("p5"), featured: true, description: "Coffret complet pour l'installation et la maintenance de réseaux de plomberie.", specs: [{ label: "Contenu", value: "42 pièces" }] },
    { name: "Colle PVC pot 500 ml", category: "Outillage & accessoires", summary: "Colle forte à prise rapide pour tubes et raccords PVC.", image: I("p6"), featured: true, description: "Colle à solvant pour assemblage PVC rigide. Prise rapide, joint étanche.", specs: [{ label: "Contenance", value: "500 ml" }] },
  ],
  posts: [
    { kind: "EVENT", title: "Nous serons présents au salon international du bâtiment", excerpt: "Retrouvez notre équipe sur le stand pour découvrir les nouveautés de la gamme.", image: I("g1"), daysAgo: -30, location: "Casablanca" },
    { kind: "NEWS", title: "Nouvelle gamme de raccords à sertir", excerpt: "Installation plus rapide, étanchéité garantie : découvrez nos raccords à sertir.", image: I("g2"), daysAgo: 12 },
    { kind: "NEWS", title: "Ouverture de notre second entrepôt", excerpt: "Plus de 1 500 m² de stock supplémentaire pour réduire encore vos délais.", image: I("g3"), daysAgo: 45 },
  ],
};
