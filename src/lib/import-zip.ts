import path from "node:path";
import fs from "node:fs/promises";
import AdmZip from "adm-zip";
import { importSite, type SiteExport } from "./transfer";
import { uploadRoot } from "./storage";

/** Importe une archive produite par l'export (site.json + uploads/<id>/...). */
export async function importZip(buf: Buffer, opts: { slug?: string; domain?: string | null } = {}) {
  const zip = new AdmZip(buf);
  const entry = zip.getEntry("site.json");
  if (!entry) throw new Error("Archive invalide : site.json manquant");
  const data = JSON.parse(entry.getData().toString("utf8")) as SiteExport;
  if (data.format !== "siteflow-export") throw new Error("Archive invalide : format inconnu");
  const site = await importSite(data, opts);
  const dest = path.join(uploadRoot(), site.id);
  await fs.mkdir(dest, { recursive: true });
  for (const e of zip.getEntries()) {
    if (e.isDirectory || !e.entryName.startsWith("uploads/")) continue;
    const name = path.basename(e.entryName);
    if (!name || name.includes("..")) continue;
    await fs.writeFile(path.join(dest, name), e.getData());
  }
  return site;
}
