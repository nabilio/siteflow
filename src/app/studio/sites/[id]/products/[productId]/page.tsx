import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireSite } from "@/lib/studio";
import { deleteProductAction, saveProductAction } from "@/lib/actions/content";
import { ImageField } from "@/components/studio/ImageField";
import { list } from "@/lib/utils";
import { MultiImages, SpecsEditor } from "./editors";

export default async function ProductForm({ params }: { params: Promise<{ id: string; productId: string }> }) {
  const { id, productId } = await params;
  const { site, base } = await requireSite(id);
  const isNew = productId === "new";
  const p = isNew ? null : await prisma.product.findFirst({ where: { id: productId, siteId: site.id } });
  if (!isNew && !p) notFound();
  return (
    <main className="space-y-4">
      <a href={`${base}/products`} className="text-sm text-slate-500 hover:underline">← Produits</a>
      <h1 className="text-2xl font-bold">{isNew ? "Nouveau produit" : p!.name}</h1>
      <form action={saveProductAction} className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <input type="hidden" name="siteId" value={site.id} /><input type="hidden" name="base" value={base} />{p && <input type="hidden" name="id" value={p.id} />}
        <div className="space-y-4">
          <div className="sf-card grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className="sf-label">Nom *</label><input name="name" required defaultValue={p?.name} className="sf-input" /></div>
            <div><label className="sf-label">Catégorie</label>
              <select name="categoryId" defaultValue={p?.categoryId ?? ""} className="sf-input"><option value="">— Aucune —</option>{site.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label className="sf-label">Prix (texte libre, optionnel)</label><input name="price" defaultValue={p?.price ?? ""} placeholder="Ex : 120 MAD / Sur devis" className="sf-input" /></div>
            <div className="sm:col-span-2"><label className="sf-label">Résumé (1-2 phrases, affiché sur les cartes)</label><input name="summary" defaultValue={p?.summary ?? ""} className="sf-input" /></div>
            <div className="sm:col-span-2"><label className="sf-label">Description complète</label>
              <textarea name="description" rows={8} defaultValue={p?.description ?? ""} className="sf-input" />
              <p className="mt-1 text-xs text-slate-500">Mise en forme : <code>## Titre</code>, <code>- liste</code>, <code>**gras**</code>.</p></div>
          </div>
          <div className="sf-card"><h2 className="mb-3 font-semibold">Caractéristiques techniques</h2><SpecsEditor initial={list<{ label: string; value: string }>(p?.specs)} /></div>
        </div>
        <div className="space-y-4">
          <div className="sf-card space-y-4">
            <ImageField siteId={site.id} name="imageUrl" value={p?.imageUrl ?? ""} label="Image principale" />
            <MultiImages siteId={site.id} initial={list<string>(p?.images)} />
            <ImageField siteId={site.id} name="pdfUrl" value={p?.pdfUrl ?? ""} label="Fiche technique (PDF)" accept="pdf" />
          </div>
          <div className="sf-card space-y-3 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" name="published" defaultChecked={p?.published ?? true} /> Visible sur le site</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={p?.featured ?? false} /> Mis en avant (accueil)</label>
            <div><label className="sf-label">Ordre d'affichage</label><input type="number" name="order" defaultValue={p?.order ?? 0} className="sf-input" /></div>
            <div><label className="sf-label">Adresse (slug)</label><input name="slug" defaultValue={p?.slug ?? ""} placeholder="auto" className="sf-input" /></div>
            <button className="sf-btn-primary w-full">💾 Enregistrer</button>
          </div>
        </div>
      </form>
      {p && (
        <form action={deleteProductAction} className="text-right">
          <input type="hidden" name="siteId" value={site.id} /><input type="hidden" name="base" value={base} /><input type="hidden" name="id" value={p.id} />
          <button className="sf-btn-danger">Supprimer ce produit</button>
        </form>
      )}
    </main>
  );
}
