"use client";
import { useEffect, useRef, useState } from "react";

type Media = { id: string; url: string; name: string; mime: string };

/**
 * Champ fichier : upload direct ou choix dans la médiathèque du site.
 * `accept` : "image" (défaut), "pdf", "video", "any".
 */
export function ImageField({ siteId, name, value, onChange, accept = "image", label }: {
  siteId: string; name?: string; value?: string; onChange?: (url: string) => void; accept?: "image" | "pdf" | "video" | "any"; label?: string;
}) {
  const [val, setVal] = useState(value ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [lib, setLib] = useState<Media[] | null>(null);
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => setVal(value ?? ""), [value]);

  const set = (u: string) => { setVal(u); onChange?.(u); };
  const mimes = { image: "image/*", pdf: "application/pdf", video: "video/mp4,video/webm", any: "image/*,application/pdf,video/mp4,video/webm" }[accept];

  async function upload(file: File) {
    setBusy(true); setErr("");
    const fd = new FormData();
    fd.append("siteId", siteId); fd.append("file", file);
    const r = await fetch("/api/upload", { method: "POST", body: fd });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) { setErr(j.error || "Erreur"); return; }
    set(j.url);
    setLib(null);
  }
  async function openLib() {
    setOpen(true);
    if (!lib) {
      const r = await fetch(`/api/media?siteId=${siteId}`);
      const all: Media[] = await r.json();
      setLib(all.filter((m) => accept === "any" || (accept === "image" ? m.mime.startsWith("image/") : accept === "pdf" ? m.mime === "application/pdf" : m.mime.startsWith("video/"))));
    }
  }
  const isImg = /\.(png|jpe?g|webp|gif|svg|ico)(\?|$)/i.test(val);

  return (
    <div>
      {label && <label className="sf-label">{label}</label>}
      {name && <input type="hidden" name={name} value={val} />}
      <div className="flex items-start gap-3">
        <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
          {val ? (isImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={val} alt="" className="h-full w-full object-cover" />
          ) : <span className="px-2 text-center break-all">{val.split("/").pop()}</span>) : "Aucun fichier"}
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="sf-btn-secondary !px-3 !py-1.5" disabled={busy} onClick={() => input.current?.click()}>{busy ? "Envoi…" : "⬆️ Importer"}</button>
            <button type="button" className="sf-btn-secondary !px-3 !py-1.5" onClick={openLib}>🗂️ Médiathèque</button>
            {val && <button type="button" className="sf-btn-danger !px-3 !py-1.5" onClick={() => set("")}>✕</button>}
          </div>
          <input className="sf-input !py-1 text-xs" placeholder="ou coller un lien https://…" value={val} onChange={(e) => setVal(e.target.value)} onBlur={(e) => e.target.value !== (value ?? "") && set(e.target.value)} />
          {err && <p className="text-xs text-red-600">{err}</p>}
        </div>
      </div>
      <input ref={input} type="file" accept={mimes} className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="max-h-[80vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Médiathèque</h3><button type="button" className="sf-btn-secondary !px-3 !py-1" onClick={() => setOpen(false)}>Fermer</button></div>
            {!lib ? <p className="text-sm text-slate-500">Chargement…</p> : lib.length === 0 ? <p className="text-sm text-slate-500">Aucun fichier. Utilisez « Importer ».</p> : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {lib.map((m) => (
                  <button type="button" key={m.id} onClick={() => { set(m.url); setOpen(false); }} className="aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-xs hover:ring-2 hover:ring-indigo-500">
                    {m.mime.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
                    ) : <span className="flex h-full items-center justify-center p-1 text-center break-all">{m.name}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
