import { makeBlock as B } from "../blocks";
import type { Template } from "../templates";
import { contactPage, tplImg } from "./_helpers";

const I = (n: string) => tplImg("cabinet", n);

export const cabinet: Template = {
  id: "cabinet",
  name: "Lex — Cabinet d'avocats / Conseil",
  sector: "Avocat, notaire, expert-comptable, fiduciaire, conseil",
  description: "Sobre et premium : domaines d'intervention, équipe, méthode, tarifs, questions fréquentes et prise de rendez-vous.",
  highlights: ["Domaines d'expertise", "Équipe", "Méthode & honoraires", "Rendez-vous en ligne"],
  theme: { primary: "#7A1F3D", accent: "#B8860B", dark: "#1A1218", font: "serif", radius: "none", headerStyle: "dark" },
  demo: {
    name: "Cabinet Lex & Conseil",
    tagline: "Conseil juridique et défense de vos intérêts",
    phone: "+212 5 22 00 99 00",
    whatsapp: "+212600009900",
    email: "cabinet@lex-conseil-demo.ma",
    address: "Angle boulevard Zerktouni, Casablanca",
    footerText: "Site de démonstration — modèle SiteFlow.",
  },
  preview: I("hero"),
  pages: [
    {
      slug: "", title: "Accueil", blocks: [
        B("hero", {
          layout: "split", badge: "Droit des affaires · Famille · Immobilier", title: "Un conseil juridique clair, une défense déterminée",
          subtitle: "Nous accompagnons entreprises et particuliers dans leurs projets et leurs litiges, avec rigueur, discrétion et un engagement de résultat.",
          image: I("hero"), ctaLabel: "Prendre rendez-vous", ctaUrl: "/contact", cta2Label: "Nos domaines", cta2Url: "/expertises",
          badges: [{ text: "Premier rendez-vous offert" }, { text: "Secret professionnel" }, { text: "Honoraires transparents" }],
        }),
        B("stats", { items: [{ value: "20 ans", label: "d'expérience" }, { value: "2 500", label: "dossiers traités" }, { value: "8", label: "avocats associés" }, { value: "92 %", label: "dossiers gagnés ou conciliés" }] }),
        B("products", { mode: "featured", title: "Domaines d'intervention", intro: "Une équipe pluridisciplinaire pour sécuriser vos décisions.", ctaLabel: "Tous nos domaines" }),
        B("textImage", { title: "Une approche à la fois humaine et stratégique", image: I("a1"), imageSide: "left", tone: "soft", text: "Chaque dossier commence par une écoute attentive. Nous analysons votre situation, vous exposons clairement les options, les risques et les coûts, puis nous construisons la stratégie la plus adaptée.", bullets: [{ text: "Réponse à chaque demande sous 24 h" }, { text: "Un avocat référent pour chaque dossier" }, { text: "Suivi régulier et compte rendu écrit" }] }),
        B("steps", { title: "Notre méthode", items: [
          { title: "Écoute", text: "Rendez-vous confidentiel pour comprendre votre situation." },
          { title: "Analyse", text: "Étude des pièces, des risques et des solutions possibles." },
          { title: "Stratégie", text: "Plan d'action et honoraires validés avec vous." },
          { title: "Action", text: "Négociation, rédaction ou procédure, avec suivi continu." },
        ] }),
        B("testimonials", { title: "Témoignages de clients", tone: "dark", items: [
          { quote: "Un cabinet rigoureux et disponible. Mon litige commercial a été résolu à l'amiable en deux mois.", name: "Réda C.", role: "Dirigeant de PME" },
          { quote: "Des conseils clairs dans une période difficile. Je me suis sentie écoutée et protégée.", name: "Nawal B.", role: "Cliente, droit de la famille" },
          { quote: "Contrats, statuts, recouvrement : un partenaire fiable pour notre croissance.", name: "Anas Z.", role: "Fondateur de start-up" },
        ] }),
        B("faq", { items: [
          { q: "Le premier rendez-vous est-il payant ?", a: "Le premier entretien d'orientation de 30 minutes est offert et sans engagement." },
          { q: "Comment sont calculés vos honoraires ?", a: "Forfait ou taux horaire, annoncés par écrit avant toute intervention. Aucune surprise." },
          { q: "Mes informations sont-elles confidentielles ?", a: "Oui. Nous sommes tenus au secret professionnel pour tous vos échanges et documents." },
        ] }),
        B("cta", { title: "Parlons de votre situation", text: "Un premier échange confidentiel et sans engagement.", ctaLabel: "Prendre rendez-vous" }),
      ],
    },
    {
      slug: "expertises", title: "Expertises", blocks: [
        B("richText", { title: "Nos domaines d'intervention", text: "Cliquez sur un domaine pour découvrir notre accompagnement.", narrow: false }),
        B("products", { mode: "all", limit: 60, title: "", ctaLabel: "" }),
        B("pricing", { title: "Formules d'accompagnement", intro: "Des honoraires clairs, adaptés à votre besoin.", tone: "soft", items: [
          { name: "Consultation", price: "800 DH", period: "/ heure", features: "Analyse de votre situation\nConseil écrit\nOrientation des démarches", highlight: false, ctaLabel: "Réserver", ctaUrl: "/contact" },
          { name: "Dossier forfaitaire", price: "Sur devis", period: "", features: "Contrat, statuts, procédure\nAvocat référent\nSuivi complet", highlight: true, ctaLabel: "Demander un devis", ctaUrl: "/contact" },
          { name: "Abonnement entreprise", price: "2 500 DH", period: "/ mois", features: "Assistance juridique illimitée\nRevue des contrats\nVeille réglementaire", highlight: false, ctaLabel: "Nous consulter", ctaUrl: "/contact" },
        ] }),
      ],
    },
    {
      slug: "equipe", title: "Équipe", blocks: [
        B("richText", { title: "Notre équipe", text: "Avocats, juristes et assistants réunis autour de valeurs communes : rigueur, intégrité, disponibilité.", narrow: true }),
        B("team", { title: "", items: [
          { image: I("g1"), name: "Me Lamia Fassi", role: "Associée · Droit des affaires" }, { image: I("g2"), name: "Me Hicham Berrada", role: "Associé · Contentieux" },
          { image: I("g3"), name: "Me Sofia Chraibi", role: "Droit de la famille" }, { image: I("g4"), name: "Me Mehdi Naciri", role: "Droit immobilier" },
        ] }),
      ],
    },
    {
      slug: "a-propos", title: "Le cabinet", blocks: [
        B("textImage", { title: "Vingt ans au service de vos intérêts", image: I("a1"), imageSide: "right", text: "**{{nom}}** a été fondé sur une conviction : le droit doit protéger et faciliter. Notre indépendance nous permet de vous conseiller librement, sans autre intérêt que le vôtre." }),
        B("features", { title: "Nos valeurs", tone: "soft", style: "icons", columns: "3", items: [
          { icon: "⚖️", title: "Rigueur", text: "Des dossiers préparés dans le détail, sans approximation." },
          { icon: "🔒", title: "Confidentialité", text: "Le secret professionnel est au cœur de notre pratique." },
          { icon: "🤝", title: "Proximité", text: "Un avocat joignable, qui vous tient informé à chaque étape." },
        ] }),
      ],
    },
    contactPage([], "Décrivez brièvement votre situation : un avocat vous recontacte sous 24 h, de façon confidentielle."),
  ],
  categories: ["Entreprises", "Particuliers"],
  products: [
    { name: "Droit des sociétés", category: "Entreprises", summary: "Création, statuts, pactes d'associés, restructurations.", image: I("p1"), featured: true, description: "Création de sociétés, rédaction des statuts, pactes d'associés, assemblées générales, cessions de parts et restructurations." },
    { name: "Contrats & contentieux commercial", category: "Entreprises", summary: "Rédaction, négociation, recouvrement, litiges.", image: I("p2"), featured: true, description: "Sécurisation de vos contrats, recouvrement de créances, défense en cas de litige commercial." },
    { name: "Droit de la famille", category: "Particuliers", summary: "Divorce, garde, pension, succession.", image: I("p3"), featured: true, description: "Accompagnement humain dans les procédures de divorce, de garde, de pension alimentaire et de succession." },
    { name: "Droit immobilier", category: "Particuliers", summary: "Achat, vente, bail, copropriété, titre foncier.", image: I("p4"), featured: true, description: "Sécurisation des transactions, rédaction des actes, litiges de bail et de copropriété." },
    { name: "Droit du travail", category: "Entreprises", summary: "Contrats, licenciements, conflits sociaux.", image: I("p5"), featured: true, description: "Conseil aux employeurs et aux salariés : contrats, procédures disciplinaires, prud'hommes." },
    { name: "Fiscalité & conformité", category: "Entreprises", summary: "Optimisation, contrôles, mise en conformité.", image: I("p6"), featured: true, description: "Audit fiscal, assistance en cas de contrôle, mise en conformité réglementaire." },
  ],
  posts: [
    { kind: "NEWS", title: "Réforme : ce qui change pour les entreprises", excerpt: "Un point clair sur les nouvelles obligations et leur calendrier.", image: I("g5"), daysAgo: 14 },
    { kind: "EVENT", title: "Conférence : sécuriser ses contrats", excerpt: "Atelier gratuit pour les dirigeants de PME, sur inscription.", image: I("g6"), daysAgo: -16, location: "Casablanca" },
  ],
};
