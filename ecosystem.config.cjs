// PM2 — SiteFlow
// Le port est lu dans /opt/siteflow/.env (PORT=...), 3020 par défaut.
const fs = require("fs");
let port = "3020";
try {
  const m = fs.readFileSync("/opt/siteflow/.env", "utf8").match(/^PORT=["']?(\d+)/m);
  if (m) port = m[1];
} catch {}

module.exports = {
  apps: [
    {
      name: "siteflow",
      cwd: "/opt/siteflow",
      script: "npm",
      args: "start",
      env: { NODE_ENV: "production", PORT: port },
      max_memory_restart: "600M",
      autorestart: true,
      time: true,
    },
  ],
};
