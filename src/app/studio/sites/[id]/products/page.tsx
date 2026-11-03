import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireSite } from "@/lib/studio";
import { deleteCategoryAction, saveCategoryAction } from "@/lib/actions/content";

export default async function ProductsPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const { site, base } = await requireSite(id);
  const products = await prisma.product.findMany({ where: { siteId: site.id }, orderBy: [{ order: "asc" }, { createdAt: "desc" }], include: { category: true } });
  const categories = await prisma.category.findMany({ where: { siteId: site.id }, orderBy: { order: "asc" }, include: { _count: { select: { products: true } } } });
  return (
    <main className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Produits & services</h1><p className="text-sm text-slate-500">{products.length} référence{products.length > 1 ? "s" : ""}</p></div>
        <Link href={`${base}/products/new`} className="sf-btn-primary">+ Nouveau produit</Link>
      </div>
      {sp.ok && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">✅ Enregistré.</div>}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="sf-card !p-0 overflow-hidden">
          {products.length === 0 ? <p className="p-6 text-sm text-slate-500">Aucun produit. Ajoutez-en un, il apparaîtra automatiquement dans les blocs « Produits » de vos pages.</p> : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500"><tr><th className="p-3">Produit</th><th className="p-3">Catégorie</th><th className="p-3">État</th><th className="p-3"></th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-12 overflow-hidden rounded bg-slate-100">{p.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />)}</div>
                        <div><div className="font-medium">{p.name}</div>{p.price && <div className="text-xs text-slate-500">{p.price}</div>}</div>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600">{p.category?.name ?? "—"}</td>
                    <td className="p-3"><span className={`sf-badge ${p.published ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"}`}>{p.published ? "Publié" : "Masqué"}</span>{p.featured && <span className="sf-badge ml-1 bg-amber-100 text-amber-800">★ accueil</span>}</td>
                    <td className="p-3 text-right"><Link href={`${base}/products/${p.id}`} className="sf-btn-secondary !px-3 !py-1.5">Modifier</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="sf-card h-fit">
          <h2 className="font-semibold">Catégories</h2>
          <ul className="mt-3 space-y-2">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center gap-2">
                <form action={saveCategoryAction} className="flex flex-1 gap-1">
                  <input type="hidden" name="siteId" value={site.id} /><input type="hidden" name="base" value={`${base}/products`} /><input type="hidden" name="id" value={c.id} />
                  <input name="name" defaultValue={c.name} className="sf-input !py-1" /><button className="sf-btn-secondary !px-2 !py-1" title="Renommer">💾</button>
                </form>
                <span className="text-xs text-slate-400">{c._count.products}</span>
                <form action={deleteCategoryAction}><input type="hidden" name="siteId" value={site.id} /><input type="hidden" name="base" value={`${base}/products`} /><input type="hidden" name="id" value={c.id} /><button className="text-red-500 hover:text-red-700" title="Supprimer">✕</button></form>
              </li>
            ))}
          </ul>
          <form action={saveCategoryAction} className="mt-3 flex gap-1">
            <input type="hidden" name="siteId" value={site.id} /><input type="hidden" name="base" value={`${base}/products`} />
            <input name="name" placeholder="Nouvelle catégorie" className="sf-input !py-1" required /><button className="sf-btn-primary !px-3 !py-1">+</button>
          </form>
        </div>
      </div>
    </main>
  );
}
