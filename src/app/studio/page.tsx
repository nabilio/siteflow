import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/studio";
import { templateById } from "@/lib/templates";
import { formatDate } from "@/lib/utils";

const STATUS: Record<string, { label: string; cls: string }> = {
  DRAFT: { label: "Brouillon", cls: "bg-amber-100 text-amber-800" },
  PUBLISHED: { label: "En ligne", cls: "bg-green-100 text-green-800" },
  ARCHIVED: { label: "Archivé", cls: "bg-slate-200 text-slate-600" },
};

export default async function StudioHome() {
  await requireStaff();
  const sites = await prisma.site.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { pages: true, products: true, messages: { where: { read: false } } } } },
  });
  return (
    <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sites</h1>
          <p className="text-sm text-slate-500">{sites.length} site{sites.length > 1 ? "s" : ""} · cliquez sur un site pour le gérer</p>
        </div>
        <div className="flex items-center gap-2">
          <form action="/api/import" method="post" encType="multipart/form-data" className="flex items-center gap-2">
            <label className="sf-btn-secondary cursor-pointer">
              📦 Importer un site
              <input type="file" name="file" accept=".zip" className="hidden" required />
            </label>
            <button className="sf-btn-secondary">Lancer l'import</button>
          </form>
          <Link href="/studio/sites/new" className="sf-btn-primary">+ Nouveau site</Link>
        </div>
      </div>

      {sites.length === 0 ? (
        <div className="sf-card py-16 text-center">
          <div className="text-5xl">🌐</div>
          <h2 className="mt-4 text-lg font-semibold">Aucun site pour le moment</h2>
          <p className="mt-1 text-sm text-slate-500">Créez votre premier site en 2 minutes : choisissez un modèle, un nom, des couleurs.</p>
          <Link href="/studio/sites/new" className="sf-btn-primary mt-6">Créer un site</Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((s) => {
            const theme = (s.theme ?? {}) as { primary?: string; accent?: string };
            const st = STATUS[s.status];
            return (
              <Link key={s.id} href={`/studio/sites/${s.id}`} className="sf-card transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-black text-white" style={{ background: theme.primary || "#2563EB" }}>
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs text-slate-500">{s.domain || `aperçu : /s/${s.slug}`}</div>
                    </div>
                  </div>
                  <span className={`sf-badge ${st.cls}`}>{st.label}</span>
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                  <span>{templateById(s.template).name}</span>
                  <span>{s._count.pages} pages</span>
                  <span>{s._count.products} produits</span>
                  {s._count.messages > 0 && <span className="sf-badge bg-red-100 text-red-700">{s._count.messages} message{s._count.messages > 1 ? "s" : ""}</span>}
                </div>
                <div className="mt-2 text-xs text-slate-400">Modifié le {formatDate(s.updatedAt)}</div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
