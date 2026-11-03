"use client";
import { useEffect, useState } from "react";

type Item = { image?: string; caption?: string };

export function Gallery({ items, autoplay, interval }: { items: Item[]; autoplay: boolean; interval: number }) {
  const [i, setI] = useState(0);
  const n = items.length;
  useEffect(() => {
    if (!autoplay || n < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), Math.max(2, interval) * 1000);
    return () => clearInterval(t);
  }, [autoplay, interval, n]);
  if (n === 0) return null;
  return (
    <div className="relative overflow-hidden r bg-slate-100" style={{ aspectRatio: "16/7" }}>
      {items.map((it, k) => (
        <div key={k} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: k === i ? 1 : 0 }}>
          {it.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={it.image} alt={it.caption || ""} className="h-full w-full object-cover" />
          )}
          {it.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white sm:p-6">
              <p className="text-sm font-medium sm:text-lg">{it.caption}</p>
            </div>
          )}
        </div>
      ))}
      {n > 1 && (
        <>
          <button aria-label="Précédent" onClick={() => setI((i - 1 + n) % n)} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-800 hover:bg-white">‹</button>
          <button aria-label="Suivant" onClick={() => setI((i + 1) % n)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-800 hover:bg-white">›</button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {items.map((_, k) => (
              <button key={k} aria-label={`Image ${k + 1}`} onClick={() => setI(k)} className={`h-2 w-2 rounded-full ${k === i ? "bg-white" : "bg-white/50"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
