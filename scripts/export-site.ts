/**
 * Exporte un site en archive zip (site.json + médias).
 * Usage : npm run site:export -- <slug> [fichier.zip]
 */
import fs from "node:fs";
import { PrismaClient } from "@prisma/client";
import { buildExportZip } from "../src/lib/export-zip";

const prisma = new PrismaClient();

async function main() {
  const slug = process.argv[2];
  if (!slug) throw new Error("Usage : npm run site:export -- <slug> [fichier.zip]");
  const site = await prisma.site.findUnique({ where: { slug } });
  if (!site) throw new Error(`Site introuvable : ${slug}`);
  const out = process.argv[3] || `siteflow-${slug}.zip`;
  const { buffer } = await buildExportZip(site.id);
  fs.writeFileSync(out, buffer);
  console.log(`✔ Export écrit : ${out} (${(buffer.length / 1024).toFixed(0)} Ko)`);
}

main().catch((e) => { console.error(e.message); process.exit(1); }).finally(() => prisma.$disconnect());
