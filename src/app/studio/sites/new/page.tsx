import { requireStaff } from "@/lib/studio";
import { TEMPLATES } from "@/lib/templates";
import { createSiteAction } from "@/lib/actions/sites";
import { NewSiteForm } from "./NewSiteForm";

export default async function NewSitePage({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
  const { template } = await searchParams;
  await requireStaff();
  const templates = TEMPLATES.map((t) => ({ id: t.id, name: t.name, sector: t.sector, description: t.description, theme: t.theme, pages: t.pages.map((p) => p.title), highlights: t.highlights, preview: t.preview, hasSamples: !!(t.products?.length || t.posts?.length) }));
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Nouveau site</h1>
      <p className="mt-1 text-sm text-slate-500">Trois étapes : le modèle, l'identité, les accès. Tout est modifiable ensuite.</p>
      <NewSiteForm initial={template} templates={templates} action={createSiteAction} />
    </main>
  );
}
