import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { canAccessSite, getSession } from "@/lib/auth";
import { loadSite } from "@/lib/site";
import { renderSite, siteMetadata } from "@/components/site/render";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; path?: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, path = [] } = await params;
  const site = await loadSite({ slug });
  if (!site) return { title: "Aperçu" };
  return siteMetadata(site, path);
}

/** Aperçu d'un site depuis le Studio (réservé aux utilisateurs connectés). */
export default async function PreviewPage({ params, searchParams }: Props) {
  const { slug, path = [] } = await params;
  const site = await loadSite({ slug });
  if (!site) notFound();
  const session = await getSession();
  if (!canAccessSite(session, site.id)) redirect(`/login?next=/s/${slug}`);
  return renderSite(site, path, `/s/${slug}`, await searchParams, true);
}
