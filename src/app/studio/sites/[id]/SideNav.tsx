"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Item = { href: string; label: string; icon: string; exact?: boolean; badge?: number };

export function SideNav({ items, site, previewHref }: { items: Item[]; site: { name: string; status: string; domain: string | null }; previewHref: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (it: Item) => (it.exact ? path === it.href : path.startsWith(it.href));
  const status = { DRAFT: ["Brouillon", "bg-amber-100 text-amber-800"], PUBLISHED: ["En ligne", "bg-green-100 text-green-800"], ARCHIVED: ["Archivé", "bg-slate-200 text-slate-600"] }[site.status] ?? ["", ""];
  const nav = (
    <nav className="space-y-0.5">
      {items.map((it) => (
        <Link key={it.href} href={it.href} onClick={() => setOpen(false)} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${active(it) ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"}`}>
          <span className="flex items-center gap-2"><span>{it.icon}</span>{it.label}</span>
          {!!it.badge && <span className="sf-badge bg-red-100 text-red-700">{it.badge}</span>}
        </Link>
      ))}
    </nav>
  );
  return (
    <>
      {/* Mobile */}
      <div className="fixed bottom-4 left-4 z-40 lg:hidden">
        <button onClick={() => setOpen(true)} className="sf-btn-primary shadow-lg">☰ Menu</button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setOpen(false)}>
          <aside className="h-full w-72 bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 font-bold">{site.name}</div>
            {nav}
            <a href={previewHref} target="_blank" className="sf-btn-secondary mt-4 w-full">👁️ Voir le site</a>
          </aside>
        </div>
      )}
      {/* Desktop */}
      <aside className="sticky top-20 hidden h-fit w-64 shrink-0 lg:block">
        <div className="sf-card !p-4">
          <div className="truncate font-bold">{site.name}</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span className={`sf-badge ${status[1]}`}>{status[0]}</span>
            {site.domain && <span className="truncate">{site.domain}</span>}
          </div>
          <a href={previewHref} target="_blank" className="sf-btn-secondary mt-3 w-full">👁️ Voir le site</a>
        </div>
        <div className="mt-3 sf-card !p-2">{nav}</div>
      </aside>
    </>
  );
}
