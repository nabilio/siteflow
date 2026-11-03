"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { assertSiteAccess } from "@/lib/studio";
import { slugify } from "@/lib/utils";
import { makeBlock, type Block, blockDef } from "@/lib/blocks";
import type { Prisma } from "@prisma/client";

export async function createPageAction(formData: FormData) {
  const siteId = String(formData.get("siteId"));
  await assertSiteAccess(siteId);
  const base = String(formData.get("base"));
  const title = String(formData.get("title") || "").trim();
  if (!title) return;
  let slug = slugify(String(formData.get("slug") || title));
  if (["produits", "actualites", "admin", "api", "uploads"].includes(slug)) slug = `page-${slug}`;
  const count = await prisma.page.count({ where: { siteId } });
  const exists = await prisma.page.findUnique({ where: { siteId_slug: { siteId, slug } } });
  if (exists) slug = `${slug}-${count + 1}`;
  const page = await prisma.page.create({
    data: { siteId, title, slug, order: count, blocks: [makeBlock("richText", { title })] as unknown as Prisma.InputJsonValue },
  });
  redirect(`${base}/pages/${page.id}`);
}

export async function savePageAction(input: { pageId: string; blocks: Block[]; title?: string; navLabel?: string | null; inNav?: boolean; published?: boolean; seoTitle?: string | null; seoDescription?: string | null; slug?: string }) {
  const page = await prisma.page.findUniqueOrThrow({ where: { id: input.pageId } });
  await assertSiteAccess(page.siteId);
  // Nettoyage : on ne garde que les types de blocs connus
  const blocks = input.blocks.filter((b) => b && blockDef(b.type)).map((b) => ({ id: b.id, type: b.type, props: b.props ?? {} }));
  const data: Prisma.PageUpdateInput = { blocks: blocks as unknown as Prisma.InputJsonValue };
  if (input.title !== undefined) data.title = input.title.trim() || page.title;
  if (input.navLabel !== undefined) data.navLabel = input.navLabel?.trim() || null;
  if (input.inNav !== undefined) data.inNav = input.inNav;
  if (input.published !== undefined) data.published = input.published;
  if (input.seoTitle !== undefined) data.seoTitle = input.seoTitle?.trim() || null;
  if (input.seoDescription !== undefined) data.seoDescription = input.seoDescription?.trim() || null;
  if (input.slug !== undefined && page.slug !== "") {
    const s = slugify(input.slug);
    if (s && s !== page.slug) {
      const exists = await prisma.page.findUnique({ where: { siteId_slug: { siteId: page.siteId, slug: s } } });
      if (!exists) data.slug = s;
    }
  }
  await prisma.page.update({ where: { id: page.id }, data });
  revalidatePath(`/studio/sites/${page.siteId}`);
  return { ok: true };
}

export async function deletePageAction(formData: FormData) {
  const pageId = String(formData.get("pageId"));
  const base = String(formData.get("base"));
  const page = await prisma.page.findUniqueOrThrow({ where: { id: pageId } });
  await assertSiteAccess(page.siteId);
  if (page.slug === "") return; // l'accueil ne se supprime pas
  await prisma.page.delete({ where: { id: pageId } });
  redirect(`${base}/pages`);
}

export async function movePageAction(formData: FormData) {
  const pageId = String(formData.get("pageId"));
  const dir = String(formData.get("dir")) === "up" ? -1 : 1;
  const page = await prisma.page.findUniqueOrThrow({ where: { id: pageId } });
  await assertSiteAccess(page.siteId);
  const pages = await prisma.page.findMany({ where: { siteId: page.siteId }, orderBy: { order: "asc" } });
  const i = pages.findIndex((p) => p.id === pageId);
  const j = i + dir;
  if (j < 0 || j >= pages.length) return;
  [pages[i], pages[j]] = [pages[j], pages[i]];
  await prisma.$transaction(pages.map((p, k) => prisma.page.update({ where: { id: p.id }, data: { order: k } })));
  revalidatePath(`/studio/sites/${page.siteId}/pages`);
}
