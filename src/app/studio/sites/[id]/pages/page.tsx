import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireSite } from "@/lib/studio";
import { createPageAction, deletePageAction, movePageAction } from "@/lib/actions/pages";
import { blocksOf } from "@/lib/site";
import { blockDef } from "@/lib/blocks";

export default async function PagesList({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { site, base } = await requireSite(id);
  const pages = await prisma.page.findMany({ where: { siteId: site.id }, orderBy: { order: "asc" } });
  return (
    <main className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pages</h1>
          <p className="text-sm text-slate-500">Chaque page est composée de blocs. L'ordre ici = l'ordre du menu.</p>
        </div>
      </div>
      <div className="sf-card !p-0 overflow-hidden">
        <ul className="divide-y divide-slate-100">
          {pages.map((p, i) => {
            const blocks = blocksOf(p);
            return (
              <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="flex flex-col">
                  <form action={movePageAction}><input type="hidden" name="pageId" value={p.id} /><button name="dir" value="up" disabled={i === 0} className="text-slate-400 hover:text-slate-700 disabled:opacity-30">▲</button></form>
                  <form action={movePageAction}><input type="hidden" name="pageId" value={p.id} /><button name="dir" value="down" disabled={i === pages.length - 1} className="text-slate-400 hover:text-slate-700 disabled:opacity-30">▼</button></form>
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`${base}/pages/${p.id}`} className="font-semibold hover:underline">{p.title}</Link>
                  <span className="ml-2 text-xs text-slate-400">/{p.slug}</span>
                  {!p.published && <span className="sf-badge ml-2 bg-amber-100 text-amber-800">non publiée</span>}
                  {!p.inNav && <span className="sf-badge ml-2 bg-slate-100 text-slate-600">hors menu</span>}
                  <div className="mt-1 flex flex-wrap gap-1">
                    {blocks.map((b) => <span key={b.id} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">{blockDef(b.type)?.label ?? b.type}</span>)}
                    {!blocks.length && <span className="text-xs text-slate-400">page vide</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={`/s/${site.slug}/${p.slug}`} target="_blank" className="sf-btn-secondary !px-3 !py-1.5">Aperçu</a>
                  <Link href={`${base}/pages/${p.id}`} className="sf-btn-primary !px-3 !py-1.5">Modifier</Link>
                  {p.slug !== "" && (
                    <form action={deletePageAction}>
                      <input type="hidden" name="pageId" value={p.id} /><input type="hidden" name="base" value={base} />
                      <button className="sf-btn-danger !px-3 !py-1.5">Supprimer</button>
                    </form>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <form action={createPageAction} className="sf-card flex flex-wrap items-end gap-3">
        <input type="hidden" name="siteId" value={site.id} /><input type="hidden" name="base" value={base} />
        <div className="flex-1"><label className="sf-label">Nouvelle page</label><input className="sf-input" name="title" placeholder="Ex : Nos services" required /></div>
        <div className="w-48"><label className="sf-label">Adresse (optionnel)</label><input className="sf-input" name="slug" placeholder="nos-services" /></div>
        <button className="sf-btn-primary">+ Créer la page</button>
      </form>
    </main>
  );
}
