import Link from "next/link";
import type { Site, Category, Product, Post } from "@prisma/client";
import type { Block } from "@/lib/blocks";
import { prisma } from "@/lib/db";
import { mdToHtml } from "@/lib/markdown";
import { bool, formatDate, list, num, str, youtubeEmbed } from "@/lib/utils";
import { Gallery } from "./Gallery";

export type RenderCtx = { site: Site & { categories: Category[] }; base: string; path: string };

const COLS: Record<string, string> = { "2": "sm:grid-cols-2", "3": "sm:grid-cols-2 lg:grid-cols-3", "4": "sm:grid-cols-2 lg:grid-cols-4" };

const TONES: Record<string, string> = {
  white: "bg-white",
  soft: "bg-slate-50",
  dark: "bg-dark text-white tone-dark",
  primary: "bg-primary text-white tone-dark",
};
function Section({ children, className = "", id, tone }: { children: React.ReactNode; className?: string; id?: string; tone?: string }) {
  const cls = tone && TONES[tone] ? TONES[tone] : className;
  return (
    <section id={id} className={`py-14 sm:py-20 ${cls}`}>
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
      const layout = str(p.layout, "left");
      const h = { md: "min-h-[420px]", lg: "min-h-[560px]", full: "min-h-[calc(100vh-64px)]" }[str(p.height, "lg")] || "min-h-[560px]";
      const badges = list<{ text?: string }>(p.badges).filter((b) => b.text);
      const buttons = (
        <div className={`mt-8 flex flex-wrap gap-3 ${layout === "center" ? "justify-center" : ""}`}>
          {str(p.ctaLabel) && <Link href={href(base, str(p.ctaUrl))} className="r btn-primary px-6 py-3 font-semibold shadow-lg">{str(p.ctaLabel)}</Link>}
          {str(p.cta2Label) && <Link href={href(base, str(p.cta2Url))} className="r btn-outline px-6 py-3 font-semibold hover:bg-white/10">{str(p.cta2Label)}</Link>}
        </div>
      );
      const chips = badges.length > 0 && (
        <ul className={`mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium opacity-90 ${layout === "center" ? "justify-center" : ""}`}>
          {badges.map((b, i) => <li key={i} className="flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] text-white">✓</span>{b.text}</li>)}
        </ul>
      );
      const badge = str(p.badge) && <span className="mb-5 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur">{str(p.badge)}</span>;
      if (layout === "split") {
        const light = bool(p.light);
        return (
          <section className={`relative overflow-hidden ${light ? "bg-slate-50 text-slate-900" : "text-white"}`} style={light ? undefined : { background: "linear-gradient(135deg, var(--site-dark) 0%, var(--site-primary) 130%)" }}>
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent opacity-20 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-primary opacity-30 blur-3xl" />
            <div className="sf-fade relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-24">
              <div>
                {str(p.badge) && <span className={`mb-5 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest ${light ? "bg-primary-soft text-primary" : "border border-white/30 bg-white/10"}`}>{str(p.badge)}</span>}
                <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">{str(p.title)}</h1>
                {str(p.subtitle) && <p className={`mt-5 max-w-xl text-lg sm:text-xl ${light ? "text-slate-600" : "text-white/85"}`}>{str(p.subtitle)}</p>}
                <div className={`mt-8 flex flex-wrap gap-3`}>
                  {str(p.ctaLabel) && <Link href={href(base, str(p.ctaUrl))} className="r btn-primary px-6 py-3 font-semibold shadow-lg">{str(p.ctaLabel)}</Link>}
                  {str(p.cta2Label) && <Link href={href(base, str(p.cta2Url))} className={`r btn-outline px-6 py-3 font-semibold ${light ? "text-slate-800 hover:bg-slate-900/5" : "hover:bg-white/10"}`}>{str(p.cta2Label)}</Link>}
                </div>
                {chips}
              </div>
              <div className="relative">
                <div className="r relative aspect-[4/3] overflow-hidden bg-white/5 shadow-2xl ring-1 ring-white/20">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-7xl opacity-40">🖼️</div>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      }
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
          {bool(p.overlay) && (img || video) && <div className="absolute inset-0" style={{ background: layout === "center" ? "rgba(0,0,0,.55)" : "linear-gradient(90deg, rgba(0,0,0,.72) 0%, rgba(0,0,0,.35) 60%, rgba(0,0,0,.15) 100%)" }} />}
          <div className={`sf-fade relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 ${layout === "center" ? "text-center" : ""}`}>
            {badge}
            <h1 className={`text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl ${layout === "center" ? "mx-auto max-w-4xl" : "max-w-3xl"}`}>{str(p.title)}</h1>
            {str(p.subtitle) && <p className={`mt-5 text-lg text-white/85 sm:text-xl ${layout === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>{str(p.subtitle)}</p>}
            {buttons}
            {chips}
          </div>
        </section>
      );
    }
    case "features": {
      const items = list(p.items);
      const st = str(p.style, "cards");
      return (
        <Section tone={str(p.tone)}>
          <Title title={str(p.title)} intro={str(p.intro)} />
          <div className={`grid gap-6 ${COLS[str(p.columns, "3")] || COLS["3"]}`}>
            {items.map((it, i) => (
              <div key={i} className={st === "plain" ? "px-2" : "cardx r border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"}>
                {st === "icons" ? (
                  <div className="r mb-4 flex h-14 w-14 items-center justify-center bg-primary/10 text-2xl" style={{ background: "color-mix(in srgb, var(--site-primary) 12%, transparent)" }}>{str(it.icon)}</div>
                ) : (
                  <div className="mb-3 text-3xl">{str(it.icon)}</div>
                )}
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
      const bullets = list<{ text?: string }>(p.bullets).filter((b) => b.text);
      return (
        <Section tone={str(p.tone)}>
          <div className={`grid items-center gap-10 lg:grid-cols-2 ${left ? "" : "lg:[&>*:first-child]:order-2"}`}>
            <div className="r aspect-[4/3] overflow-hidden bg-slate-100 shadow-xl ring-1 ring-black/5">
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
              {bullets.length > 0 && (
                <ul className="mt-5 space-y-2.5">
                  {bullets.map((b, i) => <li key={i} className="flex items-start gap-3"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">✓</span><span>{b.text}</span></li>)}
                </ul>
              )}
              {str(p.ctaLabel) && <Link href={href(base, str(p.ctaUrl))} className="r btn-primary mt-6 inline-block px-5 py-2.5 font-semibold">{str(p.ctaLabel)}</Link>}
            </div>
          </div>
        </Section>
      );
    }
    case "richText":
      return (
        <Section tone={str(p.tone)}>
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
          {str(p.layout) === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {items.map((it, i) => (
                <figure key={i} className={`r group relative overflow-hidden bg-slate-100 ${i === 0 && items.length >= 5 ? "col-span-2 row-span-2" : ""}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.image} alt={it.caption || ""} className="aspect-[4/3] h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  {it.caption && <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-sm font-medium text-white">{it.caption}</figcaption>}
                </figure>
              ))}
            </div>
          ) : (
            <Gallery items={items} autoplay={bool(p.autoplay)} interval={num(p.interval, 4)} />
          )}
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
        <section className="bg-primary py-12 text-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 text-center sm:px-6 lg:grid-cols-4">
            {items.map((it, i) => (
              <div key={i} className="lg:border-l lg:border-white/20 lg:first:border-0">
                <div className="text-4xl font-extrabold tracking-tight sm:text-5xl">{str(it.value)}</div>
                <div className="mt-2 text-sm uppercase tracking-wide opacity-85">{str(it.label)}</div>
              </div>
            ))}
          </div>
        </section>
      );
    }
    case "cta":
      return (
        <section className="relative overflow-hidden py-16 text-white" style={{ background: "linear-gradient(120deg, var(--site-primary), var(--site-dark))" }}>
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-accent opacity-30 blur-3xl" />
          <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 md:flex-row md:text-left">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">{str(p.title)}</h2>
              {str(p.text) && <p className="mt-2 text-lg opacity-90">{str(p.text)}</p>}
            </div>
            {str(p.ctaLabel) && <Link href={href(base, str(p.ctaUrl))} className="r bg-accent px-7 py-3.5 font-semibold text-white shadow-lg hover:brightness-110">{str(p.ctaLabel)}</Link>}
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
        <Section tone={str(p.tone)}>
          <Title title={str(p.title)} />
          <div className="cardx mx-auto max-w-3xl divide-y divide-slate-200 r border border-slate-200 bg-white">
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
    case "steps": {
      const items = list(p.items);
      return (
        <Section tone={str(p.tone)}>
          <Title title={str(p.title)} intro={str(p.intro)} />
          <ol className={`grid gap-8 ${items.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"}`}>
            {items.map((it, i) => (
              <li key={i} className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-white shadow-md" style={{ outline: "6px solid color-mix(in srgb, var(--site-primary) 15%, transparent)" }}>{i + 1}</span>
                  <span aria-hidden className="hidden h-px flex-1 bg-slate-300 md:block" style={{ opacity: i === items.length - 1 ? 0 : 1 }} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{str(it.title)}</h3>
                <p className="mt-2 text-slate-600">{str(it.text)}</p>
              </li>
            ))}
          </ol>
        </Section>
      );
    }
    case "testimonials": {
      const items = list(p.items);
      if (!items.length) return null;
      return (
        <Section tone={str(p.tone) || "soft"}>
          <Title title={str(p.title)} />
          <div className={`grid gap-6 ${items.length >= 3 ? "md:grid-cols-3" : items.length === 2 ? "md:grid-cols-2" : "mx-auto max-w-2xl"}`}>
            {items.map((it, i) => (
              <figure key={i} className="cardx r relative flex flex-col border border-slate-200 bg-white p-7 shadow-sm">
                <span aria-hidden className="absolute right-6 top-3 font-serif text-7xl leading-none text-primary opacity-15">”</span>
                <div className="mb-3 text-lg tracking-widest text-accent">★★★★★</div>
                <blockquote className="flex-1 text-slate-700">{str(it.quote)}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-bold text-white">{str(it.name).charAt(0).toUpperCase()}</span>
                  <span><span className="block font-semibold">{str(it.name)}</span><span className="block text-sm text-slate-500">{str(it.role)}</span></span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      );
    }
    case "pricing": {
      const items = list(p.items);
      return (
        <Section tone={str(p.tone)}>
          <Title title={str(p.title)} intro={str(p.intro)} />
          <div className={`mx-auto grid items-stretch gap-6 ${items.length >= 3 ? "max-w-6xl md:grid-cols-3" : "max-w-4xl md:grid-cols-2"}`}>
            {items.map((it, i) => {
              const hi = bool(it.highlight);
              const feats = str(it.features).split("\n").map((x) => x.trim()).filter(Boolean);
              return (
                <div key={i} className={`cardx r relative flex flex-col border p-7 ${hi ? "border-transparent bg-dark text-white shadow-2xl md:-my-3" : "border-slate-200 bg-white shadow-sm"}`}>
                  {hi && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">Recommandé</span>}
                  <h3 className="text-lg font-semibold">{str(it.name)}</h3>
                  <div className="mt-3 flex items-baseline gap-1"><span className="text-4xl font-extrabold tracking-tight">{str(it.price)}</span><span className={`text-sm ${hi ? "text-white/70" : "text-slate-500"}`}>{str(it.period)}</span></div>
                  <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                    {feats.map((f, k) => <li key={k} className="flex items-start gap-2.5"><span className="mt-0.5 text-accent">✓</span><span>{f}</span></li>)}
                  </ul>
                  {str(it.ctaLabel) && <Link href={href(base, str(it.ctaUrl))} className={`r mt-7 px-5 py-3 text-center font-semibold ${hi ? "bg-accent text-white hover:brightness-110" : "btn-primary"}`}>{str(it.ctaLabel)}</Link>}
                </div>
              );
            })}
          </div>
        </Section>
      );
    }
    case "priceList": {
      const items = list(p.items);
      let lastGroup = "";
      return (
        <Section tone={str(p.tone)}>
          <Title title={str(p.title)} intro={str(p.intro)} />
          <div className="mx-auto max-w-3xl">
            {items.map((it, i) => {
              const g = str(it.group);
              const showG = g && g !== lastGroup;
              if (g) lastGroup = g;
              return (
                <div key={i}>
                  {showG && <h3 className="mb-2 mt-10 border-b-2 border-accent pb-2 text-xl font-bold text-primary first:mt-0">{g}</h3>}
                  <div className="flex items-baseline gap-3 py-3">
                    <div className="min-w-0">
                      <div className="font-semibold">{str(it.name)}</div>
                      {str(it.text) && <div className="text-sm text-slate-500">{str(it.text)}</div>}
                    </div>
                    <span aria-hidden className="mb-1 min-w-4 flex-1 border-b border-dotted border-slate-300" />
                    <div className="shrink-0 font-bold text-primary">{str(it.price)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      );
    }
    case "hours": {
      const items = list(p.items);
      return (
        <Section tone={str(p.tone)}>
          <div className={`grid items-center gap-10 ${str(p.image) ? "lg:grid-cols-2" : "mx-auto max-w-3xl"}`}>
            {str(p.image) && (
              <div className="r aspect-[4/3] overflow-hidden bg-slate-100 shadow-xl ring-1 ring-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={str(p.image)} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{str(p.title)}</h2>
              {str(p.text) && <p className="mt-3 text-slate-600">{str(p.text)}</p>}
              <div className="cardx r mt-6 divide-y divide-slate-200 border border-slate-200 bg-white shadow-sm">
                {items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 px-5 py-3">
                    <span className="font-medium">{str(it.day)}</span>
                    <span className="text-slate-600">{str(it.time)}</span>
                  </div>
                ))}
              </div>
              {(site.address || site.phone) && (
                <div className="mt-5 space-y-1 text-sm text-slate-600">
                  {site.address && <div>📍 {site.address}</div>}
                  {site.phone && <div>📞 <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="font-semibold">{site.phone}</a></div>}
                </div>
              )}
            </div>
          </div>
        </Section>
      );
    }
    case "badges": {
      const items = list(p.items).filter((i) => str(i.text) || str(i.image));
      if (!items.length) return null;
      return (
        <section className="border-y border-slate-200 bg-white py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            {str(p.title) && <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{str(p.title)}</p>}
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {items.map((it, i) => str(it.image) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={str(it.image)} alt={str(it.text)} className="h-9 w-auto opacity-70 grayscale" />
              ) : (
                <span key={i} className="text-lg font-extrabold tracking-wide text-slate-400">{str(it.text)}</span>
              ))}
            </div>
          </div>
        </section>
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
