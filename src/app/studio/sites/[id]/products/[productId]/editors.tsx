"use client";
import { useState } from "react";
import { ImageField } from "@/components/studio/ImageField";

export function SpecsEditor({ initial }: { initial: { label: string; value: string }[] }) {
  const [rows, setRows] = useState(initial.length ? initial : [{ label: "", value: "" }]);
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="flex gap-2">
          <input name="spec_label" value={r.label} placeholder="Ex : Diamètre" className="sf-input" onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
          <input name="spec_value" value={r.value} placeholder="Ex : 20 à 110 mm" className="sf-input" onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
          <button type="button" className="text-red-500" onClick={() => setRows(rows.filter((_, j) => j !== i))}>✕</button>
        </div>
      ))}
      <button type="button" className="sf-btn-secondary !px-3 !py-1.5" onClick={() => setRows([...rows, { label: "", value: "" }])}>+ Ligne</button>
    </div>
  );
}

export function MultiImages({ siteId, initial }: { siteId: string; initial: string[] }) {
  const [imgs, setImgs] = useState<string[]>(initial);
  const [k, setK] = useState(0);
  return (
    <div>
      <label className="sf-label">Images supplémentaires</label>
      <div className="space-y-2">
        {imgs.map((u, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="hidden" name="images" value={u} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="h-12 w-16 rounded object-cover" />
            <span className="flex-1 truncate text-xs text-slate-500">{u.split("/").pop()}</span>
            <button type="button" className="text-red-500" onClick={() => setImgs(imgs.filter((_, j) => j !== i))}>✕</button>
          </div>
        ))}
        <ImageField key={k} siteId={siteId} value="" onChange={(u) => { if (u) { setImgs([...imgs, u]); setK(k + 1); } }} />
      </div>
    </div>
  );
}
