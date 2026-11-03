"use client";
import { useState } from "react";
import type { Theme } from "@/lib/templates";

type T = { id: string; name: string; sector: string; description: string; theme: Theme; pages: string[]; highlights: string[]; preview: string; hasSamples: boolean };

export function NewSiteForm({ templates, action, initial }: { templates: T[]; action: (fd: FormData) => Promise<void>; initial?: string }) {
  const first = templates.find((t) => t.id === initial) ?? templates[0];
  const [tpl, setTpl] = useState(first);
  const [primary, setPrimary] = useState(first.theme.primary);
  const [accent, setAccent] = useState(first.theme.accent);
  const [name, setName] = useState("");
  const [step, setStep] = useState(1);

  const pick = (t: T) => { setTpl(t); setPrimary(t.theme.primary); setAccent(t.theme.accent); };

  return (
    <form action={action} className="mt-6 space-y-6">
      <ol className="flex gap-2 text-sm">
        {["Modèle", "Identité", "Accès"].map((l, i) => (
          <li key={l} className={`flex items-center gap-2 rounded-full px-3 py-1 ${step === i + 1 ? "bg-indigo-600 text-white" : "bg-white text-slate-500"}`}>
            <span className="font-bold">{i + 1}</span> {l}
          </li>
        ))}
      </ol>

      {/* Étape 1 */}
      <section className={step === 1 ? "" : "hidden"}>
        <input type="hidden" name="template" value={tpl.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          {templates.map((t) => (
            <div role="button" tabIndex={0} key={t.id} onClick={() => pick(t)} onKeyDown={(e) => e.key === "Enter" && pick(t)} className={`sf-card cursor-pointer text-left transition ${tpl.id === t.id ? "ring-2 ring-indigo-500" : "hover:border-slate-300"}`}>
              {t.id !== "vierge" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.preview} alt="" className="aspect-[16/10] w-full rounded-lg object-cover" />
              ) : (
                <div className="flex aspect-[16/10] w-full items-center justify-center rounded-lg bg-slate-100 text-3xl text-slate-400">＋</div>
              )}
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="font-semibold">{t.name}</div>
                <div className="flex gap-1"><span className="h-4 w-4 rounded" style={{ background: t.theme.primary }} /><span className="h-4 w-4 rounded" style={{ background: t.theme.accent }} /></div>
              </div>
              <div className="text-xs text-slate-500">{t.sector}</div>
              <p className="mt-2 text-sm text-slate-600">{t.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {t.pages.map((p) => <span key={p} className="sf-badge bg-slate-100 text-slate-600">{p}</span>)}
              </div>
              {t.id !== "vierge" && <a href={`/studio/templates/${t.id}`} target="_blank" onClick={(e) => e.stopPropagation()} className="mt-3 inline-block text-sm font-semibold text-indigo-600 hover:underline">👁 Visualiser ce modèle</a>}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button type="button" className="sf-btn-primary" onClick={() => setStep(2)}>Continuer →</button>
        </div>
      </section>

      {/* Étape 2 */}
      <section className={step === 2 ? "sf-card space-y-4" : "hidden"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="sf-label">Nom de l'entreprise / du site *</label>
            <input className="sf-input" name="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex : Atlas Distribution" />
          </div>
          <div className="sm:col-span-2">
            <label className="sf-label">Slogan (optionnel)</label>
            <input className="sf-input" name="tagline" placeholder="Ex : Tubes, raccords et solutions techniques depuis 2005" />
          </div>
          <div>
            <label className="sf-label">Couleur principale</label>
            <div className="flex items-center gap-2">
              <input type="color" name="primary" value={primary} onChange={(e) => setPrimary(e.target.value)} className="h-10 w-14 cursor-pointer rounded border" />
              <span className="text-sm text-slate-500">{primary}</span>
            </div>
          </div>
          <div>
            <label className="sf-label">Couleur secondaire</label>
            <div className="flex items-center gap-2">
              <input type="color" name="accent" value={accent} onChange={(e) => setAccent(e.target.value)} className="h-10 w-14 cursor-pointer rounded border" />
              <span className="text-sm text-slate-500">{accent}</span>
            </div>
          </div>
          <div>
            <label className="sf-label">Téléphone</label>
            <input className="sf-input" name="phone" placeholder="+212 5 22 00 00 00" />
          </div>
          <div>
            <label className="sf-label">Email de contact</label>
            <input className="sf-input" name="contactEmail" type="email" placeholder="contact@entreprise.ma" />
          </div>
          <div className="sm:col-span-2">
            <label className="sf-label">Adresse</label>
            <input className="sf-input" name="address" placeholder="Zone industrielle, Casablanca" />
          </div>
          <div>
            <label className="sf-label">Domaine (optionnel, modifiable plus tard)</label>
            <input className="sf-input" name="domain" placeholder="www.entreprise.ma" />
          </div>
          <div>
            <label className="sf-label">Identifiant technique (slug)</label>
            <input className="sf-input" name="slug" placeholder={name ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "auto"} />
          </div>
          {tpl.hasSamples && (
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input type="checkbox" name="samples" defaultChecked /> Ajouter des produits d'exemple pour visualiser le rendu (à remplacer ensuite)
            </label>
          )}
        </div>

        {/* Aperçu couleurs */}
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-2 text-xs font-semibold uppercase text-slate-500">Aperçu</div>
          <div className="overflow-hidden rounded-lg border">
            <div className="flex items-center justify-between bg-white px-4 py-2 text-sm">
              <span className="flex items-center gap-2 font-bold"><span className="flex h-7 w-7 items-center justify-center rounded-md text-white" style={{ background: primary }}>{(name || "S").charAt(0).toUpperCase()}</span>{name || "Votre site"}</span>
              <span className="rounded px-3 py-1 text-xs font-semibold text-white" style={{ background: primary }}>Contact</span>
            </div>
            <div className="p-6 text-white" style={{ background: `linear-gradient(135deg, ${primary}, ${tpl.theme.dark})` }}>
              <div className="text-xl font-extrabold">Votre partenaire de confiance</div>
              <div className="mt-1 text-sm opacity-80">Un texte d'accroche que vous modifierez ensuite.</div>
              <div className="mt-3 flex gap-2"><span className="rounded px-3 py-1 text-xs font-semibold" style={{ background: primary }}>Découvrir</span><span className="rounded px-3 py-1 text-xs font-semibold" style={{ background: accent }}>Devis</span></div>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <button type="button" className="sf-btn-secondary" onClick={() => setStep(1)}>← Retour</button>
          <button type="button" className="sf-btn-primary" disabled={!name.trim()} onClick={() => setStep(3)}>Continuer →</button>
        </div>
      </section>

      {/* Étape 3 */}
      <section className={step === 3 ? "sf-card space-y-4" : "hidden"}>
        <h2 className="font-semibold">Accès du client (optionnel)</h2>
        <p className="text-sm text-slate-600">Créez un compte pour que le client gère lui-même ses produits, actualités et photos depuis <code>son-domaine/admin</code>. Vous pourrez l'ajouter plus tard.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="sf-label">Email du client</label>
            <input className="sf-input" name="clientEmail" type="email" placeholder="gerant@entreprise.ma" />
          </div>
          <div>
            <label className="sf-label">Mot de passe initial</label>
            <input className="sf-input" name="clientPassword" type="text" placeholder="À communiquer au client" />
          </div>
        </div>
        <div className="flex justify-between">
          <button type="button" className="sf-btn-secondary" onClick={() => setStep(2)}>← Retour</button>
          <button className="sf-btn-primary">🚀 Créer le site</button>
        </div>
      </section>
    </form>
  );
}
