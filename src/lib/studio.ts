import { redirect } from "next/navigation";
import { prisma } from "./db";
import { canAccessSite, getSession, isStaff, type Session } from "./auth";
import { adminBase, currentHost, resolveSiteByHost } from "./site";

/** Résout le site courant d'une route /studio/sites/[id] (ou "_host" sur un domaine client), vérifie l'accès. */
export async function requireSite(idParam: string) {
  const session = await getSession();
  const host = await currentHost();
  let siteId = idParam;
  if (idParam === "_host") {
    const s = await resolveSiteByHost(host);
    if (!s) redirect(process.env.SINGLE_SITE_SLUG ? "/setup" : "/login");
    siteId = s.id;
  }
  if (!session) redirect(`/login?next=${encodeURIComponent(idParam === "_host" ? "/admin" : `/studio/sites/${idParam}`)}`);
  if (!canAccessSite(session, siteId)) redirect("/studio");
  const site = await prisma.site.findUnique({ where: { id: siteId }, include: { categories: { orderBy: { order: "asc" } } } });
  if (!site) redirect("/studio");
  const base = await adminBase(siteId);
  return { site, session, base, staff: isStaff(session) };
}

export async function requireStaff(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login?next=/studio");
  if (!isStaff(session)) redirect(session.siteId ? `/studio/sites/${session.siteId}` : "/login");
  return session;
}

/** Pour les server actions : vérifie l'accès au site et renvoie la session. */
export async function assertSiteAccess(siteId: string) {
  const session = await getSession();
  if (!canAccessSite(session, siteId)) throw new Error("Non autorisé");
  return session!;
}
