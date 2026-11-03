// Génère src/lib/docs-data.ts à partir de docs/*.md (affichés dans le Studio, sans lecture de fichiers au runtime).
import fs from "node:fs";
import path from "node:path";

const names = ["INSTALLATION-CHEZ-LE-CLIENT"];
const docs = Object.fromEntries(names.map((n) => [n, fs.readFileSync(path.join(process.cwd(), "docs", `${n}.md`), "utf8")]));
fs.writeFileSync(
  path.join(process.cwd(), "src", "lib", "docs-data.ts"),
  `// FICHIER GÉNÉRÉ par scripts/embed-docs.mjs — ne pas modifier à la main.\nexport const DOCS: Record<string, string> = ${JSON.stringify(docs, null, 2)};\n`,
);
console.log(`✔ ${names.length} document(s) embarqué(s)`);
