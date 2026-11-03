import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/studio";
import { UsersTable } from "@/components/studio/UsersTable";

export default async function UsersPage() {
  const session = await requireStaff();
  const [users, sites] = await Promise.all([
    prisma.user.findMany({ orderBy: [{ role: "asc" }, { createdAt: "asc" }], include: { site: { select: { name: true } } } }),
    prisma.site.findMany({ where: { slug: { not: { startsWith: "tpl-" } } }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <div><h1 className="text-2xl font-bold">Utilisateurs</h1><p className="text-sm text-slate-500">Admins FlowTech (accès à tous les sites) et comptes clients (accès à un seul site).</p></div>
      <UsersTable users={users} base="/studio/users" sites={sites} meId={session.userId} canManageStaff={session.role === "SUPERADMIN"} />
    </main>
  );
}
