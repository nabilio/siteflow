"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Block, BlockDef, Field } from "@/lib/blocks";
import { ImageField } from "@/components/studio/ImageField";

type PageMeta = { id: string; title: string; slug: string; navLabel: string | null; inNav: boolean; published: boolean; seoTitle: string | null; seoDescription: string | null };
type SaveInput = { pageId: string; blocks: Block[]; title?: string; navLabel?: string | null; inNav?: boolean; published?: boolean; seoTitle?: string | null; seoDescription?: string | null; slug?: string };

const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
function defaults(def: BlockDef): Record<string, unknown> {
  const p: Record<string, unknown> = {};
  def.fields.forEach((f) => { p[f.key] = f.default !== undefined ? structuredClone(f.default) : f.type === "list" ? [] : f.type === "boolean" ? false : ""; });
  return p;
}

export function PageEditor({ siteId, siteSlug, base, page, initialBlocks, catalog, save }: {
  siteId: string; siteSlug: string; base: string; page: PageMeta; initialBlocks: Block[]; catalog: BlockDef[]; save: (i: SaveInput) => Promise<{ ok: boolean }>;
}) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [meta, setMeta] = useState(page);
  const [sel, setSel] = useState<string | null>(initialBlocks[0]?.id ?? null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [adding, setAdding] = useState(false);
  const [showMeta, setShowMeta] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const iframe = useRef<HTMLIFrameElement>(null);

  const update = (fn: (b: Block[]) => Block[]) => { setBlocks((b) => fn(b)); setDirty(true); };
  const selected = useMemo(() => blocks.find((b) => b.id === sel) ?? null, [blocks, sel]);
  const defOf = (t: string) => catalog.find((c) => c.type === t);

  const doSave = useCallback(async () => {
    setSaving(true);
    await save({ pageId: page.id, blocks, title: meta.title, navLabel: meta.navLabel, inNav: meta.inNav, published: meta.published, seoTitle: meta.seoTitle, seoDescription: meta.seoDescription, slug: meta.slug });
    setSaving(false); setDirty(false); setSavedAt(new Date()); setPreviewKey((k) => k + 1);
  }, [blocks, meta, page.id, save]);

  // Ctrl+S
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); doSave(); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [doSave]);
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); } };
    window.addEventListener("beforeunload", h); return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const add = (def: BlockDef) => { const b = { id: newId(), type: def.type, props: defaults(def) }; update((bs) => [...bs, b]); setSel(b.id); setAdding(false); };
  const move = (id: string, dir: -1 | 1) => update((bs) => { const i = bs.findIndex((b) => b.id === id); const j = i + dir; if (j < 0 || j >= bs.length) return bs; const c = [...bs]; [c[i], c[j]] = [c[j], c[i]]; return c; });
  const remove = (id: string) => { update((bs) => bs.filter((b) => b.id !== id)); if (sel === id) setSel(null); };
  const duplicate = (id: string) => update((bs) => { const i = bs.findIndex((b) => b.id === id); const c = { ...bs[i], id: newId(), props: structuredClone(bs[i].props) }; return [...bs.slice(0, i + 1), c, ...bs.slice(i + 1)]; });
  const setProp = (id: string, key: string, value: unknown) => update((bs) => bs.map((b) => (b.id === id ? { ...b, props: { ...b.props, [key]: value } } : b)));

  const previewUrl = `/s/${siteSlug}/${meta.slug}`;

  return (
    <main className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <a href={`${base}/pages`} className="text-sm text-slate-500 hover:underline">← Pages</a>
          <h1 className="text-xl font-bold">{meta.title} <span className="text-sm font-normal text-slate-400">/{meta.slug}</span></h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{saving ? "Enregistrement…" : dirty ? "Modifications non enregistrées" : savedAt ? `Enregistré à ${savedAt.toLocaleTimeString("fr-FR")}` : ""}</span>
          <button type="button" className="sf-btn-secondary" onClick={() => setShowMeta((s) => !s)}>⚙️ Page</button>
          <a href={previewUrl} target="_blank" className="sf-btn-secondary">👁️ Ouvrir</a>
          <button type="button" className="sf-btn-primary" onClick={doSave} disabled={saving || !dirty}>💾 Enregistrer</button>
        </div>
      </div>

      {showMeta && (
        <div className="sf-card grid gap-3 sm:grid-cols-2">
          <div><label className="sf-label">Titre de la page</label><input className="sf-input" value={meta.title} onChange={(e) => { setMeta({ ...meta, title: e.target.value }); setDirty(true); }} /></div>
          <div><label className="sf-label">Libellé dans le menu</label><input className="sf-input" value={meta.navLabel ?? ""} placeholder={meta.title} onChange={(e) => { setMeta({ ...meta, navLabel: e.target.value }); setDirty(true); }} /></div>
          <div><label className="sf-label">Adresse (slug)</label><input className="sf-input" value={meta.slug} disabled={page.slug === ""} onChange={(e) => { setMeta({ ...meta, slug: e.target.value }); setDirty(true); }} /></div>
          <div className="flex items-end gap-4 pb-2 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={meta.inNav} onChange={(e) => { setMeta({ ...meta, inNav: e.target.checked }); setDirty(true); }} /> Dans le menu</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={meta.published} onChange={(e) => { setMeta({ ...meta, published: e.target.checked }); setDirty(true); }} /> Publiée</label>
          </div>
          <div><label className="sf-label">Titre SEO (onglet navigateur / Google)</label><input className="sf-input" value={meta.seoTitle ?? ""} onChange={(e) => { setMeta({ ...meta, seoTitle: e.target.value }); setDirty(true); }} /></div>
          <div><label className="sf-label">Description SEO</label><input className="sf-input" value={meta.seoDescription ?? ""} onChange={(e) => { setMeta({ ...meta, seoDescription: e.target.value }); setDirty(true); }} /></div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        {/* Colonne gauche : structure */}
        <div className="space-y-3">
          <div className="sf-card !p-3">
            <div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold uppercase text-slate-500">Blocs de la page</span><span className="text-xs text-slate-400">{blocks.length}</span></div>
            <ul className="space-y-1">
              {blocks.map((b, i) => {
                const d = defOf(b.type);
                return (
                  <li key={b.id} className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 text-sm ${sel === b.id ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                    <button type="button" className="flex min-w-0 flex-1 items-center gap-2 text-left" onClick={() => setSel(b.id)}>
                      <span>{d?.icon}</span><span className="truncate">{d?.label ?? b.type}</span>
                    </button>
                    <button type="button" title="Monter" disabled={i === 0} onClick={() => move(b.id, -1)} className="px-1 text-slate-400 hover:text-slate-800 disabled:opacity-30">▲</button>
                    <button type="button" title="Descendre" disabled={i === blocks.length - 1} onClick={() => move(b.id, 1)} className="px-1 text-slate-400 hover:text-slate-800 disabled:opacity-30">▼</button>
                  </li>
                );
              })}
            </ul>
            <button type="button" className="sf-btn-primary mt-3 w-full" onClick={() => setAdding(true)}>+ Ajouter un bloc</button>
          </div>
          {adding && (
            <div className="sf-card !p-3">
              <div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold uppercase text-slate-500">Choisir un bloc</span><button type="button" onClick={() => setAdding(false)} className="text-xs text-slate-500">Fermer</button></div>
              <ul className="space-y-1">
                {catalog.map((d) => (
                  <li key={d.type}>
                    <button type="button" onClick={() => add(d)} className="w-full rounded-lg border border-slate-200 px-2 py-2 text-left hover:border-indigo-300 hover:bg-indigo-50">
                      <div className="text-sm font-medium">{d.icon} {d.label}</div>
                      <div className="text-xs text-slate-500">{d.description}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Colonne droite : propriétés + aperçu */}
        <div className="space-y-4">
          {selected ? (
            <div className="sf-card">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold">{defOf(selected.type)?.icon} {defOf(selected.type)?.label}</h2>
                <div className="flex gap-2">
                  <button type="button" className="sf-btn-secondary !px-3 !py-1.5" onClick={() => duplicate(selected.id)}>Dupliquer</button>
                  <button type="button" className="sf-btn-danger !px-3 !py-1.5" onClick={() => remove(selected.id)}>Supprimer</button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {defOf(selected.type)?.fields.map((f) => (
                  <FieldInput key={f.key} field={f} value={selected.props[f.key]} onChange={(v) => setProp(selected.id, f.key, v)} siteId={siteId} />
                ))}
              </div>
            </div>
          ) : (
            <div className="sf-card text-center text-sm text-slate-500">Sélectionnez un bloc à gauche pour modifier son contenu, ou ajoutez-en un.</div>
          )}
          <div className="sf-card !p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
              <span>Aperçu (mis à jour après enregistrement)</span>
              <button type="button" className="hover:underline" onClick={() => setPreviewKey((k) => k + 1)}>↻ Rafraîchir</button>
            </div>
            <iframe key={previewKey} ref={iframe} src={previewUrl} className="h-[600px] w-full bg-white" title="Aperçu" />
          </div>
        </div>
      </div>
    </main>
  );
}

function FieldInput({ field: f, value, onChange, siteId }: { field: Field; value: unknown; onChange: (v: unknown) => void; siteId: string }) {
  const full = f.type === "textarea" || f.type === "richtext" || f.type === "list" || f.type === "image";
  const wrap = (child: React.ReactNode) => (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="sf-label">{f.label}</label>
      {child}
      {f.help && <p className="mt-1 text-xs text-slate-500">{f.help}</p>}
    </div>
  );
  switch (f.type) {
    case "text": case "url":
      return wrap(<input className="sf-input" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />);
    case "number":
      return wrap(<input type="number" className="sf-input" value={String(value ?? "")} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} />);
    case "color":
      return wrap(<input type="color" className="h-10 w-16" value={String(value || "#000000")} onChange={(e) => onChange(e.target.value)} />);
    case "textarea":
      return wrap(<textarea rows={3} className="sf-input" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />);
    case "richtext":
      return wrap(<>
        <textarea rows={8} className="sf-input font-mono text-xs" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        <p className="mt-1 text-xs text-slate-500">Mise en forme : <code># Titre</code>, <code>## Sous-titre</code>, <code>- élément de liste</code>, <code>**gras**</code>, <code>[lien](https://…)</code>. Une ligne vide = nouveau paragraphe.</p>
      </>);
    case "boolean":
      return (
        <label className="flex items-center gap-2 self-end pb-2 text-sm"><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /> {f.label}</label>
      );
    case "select":
      return wrap(<select className="sf-input" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>{f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>);
    case "image":
      return wrap(<ImageField siteId={siteId} value={String(value ?? "")} onChange={onChange} accept="any" />);
    case "list": {
      const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
      const setItem = (i: number, k: string, v: unknown) => onChange(items.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
      const addItem = () => { const it: Record<string, unknown> = {}; f.fields?.forEach((sf) => (it[sf.key] = sf.default ?? "")); onChange([...items, it]); };
      const moveItem = (i: number, d: -1 | 1) => { const j = i + d; if (j < 0 || j >= items.length) return; const c = [...items]; [c[i], c[j]] = [c[j], c[i]]; onChange(c); };
      return wrap(
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                <span>Élément {i + 1}</span>
                <div className="flex gap-1">
                  <button type="button" onClick={() => moveItem(i, -1)} className="px-1 hover:text-slate-900">▲</button>
                  <button type="button" onClick={() => moveItem(i, 1)} className="px-1 hover:text-slate-900">▼</button>
                  <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="px-1 text-red-600">✕</button>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {f.fields?.map((sf) => (
                  <div key={sf.key} className={sf.type === "textarea" || sf.type === "image" ? "sm:col-span-2" : ""}>
                    <label className="mb-0.5 block text-xs font-medium text-slate-600">{sf.label}</label>
                    {sf.type === "image" ? <ImageField siteId={siteId} value={String(it[sf.key] ?? "")} onChange={(v) => setItem(i, sf.key, v)} />
                      : sf.type === "textarea" ? <textarea rows={2} className="sf-input" value={String(it[sf.key] ?? "")} onChange={(e) => setItem(i, sf.key, e.target.value)} />
                      : <input className="sf-input" value={String(it[sf.key] ?? "")} onChange={(e) => setItem(i, sf.key, e.target.value)} />}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button type="button" className="sf-btn-secondary !px-3 !py-1.5" onClick={addItem}>+ Ajouter</button>
        </div>,
      );
    }
    default:
      return null;
  }
}
