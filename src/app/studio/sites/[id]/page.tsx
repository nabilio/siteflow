import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireSite } from "@/lib/studio";
import { setSiteStatusAction } from "@/lib/actions/sites";
import { formatDate } from "@/lib/utils";

export default async function SiteDashboard({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ alerte?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const { site, base, staff } = await requireSite(id);
  const [pages, products, posts, media, messages, lastMessages] = await Promise.all([
    prisma.page.count({ where: { siteId: site.id } }),
    prisma.product.count({ where: { siteId: site.id } }),
    prisma.post.count({ where: { siteId: site.id } }),
    prisma.media.count({ where: { siteId: site.id } }),
    prisma.message.count({ where: { siteId: site.id, read: false } }),
    prisma.message.findMany({ where: { siteId: site.id }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const checklist = [
    { ok: !!site.logoUrl, label: "Ajouter le logo", href: `${base}/settings` },
    { ok: !!(site.phone && site.contactEmail), label: "Renseigner téléphone et email", href: `${base}/settings` },
    { ok: products > 0, label: "Ajouter au moins un produit / service", href: `${base}/products` },
    { ok: media > 0, label: "Importer des photos", href: `${base}/media` },
    { ok: !!site.domain, label: "Définir le domaine", href: `${base}/settings#domaine`, staffOnly: true },
    { ok: site.status === "PUBLISHED", label: "Publier le site", href: `${base}/deploy`, staffOnly: true },
  ].filter((c) => !c.staffOnly || staff);
  const done = checklist.filter((c) => c.ok).length;

  return (
    <main className="space-y-6">
      {sp.alerte === "domaine" && <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">⚠️ Le domaine saisi est déjà utilisé par un autre site : il n'a pas été enregistré. Corrigez-le dans Paramètres.</div>}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{site.name}</h1>
          <p className="text-sm text-slate-500">Créé le {formatDate(site.createdAt)} · dernière modification {formatDate(site.updatedAt)}</p>
        </div>
        {staff && (
          <form action={setSiteStatusAction} className="flex items-center gap-2">
            <input type="hidden" name="siteId" value={site.id} />
            {site.status === "PUBLISHED" ? (
              <button name="status" value="DRAFT" className="sf-btn-secondary">Mettre hors ligne</button>
            ) : (
              <button name="status" value="PUBLISHED" className="sf-btn-primary">✅ Publier le site</button>
            )}
          </form>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Pages", v: pages, href: `${base}/pages` },
          { label: "Produits", v: products, href: `${base}/products` },
          { label: "Actualités", v: posts, href: `${base}/posts` },
          { label: "Messages non lus", v: messages, href: `${base}/messages` },
        ].map((k) => (
          <Link key={k.label} href={k.href} className="sf-card hover:border-indigo-300">
            <div className="text-3xl font-bold">{k.v}</div>
            <div className="text-sm text-slate-500">{k.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="sf-card">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Mise en route</h2>
            <span className="text-sm text-slate-500">{done}/{checklist.length}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-indigo-600" style={{ width: `${(done / checklist.length) * 100}%` }} /></div>
          <ul className="mt-4 space-y-2">
            {checklist.map((c) => (
              <li key={c.label}>
                <Link href={c.href} className={`flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50 ${c.ok ? "text-slate-400 line-through" : ""}`}>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${c.ok ? "bg-green-500 text-white" : "border border-slate-300"}`}>{c.ok ? "✓" : ""}</span>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="sf-card">
          <h2 className="font-semibold">Derniers messages</h2>
          {lastMessages.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">Aucun message reçu pour le moment.</p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {lastMessages.map((m) => (
                <li key={m.id} className="py-2 text-sm">
                  <div className="flex justify-between"><span className={m.read ? "" : "font-semibold"}>{m.name}</span><span className="text-xs text-slate-400">{formatDate(m.createdAt)}</span></div>
                  <p className="line-clamp-1 text-slate-600">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
          <Link href={`${base}/messages`} className="mt-3 inline-block text-sm font-medium text-indigo-600">Voir tous les messages →</Link>
        </div>
      </div>

      <div className="sf-card">
        <h2 className="font-semibold">Accès rapides</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={`${base}/pages`} className="sf-btn-secondary">✏️ Modifier l'accueil</Link>
          <Link href={`${base}/products/new`} className="sf-btn-secondary">+ Produit</Link>
          <Link href={`${base}/posts/new`} className="sf-btn-secondary">+ Actualité / salon</Link>
          <Link href={`${base}/media`} className="sf-btn-secondary">+ Photos</Link>
          <a href={`/s/${site.slug}`} target="_blank" className="sf-btn-secondary">👁️ Aperçu</a>
        </div>
      </div>
    </main>
  );
}
