import Link from "next/link";
import { requireStaff } from "@/lib/studio";
import { TEMPLATES } from "@/lib/templates";

export default async function TemplatesGallery() {
  await requireStaff();
  const list = TEMPLATES.filter((t) => t.id !== "vierge");
  return (
    <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Modèles de sites</h1>
          <p className="text-sm text-slate-500">Des sites complets prêts à l'emploi. Visualisez-les en grandeur nature, puis utilisez-en un : contenu, couleurs et pages restent entièrement modifiables.</p>
        </div>
        <Link href="/studio/sites/new?template=vierge" className="sf-btn-secondary">Partir d'un site vierge</Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((t) => (
          <div key={t.id} className="sf-card flex flex-col overflow-hidden !p-0">
            <Link href={`/studio/templates/${t.id}`} className="block bg-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.preview} alt={t.name} className="aspect-[16/10] w-full object-cover transition hover:scale-[1.02]" />
            </Link>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold">{t.name}</h2>
                <div className="flex gap-1"><span className="h-4 w-4 rounded" style={{ background: t.theme.primary }} /><span className="h-4 w-4 rounded" style={{ background: t.theme.accent }} /></div>
              </div>
              <div className="text-xs font-medium text-indigo-600">{t.sector}</div>
              <p className="mt-2 text-sm text-slate-600">{t.description}</p>
              <ul className="mt-3 space-y-1 text-xs text-slate-500">
                {t.highlights.map((h) => <li key={h}>✓ {h}</li>)}
              </ul>
              <div className="mt-auto flex gap-2 pt-4">
                <Link href={`/studio/templates/${t.id}`} className="sf-btn-secondary flex-1 justify-center">👁 Visualiser</Link>
                <Link href={`/studio/sites/new?template=${t.id}`} className="sf-btn-primary flex-1 justify-center">Utiliser</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
