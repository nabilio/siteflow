"use client";
import { useState } from "react";

const rand = (bytes: number) => Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (b) => b.toString(16).padStart(2, "0")).join("");
const pwd = () => {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(14)), (b) => chars[b % chars.length]).join("") + "!7";
};

/** Génère les variables d'environnement à coller chez l'hébergeur du client. Rien n'est envoyé : tout reste dans le navigateur. */
export function ClientConfig({ slug, siteId }: { slug: string; siteId: string }) {
  const [id, setId] = useState(slug.replace(/^tpl-/, ""));
  const [db, setDb] = useState({ name: "", user: "", pass: "" });
  const [admin, setAdmin] = useState({ email: "", pass: "" });
  const [secret, setSecret] = useState("");
  const [copied, setCopied] = useState(false);
  const s = secret || "(cliquer sur « Générer »)";
  const text = [
    `DATABASE_URL=mysql://${db.user || "UTILISATEUR"}:${encodeURIComponent(db.pass) || "MOTDEPASSE"}@127.0.0.1:3306/${db.name || "NOMBASE"}`,
    `SESSION_SECRET=${s}`,
    `SINGLE_SITE_SLUG=${id || "entreprise"}`,
    `SEED_ADMIN_EMAIL=${admin.email || "admin@exemple.ma"}`,
    `SEED_ADMIN_PASSWORD=${admin.pass || "(cliquer sur « Générer »)"}`,
  ].join("\n");
  const copy = async () => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* sélection manuelle */ } };

  return (
    <div className="sf-card space-y-4">
      <div>
        <h2 className="font-semibold">🏠 Livrer chez l'hébergeur du client</h2>
        <p className="mt-1 text-sm text-slate-700">Le client a son propre hébergement ? Trois éléments à préparer, puis suivre le <a href="/studio/guide/installation" className="text-indigo-600 underline">guide d'installation pas à pas</a>.</p>
      </div>
      <ol className="space-y-3 text-sm text-slate-700">
        <li><strong>1. Exporter le site</strong> (contenu + images) : <a href={`/api/export?siteId=${siteId}`} className="sf-btn-secondary ml-1 !px-3 !py-1.5">⬇️ Exporter ce site</a></li>
        <li><strong>2. Récupérer le code</strong> : <a className="text-indigo-600 underline" href="https://github.com/nabilio/siteflow/archive/refs/heads/main.zip">code.zip</a> ou le dépôt <code>github.com/nabilio/siteflow</code> (branche <code>main</code>).</li>
        <li>
          <strong>3. Générer la configuration</strong> à coller dans les variables d'environnement de l'hébergeur (après avoir créé la base chez lui).
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div><label className="sf-label">Identifiant du site</label><input className="sf-input" value={id} onChange={(e) => setId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} /></div>
            <div><label className="sf-label">Nom de la base</label><input className="sf-input" value={db.name} onChange={(e) => setDb({ ...db, name: e.target.value })} placeholder="u123456789_site" /></div>
            <div><label className="sf-label">Utilisateur de la base</label><input className="sf-input" value={db.user} onChange={(e) => setDb({ ...db, user: e.target.value })} /></div>
            <div><label className="sf-label">Mot de passe de la base</label><input className="sf-input" value={db.pass} onChange={(e) => setDb({ ...db, pass: e.target.value })} /></div>
            <div><label className="sf-label">E-mail du compte administrateur</label><input className="sf-input" type="email" value={admin.email} onChange={(e) => setAdmin({ ...admin, email: e.target.value })} /></div>
            <div className="flex items-end"><button type="button" className="sf-btn-secondary" onClick={() => { setSecret(rand(32)); setAdmin((a) => ({ ...a, pass: pwd() })); }}>🔑 Générer clé secrète et mot de passe</button></div>
          </div>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-slate-900 p-3 text-xs text-slate-100">{text}</pre>
          <button type="button" className="sf-btn-secondary mt-2 !px-3 !py-1.5" onClick={copy}>{copied ? "✅ Copié" : "📋 Copier"}</button>
          <p className="mt-2 text-xs text-slate-500">Rien n'est envoyé ni enregistré : ces valeurs restent dans votre navigateur. Notez le mot de passe administrateur avant de quitter la page.</p>
        </li>
      </ol>
    </div>
  );
}
