import { publicUrl } from "@/lib/url";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Routage par domaine :
 *  - Domaine du Studio (STUDIO_HOSTS)      → application telle quelle (/studio, /login, /s/<slug> aperçu…)
 *  - Tout autre domaine (site client)      → /sf-site/... (rendu public)
 *      - /admin/...                        → /studio/sites/_host/... (back-office du client sur son domaine)
 *  - Mode site unique (SINGLE_SITE_SLUG)   → même logique que domaine client, pour tout hôte.
 */
export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").toLowerCase();
  const single = !!process.env.SINGLE_SITE_SLUG;
  const studio = !single && isStudioHost(host);

  if (studio) return NextResponse.next();

  const p = url.pathname;
  // Ressources partagées
  if (p.startsWith("/api/") || p.startsWith("/uploads/") || p.startsWith("/sf-site/") || p.startsWith("/s/") || p === "/login" || p === "/logout" || p === "/setup") {
    return NextResponse.next();
  }

  // Back-office client sur son propre domaine
  if (p === "/admin" || p.startsWith("/admin/")) {
    const rest = p.slice("/admin".length);
    const target = url.clone();
    target.pathname = `/studio/sites/_host${rest}`;
    const reqHeaders = new Headers(req.headers);
    reqHeaders.set("x-sf-admin-base", "/admin");
    return NextResponse.rewrite(target, { request: { headers: reqHeaders } });
  }
  if (p === "/studio" || p.startsWith("/studio/")) {
    // Le Studio n'est pas exposé sur les domaines clients
    return NextResponse.redirect(publicUrl(req, "/admin"));
  }

  const target = url.clone();
  target.pathname = `/sf-site${p === "/" ? "" : p}`;
  return NextResponse.rewrite(target);
}

function isStudioHost(host: string) {
  const list = (process.env.STUDIO_HOSTS || "localhost:3000,localhost")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  const bare = host.replace(/:\d+$/, "");
  return list.some((s) => s === host || s === bare || s.replace(/:\d+$/, "") === bare);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map|txt|xml|woff2?)$).*)"],
};
