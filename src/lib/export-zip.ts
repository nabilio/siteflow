import AdmZip from "adm-zip";
import { prisma } from "./db";
import { exportSite } from "./transfer";

/** Construit l'archive d'export d'un site (site.json + uploads/<id>/...). */
export async function buildExportZip(siteId: string) {
  const data = await exportSite(siteId);
  const zip = new AdmZip();
  zip.addFile("site.json", Buffer.from(JSON.stringify(data, null, 2), "utf8"));
  const medias = await prisma.media.findMany({ where: { siteId }, select: { id: true, url: true } });
  for (const m of medias) {
    const row = await prisma.mediaData.findUnique({ where: { mediaId: m.id } });
    if (row) zip.addFile(m.url.replace(/^\//, ""), Buffer.from(row.data));
  }
  return { buffer: zip.toBuffer(), slug: data.site.slug };
}
