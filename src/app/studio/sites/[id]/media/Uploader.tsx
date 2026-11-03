"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function Uploader({ siteId }: { siteId: string }) {
  const [busy, setBusy] = useState(0);
  const [errs, setErrs] = useState<string[]>([]);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  async function send(files: FileList | File[]) {
    const arr = Array.from(files);
    setBusy(arr.length); setErrs([]);
    for (const f of arr) {
      const fd = new FormData(); fd.append("siteId", siteId); fd.append("file", f);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      if (!r.ok) { const j = await r.json().catch(() => ({})); setErrs((e) => [...e, `${f.name} : ${j.error || "erreur"}`]); }
      setBusy((b) => b - 1);
    }
    router.refresh();
  }
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); send(e.dataTransfer.files); }}
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center"
    >
      <div className="text-3xl">⬆️</div>
      <p className="mt-2 text-sm text-slate-600">Glissez vos fichiers ici, ou</p>
      <button type="button" className="sf-btn-primary mt-3" disabled={busy > 0} onClick={() => input.current?.click()}>{busy > 0 ? `Envoi (${busy} restant)…` : "Choisir des fichiers"}</button>
      <input ref={input} type="file" multiple className="hidden" accept="image/*,application/pdf,video/mp4,video/webm" onChange={(e) => e.target.files && send(e.target.files)} />
      {errs.map((e) => <p key={e} className="mt-2 text-xs text-red-600">{e}</p>)}
    </div>
  );
}
