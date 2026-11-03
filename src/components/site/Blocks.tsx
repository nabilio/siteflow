import Link from "next/link";
import type { Site, Category, Product, Post } from "@prisma/client";
import type { Block } from "@/lib/blocks";
import { prisma } from "@/lib/db";
import { mdToHtml } from "@/lib/markdown";
import { bool, formatDate, list, num, str, youtubeEmbed } from "@/lib/utils";
import { Gallery } from "./Gallery";

export type RenderCtx = { site: Site & { categories: Category[] }; base: string; path: string };

const COLS: Record<string, string> = { "2": "sm:grid-cols-2", "3": "sm:grid-cols-2 lg:grid-cols-3", "4": "sm:grid-cols-2 lg:grid-cols-4" };

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`py-14 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
    </section>
  );
}
function Title({ title, intro, center = true }: { title?: string; intro?: string; center?: boolean }) {
  if (!title && !intro) return null;
  return (
    <div className={`mb-10 ${center ? "text-center" : ""}`}>
      {title && <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>}
      {intro && <p className={`mt-3 text-lg text-slate-600 ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>{intro}</p>}
    </div>
  );
}
const href = (base: string, u: string) => (u.startsWith("/") ? `${base}${u}` : u || "#");

export function ProductCard({ p, base, showPrice = true }: { p: Product; base: string; showPrice?: boolean }) {
  return (
    <Link href={`${base}/produits/${p.slug}`} className="group r flex flex-col overflow-hidden border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="aspect-[4/3] bg-slate-100">
        {p.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover transition group-hover:scale-[1.03]" />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl text-slate-300">📦</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold">{p.name}</h3>
        {p.summary && <p className="mt-1 line-clamp-2 text-sm text-slate-600">{p.summary}</p>}
        <div className="mt-auto flex items-center justify-between pt-3 text-sm">
          <span className="text-primary font-semibold">Voir la fiche →</span>
          {showPrice && p.price && <span className="font-bold">{p.price}</span>}
        </div>
      </div>
    </Link>
  );
}

export function PostCard({ p, base }: { p: Post; base: string }) {
  const url = p.link || `${base}/actualites/${p.slug}`;
  const ext = !!p.link && /^https?:/.test(p.link);
  return (
    <a href={url} target={ext ? "_blank" : undefined} rel={ext ? "noreferrer" : undefined} className="group r flex flex-col overflow-hidden border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[16/9] bg-slate-100">
        {p.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl text-slate-300">{p.kind === "EVENT" ? "📅" : "📰"}</div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-800">
          {p.kind === "EVENT" ? "Salon / événement" : "Actualité"}
        </span>
      </div>
      <div className="p-4">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {formatDate(p.date)}{p.endDate ? ` → ${formatDate(p.endDate)}` : ""}{p.location ? ` · ${p.location}` : ""}
        </div>
        <h3 className="mt-1 font-semibold group-hover:underline">{p.title}</h3>
        {p.excerpt && <p className="mt-1 line-clamp-3 text-sm text-slate-600">{p.excerpt}</p>}
      </div>
    </a>
  );
}

export async function RenderBlock({ block, ctx }: { block: Block; ctx: RenderCtx }) {
  const { site, base } = ctx;
  const p = block.props;
  switch (block.type) {
    case "hero": {
      const img = str(p.image);
      const video = str(p.videoUrl);
      const yt = video ? youtubeEmbed(video) : null;
      const h = { md: "min-h-[420px]", lg: "min-h-[560px]", full: "min-h-[calc(100vh-64px)]" }[str(p.height, "lg")] || "min-h-[560px]";
      return (
        <section className={`relative flex ${h} items-center overflow-hidden bg-dark text-white`}>
          {yt ? (
            <iframe src={yt} className="pointer-events-none absolute left-1/2 top-1/2 aspect-video h-[120%] min-w-full -translate-x-1/2 -translate-y-1/2" allow="autoplay" title="video" />
          ) : video ? (
            <video src={video} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
          ) : img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--site-primary), var(--site-dark))" }} />
          )}
          {bool(p.overlay) && (img || video) && <div className="absolute inset-0 bg-black/55" />}
          <div className="sf-fade relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">{str(p.title)}</h1>
            {str(p.subtitle) && <p className="mt-5 max-w-2xl text-lg text-white/85 sm:text-xl">{str(p.subtitle)}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              {str(p.ctaLabel) && <Link href={href(base, str(p.ctaUrl))} className="r btn-primary px-6 py-3 font-semibold">{str(p.ctaLabel)}</Link>}
              {str(p.cta2Label) && <Link href={href(base, str(p.cta2Url))} className="r btn-outline px-6 py-3 font-semibold text-white hover:bg-white/10">{str(p.cta2Label)}</Link>}
            </div>
          </div>
        </section>
      );
    }
    case "features": {
      const items = list(p.items);
      return (
        <Section>
          <Title title={str(p.title)} intro={str(p.intro)} />
          <div className={`grid gap-6 ${COLS[str(p.columns, "3")] || COLS["3"]}`}>
            {items.map((it, i) => (
              <div key={i} className="r border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-3 text-3xl">{str(it.icon)}</div>
                <h3 className="text-lg font-semibold">{str(it.title)}</h3>
                <p className="mt-2 text-slate-600">{str(it.text)}</p>
              </div>
            ))}
          </div>
        </Section>
      );
    }
    case "textImage": {
      const left = str(p.imageSide) === "left";
      return (
        <Section>
          <div className={`grid items-center gap-10 lg:grid-cols-2 ${left ? "" : "lg:[&>*:first-child]:order-2"}`}>
            <div className="r aspect-[4/3] overflow-hidden bg-slate-100">
              {str(p.image) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={str(p.image)} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl text-slate-300">🏢</div>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{str(p.title)}</h2>
              <div className="prose-site mt-4 text-slate-700" dangerouslySetInnerHTML={{ __html: mdToHtml(str(p.text)) }} />
              {str(p.ctaLabel) && <Link href={href(base, str(p.ctaUrl))} className="r btn-primary mt-6 inline-block px-5 py-2.5 font-semibold">{str(p.ctaLabel)}</Link>}
            </div>
          </div>
        </Section>
      );
    }
    case "richText":
      return (
        <Section>
          <div className={bool(p.narrow) ? "mx-auto max-w-3xl" : ""}>
            {str(p.title) && <h2 className="mb-4 text-3xl font-bold tracking-tight">{str(p.title)}</h2>}
            <div className="prose-site text-slate-700" dangerouslySetInnerHTML={{ __html: mdToHtml(str(p.text)) }} />
          </div>
        </Section>
      );
    case "gallery": {
      const items = list<{ image?: string; caption?: string }>(p.items).filter((i) => i.image);
      if (!items.length) return null;
      return (
        <Section className="bg-slate-50">
          <Title title={str(p.title)} />
          <Gallery items={items} autoplay={bool(p.autoplay)} interval={num(p.interval, 4)} />
        </Section>
      );
    }
    case "products": {
      const mode = str(p.mode, "featured");
      const limit = num(p.limit, 6);
      if (mode === "categories") {
        const cats = await prisma.category.findMany({ where: { siteId: site.id }, orderBy: { order: "asc" }, include: { products: { where: { published: true }, take: 1, orderBy: { order: "asc" } }, _count: { select: { products: true } } } });
        if (!cats.length) return null;
        return (
          <Section>
            <Title title={str(p.title)} intro={str(p.intro)} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cats.map((c) => (
                <Link key={c.id} href={`${base}/produits?categorie=${c.slug}`} className="group r relative aspect-[4/3] overflow-hidden text-white shadow" style={{ background: "linear-gradient(135deg, var(--site-primary), var(--site-dark))" }}>
                  {c.products[0]?.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.products[0].imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 transition group-hover:scale-105" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 p-5">
                    <h3 className="text-xl font-bold">{c.name}</h3>
                    <p className="text-sm opacity-80">{c._count.products} référence{c._count.products > 1 ? "s" : ""}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        );
      }
      const products = await prisma.product.findMany({
        where: { siteId: site.id, published: true, ...(mode === "featured" ? { featured: true } : {}) },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        take: limit,
      });
      if (!products.length) return null;
      return (
        <Section>
          <Title title={str(p.title)} intro={str(p.intro)} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((pr) => <ProductCard key={pr.id} p={pr} base={base} />)}
          </div>
          {str(p.ctaLabel) && (
            <div className="mt-10 text-center">
              <Link href={`${base}/produits`} className="r btn-primary px-6 py-3 font-semibold">{str(p.ctaLabel)}</Link>
            </div>
          )}
        </Section>
      );
    }
    case "posts": {
      const kind = str(p.kind, "all");
      const posts = await prisma.post.findMany({
        where: { siteId: site.id, published: true, ...(kind === "NEWS" || kind === "EVENT" ? { kind } : {}) },
        orderBy: { date: "desc" },
        take: num(p.limit, 3),
      });
      if (!posts.length) return null;
      return (
        <Section className="bg-slate-50">
          <Title title={str(p.title)} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((po) => <PostCard key={po.id} p={po} base={base} />)}
          </div>
        </Section>
      );
    }
    case "stats": {
      const items = list(p.items);
      return (
        <section className="bg-primary py-10 text-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 text-center sm:px-6 lg:grid-cols-4">
            {items.map((it, i) => (
              <div key={i}>
                <div className="text-3xl font-extrabold sm:text-4xl">{str(it.value)}</div>
                <div className="mt-1 text-sm opacity-90">{str(it.label)}</div>
              </div>
            ))}
          </div>
        </section>
      );
    }
    case "cta":
      return (
        <section className="bg-accent py-14 text-white">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 md:flex-row md:text-left">
            <div>
              <h2 className="text-3xl font-bold">{str(p.title)}</h2>
              {str(p.text) && <p className="mt-2 text-lg opacity-90">{str(p.text)}</p>}
            </div>
            {str(p.ctaLabel) && <Link href={href(base, str(p.ctaUrl))} className="r bg-white px-6 py-3 font-semibold text-slate-900 shadow hover:bg-slate-100">{str(p.ctaLabel)}</Link>}
          </div>
        </section>
      );
    case "video": {
      const v = str(p.videoUrl);
      if (!v) return null;
      const yt = v.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
      return (
        <Section className="bg-dark text-white">
          <Title title={str(p.title)} />
          <div className="r mx-auto aspect-video max-w-4xl overflow-hidden bg-black shadow-2xl">
            {yt ? (
              <iframe src={`https://www.youtube-nocookie.com/embed/${yt[1]}`} className="h-full w-full" allowFullScreen title="video" />
            ) : (
              <video src={v} controls className="h-full w-full" />
            )}
          </div>
          {str(p.text) && <p className="mx-auto mt-6 max-w-2xl text-center text-white/80">{str(p.text)}</p>}
        </Section>
      );
    }
    case "faq":
      return (
        <Section>
          <Title title={str(p.title)} />
          <div className="mx-auto max-w-3xl divide-y divide-slate-200 r border border-slate-200 bg-white">
            {list(p.items).map((it, i) => (
              <details key={i} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                  {str(it.q)}
                  <span className="ml-4 text-xl text-slate-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-slate-600">{str(it.a)}</p>
              </details>
            ))}
          </div>
        </Section>
      );
    case "team": {
      const items = list(p.items);
      if (!items.length) return null;
      return (
        <Section>
          <Title title={str(p.title)} />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((it, i) => (
              <div key={i} className="text-center">
                <div className="r mx-auto aspect-square w-full overflow-hidden bg-slate-100">
                  {str(it.image) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={str(it.image)} alt={str(it.name)} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl text-slate-300">👤</div>
                  )}
                </div>
                <div className="mt-3 font-semibold">{str(it.name)}</div>
                <div className="text-sm text-slate-500">{str(it.role)}</div>
              </div>
            ))}
          </div>
        </Section>
      );
    }
    case "contact":
      return (
        <Section id="contact" className="bg-slate-50">
          <Title title={str(p.title)} intro={str(p.intro)} />
          <div className="grid gap-10 lg:grid-cols-5">
            <form action="/api/contact" method="post" className="r space-y-4 border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
              <input type="hidden" name="siteId" value={site.id} />
              <input type="hidden" name="back" value={ctx.path} />
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium">Nom *<input name="name" required className="mt-1 w-full r border border-slate-300 px-3 py-2" /></label>
                <label className="block text-sm font-medium">Téléphone<input name="phone" className="mt-1 w-full r border border-slate-300 px-3 py-2" /></label>
              </div>
              <label className="block text-sm font-medium">Email<input name="email" type="email" className="mt-1 w-full r border border-slate-300 px-3 py-2" /></label>
              <label className="block text-sm font-medium">Objet<input name="subject" className="mt-1 w-full r border border-slate-300 px-3 py-2" /></label>
              <label className="block text-sm font-medium">Message *<textarea name="message" required rows={5} className="mt-1 w-full r border border-slate-300 px-3 py-2" /></label>
              <button className="r btn-primary w-full px-6 py-3 font-semibold sm:w-auto">Envoyer</button>
            </form>
            <div className="space-y-4 lg:col-span-2">
              <div className="r border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold">Nos coordonnées</h3>
                <ul className="mt-3 space-y-2 text-slate-700">
                  {site.address && <li>📍 {site.address}</li>}
                  {site.phone && <li>📞 <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a></li>}
                  {site.whatsapp && <li>💬 <a href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`}>WhatsApp {site.whatsapp}</a></li>}
                  {site.contactEmail && <li>✉️ <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></li>}
                </ul>
              </div>
              {bool(p.showMap) && site.mapEmbedUrl && (
                <iframe src={site.mapEmbedUrl} className="r h-64 w-full border border-slate-200" loading="lazy" title="Carte" />
              )}
            </div>
          </div>
        </Section>
      );
    case "spacer": {
      const h = { sm: "h-6", md: "h-12", lg: "h-24" }[str(p.size, "md")] || "h-12";
      return <div className={`mx-auto max-w-7xl px-4 ${h} ${bool(p.line) ? "flex items-center" : ""}`}>{bool(p.line) && <hr className="w-full border-slate-200" />}</div>;
    }
    default:
      return null;
  }
}
