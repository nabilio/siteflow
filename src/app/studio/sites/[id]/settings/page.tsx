import { requireSite } from "@/lib/studio";
import { deleteSiteAction, duplicateSiteAction, updateSiteSettingsAction } from "@/lib/actions/sites";
import { ImageField } from "@/components/studio/ImageField";
import { themeOf } from "@/lib/site";
import { FONTS } from "@/lib/templates";

export default async function SettingsPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; erreur?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const { site, base, staff } = await requireSite(id);
  const t = themeOf(site);
  const socials = (site.socials ?? {}) as Record<string, string>;
  return (
    <main className="space-y-6">
      <div><h1 className="text-2xl font-bold">Paramètres</h1><p className="text-sm text-slate-500">Identité, apparence, coordonnées et référencement.</p></div>
      {sp.ok && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">✅ Paramètres enregistrés.</div>}
      {sp.erreur === "domaine" && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">Ce domaine est déjà utilisé par un autre site. Les autres modifications n'ont pas été enregistrées.</div>}
      {sp.erreur === "confirm" &&<div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">Pour supprimer, tapez exactement SUPPRIMER.</div>}

      <form action={updateSiteSettingsAction} className="space-y-6">
        <input type="hidden" name="siteId" value={site.id} /><input type="hidden" name="base" value={base} />

        <section className="sf-card grid gap-4 sm:grid-cols-2">
          <h2 className="font-semibold sm:col-span-2">Identité</h2>
          <div><label className="sf-label">Nom</label><input name="name" defaultValue={site.name} required className="sf-input" /></div>
          <div><label className="sf-label">Slogan</label><input name="tagline" defaultValue={site.tagline ?? ""} className="sf-input" /></div>
          <ImageField siteId={site.id} name="logoUrl" value={site.logoUrl ?? ""} label="Logo (PNG ou SVG, fond transparent de préférence)" />
          <ImageField siteId={site.id} name="faviconUrl" value={site.faviconUrl ?? ""} label="Favicon (icône d'onglet, PNG carré)" />
          <div className="sm:col-span-2"><label className="sf-label">Texte du pied de page</label><input name="footerText" defaultValue={site.footerText ?? ""} className="sf-input" placeholder="Ex : Société au capital de… · RC Casablanca…" /></div>
        </section>

        <section className="sf-card grid gap-4 sm:grid-cols-3">
          <h2 className="font-semibold sm:col-span-3">Apparence</h2>
          <div><label className="sf-label">Couleur principale</label><div className="flex items-center gap-2"><input type="color" name="primary" defaultValue={t.primary} className="h-10 w-14" /><span className="text-xs text-slate-500">boutons, liens</span></div></div>
          <div><label className="sf-label">Couleur secondaire</label><div className="flex items-center gap-2"><input type="color" name="accent" defaultValue={t.accent} className="h-10 w-14" /><span className="text-xs text-slate-500">bandeaux d'appel à l'action</span></div></div>
          <div><label className="sf-label">Couleur sombre</label><div className="flex items-center gap-2"><input type="color" name="dark" defaultValue={t.dark} className="h-10 w-14" /><span className="text-xs text-slate-500">pied de page</span></div></div>
          <div><label className="sf-label">Police</label><select name="font" defaultValue={t.font} className="sf-input">{FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}</select></div>
          <div><label className="sf-label">Coins arrondis</label><select name="radius" defaultValue={t.radius} className="sf-input"><option value="none">Carrés</option><option value="md">Légèrement arrondis</option><option value="xl">Très arrondis</option></select></div>
          <div><label className="sf-label">Style de l'en-tête</label><select name="headerStyle" defaultValue={t.headerStyle} className="sf-input"><option value="light">Clair</option><option value="dark">Sombre</option><option value="transparent">Transparent sur la bannière</option></select></div>
        </section>

        <section className="sf-card grid gap-4 sm:grid-cols-2">
          <h2 className="font-semibold sm:col-span-2">Coordonnées</h2>
          <div><label className="sf-label">Téléphone</label><input name="phone" defaultValue={site.phone ?? ""} className="sf-input" /></div>
          <div><label className="sf-label">WhatsApp (numéro international, ex : +212600000000)</label><input name="whatsapp" defaultValue={site.whatsapp ?? ""} className="sf-input" /><p className="mt-1 text-xs text-slate-500">Si renseigné, un bouton WhatsApp flottant apparaît sur le site.</p></div>
          <div><label className="sf-label">Email de contact</label><input name="contactEmail" type="email" defaultValue={site.contactEmail ?? ""} className="sf-input" /></div>
          <div><label className="sf-label">Adresse</label><input name="address" defaultValue={site.address ?? ""} className="sf-input" /></div>
          <div className="sm:col-span-2"><label className="sf-label">Carte Google Maps (lien d'intégration « embed »)</label><input name="mapEmbedUrl" defaultValue={site.mapEmbedUrl ?? ""} className="sf-input" placeholder="https://www.google.com/maps/embed?pb=…" /><p className="mt-1 text-xs text-slate-500">Google Maps → Partager → Intégrer une carte → copier uniquement l'adresse dans src="…".</p></div>
          {["facebook", "instagram", "linkedin", "tiktok", "youtube", "x"].map((k) => (
            <div key={k}><label className="sf-label capitalize">{k}</label><input name={`social_${k}`} defaultValue={socials[k] ?? ""} className="sf-input" placeholder="https://…" /></div>
          ))}
        </section>

        <section className="sf-card grid gap-4 sm:grid-cols-2">
          <h2 className="font-semibold sm:col-span-2">Référencement (SEO)</h2>
          <div><label className="sf-label">Titre du site (Google, onglet)</label><input name="seoTitle" defaultValue={site.seoTitle ?? ""} className="sf-input" /></div>
          <div><label className="sf-label">Description (Google)</label><input name="seoDescription" defaultValue={site.seoDescription ?? ""} className="sf-input" maxLength={160} /></div>
        </section>

        {staff && (
          <section id="domaine" className="sf-card grid gap-4 sm:grid-cols-3">
            <h2 className="font-semibold sm:col-span-3">Domaine & publication <span className="sf-badge ml-2 bg-slate-100 text-slate-600">réservé aux admins</span></h2>
            <div><label className="sf-label">Domaine du site</label><input name="domain" defaultValue={site.domain ?? ""} className="sf-input" placeholder="www.entreprise.ma" /><p className="mt-1 text-xs text-slate-500">Sans http. Le site répond à ce domaine avec et sans www.</p></div>
            <div><label className="sf-label">Identifiant (slug)</label><input name="slug" defaultValue={site.slug} className="sf-input" /><p className="mt-1 text-xs text-slate-500">Aperçu : /s/{site.slug}</p></div>
            <div><label className="sf-label">État</label><select name="status" defaultValue={site.status} className="sf-input"><option value="DRAFT">Brouillon (invisible)</option><option value="PUBLISHED">En ligne</option><option value="ARCHIVED">Archivé</option></select></div>
          </section>
        )}

        <div className="flex justify-end"><button className="sf-btn-primary">💾 Enregistrer les paramètres</button></div>
      </form>

      {staff && (
        <section className="sf-card space-y-4">
          <h2 className="font-semibold text-red-700">Zone sensible</h2>
          <div className="flex flex-wrap items-center gap-3">
            <form action={duplicateSiteAction}><input type="hidden" name="siteId" value={site.id} /><button className="sf-btn-secondary">📋 Dupliquer ce site</button></form>
            <form action={deleteSiteAction} className="flex items-center gap-2">
              <input type="hidden" name="siteId" value={site.id} />
              <input name="confirm" placeholder="Tapez SUPPRIMER" className="sf-input w-44" />
              <button className="sf-btn-danger">Supprimer définitivement</button>
            </form>
          </div>
        </section>
      )}
    </main>
  );
}
