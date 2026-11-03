import { makeBlock as B } from "../blocks";
import type { Template } from "../templates";
import { contactPage, tplImg } from "./_helpers";

const I = (n: string) => tplImg("restaurant", n);

export const restaurant: Template = {
  id: "restaurant",
  name: "Saveurs — Restaurant / Café",
  sector: "Restaurant, café, traiteur, pâtisserie, riad",
  description: "Ambiance chaleureuse : carte complète avec prix, plats signature, galerie, horaires et réservation.",
  highlights: ["Carte avec prix", "Plats signature", "Galerie", "Horaires & réservation"],
  theme: { primary: "#C2410C", accent: "#D4A017", dark: "#1C1210", font: "serif", radius: "md", headerStyle: "dark" },
  demo: {
    name: "Dar Saveurs",
    tagline: "Cuisine marocaine de tradition, revisitée",
    phone: "+212 5 24 00 33 44",
    whatsapp: "+212600003344",
    email: "reservation@darsaveurs-demo.ma",
    address: "12 rue des Orangers, Médina, Marrakech",
    footerText: "Site de démonstration — modèle SiteFlow.",
  },
  preview: I("hero"),
  pages: [
    {
      slug: "", title: "Accueil", blocks: [
        B("hero", {
          layout: "split", badge: "Cuisine de tradition", title: "Des saveurs authentiques, une table généreuse",
          subtitle: "Tajines mijotés, pastillas dorées, pâtisseries maison : une cuisine de famille préparée chaque jour avec des produits frais.",
          image: I("hero"), ctaLabel: "Réserver une table", ctaUrl: "/contact", cta2Label: "Voir la carte", cta2Url: "/la-carte",
          badges: [{ text: "Produits frais du marché" }, { text: "Terrasse ombragée" }, { text: "Ouvert 7j/7" }],
        }),
        B("textImage", { title: "Une cuisine qui raconte une histoire", image: I("a1"), imageSide: "right", text: "Chez **{{nom}}**, chaque recette vient d'un carnet de famille. Nous travaillons avec des producteurs locaux et cuisinons à la commande, pour que chaque assiette ait le goût d'un repas partagé à la maison.", bullets: [{ text: "Épices et huiles de producteurs locaux" }, { text: "Pain et pâtisseries faits maison" }, { text: "Options végétariennes à chaque service" }], ctaLabel: "Notre histoire", ctaUrl: "/a-propos" }),
        B("products", { mode: "featured", title: "Nos plats signature", intro: "Les incontournables de la maison, préparés chaque jour.", ctaLabel: "Voir toute la carte" }),
        B("stats", { items: [{ value: "4,8/5", label: "note de nos clients" }, { value: "12 000", label: "couverts par an" }, { value: "25", label: "recettes de famille" }, { value: "7j/7", label: "ouvert" }] }),
        B("gallery", { title: "L'ambiance", layout: "grid", items: [
          { image: I("g1"), caption: "Le tajine du jour" }, { image: I("g2"), caption: "Thé à la menthe" }, { image: I("g3"), caption: "Pastilla" },
          { image: I("g4"), caption: "Salades fraîches" }, { image: I("g5"), caption: "Plat du chef" }, { image: I("g6"), caption: "Café gourmand" },
        ] }),
        B("testimonials", { title: "Ce que disent nos convives", tone: "dark", items: [
          { quote: "Le meilleur tajine d'agneau que j'aie mangé. Accueil chaleureux et cadre magnifique.", name: "Nadia L.", role: "Cliente" },
          { quote: "Une vraie adresse de quartier : généreux, authentique, et le service est adorable.", name: "Thomas R.", role: "Voyageur" },
          { quote: "Nous y avons fêté un anniversaire de 20 personnes, tout était parfait.", name: "Imane K.", role: "Cliente" },
        ] }),
        B("hours", { title: "Venez nous voir", text: "Réservation conseillée le week-end et pour les groupes. Nous organisons aussi vos événements privés.", image: I("a2"), items: [
          { day: "Lundi – Jeudi", time: "12h00 – 15h00 · 19h00 – 23h00" }, { day: "Vendredi – Samedi", time: "12h00 – 23h30" }, { day: "Dimanche", time: "12h00 – 22h00" },
        ] }),
        B("cta", { title: "Une table vous attend", text: "Réservez en ligne ou par téléphone, nous confirmons rapidement.", ctaLabel: "Réserver" }),
      ],
    },
    {
      slug: "la-carte", title: "La carte", blocks: [
        B("richText", { title: "Notre carte", text: "Les plats évoluent avec les saisons. Prix en dirhams, taxes comprises. Dites-nous vos allergies, nous adaptons.", narrow: true }),
        B("priceList", { title: "", items: [
          { group: "Entrées", name: "Salade marocaine", text: "Tomates, concombre, oignon, coriandre, huile d'olive", price: "45 DH" },
          { group: "Entrées", name: "Zaalouk & pain maison", text: "Aubergines fumées, tomates, cumin", price: "50 DH" },
          { group: "Entrées", name: "Pastilla au poulet", text: "Feuilleté aux amandes, cannelle et sucre glace", price: "85 DH" },
          { group: "Plats", name: "Tajine d'agneau aux pruneaux", text: "Mijoté 4 heures, amandes grillées", price: "145 DH" },
          { group: "Plats", name: "Couscous royal", text: "Sept légumes, agneau, poulet, merguez", price: "130 DH" },
          { group: "Plats", name: "Tajine de poulet aux olives", text: "Citron confit, olives violettes", price: "110 DH" },
          { group: "Plats", name: "Tajine végétarien", text: "Légumes de saison, pois chiches", price: "95 DH" },
          { group: "Desserts", name: "Pastilla au lait", text: "Crème d'amande, fleur d'oranger", price: "55 DH" },
          { group: "Desserts", name: "Assiette de gâteaux marocains", text: "Cornes de gazelle, ghriba, sellou", price: "50 DH" },
          { group: "Boissons", name: "Thé à la menthe", text: "Théière pour deux", price: "25 DH" },
          { group: "Boissons", name: "Jus d'orange pressé", text: "", price: "30 DH" },
          { group: "Boissons", name: "Café noir / café crème", text: "", price: "20 DH" },
        ] }),
        B("cta", { title: "Menu groupe & événements", text: "Anniversaires, repas d'entreprise : nous préparons un menu sur mesure.", ctaLabel: "Nous contacter" }),
      ],
    },
    {
      slug: "galerie", title: "Galerie", blocks: [
        B("gallery", { title: "En images", layout: "grid", items: [
          { image: I("g1"), caption: "Tajine" }, { image: I("g2"), caption: "Thé" }, { image: I("g3"), caption: "Pastilla" }, { image: I("g4"), caption: "Salades" },
          { image: I("g5"), caption: "Plat du chef" }, { image: I("g6"), caption: "Dessert" }, { image: I("a1"), caption: "La salle" }, { image: I("a2"), caption: "La terrasse" },
        ] }),
      ],
    },
    {
      slug: "a-propos", title: "Notre histoire", blocks: [
        B("textImage", { title: "Trois générations en cuisine", image: I("a1"), imageSide: "left", text: "Tout a commencé dans la cuisine de ma grand-mère, un vendredi de couscous. Aujourd'hui, **{{nom}}** perpétue ces recettes avec la même exigence : de bons produits, du temps, et le plaisir de recevoir." }),
        B("features", { title: "Nos valeurs", tone: "soft", style: "icons", columns: "3", items: [
          { icon: "🌿", title: "Produits frais", text: "Marché chaque matin, producteurs locaux, saisons respectées." },
          { icon: "🔥", title: "Cuisson lente", text: "Les tajines mijotent des heures, comme à la maison." },
          { icon: "🤲", title: "Hospitalité", text: "On vous reçoit comme des invités, pas comme des clients." },
        ] }),
      ],
    },
    contactPage([B("hours", { title: "Horaires", tone: "soft", items: [{ day: "Lundi – Jeudi", time: "12h00 – 15h00 · 19h00 – 23h00" }, { day: "Vendredi – Samedi", time: "12h00 – 23h30" }, { day: "Dimanche", time: "12h00 – 22h00" }] })], "Réservation, groupe, privatisation : écrivez-nous ou appelez-nous, nous confirmons rapidement."),
  ],
  categories: ["Plats", "Entrées", "Desserts & boissons"],
  products: [
    { name: "Tajine d'agneau aux pruneaux", category: "Plats", summary: "Mijoté quatre heures, amandes grillées et sésame.", image: I("p1"), price: "145 DH", featured: true, description: "Notre plat emblématique : épaule d'agneau fondante, pruneaux confits au miel, amandes grillées.\n\nServi avec du pain maison." },
    { name: "Pastilla au poulet", category: "Entrées", summary: "Feuilleté croustillant, amandes, cannelle.", image: I("p2"), price: "85 DH", featured: true, description: "Feuilles de brick dorées, poulet effiloché aux oignons, amandes, cannelle et sucre glace." },
    { name: "Thé à la menthe", category: "Desserts & boissons", summary: "Théière pour deux, menthe fraîche.", image: I("p3"), price: "25 DH", featured: true, description: "Thé vert à la menthe fraîche, préparé à la table." },
    { name: "Salade fraîcheur du marché", category: "Entrées", summary: "Légumes croquants, herbes, huile d'olive.", image: I("p4"), price: "45 DH", featured: true, description: "Salade de saison aux herbes fraîches, huile d'olive vierge et citron." },
    { name: "Couscous royal", category: "Plats", summary: "Sept légumes, agneau, poulet, merguez.", image: I("p5"), price: "130 DH", featured: true, description: "Le grand classique du vendredi, semoule roulée à la main." },
    { name: "Café gourmand", category: "Desserts & boissons", summary: "Café et assortiment de mini-desserts.", image: I("p6"), price: "45 DH", featured: true, description: "Un expresso accompagné de trois mignardises maison." },
  ],
  posts: [
    { kind: "EVENT", title: "Soirée musique andalouse", excerpt: "Un dîner en musique, le premier vendredi de chaque mois. Sur réservation.", image: I("g3"), daysAgo: -14, location: "Terrasse" },
    { kind: "NEWS", title: "Nouveau menu de saison", excerpt: "Courge, grenade et agrumes : la carte d'automne est arrivée.", image: I("g4"), daysAgo: 8 },
  ],
};
