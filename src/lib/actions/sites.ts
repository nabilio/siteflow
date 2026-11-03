"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireStaff, assertSiteAccess } from "@/lib/studio";
import { templateById } from "@/lib/templates";
import { buildSiteFromTemplate } from "@/lib/template-build";
import { cleanDomain, slugify } from "@/lib/utils";
import { hashPassword } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

export async function createSiteAction(formData: FormData) {
  await requireStaff();
  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Nom requis");
  const tpl = templateById(String(formData.get("template") || "distribution"));
  let slug = slugify(String(formData.get("slug") || name)) || "site";
  const existing = await prisma.site.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  const domainRaw = String(formData.get("domain") || "");
  let domain = domainRaw ? cleanDomain(domainRaw) : null;
  let domainTaken = false;
  if (domain && (await prisma.site.findUnique({ where: { domain } }))) {
    domain = null;
    domainTaken = true;
  }

  const f = (k: string) => String(formData.get(k) || "").trim() || null;
  const site = await buildSiteFromTemplate(tpl, {
    name, slug, domain,
    primary: String(formData.get("primary") || ""), accent: String(formData.get("accent") || ""),
    tagline: f("tagline") ?? tpl.demo.tagline, phone: f("phone"), whatsapp: f("whatsapp"), contactEmail: f("contactEmail"), address: f("address"),
    samples: formData.get("samples") === "on",
  });

  // Compte client (optionnel)
  const clientEmail = String(formData.get("clientEmail") || "").trim().toLowerCase();
  const clientPassword = String(formData.get("clientPassword") || "");
  if (clientEmail && clientPassword) {
    await prisma.user.create({ data: { email: clientEmail, passwordHash: await hashPassword(clientPassword), name: name, role: "CLIENT", siteId: site.id } });
  }

  redirect(`/studio/sites/${site.id}${domainTaken ? "?alerte=domaine" : ""}`);
}

export async function updateSiteSettingsAction(formData: FormData) {
  const siteId = String(formData.get("siteId"));
  const session = await assertSiteAccess(siteId);
  const staff = session.role !== "CLIENT";
  const base = String(formData.get("base") || `/studio/sites/${siteId}`);
  const current = await prisma.site.findUniqueOrThrow({ where: { id: siteId } });
  const theme = (current.theme ?? {}) as Record<string, unknown>;

  const f = (k: string) => (formData.has(k) ? String(formData.get(k) || "").trim() || null : undefined);
  const socials: Record<string, string> = {};
  for (const k of ["facebook", "instagram", "linkedin", "tiktok", "youtube", "x"]) {
    const v = f(`social_${k}`);
    if (v) socials[k] = v;
  }

  const data: Prisma.SiteUpdateInput = {
    name: f("name") ?? undefined,
    tagline: f("tagline"),
    phone: f("phone"),
    whatsapp: f("whatsapp"),
    contactEmail: f("contactEmail"),
    address: f("address"),
    mapEmbedUrl: f("mapEmbedUrl"),
    footerText: f("footerText"),
    seoTitle: f("seoTitle"),
    seoDescription: f("seoDescription"),
    logoUrl: f("logoUrl"),
    faviconUrl: f("faviconUrl"),
    socials: formData.has("social_facebook") ? socials : undefined,
    theme: {
      ...theme,
      primary: f("primary") ?? theme.primary,
      accent: f("accent") ?? theme.accent,
      dark: f("dark") ?? theme.dark,
      font: f("font") ?? theme.font,
      radius: f("radius") ?? theme.radius,
      headerStyle: f("headerStyle") ?? theme.headerStyle,
    } as Prisma.InputJsonValue,
  };
  if (staff) {
    const d = f("domain");
    if (d !== undefined) {
      const clean = d ? cleanDomain(d) : null;
      if (clean) {
        const other = await prisma.site.findUnique({ where: { domain: clean } });
        if (other && other.id !== siteId) redirect(`${base}/settings?erreur=domaine`);
      }
      data.domain = clean;
    }
    const slug = f("slug");
    if (slug) data.slug = slugify(slug);
    const status = f("status");
    if (status === "DRAFT" || status === "PUBLISHED" || status === "ARCHIVED") data.status = status;
  }
  // Supprimer les clés undefined
  Object.keys(data).forEach((k) => (data as Record<string, unknown>)[k] === undefined && delete (data as Record<string, unknown>)[k]);
  await prisma.site.update({ where: { id: siteId }, data });
  revalidatePath(base);
  redirect(`${base}/settings?ok=1`);
}

export async function setSiteStatusAction(formData: FormData) {
  const siteId = String(formData.get("siteId"));
  await requireStaff();
  const status = String(formData.get("status"));
  if (status !== "DRAFT" && status !== "PUBLISHED" && status !== "ARCHIVED") return;
  await prisma.site.update({ where: { id: siteId }, data: { status } });
  revalidatePath(`/studio/sites/${siteId}`);
}

export async function deleteSiteAction(formData: FormData) {
  await requireStaff();
  const siteId = String(formData.get("siteId"));
  if (String(formData.get("confirm")) !== "SUPPRIMER") redirect(`/studio/sites/${siteId}/settings?erreur=confirm`);
  await prisma.site.delete({ where: { id: siteId } });
  redirect("/studio");
}

export async function duplicateSiteAction(formData: FormData) {
  await requireStaff();
  const siteId = String(formData.get("siteId"));
  const src = await prisma.site.findUniqueOrThrow({ where: { id: siteId }, include: { pages: true, categories: { include: { products: true } }, posts: true } });
  const slug = `${src.slug}-copie-${Date.now().toString(36).slice(-4)}`;
  const site = await prisma.site.create({
    data: {
      name: `${src.name} (copie)`, slug, template: src.template, theme: src.theme as Prisma.InputJsonValue, tagline: src.tagline,
      logoUrl: src.logoUrl, faviconUrl: src.faviconUrl, contactEmail: src.contactEmail, phone: src.phone, whatsapp: src.whatsapp,
      address: src.address, mapEmbedUrl: src.mapEmbedUrl, socials: (src.socials ?? undefined) as Prisma.InputJsonValue | undefined,
      seoTitle: src.seoTitle, seoDescription: src.seoDescription, footerText: src.footerText,
      pages: { create: src.pages.map((p) => ({ slug: p.slug, title: p.title, navLabel: p.navLabel, inNav: p.inNav, order: p.order, published: p.published, blocks: p.blocks as Prisma.InputJsonValue, seoTitle: p.seoTitle, seoDescription: p.seoDescription })) },
      posts: { create: src.posts.map((p) => ({ kind: p.kind, title: p.title, slug: p.slug, excerpt: p.excerpt, body: p.body, imageUrl: p.imageUrl, link: p.link, location: p.location, date: p.date, endDate: p.endDate, published: p.published })) },
    },
  });
  for (const c of src.categories) {
    await prisma.category.create({
      data: {
        siteId: site.id, name: c.name, slug: c.slug, order: c.order,
        products: { create: c.products.map((p) => ({ siteId: site.id, name: p.name, slug: p.slug, summary: p.summary, description: p.description, imageUrl: p.imageUrl, images: (p.images ?? undefined) as Prisma.InputJsonValue | undefined, specs: (p.specs ?? undefined) as Prisma.InputJsonValue | undefined, pdfUrl: p.pdfUrl, price: p.price, featured: p.featured, published: p.published, order: p.order })) },
      },
    });
  }
  redirect(`/studio/sites/${site.id}`);
}
