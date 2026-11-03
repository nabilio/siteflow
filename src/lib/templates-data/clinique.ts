import { makeBlock as B } from "../blocks";
import type { Template } from "../templates";
import { contactPage, tplImg } from "./_helpers";

const I = (n: string) => tplImg("clinique", n);

export const clinique: Template = {
  id: "clinique",
  name: "Aura — Santé / Cabinet médical",
  sector: "Médecin, dentiste, clinique, kiné, laboratoire, pharmacie",
  description: "Rassurant et clair : spécialités, équipe médicale, horaires, questions fréquentes et prise de rendez-vous.",
  highlights: ["Spécialités détaillées", "Équipe médicale", "Horaires & urgences", "FAQ patients"],
  theme: { primary: "#0E9F8E", accent: "#0284C7", dark: "#0B2A33", font: "rounded", radius: "xl", headerStyle: "light" },
  demo: {
    name: "Clinique Aura",
    tagline: "Des soins attentifs, au plus près de vous",
    phone: "+212 5 37 00 55 66",
    whatsapp: "+212600005566",
    email: "rdv@clinique-aura-demo.ma",
    address: "45 avenue Mohammed V, Agdal, Rabat",
    footerText: "Site de démonstration — modèle SiteFlow. En cas d'urgence vitale, appelez le 15.",
  },
  preview: I("hero"),
  pages: [
    {
      slug: "", title: "Accueil", blocks: [
        B("hero", {
          layout: "split", light: true, badge: "Prise de rendez-vous rapide", title: "Votre santé mérite une attention de chaque instant",
          subtitle: "Une équipe de praticiens à l'écoute, un plateau technique moderne et des rendez-vous rapides, dans un cadre pensé pour votre confort.",
          image: I("hero"), ctaLabel: "Prendre rendez-vous", ctaUrl: "/contact", cta2Label: "Nos spécialités", cta2Url: "/specialites",
          badges: [{ text: "Rendez-vous sous 48 h" }, { text: "Tiers payant" }, { text: "Parking gratuit" }],
        }),
        B("features", { title: "Pourquoi nous faire confiance", style: "icons", columns: "4", items: [
          { icon: "👩‍⚕️", title: "Praticiens expérimentés", text: "Une équipe pluridisciplinaire de médecins spécialistes." },
          { icon: "🔬", title: "Plateau technique", text: "Imagerie, analyses et bloc opératoire sur place." },
          { icon: "🕒", title: "Rendez-vous rapides", text: "Consultation sous 48 h et urgences prises en charge." },
          { icon: "💚", title: "Écoute & bienveillance", text: "Le temps d'expliquer, de rassurer, de soigner." },
        ] }),
        B("products", { mode: "featured", title: "Nos spécialités", intro: "Des soins complets pour toute la famille.", ctaLabel: "Toutes les spécialités" }),
        B("textImage", { title: "Une approche centrée sur le patient", image: I("a1"), imageSide: "left", tone: "soft", text: "Chez **{{nom}}**, chaque parcours de soins est coordonné : votre dossier est partagé entre les praticiens, vos résultats sont expliqués et votre suivi est organisé.", bullets: [{ text: "Dossier médical numérique sécurisé" }, { text: "Rappels de rendez-vous par SMS" }, { text: "Prise en charge des mutuelles et assurances" }], ctaLabel: "En savoir plus", ctaUrl: "/a-propos" }),
        B("stats", { items: [{ value: "25", label: "praticiens" }, { value: "18 000", label: "patients suivis" }, { value: "12", label: "spécialités" }, { value: "7j/7", label: "urgences" }] }),
        B("steps", { title: "Votre rendez-vous en 3 étapes", items: [
          { title: "Contactez-nous", text: "Par téléphone, WhatsApp ou via le formulaire en ligne." },
          { title: "Choisissez un créneau", text: "Nous vous proposons les premières disponibilités." },
          { title: "Venez consulter", text: "Accueil, consultation et ordonnance, sans attente." },
        ] }),
        B("testimonials", { title: "Avis de nos patients", items: [
          { quote: "Accueil irréprochable et un docteur qui prend vraiment le temps d'expliquer. Je recommande.", name: "Samira T.", role: "Patiente" },
          { quote: "Rendez-vous obtenu le lendemain, résultats d'analyses rapides. Très professionnel.", name: "Hamza O.", role: "Patient" },
          { quote: "Suivi de grossesse parfait, équipe très humaine.", name: "Leila M.", role: "Patiente" },
        ] }),
        B("faq", { tone: "soft", items: [
          { q: "Comment prendre rendez-vous ?", a: "Par téléphone, par WhatsApp ou via le formulaire de contact. Nous vous répondons dans la journée." },
          { q: "Acceptez-vous les mutuelles et le tiers payant ?", a: "Oui, la majorité des mutuelles et assurances sont acceptées. Présentez votre carte lors du rendez-vous." },
          { q: "Que faire en cas d'urgence ?", a: "Appelez le 15. Notre service d'urgences accueille aussi les patients 7j/7 aux horaires affichés." },
          { q: "Puis-je obtenir mes résultats en ligne ?", a: "Les résultats d'analyses sont disponibles sous 24 à 48 h et peuvent vous être envoyés de façon sécurisée." },
        ] }),
        B("cta", { title: "Besoin d'une consultation ?", text: "Notre équipe vous répond rapidement.", ctaLabel: "Prendre rendez-vous" }),
      ],
    },
    {
      slug: "specialites", title: "Spécialités", blocks: [
        B("richText", { title: "Nos spécialités médicales", text: "Cliquez sur une spécialité pour découvrir les soins proposés.", narrow: false }),
        B("products", { mode: "all", limit: 60, title: "", ctaLabel: "" }),
        B("cta", { title: "Un doute sur la spécialité à consulter ?", text: "Appelez-nous, nous vous orientons.", ctaLabel: "Nous appeler" }),
      ],
    },
    {
      slug: "equipe", title: "L'équipe", blocks: [
        B("richText", { title: "Notre équipe médicale", text: "Des praticiens passionnés, réunis autour d'un même engagement : votre bien-être.", narrow: true }),
        B("team", { title: "", items: [
          { image: I("g1"), name: "Dr Samia Alaoui", role: "Médecine générale" }, { image: I("g2"), name: "Dr Karim Benjelloun", role: "Cardiologie" },
          { image: I("g3"), name: "Dr Meryem Idrissi", role: "Pédiatrie" }, { image: I("g4"), name: "Dr Omar Tazi", role: "Chirurgie dentaire" },
        ] }),
      ],
    },
    {
      slug: "a-propos", title: "À propos", blocks: [
        B("textImage", { title: "Une clinique à taille humaine", image: I("a1"), imageSide: "right", text: "Fondée par un collectif de médecins, **{{nom}}** réunit en un même lieu consultations, imagerie et analyses. Notre ambition : rendre les soins de qualité plus simples et plus accessibles." }),
        B("features", { title: "Nos engagements", tone: "soft", style: "cards", columns: "3", items: [
          { icon: "🛡️", title: "Sécurité", text: "Protocoles d'hygiène stricts et matériel stérilisé." },
          { icon: "🔒", title: "Confidentialité", text: "Vos données médicales restent privées et protégées." },
          { icon: "🤝", title: "Accessibilité", text: "Locaux adaptés, tarifs affichés, tiers payant." },
        ] }),
      ],
    },
    contactPage([B("hours", { title: "Horaires d'ouverture", image: I("a2"), text: "Urgences : appelez le 15 en cas d'urgence vitale.", items: [{ day: "Lundi – Vendredi", time: "8h00 – 19h00" }, { day: "Samedi", time: "8h00 – 14h00" }, { day: "Dimanche", time: "Urgences uniquement" }] })], "Rendez-vous, renseignements, résultats : nous vous répondons dans la journée."),
  ],
  categories: ["Consultations", "Soins & prévention"],
  products: [
    { name: "Médecine générale", category: "Consultations", summary: "Suivi de santé, bilans, certificats, prévention.", image: I("p1"), featured: true, description: "Consultation de médecine générale pour adultes et enfants : suivi de maladies chroniques, bilans de santé, vaccinations, certificats.\n\n**Durée moyenne :** 20 minutes." },
    { name: "Dentisterie & orthodontie", category: "Soins & prévention", summary: "Soins dentaires, détartrage, appareils.", image: I("p2"), featured: true, description: "Soins conservateurs, détartrage, blanchiment, prothèses et orthodontie pour enfants et adultes." },
    { name: "Cardiologie", category: "Consultations", summary: "Bilans cardiaques, ECG, suivi tension.", image: I("p3"), featured: true, description: "Consultation, électrocardiogramme, épreuve d'effort et suivi de l'hypertension." },
    { name: "Pédiatrie", category: "Consultations", summary: "Suivi de croissance et vaccinations.", image: I("p4"), featured: true, description: "Consultations de nourrissons et d'enfants, suivi de croissance, vaccinations, conseils aux parents." },
    { name: "Gynécologie & suivi de grossesse", category: "Consultations", summary: "Consultation, échographie, accompagnement.", image: I("p5"), featured: true, description: "Suivi gynécologique, échographies, préparation à l'accouchement." },
    { name: "Analyses & prévention", category: "Soins & prévention", summary: "Bilans sanguins, dépistages, check-up.", image: I("p6"), featured: true, description: "Laboratoire intégré : bilans sanguins, dépistages et check-up complets avec résultats sous 24 à 48 h." },
  ],
  posts: [
    { kind: "NEWS", title: "Campagne de vaccination contre la grippe", excerpt: "La vaccination saisonnière est ouverte, sans rendez-vous le samedi matin.", image: I("g5"), daysAgo: 6 },
    { kind: "EVENT", title: "Journée de dépistage gratuit", excerpt: "Tension, glycémie et cholestérol : bilan gratuit en 15 minutes.", image: I("g6"), daysAgo: -20, location: "Accueil de la clinique" },
  ],
};
