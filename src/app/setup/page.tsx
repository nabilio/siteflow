import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession, isStaff } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Premier lancement d'une installation « site autonome » : import du site exporté depuis le Studio. */
export default async function SetupPage({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const single = process.env.SINGLE_SITE_SLUG;
  if (!single) redirect("/login");
  if (await prisma.site.findUnique({ where: { slug: single } })) redirect("/admin");
  const session = await getSession();
  if (!session || !isStaff(session)) redirect("/login?next=/setup");
  const sp = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form action="/api/import" method="post" encType="multipart/form-data" className="sf-card w-full max-w-lg space-y-4">
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-black text-white">S</div>
          <h1 className="text-xl font-bold">Installation du site</h1>
          <p className="text-sm text-slate-500">Dernière étape : importer le fichier exporté depuis le Studio.</p>
        </div>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
          <li>Dans le Studio : site → <strong>Mise en ligne</strong> → <strong>Exporter ce site</strong>.</li>
          <li>Choisir ici le fichier <code>siteflow-….zip</code> obtenu, puis lancer l'import.</li>
        </ol>
        {sp.erreur && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">L'import a échoué. Vérifiez que le fichier est bien un export SiteFlow.</p>}
        <input type="file" name="file" accept=".zip" required className="sf-input" />
        <button className="sf-btn-primary w-full">Importer et ouvrir le site</button>
      </form>
    </main>
  );
}
