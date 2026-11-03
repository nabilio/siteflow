"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { assertSiteAccess } from "@/lib/studio";
import { slugify } from "@/lib/utils";
import { deleteUpload } from "@/lib/storage";
import { hashPassword } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const opt = (fd: FormData, k: string) => s(fd, k) || null;

async function uniqueSlug(table: "product" | "post" | "category", siteId: string, base: string, excludeId?: string) {
  let slug = slugify(base) || "element";
  for (let i = 0; i < 50; i++) {
    const candidate = i ? `${slug}-${i + 1}` : slug;
    const found =
      table === "product"
        ? await prisma.product.findUnique({ where: { siteId_slug: { siteId, slug: candidate } } })
        : table === "post"
          ? await prisma.post.findUnique({ where: { siteId_slug: { siteId, slug: candidate } } })
          : await prisma.category.findUnique({ where: { siteId_slug: { siteId, slug: candidate } } });
    if (!found || found.id === excludeId) return candidate;
  }
  return `${slug}-${Date.now().toString(36)}`;
}

// ---------- Catégories ----------
export async function saveCategoryAction(fd: FormData) {
  const siteId = s(fd, "siteId");
  await assertSiteAccess(siteId);
  const id = s(fd, "id");
  const name = s(fd, "name");
  if (!name) return;
  const slug = await uniqueSlug("category", siteId, name, id || undefined);
  if (id) await prisma.category.update({ where: { id }, data: { name, slug } });
  else {
    const count = await prisma.category.count({ where: { siteId } });
    await prisma.category.create({ data: { siteId, name, slug, order: count } });
  }
  revalidatePath(s(fd, "base"));
}
export async function deleteCategoryAction(fd: FormData) {
  const siteId = s(fd, "siteId");
  await assertSiteAccess(siteId);
  await prisma.category.delete({ where: { id: s(fd, "id") } });
  revalidatePath(s(fd, "base"));
}

// ---------- Produits ----------
export async function saveProductAction(fd: FormData) {
  const siteId = s(fd, "siteId");
  await assertSiteAccess(siteId);
  const base = s(fd, "base");
  const id = s(fd, "id");
  const name = s(fd, "name");
  if (!name) return;
  const slug = await uniqueSlug("product", siteId, s(fd, "slug") || name, id || undefined);
  const images = fd.getAll("images").map(String).filter(Boolean);
  const specs: { label: string; value: string }[] = [];
  fd.getAll("spec_label").forEach((l, i) => {
    const label = String(l).trim();
    const value = String(fd.getAll("spec_value")[i] ?? "").trim();
    if (label) specs.push({ label, value });
  });
  const data = {
    name, slug,
    categoryId: opt(fd, "categoryId"),
    summary: opt(fd, "summary"),
    description: opt(fd, "description"),
    imageUrl: opt(fd, "imageUrl"),
    images: images as unknown as Prisma.InputJsonValue,
    specs: specs as unknown as Prisma.InputJsonValue,
    pdfUrl: opt(fd, "pdfUrl"),
    price: opt(fd, "price"),
    featured: fd.get("featured") === "on",
    published: fd.get("published") === "on",
    order: Number(s(fd, "order") || 0),
  };
  if (id) await prisma.product.update({ where: { id }, data });
  else await prisma.product.create({ data: { ...data, siteId } });
  revalidatePath(base);
  redirect(`${base}/products?ok=1`);
}
export async function deleteProductAction(fd: FormData) {
  const siteId = s(fd, "siteId");
  await assertSiteAccess(siteId);
  await prisma.product.delete({ where: { id: s(fd, "id") } });
  const base = s(fd, "base");
  revalidatePath(base);
  redirect(`${base}/products`);
}

// ---------- Actualités / événements ----------
export async function savePostAction(fd: FormData) {
  const siteId = s(fd, "siteId");
  await assertSiteAccess(siteId);
  const base = s(fd, "base");
  const id = s(fd, "id");
  const title = s(fd, "title");
  if (!title) return;
  const slug = await uniqueSlug("post", siteId, s(fd, "slug") || title, id || undefined);
  const kind = s(fd, "kind") === "EVENT" ? "EVENT" : "NEWS";
  const date = s(fd, "date") ? new Date(s(fd, "date")) : new Date();
  const endDate = s(fd, "endDate") ? new Date(s(fd, "endDate")) : null;
  const data = {
    title, slug, kind: kind as "NEWS" | "EVENT", date, endDate,
    excerpt: opt(fd, "excerpt"), body: opt(fd, "body"), imageUrl: opt(fd, "imageUrl"), link: opt(fd, "link"), location: opt(fd, "location"),
    published: fd.get("published") === "on",
  };
  if (id) await prisma.post.update({ where: { id }, data });
  else await prisma.post.create({ data: { ...data, siteId } });
  revalidatePath(base);
  redirect(`${base}/posts?ok=1`);
}
export async function deletePostAction(fd: FormData) {
  const siteId = s(fd, "siteId");
  await assertSiteAccess(siteId);
  await prisma.post.delete({ where: { id: s(fd, "id") } });
  const base = s(fd, "base");
  revalidatePath(base);
  redirect(`${base}/posts`);
}

// ---------- Médias ----------
export async function deleteMediaAction(fd: FormData) {
  const siteId = s(fd, "siteId");
  await assertSiteAccess(siteId);
  const m = await prisma.media.findUnique({ where: { id: s(fd, "id") } });
  if (m && m.siteId === siteId) {
    await deleteUpload(m.url);
    await prisma.media.delete({ where: { id: m.id } });
  }
  revalidatePath(s(fd, "base"));
}

// ---------- Messages ----------
export async function toggleMessageAction(fd: FormData) {
  const siteId = s(fd, "siteId");
  await assertSiteAccess(siteId);
  const m = await prisma.message.findUnique({ where: { id: s(fd, "id") } });
  if (m && m.siteId === siteId) await prisma.message.update({ where: { id: m.id }, data: { read: !m.read } });
  revalidatePath(s(fd, "base"));
}
export async function deleteMessageAction(fd: FormData) {
  const siteId = s(fd, "siteId");
  await assertSiteAccess(siteId);
  await prisma.message.deleteMany({ where: { id: s(fd, "id"), siteId } });
  revalidatePath(s(fd, "base"));
}

// ---------- Utilisateurs ----------
export async function saveUserAction(fd: FormData) {
  const { getSession, isStaff } = await import("@/lib/auth");
  const me = await getSession();
  if (!me) throw new Error("Non autorisé");
  const siteId = opt(fd, "siteId");
  const roleRaw = s(fd, "role");
  const role = roleRaw === "SUPERADMIN" || roleRaw === "ADMIN" || roleRaw === "CLIENT" ? roleRaw : "CLIENT";
  // Un client ne peut créer que des comptes CLIENT sur son propre site ; un ADMIN ne crée pas de SUPERADMIN
  if (!isStaff(me) && (role !== "CLIENT" || siteId !== me.siteId)) throw new Error("Non autorisé");
  if (me.role === "ADMIN" && role === "SUPERADMIN") throw new Error("Non autorisé");
  const id = s(fd, "id");
  const email = s(fd, "email").toLowerCase();
  const name = s(fd, "name") || email;
  const password = s(fd, "password");
  if (id) {
    const data: Prisma.UserUpdateInput = { name, role, site: siteId ? { connect: { id: siteId } } : { disconnect: true } };
    if (password) data.passwordHash = await hashPassword(password);
    if (email) data.email = email;
    await prisma.user.update({ where: { id }, data });
  } else {
    if (!email || !password) return;
    await prisma.user.create({ data: { email, name, role, siteId, passwordHash: await hashPassword(password) } });
  }
  revalidatePath(s(fd, "base") || "/studio/users");
}
export async function deleteUserAction(fd: FormData) {
  const { getSession, isStaff } = await import("@/lib/auth");
  const me = await getSession();
  if (!me) throw new Error("Non autorisé");
  const user = await prisma.user.findUnique({ where: { id: s(fd, "id") } });
  if (!user || user.id === me.userId) return;
  if (!isStaff(me) && !(user.role === "CLIENT" && user.siteId === me.siteId)) throw new Error("Non autorisé");
  if (user.role === "SUPERADMIN" && me.role !== "SUPERADMIN") throw new Error("Non autorisé");
  await prisma.user.delete({ where: { id: user.id } });
  revalidatePath(s(fd, "base") || "/studio/users");
}
