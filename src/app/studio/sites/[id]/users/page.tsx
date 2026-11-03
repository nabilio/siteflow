import { prisma } from "@/lib/db";
import { requireSite } from "@/lib/studio";
import { UsersTable } from "@/components/studio/UsersTable";

export default async function SiteUsersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { site, base, session } = await requireSite(id);
  const users = await prisma.user.findMany({ where: { siteId: site.id }, orderBy: { createdAt: "asc" } });
  const adminUrl = site.domain ? `https://${site.domain}/admin` : "(domaine non défini) → /admin";
  return (
    <main className="space-y-6">
      <div><h1 className="text-2xl font-bold">Accès client</h1><p className="text-sm text-slate-500">Ces comptes se connectent sur <code className="rounded bg-slate-100 px-1">{adminUrl}</code> et gèrent uniquement le contenu de ce site.</p></div>
      <UsersTable users={users} base={`${base}/users`} siteId={site.id} meId={session.userId} canManageStaff={false} />
    </main>
  );
}
