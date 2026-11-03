import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession, login } from "@/lib/auth";
import { isStudioHost } from "@/lib/site";

export const dynamic = "force-dynamic";

async function loginAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "");
  const s = await login(email, password);
  if (!s) redirect(`/login?erreur=1&next=${encodeURIComponent(next)}`);
  redirect(next || (s.role === "CLIENT" ? "/admin" : "/studio"));
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ erreur?: string; next?: string }> }) {
  const sp = await searchParams;
  const session = await getSession();
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const onStudio = isStudioHost(host) && !process.env.SINGLE_SITE_SLUG;
  if (session) redirect(sp.next || (onStudio ? "/studio" : "/admin"));

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form action={loginAction} className="sf-card w-full max-w-sm space-y-4">
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-black text-white">S</div>
          <h1 className="text-xl font-bold">{onStudio ? "SiteFlow Studio" : "Administration du site"}</h1>
          <p className="text-sm text-slate-500">Connectez-vous pour continuer</p>
        </div>
        {sp.erreur && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">Email ou mot de passe incorrect.</p>}
        <input type="hidden" name="next" value={sp.next || ""} />
        <div>
          <label className="sf-label">Email</label>
          <input className="sf-input" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <label className="sf-label">Mot de passe</label>
          <input className="sf-input" name="password" type="password" required autoComplete="current-password" />
        </div>
        <button className="sf-btn-primary w-full">Se connecter</button>
      </form>
    </main>
  );
}
