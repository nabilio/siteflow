import { deleteUserAction, saveUserAction } from "@/lib/actions/content";

type U = { id: string; email: string; name: string; role: string; siteId: string | null; site?: { name: string } | null };
const ROLE: Record<string, string> = { SUPERADMIN: "Super admin", ADMIN: "Admin FlowTech", CLIENT: "Client" };

export function UsersTable({ users, base, siteId, sites, meId, canManageStaff }: {
  users: U[]; base: string; siteId?: string; sites?: { id: string; name: string }[]; meId: string; canManageStaff: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="sf-card !p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500"><tr><th className="p-3">Utilisateur</th><th className="p-3">Rôle</th>{!siteId && <th className="p-3">Site</th>}<th className="p-3"></th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="p-3"><div className="font-medium">{u.name}</div><div className="text-xs text-slate-500">{u.email}</div></td>
                <td className="p-3"><span className="sf-badge bg-slate-100 text-slate-700">{ROLE[u.role] ?? u.role}</span></td>
                {!siteId && <td className="p-3 text-slate-600">{u.site?.name ?? "—"}</td>}
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <details className="relative">
                      <summary className="sf-btn-secondary !px-3 !py-1.5 list-none">Modifier</summary>
                      <form action={saveUserAction} className="absolute right-0 z-10 mt-1 w-72 space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                        <input type="hidden" name="id" value={u.id} /><input type="hidden" name="base" value={base} />
                        <input type="hidden" name="siteId" value={siteId ?? u.siteId ?? ""} />
                        <input name="name" defaultValue={u.name} className="sf-input" placeholder="Nom" />
                        <input name="email" defaultValue={u.email} className="sf-input" placeholder="Email" />
                        <input name="password" className="sf-input" placeholder="Nouveau mot de passe (vide = inchangé)" />
                        {canManageStaff ? (
                          <select name="role" defaultValue={u.role} className="sf-input"><option value="CLIENT">Client</option><option value="ADMIN">Admin FlowTech</option><option value="SUPERADMIN">Super admin</option></select>
                        ) : <input type="hidden" name="role" value="CLIENT" />}
                        <button className="sf-btn-primary w-full">Enregistrer</button>
                      </form>
                    </details>
                    {u.id !== meId && (
                      <form action={deleteUserAction}><input type="hidden" name="id" value={u.id} /><input type="hidden" name="base" value={base} /><button className="sf-btn-danger !px-3 !py-1.5">Supprimer</button></form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-slate-500">Aucun utilisateur.</td></tr>}
          </tbody>
        </table>
      </div>
      <form action={saveUserAction} className="sf-card grid gap-3 sm:grid-cols-5">
        <h2 className="font-semibold sm:col-span-5">Ajouter un accès</h2>
        <input type="hidden" name="base" value={base} />
        <input name="name" placeholder="Nom" className="sf-input" />
        <input name="email" type="email" placeholder="Email" required className="sf-input" />
        <input name="password" placeholder="Mot de passe" required className="sf-input" />
        {siteId ? (
          <><input type="hidden" name="siteId" value={siteId} /><input type="hidden" name="role" value="CLIENT" /><div className="sf-input bg-slate-50 text-slate-500">Client de ce site</div></>
        ) : (
          <div className="flex gap-2">
            <select name="role" className="sf-input"><option value="ADMIN">Admin FlowTech</option>{canManageStaff && <option value="SUPERADMIN">Super admin</option>}<option value="CLIENT">Client</option></select>
            <select name="siteId" className="sf-input"><option value="">— Site (clients) —</option>{sites?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
          </div>
        )}
        <button className="sf-btn-primary">+ Ajouter</button>
      </form>
    </div>
  );
}
