import { createHash } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "./db";
import { slugify } from "./utils";
import { TEMPLATES, type Template } from "./templates";

export const DEMO_PREFIX = "tpl-";

/** Remplace {{nom}} par le nom du site dans tout le contenu d'un modèle. */
function personalize<T>(value: T, name: string): T {
  const safe = JSON.stringify(name).slice(1, -1);
  return JSON.parse(JSON.stringify(value).split("{{nom}}").join(safe));
}

type Overrides = {
  name: string;
  slug: string;
  domain?: string | null;
  primary?: string;
  accent?: string;
  tagline?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  contactEmail?: string | null;
  address?: string | null;
  footerText?: string | null;
  seoDescription?: string | null;
  status?: "DRAFT" | "PUBLISHED";
  samples: boolean;
};

/** Crée un site complet (pages, catégories, produits, actualités) à partir d'un modèle. */
export async function buildSiteFromTemplate(tpl: Template, o: Overrides) {
  const t = personalize(tpl, o.name);
  const site = await prisma.site.create({
    data: {
      name: o.name,
      slug: o.slug,
      domain: o.domain ?? null,
      template: tpl.id,
      status: o.status ?? "DRAFT",
      theme: { ...t.theme, primary: o.primary || t.theme.primary, accent: o.accent || t.theme.accent },
      tagline: o.tagline ?? null,
      phone: o.phone ?? null,
      whatsapp: o.whatsapp ?? null,
      contactEmail: o.contactEmail ?? null,
      address: o.address ?? null,
      footerText: o.footerText ?? null,
      seoTitle: o.name,
      seoDescription: o.seoDescription ?? null,
      pages: {
        create: t.pages.map((p, i) => ({
          slug: p.slug,
          title: p.title,
          navLabel: p.navLabel ?? null,
          inNav: p.inNav ?? true,
          order: i,
          blocks: p.blocks as unknown as Prisma.InputJsonValue,
        })),
      },
    },
  });

  if (o.samples) {
    const cats = new Map<string, string>();
    for (const [i, name] of (t.categories ?? []).entries()) {
      const c = await prisma.category.create({ data: { siteId: site.id, name, slug: slugify(name), order: i } });
      cats.set(name, c.id);
    }
    for (const [i, p] of (t.products ?? []).entries()) {
      let catId = cats.get(p.category);
      if (!catId) {
        const c = await prisma.category.create({ data: { siteId: site.id, name: p.category, slug: slugify(p.category), order: cats.size } });
        catId = c.id;
        cats.set(p.category, catId);
      }
      await prisma.product.create({
        data: {
          siteId: site.id, categoryId: catId, name: p.name, slug: slugify(p.name), summary: p.summary, description: p.description ?? null,
          imageUrl: p.image, price: p.price ?? null, featured: !!p.featured, order: i, specs: p.specs ?? undefined,
        },
      });
    }
    for (const p of t.posts ?? []) {
      await prisma.post.create({
        data: {
          siteId: site.id, kind: p.kind, title: p.title, slug: slugify(p.title), excerpt: p.excerpt, body: p.body ?? p.excerpt,
          imageUrl: p.image, date: new Date(Date.now() - p.daysAgo * 86400000), location: p.location ?? null,
        },
      });
    }
  }
  return site;
}

const hashOf = (tpl: Template) => "tplhash:" + createHash("sha1").update(JSON.stringify(tpl)).digest("hex").slice(0, 12);

/** Maintient un site de démonstration par modèle (slug tpl-<id>) pour l'aperçu dans le Studio. */
export async function ensureTemplateDemos() {
  for (const tpl of TEMPLATES) {
    if (tpl.id === "vierge") continue;
    const slug = DEMO_PREFIX + tpl.id;
    const hash = hashOf(tpl);
    const existing = await prisma.site.findUnique({ where: { slug } });
    if (existing?.seoDescription === hash) continue;
    if (existing) await prisma.site.delete({ where: { slug } });
    const d = tpl.demo;
    const site = await buildSiteFromTemplate(tpl, {
      name: d.name, slug, tagline: d.tagline, phone: d.phone, whatsapp: d.whatsapp ?? null, contactEmail: d.email, address: d.address,
      footerText: d.footerText ?? null, status: "PUBLISHED", samples: true,
    });
    await prisma.site.update({ where: { id: site.id }, data: { seoDescription: hash } });
  }
}
