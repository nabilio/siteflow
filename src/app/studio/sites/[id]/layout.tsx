import { prisma } from "@/lib/db";
import { requireSite } from "@/lib/studio";
import { SideNav } from "./SideNav";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { site, base, staff } = await requireSite(id);
  const unread = await prisma.message.count({ where: { siteId: site.id, read: false } });
  const items = [
    { href: base, label: "Tableau de bord", icon: "🏠", exact: true },
    { href: `${base}/pages`, label: "Pages", icon: "📄" },
    { href: `${base}/products`, label: "Produits", icon: "📦" },
    { href: `${base}/posts`, label: "Actualités & salons", icon: "📰" },
    { href: `${base}/media`, label: "Médias", icon: "🖼️" },
    { href: `${base}/messages`, label: "Messages", icon: "✉️", badge: unread },
    { href: `${base}/settings`, label: "Paramètres", icon: "⚙️" },
    { href: `${base}/users`, label: "Accès", icon: "👤" },
    ...(staff ? [{ href: `${base}/deploy`, label: "Mise en ligne", icon: "🚀" }] : []),
  ];
  const previewHref = site.domain && site.status === "PUBLISHED" ? `https://${site.domain}` : `/s/${site.slug}`;
  return (
    <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-6 sm:px-6">
      <SideNav items={items} site={{ name: site.name, status: site.status, domain: site.domain }} previewHref={previewHref} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
