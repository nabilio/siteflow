import { prisma } from "./db";
import type { Prisma } from "@prisma/client";

/** Export complet d'un site (sans les utilisateurs ni les messages). */
export async function exportSite(siteId: string) {
  const site = await prisma.site.findUniqueOrThrow({
    where: { id: siteId },
    include: { pages: true, categories: true, products: true, posts: true, media: true },
  });
  const { id, createdAt, updatedAt, ...rest } = site;
  void id; void createdAt; void updatedAt;
  return {
    format: "siteflow-export",
    version: 1,
    exportedAt: new Date().toISOString(),
    site: rest,
  };
}

export type SiteExport = Awaited<ReturnType<typeof exportSite>>;

/** Import d'un export : crée un nouveau site (slug/domaine ajustés si déjà pris). */
export async function importSite(data: SiteExport, opts: { slug?: string; domain?: string | null } = {}) {
  const s = data.site;
  let slug = opts.slug || s.slug;
  if (await prisma.site.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  const domain = opts.domain === undefined ? s.domain : opts.domain;
  const j = (v: unknown) => (v == null ? undefined : (v as Prisma.InputJsonValue));

  const site = await prisma.site.create({
    data: {
      slug, domain: domain && !(await prisma.site.findUnique({ where: { domain } })) ? domain : null,
      name: s.name, tagline: s.tagline, status: s.status, template: s.template, theme: s.theme as Prisma.InputJsonValue,
      logoUrl: s.logoUrl, faviconUrl: s.faviconUrl, contactEmail: s.contactEmail, phone: s.phone, whatsapp: s.whatsapp,
      address: s.address, mapEmbedUrl: s.mapEmbedUrl, socials: j(s.socials), seoTitle: s.seoTitle, seoDescription: s.seoDescription, footerText: s.footerText,
    },
  });
  const catMap = new Map<string, string>();
  for (const c of s.categories) {
    const nc = await prisma.category.create({ data: { siteId: site.id, name: c.name, slug: c.slug, order: c.order } });
    catMap.set(c.id, nc.id);
  }
  // Les URLs /uploads/<ancienId>/... deviennent /uploads/<nouvelId>/...
  const RX = /\/uploads\/[^/"\s]+\//g;
  const fix = (u: string | null) => (u ? u.replace(RX, `/uploads/${site.id}/`) : u);
  const fixJson = (v: unknown) => JSON.parse(JSON.stringify(v ?? null).replace(RX, `/uploads/${site.id}/`));

  await prisma.page.createMany({ data: s.pages.map((p) => ({ siteId: site.id, slug: p.slug, title: p.title, navLabel: p.navLabel, inNav: p.inNav, order: p.order, published: p.published, blocks: fixJson(p.blocks), seoTitle: p.seoTitle, seoDescription: p.seoDescription })) });
  await prisma.product.createMany({ data: s.products.map((p) => ({ siteId: site.id, categoryId: p.categoryId ? catMap.get(p.categoryId) ?? null : null, name: p.name, slug: p.slug, summary: p.summary, description: p.description, imageUrl: fix(p.imageUrl), images: fixJson(p.images), specs: j(p.specs), pdfUrl: fix(p.pdfUrl), price: p.price, featured: p.featured, published: p.published, order: p.order })) });
  await prisma.post.createMany({ data: s.posts.map((p) => ({ siteId: site.id, kind: p.kind, title: p.title, slug: p.slug, excerpt: p.excerpt, body: p.body, imageUrl: fix(p.imageUrl), link: p.link, location: p.location, date: p.date, endDate: p.endDate, published: p.published })) });
  await prisma.media.createMany({ data: s.media.map((m) => ({ siteId: site.id, url: fix(m.url)!, name: m.name, mime: m.mime, size: m.size })) });
  if (site.logoUrl || site.faviconUrl) await prisma.site.update({ where: { id: site.id }, data: { logoUrl: fix(site.logoUrl), faviconUrl: fix(site.faviconUrl) } });
  return site;
}

/** Identifiant de site d'origine (dossier des médias) contenu dans un export. */
export function sourceSiteIdOf(data: SiteExport): string | null {
  const m = data.site.media[0]?.url.match(/^\/uploads\/([^/]+)\//);
  return m?.[1] ?? null;
}
