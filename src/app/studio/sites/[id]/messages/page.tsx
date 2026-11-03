import { prisma } from "@/lib/db";
import { requireSite } from "@/lib/studio";
import { deleteMessageAction, toggleMessageAction } from "@/lib/actions/content";
import { formatDate } from "@/lib/utils";

export default async function MessagesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { site, base } = await requireSite(id);
  const messages = await prisma.message.findMany({ where: { siteId: site.id }, orderBy: { createdAt: "desc" } });
  return (
    <main className="space-y-6">
      <div><h1 className="text-2xl font-bold">Messages reçus</h1><p className="text-sm text-slate-500">Formulaire de contact du site.</p></div>
      {messages.length === 0 ? <div className="sf-card text-sm text-slate-500">Aucun message.</div> : messages.map((m) => (
        <div key={m.id} className={`sf-card ${m.read ? "" : "border-indigo-300"}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="font-semibold">{m.name} {!m.read && <span className="sf-badge ml-1 bg-indigo-100 text-indigo-700">Nouveau</span>}</div>
              <div className="text-xs text-slate-500">
                {formatDate(m.createdAt)}{m.email && <> · <a href={`mailto:${m.email}`} className="underline">{m.email}</a></>}{m.phone && <> · <a href={`tel:${m.phone}`} className="underline">{m.phone}</a></>}
              </div>
            </div>
            <div className="flex gap-2">
              <form action={toggleMessageAction}><input type="hidden" name="siteId" value={site.id} /><input type="hidden" name="base" value={`${base}/messages`} /><input type="hidden" name="id" value={m.id} /><button className="sf-btn-secondary !px-3 !py-1.5">{m.read ? "Marquer non lu" : "Marquer lu"}</button></form>
              <form action={deleteMessageAction}><input type="hidden" name="siteId" value={site.id} /><input type="hidden" name="base" value={`${base}/messages`} /><input type="hidden" name="id" value={m.id} /><button className="sf-btn-danger !px-3 !py-1.5">Supprimer</button></form>
            </div>
          </div>
          {m.subject && <div className="mt-2 text-sm font-medium">{m.subject}</div>}
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{m.message}</p>
        </div>
      ))}
    </main>
  );
}
