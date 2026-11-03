import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { currentHost, loadSite, resolveSiteByHost } from "@/lib/site";
import { renderSite, siteMetadata } from "@/components/site/render";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ path?: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

async function getSite() {
  const host = await currentHost();
  const s = await resolveSiteByHost(host);
  if (!s) return null;
  return loadSite({ id: s.id });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = await getSite();
  if (!site) return { title: "Site introuvable" };
  const { path = [] } = await params;
  return siteMetadata(site, path);
}

export default async function SitePage({ params, searchParams }: Props) {
  const site = await getSite();
  if (!site) {
    const host = await currentHost();
    if (process.env.SINGLE_SITE_SLUG) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6 text-center">
          <div className="sf-card max-w-md">
            <h1 className="text-xl font-bold">Installation en cours</h1>
            <p className="mt-2 text-sm text-slate-600">L'application est bien installée. Dernière étape : <a className="text-indigo-600 underline" href="/setup">importer le site</a> (connexion avec le compte administrateur).</p>
          </div>
        </main>
      );
    }
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6 text-center">
        <div className="sf-card max-w-md">
          <h1 className="text-xl font-bold">Aucun site n'est configuré pour ce domaine</h1>
          <p className="mt-2 text-sm text-slate-600">Domaine reçu : <code>{host}</code>. Dans le Studio, ouvrez le site concerné → Paramètres → Domaine, et saisissez exactement ce domaine.</p>
        </div>
      </main>
    );
  }
  if (site.status !== "PUBLISHED" && !process.env.SINGLE_SITE_SLUG) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6 text-center">
        <div className="sf-card max-w-md">
          <h1 className="text-xl font-bold">{site.name}</h1>
          <p className="mt-2 text-sm text-slate-600">Ce site est en cours de préparation. Revenez bientôt.</p>
        </div>
      </main>
    );
  }
  const { path = [] } = await params;
  if (path[0] === "admin") notFound();
  return renderSite(site, path, "", await searchParams);
}
