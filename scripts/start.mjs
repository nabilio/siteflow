// Démarrage production : sert le build "standalone" (le plus léger) ou, à défaut, `next start`.
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const standalone = path.join(root, ".next", "standalone", "server.js");
const port = process.env.PORT || "3020";
if (fs.existsSync(standalone)) {
  const sdir = path.join(root, ".next", "standalone");
  const link = (from, to) => { if (fs.existsSync(from) && !fs.existsSync(to)) { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.cpSync(from, to, { recursive: true }); } };
  link(path.join(root, ".next", "static"), path.join(sdir, ".next", "static"));
  link(path.join(root, "public"), path.join(sdir, "public"));
  spawn(process.execPath, [standalone], { stdio: "inherit", env: { ...process.env, PORT: port, HOSTNAME: "0.0.0.0" } }).on("exit", (c) => process.exit(c ?? 0));
} else {
  spawn(process.execPath, [path.join(root, "node_modules", "next", "dist", "bin", "next"), "start", "-p", port], { stdio: "inherit" }).on("exit", (c) => process.exit(c ?? 0));
}
