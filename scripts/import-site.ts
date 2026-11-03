/**
 * Importe une archive d'export dans la base courante.
 * Usage : npm run site:import -- fichier.zip [--slug nouveau-slug] [--domain www.exemple.ma]
 * En mode site autonome, utilisez --slug avec la valeur de SINGLE_SITE_SLUG.
 */
import fs from "node:fs";
import { PrismaClient } from "@prisma/client";
import { importZip } from "../src/lib/import-zip";

const prisma = new PrismaClient();

async function main() {
  const [file, ...rest] = process.argv.slice(2);
  if (!file) throw new Error("Usage : npm run site:import -- fichier.zip [--slug slug] [--domain domaine]");
  const opt = (k: string) => { const i = rest.indexOf(k); return i >= 0 ? rest[i + 1] : undefined; };
  const site = await importZip(fs.readFileSync(file), { slug: opt("--slug"), domain: opt("--domain") ?? null });
  console.log(`✔ Site importé : ${site.name} (slug ${site.slug}, id ${site.id})`);
}

main().catch((e) => { console.error(e.message); process.exit(1); }).finally(() => prisma.$disconnect());
