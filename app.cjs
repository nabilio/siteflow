// Point d'entrée pour les hébergeurs cPanel / CloudLinux « Setup Node.js App » (Phusion Passenger).
// Passenger charge ce fichier dans le même processus : on prépare les fichiers statiques puis on lance le serveur Next (build standalone).
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const sdir = path.join(root, ".next", "standalone");
const server = path.join(sdir, "server.js");
if (!fs.existsSync(server)) {
  throw new Error("Build introuvable : exécutez d'abord « npm run build » dans le dossier de l'application.");
}
const link = (from, to) => {
  if (fs.existsSync(from) && !fs.existsSync(to)) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.cpSync(from, to, { recursive: true });
  }
};
link(path.join(root, ".next", "static"), path.join(sdir, ".next", "static"));
link(path.join(root, "public"), path.join(sdir, "public"));
process.chdir(sdir);
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";
require(server);
