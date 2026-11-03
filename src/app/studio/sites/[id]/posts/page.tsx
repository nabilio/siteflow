import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireSite } from "@/lib/studio";
import { formatDate } from "@/lib/utils";

export default async function PostsPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const { site, base } = await requireSite(id);
  const posts = await prisma.post.findMany({ where: { siteId: site.id }, orderBy: { date: "desc" } });
  return (
    <main className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Actualités & salons</h1><p className="text-sm text-slate-500">Affichés dans les blocs « Actualités / salons » des pages.</p></div>
        <Link href={`${base}/posts/new`} className="sf-btn-primary">+ Nouveau</Link>
      </div>
      {sp.ok && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">✅ Enregistré.</div>}
      <div className="sf-card !p-0 overflow-hidden">
        {posts.length === 0 ? <p className="p-6 text-sm text-slate-500">Rien pour le moment. Ajoutez une actualité ou un salon.</p> : (
          <ul className="divide-y divide-slate-100">
            {posts.map((p) => (
              <li key={p.id} className="flex items-center gap-4 p-3">
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded bg-slate-100">{p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><span className="font-medium">{p.title}</span><span className={`sf-badge ${p.kind === "EVENT" ? "bg-purple-100 text-purple-800" : "bg-sky-100 text-sky-800"}`}>{p.kind === "EVENT" ? "Salon / événement" : "Actualité"}</span>{!p.published && <span className="sf-badge bg-slate-100 text-slate-600">Masqué</span>}</div>
                  <div className="text-xs text-slate-500">{formatDate(p.date)}{p.location ? ` · ${p.location}` : ""}</div>
                </div>
                <Link href={`${base}/posts/${p.id}`} className="sf-btn-secondary !px-3 !py-1.5">Modifier</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
