import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { blocksOf, loadSite, type SiteFull } from "@/lib/site";
import { formatDate, list } from "@/lib/utils";
import { mdToHtml } from "@/lib/markdown";
import { SiteShell } from "./SiteShell";
import { ProductCard, RenderBlock } from "./Blocks";

type Search = Record<string, string | string[] | undefined>;

export async function siteMetadata(site: SiteFull, parts: string[]): Promise<Metadata> {
  const slug = parts[0] ?? "";
  const page = site.pages.find((p) => p.slug === slug);
  const title = page?.seoTitle || (page ? `${page.title} · ${site.name}` : site.seoTitle || site.name);
  return {
    title: site.seoTitle && !page?.slug ? site.seoTitle : title,
    description: page?.seoDescription || site.seoDescription || site.tagline || undefined,
    icons: site.faviconUrl ? { icon: site.faviconUrl } : undefined,
  };
}

/** Rend une page publique du site. `base` = "" en prod, "/s/<slug>" en aperçu Studio. */
export async function renderSite(site: SiteFull, parts: string[], base: string, search: Search, preview = false) {
  const path = `${base}/${parts.join("/")}`.replace(/\/$/, "") || "/";
  const ctx = { site, base, path };
  const banner = preview ? <PreviewBanner site={site} /> : null;

  // Fiche produit
  if (parts[0] === "produits" && parts[1]) {
    const product = await prisma.product.findFirst({ where: { siteId: site.id, slug: parts[1], published: true }, include: { category: true } });
    if (!product) notFound();
    const images = [product.imageUrl, ...list<string>(product.images)].filter(Boolean) as string[];
    const specs = list<{ label: string; value: string }>(product.specs);
    const related = await prisma.product.findMany({ where: { siteId: site.id, published: true, id: { not: product.id }, ...(product.categoryId ? { categoryId: product.categoryId } : {}) }, take: 3, orderBy: { order: "asc" } });
    return (
      <SiteShell site={site} base={base}>
        {banner}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <nav className="mb-6 text-sm text-slate-500">
            <Link href={base || "/"} className="hover:underline">Accueil</Link> › <Link href={`${base}/produits`} className="hover:underline">Produits</Link>
            {product.category && <> › <Link href={`${base}/produits?categorie=${product.category.slug}`} className="hover:underline">{product.category.name}</Link></>}
          </nav>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <div className="r aspect-[4/3] overflow-hidden bg-slate-100">
                {images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={images[0]} alt={product.name} className="h-full w-full object-cover" />
                ) : <div className="flex h-full items-center justify-center text-7xl text-slate-300">📦</div>}
              </div>
              {images.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {images.slice(1, 5).map((u) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={u} src={u} alt="" className="r aspect-square w-full object-cover" />
                  ))}
                </div>
              )}
            </div>
            <div>
              {product.category && <div className="text-primary text-sm font-semibold uppercase tracking-wide">{product.category.name}</div>}
              <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{product.name}</h1>
              {product.price && <div className="mt-2 text-2xl font-bold">{product.price}</div>}
              {product.summary && <p className="mt-4 text-lg text-slate-600">{product.summary}</p>}
              {product.description && <div className="prose-site mt-4 text-slate-700" dangerouslySetInnerHTML={{ __html: mdToHtml(product.description) }} />}
              {specs.length > 0 && (
                <table className="mt-6 w-full text-sm">
                  <tbody>
                    {specs.map((s, i) => (
                      <tr key={i} className="border-b border-slate-200">
                        <td className="py-2 pr-4 font-semibold text-slate-700">{s.label}</td>
                        <td className="py-2 text-slate-600">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`${base}/contact?objet=${encodeURIComponent(product.name)}`} className="r btn-primary px-6 py-3 font-semibold">Demander un devis</Link>
                {product.pdfUrl && <a href={product.pdfUrl} target="_blank" rel="noreferrer" className="r border-2 border-slate-300 px-6 py-3 font-semibold hover:bg-slate-50">📄 Fiche technique (PDF)</a>}
                {site.whatsapp && <a href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Bonjour, je souhaite des informations sur : ${product.name}`)}`} target="_blank" rel="noreferrer" className="r bg-[#25D366] px-6 py-3 font-semibold text-white">WhatsApp</a>}
              </div>
            </div>
          </div>
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 text-2xl font-bold">Produits similaires</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((p) => <ProductCard key={p.id} p={p} base={base} />)}</div>
            </div>
          )}
        </div>
      </SiteShell>
    );
  }

  // Liste produits (page "produits" avec filtre catégorie) — si la page existe, on rend ses blocs avec le filtre
  if (parts[0] === "produits" && !parts[1] && search.categorie) {
    const cat = site.categories.find((c) => c.slug === search.categorie);
    const products = await prisma.product.findMany({ where: { siteId: site.id, published: true, ...(cat ? { categoryId: cat.id } : {}) }, orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
    return (
      <SiteShell site={site} base={base}>
        {banner}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl">{cat?.name ?? "Nos produits"}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`${base}/produits`} className="r border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50">Tous</Link>
            {site.categories.map((c) => (
              <Link key={c.id} href={`${base}/produits?categorie=${c.slug}`} className={`r border px-3 py-1 text-sm ${c.id === cat?.id ? "bg-primary border-transparent text-white" : "border-slate-300 hover:bg-slate-50"}`}>{c.name}</Link>
            ))}
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.map((p) => <ProductCard key={p.id} p={p} base={base} />)}</div>
          {!products.length && <p className="mt-8 text-slate-500">Aucun produit dans cette catégorie pour le moment.</p>}
        </div>
      </SiteShell>
    );
  }

  // Article / événement
  if (parts[0] === "actualites" && parts[1]) {
    const post = await prisma.post.findFirst({ where: { siteId: site.id, slug: parts[1], published: true } });
    if (!post) notFound();
    return (
      <SiteShell site={site} base={base}>
        {banner}
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <div className="text-sm font-medium uppercase tracking-wide text-slate-500">
            {post.kind === "EVENT" ? "Salon / événement" : "Actualité"} · {formatDate(post.date)}{post.endDate ? ` → ${formatDate(post.endDate)}` : ""}{post.location ? ` · ${post.location}` : ""}
          </div>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{post.title}</h1>
          {post.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.imageUrl} alt="" className="r mt-6 aspect-video w-full object-cover" />
          )}
          {post.excerpt && <p className="mt-6 text-lg text-slate-600">{post.excerpt}</p>}
          {post.body && <div className="prose-site mt-4 text-slate-700" dangerouslySetInnerHTML={{ __html: mdToHtml(post.body) }} />}
          {post.link && <a href={post.link} target="_blank" rel="noreferrer" className="r btn-primary mt-8 inline-block px-6 py-3 font-semibold">En savoir plus ↗</a>}
        </article>
      </SiteShell>
    );
  }

  // Page classique
  const slug = parts.join("/");
  const page = site.pages.find((p) => p.slug === slug && p.published);
  if (!page) notFound();
  const blocks = blocksOf(page);
  const transparent = blocks[0]?.type === "hero";
  return (
    <SiteShell site={site} base={base} transparentHeader={transparent}>
      {banner}
      {search.envoye && (
        <div className="bg-green-600 px-4 py-3 text-center font-medium text-white">✅ Votre message a bien été envoyé. Nous vous répondrons rapidement.</div>
      )}
      {!blocks.length && <div className="mx-auto max-w-7xl px-4 py-24 text-center text-slate-400">Cette page est vide. Ajoutez des blocs depuis l'administration.</div>}
      {blocks.map((b) => <RenderBlock key={b.id} block={b} ctx={ctx} />)}
    </SiteShell>
  );
}

function PreviewBanner({ site }: { site: SiteFull }) {
  return (
    <div className="sticky top-0 z-40 flex items-center justify-between bg-indigo-600 px-4 py-2 text-sm text-white">
      <span>👁️ Aperçu du site « {site.name} » — {site.status === "PUBLISHED" ? "publié" : "brouillon"}</span>
      <a href={`/studio/sites/${site.id}`} className="rounded bg-white/20 px-3 py-1 font-semibold hover:bg-white/30">← Retour au Studio</a>
    </div>
  );
}

export { loadSite };
