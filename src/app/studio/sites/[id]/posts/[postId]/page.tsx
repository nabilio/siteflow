import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireSite } from "@/lib/studio";
import { deletePostAction, savePostAction } from "@/lib/actions/content";
import { ImageField } from "@/components/studio/ImageField";

const d = (x?: Date | null) => (x ? new Date(x).toISOString().slice(0, 10) : "");

export default async function PostForm({ params }: { params: Promise<{ id: string; postId: string }> }) {
  const { id, postId } = await params;
  const { site, base } = await requireSite(id);
  const isNew = postId === "new";
  const p = isNew ? null : await prisma.post.findFirst({ where: { id: postId, siteId: site.id } });
  if (!isNew && !p) notFound();
  return (
    <main className="space-y-4">
      <a href={`${base}/posts`} className="text-sm text-slate-500 hover:underline">← Actualités & salons</a>
      <h1 className="text-2xl font-bold">{isNew ? "Nouvelle actualité / salon" : p!.title}</h1>
      <form action={savePostAction} className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <input type="hidden" name="siteId" value={site.id} /><input type="hidden" name="base" value={base} />{p && <input type="hidden" name="id" value={p.id} />}
        <div className="sf-card grid gap-4 sm:grid-cols-2">
          <div><label className="sf-label">Type</label><select name="kind" defaultValue={p?.kind ?? "NEWS"} className="sf-input"><option value="NEWS">Actualité</option><option value="EVENT">Salon / événement</option></select></div>
          <div><label className="sf-label">Lieu (pour un salon)</label><input name="location" defaultValue={p?.location ?? ""} placeholder="Ex : Casablanca, OFEC" className="sf-input" /></div>
          <div className="sm:col-span-2"><label className="sf-label">Titre *</label><input name="title" required defaultValue={p?.title} className="sf-input" /></div>
          <div><label className="sf-label">Date</label><input type="date" name="date" defaultValue={d(p?.date) || new Date().toISOString().slice(0, 10)} className="sf-input" /></div>
          <div><label className="sf-label">Date de fin (salon)</label><input type="date" name="endDate" defaultValue={d(p?.endDate)} className="sf-input" /></div>
          <div className="sm:col-span-2"><label className="sf-label">Résumé (affiché sur la carte)</label><textarea name="excerpt" rows={2} defaultValue={p?.excerpt ?? ""} className="sf-input" /></div>
          <div className="sm:col-span-2"><label className="sf-label">Texte complet</label><textarea name="body" rows={8} defaultValue={p?.body ?? ""} className="sf-input" /></div>
          <div className="sm:col-span-2"><label className="sf-label">Lien externe (optionnel : site du salon, article…)</label><input name="link" defaultValue={p?.link ?? ""} placeholder="https://…" className="sf-input" /><p className="mt-1 text-xs text-slate-500">Si renseigné, la carte renvoie vers ce lien au lieu de la page de l'article.</p></div>
        </div>
        <div className="space-y-4">
          <div className="sf-card"><ImageField siteId={site.id} name="imageUrl" value={p?.imageUrl ?? ""} label="Image" /></div>
          <div className="sf-card space-y-3 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" name="published" defaultChecked={p?.published ?? true} /> Visible sur le site</label>
            <div><label className="sf-label">Adresse (slug)</label><input name="slug" defaultValue={p?.slug ?? ""} placeholder="auto" className="sf-input" /></div>
            <button className="sf-btn-primary w-full">💾 Enregistrer</button>
          </div>
        </div>
      </form>
      {p && (
        <form action={deletePostAction} className="text-right">
          <input type="hidden" name="siteId" value={site.id} /><input type="hidden" name="base" value={base} /><input type="hidden" name="id" value={p.id} />
          <button className="sf-btn-danger">Supprimer</button>
        </form>
      )}
    </main>
  );
}
