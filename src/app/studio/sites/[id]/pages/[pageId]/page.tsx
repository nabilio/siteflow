import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireSite } from "@/lib/studio";
import { blocksOf } from "@/lib/site";
import { BLOCKS } from "@/lib/blocks";
import { savePageAction } from "@/lib/actions/pages";
import { PageEditor } from "./PageEditor";

export default async function PageEditorPage({ params }: { params: Promise<{ id: string; pageId: string }> }) {
  const { id, pageId } = await params;
  const { site, base } = await requireSite(id);
  const page = await prisma.page.findFirst({ where: { id: pageId, siteId: site.id } });
  if (!page) notFound();
  return (
    <PageEditor
      siteId={site.id}
      siteSlug={site.slug}
      base={base}
      page={{ id: page.id, title: page.title, slug: page.slug, navLabel: page.navLabel, inNav: page.inNav, published: page.published, seoTitle: page.seoTitle, seoDescription: page.seoDescription }}
      initialBlocks={blocksOf(page)}
      catalog={BLOCKS}
      save={savePageAction}
    />
  );
}
