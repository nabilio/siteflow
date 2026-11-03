import { makeBlock as B } from "../blocks";
import type { Template } from "../templates";
import { contactPage, tplImg } from "./_helpers";

const I = (n: string) => tplImg("beaute", n);

export const beaute: Template = {
  id: "beaute",
  name: "Éclat — Beauté / Spa / Coiffure",
  sector: "Salon de coiffure, institut, spa, hammam, onglerie",
  description: "Doux et élégant : soins et tarifs, galerie, forfaits, avis et réservation par WhatsApp.",
  highlights: ["Carte des soins & tarifs", "Forfaits", "Galerie", "Réservation WhatsApp"],
  theme: { primary: "#BE5A83", accent: "#D9A441", dark: "#3A1F2B", font: "rounded", radius: "xl", headerStyle: "light" },
  demo: {
    name: "Éclat Beauté & Spa",
    tagline: "Votre moment de douceur au cœur de la ville",
    phone: "+212 5 39 00 21 21",
    whatsapp: "+212600002121",
    email: "rdv@eclat-spa-demo.ma",
    address: "8 rue Moulay Youssef, Tanger",
    footerText: "Site de démonstration — modèle SiteFlow.",
  },
  preview: I("hero"),
  pages: [
    {
      slug: "", title: "Accueil", blocks: [
        B("hero", {
          layout: "split", badge: "Institut · Spa · Coiffure", title: "Prenez soin de vous, sans compromis",
          subtitle: "Soins du visage, massages, hammam, coiffure et onglerie : des moments de bien-être dans une ambiance apaisante, avec des produits naturels et doux.",
          image: I("hero"), ctaLabel: "Réserver un soin", ctaUrl: "/contact", cta2Label: "Voir les tarifs", cta2Url: "/soins-tarifs",
          badges: [{ text: "Produits naturels" }, { text: "Sur rendez-vous" }, { text: "Cabines privatives" }],
        }),
        B("features", { title: "Un univers pensé pour votre bien-être", style: "icons", columns: "3", items: [
          { icon: "🌸", title: "Soins du visage", text: "Nettoyage, hydratation, anti-âge adaptés à votre peau." },
          { icon: "💆", title: "Massages & hammam", text: "Rituels relaxants au savon noir, gommage et massage à l'huile d'argan." },
          { icon: "💇", title: "Coiffure & couleur", text: "Coupe, brushing, balayage et soins profonds." },
          { icon: "💅", title: "Onglerie", text: "Manucure, pose de vernis semi-permanent, nail art." },
          { icon: "🕯️", title: "Ambiance apaisante", text: "Cabines feutrées, musique douce, thé à la menthe offert." },
          { icon: "🌿", title: "Produits naturels", text: "Huiles et soins d'origine locale, sans ingrédients agressifs." },
        ] }),
        B("products", { mode: "featured", title: "Nos soins signature", intro: "Les rituels préférés de nos clientes.", ctaLabel: "Tous les soins" }),
        B("textImage", { title: "Le temps d'une parenthèse", image: I("a1"), imageSide: "right", tone: "soft", text: "Chez **{{nom}}**, chaque visite est pensée comme une pause : nos praticiennes diplômées prennent le temps de vous écouter pour adapter chaque soin.", bullets: [{ text: "Praticiennes diplômées et expérimentées" }, { text: "Hygiène irréprochable, matériel stérilisé" }, { text: "Forfaits couple et entre amies" }] }),
        B("gallery", { title: "L'institut en images", layout: "grid", items: [
          { image: I("g1"), caption: "Soin visage" }, { image: I("g2"), caption: "Cabine massage" }, { image: I("g3"), caption: "Produits naturels" },
          { image: I("g4"), caption: "Coiffure" }, { image: I("g5"), caption: "Espace détente" }, { image: I("g6"), caption: "Hammam" },
        ] }),
        B("testimonials", { title: "Elles en parlent", items: [
          { quote: "Le massage à l'huile d'argan était divin. Je suis ressortie complètement détendue.", name: "Amal S.", role: "Cliente" },
          { quote: "Ambiance douce, équipe adorable et résultats visibles sur ma peau en deux séances.", name: "Zineb R.", role: "Cliente" },
          { quote: "Mon salon préféré pour la couleur : elles écoutent vraiment ce qu'on veut.", name: "Kenza B.", role: "Cliente" },
        ] }),
        B("pricing", { title: "Nos forfaits bien-être", intro: "Offrez-vous (ou offrez) un moment d'exception.", tone: "soft", items: [
          { name: "Escale détente", price: "450 DH", period: "1 h 30", features: "Hammam traditionnel\nGommage au savon noir\nThé à la menthe", highlight: false, ctaLabel: "Réserver", ctaUrl: "/contact" },
          { name: "Rituel signature", price: "790 DH", period: "2 h 30", features: "Hammam et gommage\nMassage à l'huile d'argan\nSoin du visage éclat", highlight: true, ctaLabel: "Réserver", ctaUrl: "/contact" },
          { name: "Duo / couple", price: "1 400 DH", period: "2 h", features: "Hammam privatif\nMassage en duo\nBoissons et douceurs", highlight: false, ctaLabel: "Réserver", ctaUrl: "/contact" },
        ] }),
        B("cta", { title: "Offrez-vous une pause", text: "Réservez votre créneau en quelques secondes, par WhatsApp ou par téléphone.", ctaLabel: "Réserver maintenant" }),
      ],
    },
    {
      slug: "soins-tarifs", title: "Soins & tarifs", blocks: [
        B("richText", { title: "Soins & tarifs", text: "Prix en dirhams, durée indiquée à titre indicatif. Réservation conseillée.", narrow: true }),
        B("priceList", { items: [
          { group: "Visage", name: "Nettoyage de peau", text: "Gommage, extraction, masque, 60 min", price: "280 DH" },
          { group: "Visage", name: "Soin hydratant éclat", text: "Sérum, massage, masque, 75 min", price: "380 DH" },
          { group: "Visage", name: "Soin anti-âge", text: "Protocole complet, 90 min", price: "520 DH" },
          { group: "Corps & hammam", name: "Hammam & gommage", text: "Savon noir, kessa, rinçage, 60 min", price: "250 DH" },
          { group: "Corps & hammam", name: "Massage relaxant", text: "Huile d'argan, 60 min", price: "400 DH" },
          { group: "Corps & hammam", name: "Massage aux pierres chaudes", text: "75 min", price: "520 DH" },
          { group: "Coiffure", name: "Brushing", text: "", price: "120 DH" },
          { group: "Coiffure", name: "Coupe + soin", text: "", price: "250 DH" },
          { group: "Coiffure", name: "Balayage", text: "Selon longueur", price: "à partir de 700 DH" },
          { group: "Mains & pieds", name: "Manucure + vernis", text: "", price: "150 DH" },
          { group: "Mains & pieds", name: "Pose semi-permanent", text: "", price: "220 DH" },
          { group: "Mains & pieds", name: "Pédicure spa", text: "", price: "260 DH" },
        ] }),
        B("cta", { title: "Un doute sur le soin idéal ?", text: "Nos praticiennes vous conseillent gratuitement.", ctaLabel: "Poser une question" }),
      ],
    },
    {
      slug: "galerie", title: "Galerie", blocks: [
        B("gallery", { title: "En images", layout: "grid", items: [
          { image: I("g1"), caption: "Soin visage" }, { image: I("g2"), caption: "Cabine massage" }, { image: I("g3"), caption: "Produits" }, { image: I("g4"), caption: "Coiffure" },
          { image: I("g5"), caption: "Détente" }, { image: I("g6"), caption: "Hammam" }, { image: I("a1"), caption: "L'accueil" }, { image: I("a2"), caption: "Les soins" },
        ] }),
      ],
    },
    {
      slug: "a-propos", title: "À propos", blocks: [
        B("textImage", { title: "Notre philosophie", image: I("a2"), imageSide: "left", text: "**{{nom}}** est né du désir de créer un lieu où le temps ralentit. Nous sélectionnons des produits naturels et formons nos équipes à des gestes précis et attentionnés." }),
        B("features", { title: "Nos engagements", tone: "soft", style: "cards", columns: "3", items: [
          { icon: "🌿", title: "Naturel", text: "Argan, rose, fleur d'oranger : des soins simples et efficaces." },
          { icon: "🧼", title: "Hygiène", text: "Matériel stérilisé, linge renouvelé à chaque client." },
          { icon: "💗", title: "Écoute", text: "Un diagnostic offert avant chaque soin." },
        ] }),
      ],
    },
    contactPage([B("hours", { title: "Horaires", tone: "soft", items: [{ day: "Mardi – Samedi", time: "10h00 – 20h00" }, { day: "Dimanche", time: "11h00 – 18h00" }, { day: "Lundi", time: "Fermé" }] })], "Réservation, cadeau, question sur un soin : écrivez-nous ou envoyez un message WhatsApp."),
  ],
  categories: ["Visage", "Corps & hammam", "Coiffure & ongles"],
  products: [
    { name: "Rituel hammam & gommage", category: "Corps & hammam", summary: "Savon noir, kessa, massage à l'argan.", image: I("p1"), price: "250 DH", featured: true, description: "Un hammam traditionnel suivi d'un gommage au savon noir, pour une peau douce et lumineuse." },
    { name: "Soin visage éclat", category: "Visage", summary: "Nettoyage, sérum vitaminé, masque, massage.", image: I("p2"), price: "380 DH", featured: true, description: "Un soin complet pour retrouver une peau fraîche et lumineuse, adapté à votre type de peau." },
    { name: "Coupe & brushing", category: "Coiffure & ongles", summary: "Conseil, coupe sur mesure, soin et coiffage.", image: I("p3"), price: "250 DH", featured: true, description: "Coupe personnalisée avec soin profond et brushing finition." },
    { name: "Massage relaxant à l'huile d'argan", category: "Corps & hammam", summary: "60 minutes de détente profonde.", image: I("p4"), price: "400 DH", featured: true, description: "Massage doux et enveloppant pour dénouer les tensions, à l'huile d'argan pure." },
    { name: "Manucure & vernis semi-permanent", category: "Coiffure & ongles", summary: "Soin des mains et pose longue durée.", image: I("p5"), price: "220 DH", featured: true, description: "Limage, soin des cuticules, pose de vernis semi-permanent tenue 3 semaines." },
    { name: "Forfait duo", category: "Corps & hammam", summary: "Hammam et massage pour deux personnes.", image: I("p6"), price: "1 400 DH", featured: true, description: "Un moment à partager : hammam privatif, massage en duo, boissons et douceurs." },
  ],
  posts: [
    { kind: "NEWS", title: "Nouveau : soin à la rose de Damas", excerpt: "Un rituel hydratant et parfumé, disponible dès cette semaine.", image: I("g3"), daysAgo: 7 },
    { kind: "EVENT", title: "Soirée entre amies", excerpt: "Une soirée détente avec hammam, thé et douceurs, sur réservation.", image: I("g5"), daysAgo: -12, location: "Institut" },
  ],
};
