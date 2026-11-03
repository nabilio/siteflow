import { prisma } from "@/lib/db";
import { requireSite } from "@/lib/studio";
import { deleteMediaAction } from "@/lib/actions/content";
import { Uploader } from "./Uploader";

export default async function MediaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { site, base } = await requireSite(id);
  const media = await prisma.media.findMany({ where: { siteId: site.id }, orderBy: { createdAt: "desc" } });
  const total = media.reduce((a, m) => a + m.size, 0);
  return (
    <main className="space-y-6">
      <div><h1 className="text-2xl font-bold">Médias</h1><p className="text-sm text-slate-500">{media.length} fichier{media.length > 1 ? "s" : ""} · {(total / 1024 / 1024).toFixed(1)} Mo. Images, PDF et vidéos (max 50 Mo). Utilisez uniquement des visuels dont vous détenez les droits.</p></div>
      <Uploader siteId={site.id} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {media.map((m) => (
          <div key={m.id} className="sf-card !p-2">
            <div className="aspect-square overflow-hidden rounded-lg bg-slate-100">
              {m.mime.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
              ) : <div className="flex h-full items-center justify-center text-3xl">{m.mime === "application/pdf" ? "📄" : "🎬"}</div>}
            </div>
            <div className="mt-2 truncate text-xs" title={m.name}>{m.name}</div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{(m.size / 1024).toFixed(0)} Ko</span>
              <div className="flex gap-2">
                <a href={m.url} target="_blank" className="hover:text-slate-800">Ouvrir</a>
                <form action={deleteMediaAction}><input type="hidden" name="siteId" value={site.id} /><input type="hidden" name="base" value={`${base}/media`} /><input type="hidden" name="id" value={m.id} /><button className="text-red-500">Suppr.</button></form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
