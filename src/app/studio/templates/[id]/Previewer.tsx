"use client";
import { useState } from "react";

const SIZES = [
  { k: "desktop", label: "💻 Ordinateur", w: "100%" },
  { k: "tablet", label: "📱 Tablette", w: "820px" },
  { k: "mobile", label: "📲 Mobile", w: "390px" },
];

export function Previewer({ slug, pages }: { slug: string; pages: { slug: string; title: string }[] }) {
  const [size, setSize] = useState(SIZES[0]);
  const [page, setPage] = useState(pages[0]?.slug ?? "");
  const src = `/s/${slug}${page && page !== "home" && page !== "" ? `/${page}` : ""}`;
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {pages.map((p) => (
            <button key={p.slug} onClick={() => setPage(p.slug)} className={`rounded-full px-3 py-1 text-sm ${page === p.slug ? "bg-indigo-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>{p.title}</button>
          ))}
        </div>
        <div className="flex gap-1">
          {SIZES.map((s) => (
            <button key={s.k} onClick={() => setSize(s)} className={`rounded-lg px-3 py-1 text-sm ${size.k === s.k ? "bg-slate-800 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>{s.label}</button>
          ))}
        </div>
      </div>
      <div className="flex flex-1 justify-center rounded-xl bg-slate-300 p-3">
        <iframe key={src} src={src} title="Aperçu" style={{ width: size.w, maxWidth: "100%", height: "calc(100vh - 210px)", minHeight: 500 }} className="rounded-lg border border-slate-400 bg-white shadow-xl" />
      </div>
    </div>
  );
}
