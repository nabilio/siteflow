import { headers } from "next/headers";
import { prisma } from "./db";
import type { Theme } from "./templates";
import type { Block } from "./blocks";

export function studioHosts(): string[] {
  return (process.env.STUDIO_HOSTS || "localhost:3000,localhost")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
}

export function isStudioHost(host: string) {
  const h = host.toLowerCase();
  const bare = h.replace(/:\d+$/, "");
  return studioHosts().some((s) => s === h || s === bare || s.replace(/:\d+$/, "") === bare);
}

export async function currentHost() {
  const h = await headers();
  return (h.get("x-forwarded-host") || h.get("host") || "").toLowerCase();
}

/** Site servi pour l'hôte courant (domaine client, mode site unique, ou aperçu /s/slug). */
export async function resolveSiteByHost(host: string) {
  const single = process.env.SINGLE_SITE_SLUG;
  if (single) return prisma.site.findUnique({ where: { slug: single } });
  const bare = host.replace(/:\d+$/, "").replace(/^www\./, "");
  return prisma.site.findFirst({ where: { OR: [{ domain: bare }, { domain: `www.${bare}` }] } });
}

export type SiteFull = NonNullable<Awaited<ReturnType<typeof loadSite>>>;

export async function loadSite(where: { id?: string; slug?: string }) {
  const site = await prisma.site.findFirst({
    where,
    include: {
      pages: { orderBy: { order: "asc" } },
      categories: { orderBy: { order: "asc" } },
    },
  });
  return site;
}

export function themeOf(site: { theme: unknown }): Theme {
  const t = (site.theme ?? {}) as Partial<Theme>;
  return {
    primary: t.primary ?? "#2563EB",
    accent: t.accent ?? "#F59E0B",
    dark: t.dark ?? "#0F172A",
    font: t.font ?? "sans",
    radius: t.radius ?? "md",
    headerStyle: t.headerStyle ?? "light",
  };
}

export function blocksOf(page: { blocks: unknown }): Block[] {
  return Array.isArray(page.blocks) ? (page.blocks as Block[]) : [];
}

/** Base d'URL de l'admin pour le contexte courant (Studio ou domaine client). */
export async function adminBase(siteId: string) {
  const h = await headers();
  const base = h.get("x-sf-admin-base");
  return base || `/studio/sites/${siteId}`;
}
