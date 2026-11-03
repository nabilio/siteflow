import { requireStaff } from "@/lib/studio";
import { BLOCKS } from "@/lib/blocks";
import { TEMPLATES } from "@/lib/templates";

export default async function GuidePage() {
  await requireStaff();
  const ip = process.env.PUBLIC_SERVER_IP || "IP_DU_SERVEUR";
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6">
      <div><h1 className="text-2xl font-bold">Guide de l'admin</h1><p className="text-sm text-slate-500">Comment créer et livrer un site client en 30 minutes, sans code.</p></div>

      <section className="sf-card space-y-3">
        <h2 className="text-lg font-semibold">1. Créer le site (5 min)</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
          <li><strong>Sites → Nouveau site</strong> : choisir le modèle le plus proche de l'activité du client.</li>
          <li>Saisir le nom, le slogan, les couleurs (prendre celles du logo du client), téléphone, email, adresse.</li>
          <li>Créer tout de suite le compte du client (email + mot de passe) si vous avez l'info.</li>
          <li>Cliquer <strong>Créer le site</strong>. Le site existe avec ses pages pré-remplies.</li>
        </ol>
      </section>

      <section className="sf-card space-y-3">
        <h2 className="text-lg font-semibold">2. Personnaliser (20 min)</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
          <li><strong>Paramètres</strong> : logo, favicon, WhatsApp, réseaux sociaux, carte Google Maps, texte du pied de page.</li>
          <li><strong>Médias</strong> : importer les photos du client (uniquement des visuels dont il détient les droits).</li>
          <li><strong>Produits</strong> : créer les catégories puis les produits (image, résumé, fiche PDF). Cocher « mis en avant » pour l'accueil.</li>
          <li><strong>Actualités & salons</strong> : ajouter les salons à venir avec image et lien.</li>
          <li><strong>Pages → Accueil → Modifier</strong> : adapter les textes de chaque bloc. Ajouter / supprimer / réordonner les blocs. Enregistrer (Ctrl+S).</li>
          <li>Vérifier le rendu avec <strong>Voir le site</strong> (aperçu), sur mobile aussi.</li>
        </ol>
      </section>

      <section className="sf-card space-y-3">
        <h2 className="text-lg font-semibold">3. Mettre en ligne (5 min + propagation DNS)</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
          <li><strong>Paramètres → Domaine</strong> : saisir le domaine du client (ex : <code>www.entreprise.ma</code>).</li>
          <li>Chez le registrar du client : enregistrements A <code>@</code> et <code>www</code> → <code>{ip}</code>.</li>
          <li>Sur le serveur : <code>sudo /opt/siteflow/deploy/add-domain.sh www.entreprise.ma</code> (certificat HTTPS).</li>
          <li><strong>Mise en ligne → Publier</strong>. La page « Mise en ligne » vérifie chaque étape automatiquement.</li>
          <li>Envoyer au client : l'adresse du site et son accès <code>https://www.entreprise.ma/admin</code>.</li>
        </ol>
      </section>

      <section className="sf-card space-y-3">
        <h2 className="text-lg font-semibold">Les modèles disponibles</h2>
        <ul className="space-y-2 text-sm">
          {TEMPLATES.map((t) => <li key={t.id}><strong>{t.name}</strong> <span className="text-slate-500">({t.sector})</span> — {t.description}</li>)}
        </ul>
      </section>

      <section className="sf-card space-y-3">
        <h2 className="text-lg font-semibold">Les blocs disponibles</h2>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {BLOCKS.map((b) => <li key={b.type} className="rounded-lg bg-slate-50 p-2"><strong>{b.icon} {b.label}</strong><div className="text-slate-600">{b.description}</div></li>)}
        </ul>
        <p className="text-xs text-slate-500">Un nouveau type de bloc = une entrée dans <code>src/lib/blocks.ts</code> (le formulaire) + un cas dans <code>src/components/site/Blocks.tsx</code> (le rendu).</p>
      </section>

      <section className="sf-card space-y-3">
        <h2 className="text-lg font-semibold">Questions fréquentes</h2>
        <dl className="space-y-3 text-sm">
          <div><dt className="font-semibold">Le client veut son propre hébergement.</dt><dd className="text-slate-700">Mise en ligne → Exporter. Puis suivre <code>docs/PROCEDURE-SITE-AUTONOME.md</code> : l'application s'installe en mode site unique sur un VPS Hostinger (ou tout serveur Node + MySQL).</dd></div>
          <div><dt className="font-semibold">Un bloc n'apparaît pas sur le site.</dt><dd className="text-slate-700">Les blocs Produits, Actualités, Galerie et Équipe sont masqués automatiquement s'ils sont vides. Ajoutez du contenu.</dd></div>
          <div><dt className="font-semibold">Le domaine affiche « Aucun site configuré ».</dt><dd className="text-slate-700">Le domaine saisi dans Paramètres doit correspondre exactement (avec ou sans www, les deux fonctionnent).</dd></div>
          <div><dt className="font-semibold">Le client a oublié son mot de passe.</dt><dd className="text-slate-700">Site → Accès → Modifier → saisir un nouveau mot de passe.</dd></div>
        </dl>
      </section>
    </main>
  );
}
