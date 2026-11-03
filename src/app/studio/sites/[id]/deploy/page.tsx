import dns from "node:dns/promises";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSite } from "@/lib/studio";
import { setSiteStatusAction } from "@/lib/actions/sites";
import { ClientConfig } from "./ClientConfig";

async function resolveA(host: string) {
  try { return await dns.resolve4(host); } catch { return []; }
}
async function httpsOk(host: string) {
  try {
    const r = await fetch(`https://${host}/`, { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(5000) });
    return r.status > 0;
  } catch { return false; }
}

export default async function DeployPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { site, base, staff } = await requireSite(id);
  if (!staff) redirect(base);
  const ip = process.env.PUBLIC_SERVER_IP || "IP_DU_SERVEUR";
  const domain = site.domain;
  const [aRoot, aWww, https] = domain ? await Promise.all([resolveA(domain), resolveA(`www.${domain.replace(/^www\./, "")}`), httpsOk(domain)]) : [[], [], false];
  const dnsOk = !!domain && (aRoot.includes(ip) || aWww.includes(ip));

  const Step = ({ n, ok, title, children }: { n: number; ok: boolean; title: string; children: React.ReactNode }) => (
    <div className="sf-card flex gap-4">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold ${ok ? "bg-green-500 text-white" : "bg-slate-200 text-slate-600"}`}>{ok ? "✓" : n}</div>
      <div className="min-w-0 flex-1"><h2 className="font-semibold">{title}</h2><div className="mt-2 space-y-2 text-sm text-slate-700">{children}</div></div>
    </div>
  );
  const Cmd = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">{children}</pre>;

  return (
    <main className="space-y-4">
      <div><h1 className="text-2xl font-bold">Mise en ligne</h1><p className="text-sm text-slate-500">Mise en ligne sur le Studio FlowTech : 5 étapes vérifiées automatiquement. Le client a son propre hébergeur ? Voir le bloc « Livrer chez l’hébergeur du client » en bas de page.</p></div>

      <Step n={1} ok={!!domain} title="Définir le domaine du site">
        {domain ? <p>Domaine : <strong>{domain}</strong></p> : <p>Aucun domaine défini.</p>}
        <Link href={`${base}/settings#domaine`} className="sf-btn-secondary !px-3 !py-1.5">Modifier dans Paramètres</Link>
      </Step>

      <Step n={2} ok={dnsOk} title="Pointer le domaine vers l'hébergement (DNS)">
        <p>Chez le registrar du client (Hostinger, OVH, Genious, …), créer deux enregistrements <strong>A</strong> :</p>
        <table className="w-full max-w-md text-left text-xs"><thead><tr className="text-slate-500"><th className="py-1">Type</th><th>Nom</th><th>Valeur</th><th>TTL</th></tr></thead><tbody>
          <tr><td className="py-1">A</td><td>@</td><td><code>{ip}</code></td><td>3600</td></tr>
          <tr><td className="py-1">A</td><td>www</td><td><code>{ip}</code></td><td>3600</td></tr>
        </tbody></table>
        {domain && (
          <p className="text-xs">Vérification actuelle : <code>{domain}</code> → {aRoot.length ? aRoot.join(", ") : "aucune réponse"} · <code>www</code> → {aWww.length ? aWww.join(", ") : "aucune réponse"}. {dnsOk ? "✅ Correct." : "⏳ Pas encore propagé (compter 5 min à 24 h), puis rechargez cette page."}</p>
        )}
      </Step>

      <Step n={3} ok={https} title="Rattacher le domaine à l'hébergement (hPanel)">
        <p>Dans hPanel, ouvrir le site du Studio → <strong>Domains</strong> → ajouter <code>{domain || "www.entreprise.ma"}</code> comme <strong>domaine parqué (alias)</strong>. Le certificat HTTPS est généré automatiquement par Hostinger une fois le DNS propagé.</p>
        <p className="text-xs text-slate-500">À refaire si le domaine change. {domain && (https ? "✅ Le site répond en HTTPS." : "⏳ HTTPS pas encore actif.")}</p>
      </Step>

      <Step n={4} ok={site.status === "PUBLISHED"} title="Publier le site">
        <p>Tant que le site est en brouillon, le domaine affiche « site en préparation ».</p>
        <form action={setSiteStatusAction}>
          <input type="hidden" name="siteId" value={site.id} />
          {site.status === "PUBLISHED" ? <button name="status" value="DRAFT" className="sf-btn-secondary !px-3 !py-1.5">Repasser en brouillon</button> : <button name="status" value="PUBLISHED" className="sf-btn-primary !px-3 !py-1.5">✅ Publier maintenant</button>}
        </form>
      </Step>

      <Step n={5} ok={!!domain && dnsOk && https && site.status === "PUBLISHED"} title="Vérifier et livrer au client">
        <ul className="list-disc space-y-1 pl-5">
          <li>Ouvrir {domain ? <a href={`https://${domain}`} target="_blank" className="text-indigo-600 underline">https://{domain}</a> : "le domaine"} sur mobile et ordinateur.</li>
          <li>Tester le formulaire de contact (le message doit arriver dans <Link href={`${base}/messages`} className="underline">Messages</Link>).</li>
          <li>Communiquer au client son accès : <code>https://{domain || "domaine"}/admin</code> (compte créé dans <Link href={`${base}/users`} className="underline">Accès</Link>).</li>
        </ul>
      </Step>

      <ClientConfig slug={site.slug} siteId={site.id} />
    </main>
  );
}
