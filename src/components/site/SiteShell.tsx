import Link from "next/link";
import type { Page, Site } from "@prisma/client";
import { themeOf } from "@/lib/site";
import { MobileNav } from "./MobileNav";

type Props = {
  site: Site & { pages: Page[] };
  base: string; // "" en prod, "/s/slug" en aperçu
  children: React.ReactNode;
  transparentHeader?: boolean;
};

const RADIUS = { none: "0px", md: "0.75rem", xl: "1.5rem" };
const FONT = { sans: "var(--font-sans)", serif: "var(--font-serif)", rounded: "var(--font-rounded)" };

export function SiteShell({ site, base, children, transparentHeader }: Props) {
  const t = themeOf(site);
  const nav = site.pages.filter((p) => p.inNav && p.published);
  const socials = (site.socials ?? {}) as Record<string, string>;
  const style = {
    "--site-primary": t.primary,
    "--site-accent": t.accent,
    "--site-dark": t.dark,
    "--site-radius": RADIUS[t.radius],
    "--site-font": FONT[t.font],
  } as React.CSSProperties;
  const dark = t.headerStyle === "dark";
  const transparent = t.headerStyle === "transparent" && transparentHeader;
  const headerCls = transparent
    ? "absolute inset-x-0 top-0 z-30 text-white"
    : dark
      ? "sticky top-0 z-30 bg-dark text-white shadow"
      : "sticky top-0 z-30 bg-white/95 text-slate-900 shadow-sm backdrop-blur";
  const links = nav.map((p) => ({ href: `${base}/${p.slug}`.replace(/\/$/, "") || "/", label: p.navLabel || p.title }));

  return (
    <div className="site flex min-h-screen flex-col" style={style}>
      <header className={headerCls}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href={base || "/"} className="flex items-center gap-3">
            {site.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={site.logoUrl} alt={site.name} className="h-10 w-auto max-w-[160px] object-contain" />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-black text-white">
                {site.name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="text-lg font-bold leading-tight">{site.name}</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium opacity-90 hover:opacity-100">
                {l.label}
              </Link>
            ))}
            {site.phone && (
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="r btn-primary px-4 py-2 text-sm font-semibold">
                {site.phone}
              </a>
            )}
          </nav>
          <MobileNav links={links} phone={site.phone} />
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-dark text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <div className="text-lg font-bold text-white">{site.name}</div>
            {site.tagline && <p className="mt-1 text-sm">{site.tagline}</p>}
            {site.footerText && <p className="mt-3 text-sm opacity-80">{site.footerText}</p>}
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-white">Navigation</div>
            <ul className="space-y-1 text-sm">
              {links.map((l) => (
                <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-white">Contact</div>
            <ul className="space-y-1 text-sm">
              {site.address && <li>{site.address}</li>}
              {site.phone && <li><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white">{site.phone}</a></li>}
              {site.whatsapp && <li><a href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`} className="hover:text-white">WhatsApp : {site.whatsapp}</a></li>}
              {site.contactEmail && <li><a href={`mailto:${site.contactEmail}`} className="hover:text-white">{site.contactEmail}</a></li>}
            </ul>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              {Object.entries(socials).filter(([, v]) => v).map(([k, v]) => (
                <a key={k} href={v} target="_blank" rel="noreferrer" className="rounded-full border border-slate-600 px-3 py-1 capitalize hover:border-white hover:text-white">{k}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700/60 py-4 text-center text-xs opacity-70">
          © {new Date().getFullYear()} {site.name}. Tous droits réservés.
        </div>
      </footer>

      {site.whatsapp && (
        <a
          href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.5 6.5 0 0 1-3.3-2.9c-.2-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.8c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c1.7.7 2 .6 2.6.5a2.3 2.3 0 0 0 1.5-1.1 1.9 1.9 0 0 0 .1-1.1c0-.1-.2-.2-.4-.3z"/></svg>
        </a>
      )}
    </div>
  );
}
