import path from "node:path";
import fs from "node:fs";
import AdmZip from "adm-zip";
import { exportSite } from "./transfer";
import { uploadRoot } from "./storage";

/** Construit l'archive d'export d'un site (site.json + uploads/<id>/...). */
export async function buildExportZip(siteId: string) {
  const data = await exportSite(siteId);
  const zip = new AdmZip();
  zip.addFile("site.json", Buffer.from(JSON.stringify(data, null, 2), "utf8"));
  const dir = path.join(uploadRoot(), siteId);
  if (fs.existsSync(dir)) zip.addLocalFolder(dir, `uploads/${siteId}`);
  return { buffer: zip.toBuffer(), slug: data.site.slug };
}
