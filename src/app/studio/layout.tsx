import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSession, isStaff } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const h = await headers();
  const clientDomain = h.get("x-sf-admin-base") === "/admin";
  if (!session) redirect(`/login?next=${clientDomain ? "/admin" : "/studio"}`);
  const staff = isStaff(session);
  const home = clientDomain ? "/admin" : staff ? "/studio" : `/studio/sites/${session.siteId}`;

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-2.5 sm:px-6">
          <Link href={home} className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">S</span>
            <span>{clientDomain ? "Administration du site" : "SiteFlow Studio"}</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm sm:gap-3">
            {staff && !clientDomain && (
              <>
                <Link href="/studio" className="rounded-lg px-2 py-1.5 font-medium text-slate-600 hover:bg-slate-100 sm:px-3">Sites</Link>
                <Link href="/studio/users" className="hidden rounded-lg px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 md:block">Utilisateurs</Link>
                <Link href="/studio/guide" className="hidden rounded-lg px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 md:block">Guide</Link>
              </>
            )}
            <span className="hidden text-slate-500 lg:inline">{session.name}</span>
            <a href="/logout" className="sf-btn-secondary !px-2 !py-1.5 sm:!px-3" title="Déconnexion"><span className="hidden sm:inline">Déconnexion</span><span className="sm:hidden">⎋</span></a>
          </nav>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
