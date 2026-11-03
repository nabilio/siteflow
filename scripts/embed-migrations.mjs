// Génère src/lib/migrations-data.ts à partir de prisma/migrations/*/migration.sql
// (embarqué dans le build : aucune lecture de fichiers au runtime, indispensable en hébergement mutualisé).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const dir = path.join(process.cwd(), "prisma", "migrations");
const names = fs.readdirSync(dir).filter((n) => fs.statSync(path.join(dir, n)).isDirectory()).sort();
const items = names.map((name) => {
  const sql = fs.readFileSync(path.join(dir, name, "migration.sql"), "utf8");
  return { name, sql, checksum: crypto.createHash("sha256").update(sql).digest("hex") };
});
const out = `// FICHIER GÉNÉRÉ par scripts/embed-migrations.mjs — ne pas modifier à la main.\nexport const MIGRATIONS: { name: string; sql: string; checksum: string }[] = ${JSON.stringify(items, null, 2)};\n`;
fs.writeFileSync(path.join(process.cwd(), "src", "lib", "migrations-data.ts"), out);
console.log(`✔ ${items.length} migration(s) embarquée(s)`);
