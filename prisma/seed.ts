import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { TEMPLATES } from "../src/lib/templates";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@flowtechnologie.ma").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "ChangezMoi!2026";
  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Super admin", role: "SUPERADMIN", passwordHash: await bcrypt.hash(password, 10) },
  });
  console.log(`✔ Compte superadmin : ${admin.email}`);

  if (process.env.SEED_DEMO !== "0" && !(await prisma.site.findUnique({ where: { slug: "demo" } }))) {
    const tpl = TEMPLATES[0];
    const site = await prisma.site.create({
      data: {
        slug: "demo",
        name: "Atlas Distribution (démo)",
        tagline: "Tubes, raccords et solutions techniques",
        template: tpl.id,
        theme: tpl.theme,
        phone: "+212 5 22 00 00 00",
        whatsapp: "+212600000000",
        contactEmail: "contact@exemple.ma",
        address: "Zone industrielle, Casablanca",
        seoTitle: "Atlas Distribution — démo SiteFlow",
        status: "PUBLISHED",
        pages: { create: tpl.pages.map((p, i) => ({ slug: p.slug, title: p.title, navLabel: p.navLabel ?? null, inNav: p.inNav ?? true, order: i, blocks: JSON.parse(JSON.stringify(p.blocks)) })) },
      },
    });
    const cats = ["Tubes PVC", "Tubes PEHD", "Raccords"];
    for (const [i, name] of cats.entries()) {
      const c = await prisma.category.create({ data: { siteId: site.id, name, slug: name.toLowerCase().replace(/\s+/g, "-"), order: i } });
      for (let k = 1; k <= 3; k++) {
        await prisma.product.create({
          data: {
            siteId: site.id, categoryId: c.id, name: `${name} — référence ${k}`, slug: `${c.slug}-ref-${k}`, order: k,
            summary: `Description courte de la référence ${k} de la gamme ${name}.`,
            description: `## Caractéristiques\n\nTexte de description à remplacer.\n\n- Conforme aux normes\n- Disponible en stock`,
            specs: [{ label: "Diamètre", value: "20 à 110 mm" }, { label: "Pression", value: "PN 10 / PN 16" }],
            featured: k === 1,
          },
        });
      }
    }
    await prisma.post.createMany({
      data: [
        { siteId: site.id, kind: "EVENT", title: "Salon du bâtiment", slug: "salon-du-batiment", excerpt: "Retrouvez-nous sur notre stand.", location: "Casablanca", date: new Date(Date.now() + 30 * 86400000), endDate: new Date(Date.now() + 33 * 86400000) },
        { siteId: site.id, kind: "NEWS", title: "Nouvelle gamme disponible", slug: "nouvelle-gamme", excerpt: "Une nouvelle gamme vient enrichir notre catalogue.", body: "Texte de l'actualité.", date: new Date() },
      ],
    });
    console.log("✔ Site de démonstration créé : /s/demo");
  }
}

main().finally(() => prisma.$disconnect());
