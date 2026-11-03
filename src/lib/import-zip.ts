import path from "node:path";
import AdmZip from "adm-zip";
import { prisma } from "./db";
import { importSite, type SiteExport } from "./transfer";

/** Importe une archive produite par l'export (site.json + uploads/<id>/...). */
export async function importZip(buf: Buffer, opts: { slug?: string; domain?: string | null } = {}) {
  const zip = new AdmZip(buf);
  const entry = zip.getEntry("site.json");
  if (!entry) throw new Error("Archive invalide : site.json manquant");
  const data = JSON.parse(entry.getData().toString("utf8")) as SiteExport;
  if (data.format !== "siteflow-export") throw new Error("Archive invalide : format inconnu");
  const site = await importSite(data, opts);
  for (const e of zip.getEntries()) {
    if (e.isDirectory || !e.entryName.startsWith("uploads/")) continue;
    const name = path.basename(e.entryName);
    if (!name || name.includes("..")) continue;
    const media = await prisma.media.findFirst({ where: { siteId: site.id, url: `/uploads/${site.id}/${name}` } });
    if (media) {
      const bytes = new Uint8Array(e.getData());
      await prisma.mediaData.upsert({ where: { mediaId: media.id }, create: { mediaId: media.id, data: bytes }, update: { data: bytes } });
    }
  }
  return site;
}
