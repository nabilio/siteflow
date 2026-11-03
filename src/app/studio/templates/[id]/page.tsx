import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/studio";
import { TEMPLATES, templateById } from "@/lib/templates";
import { Previewer } from "./Previewer";

export default async function TemplatePreview({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const { id } = await params;
  const tpl = TEMPLATES.find((t) => t.id === id);
  if (!tpl || tpl.id === "vierge") notFound();
  const t = templateById(id);
  return (
    <main className="mx-auto flex max-w-[1600px] flex-col px-3 py-4 sm:px-6" style={{ minHeight: "calc(100vh - 56px)" }}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/studio/templates" className="text-xs text-slate-500 hover:underline">← Tous les modèles</Link>
          <h1 className="text-xl font-bold">{t.name} <span className="text-sm font-normal text-slate-500">· {t.sector}</span></h1>
        </div>
        <Link href={`/studio/sites/new?template=${t.id}`} className="sf-btn-primary">✨ Utiliser ce modèle</Link>
      </div>
      <Previewer slug={`tpl-${t.id}`} pages={t.pages.map((p) => ({ slug: p.slug, title: p.navLabel || p.title }))} />
    </main>
  );
}
