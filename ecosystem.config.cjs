// PM2 — SiteFlow
module.exports = {
  apps: [
    {
      name: "siteflow",
      cwd: "/opt/siteflow",
      script: "npm",
      args: "start",
      env: { NODE_ENV: "production" },
      max_memory_restart: "600M",
      autorestart: true,
      time: true,
    },
  ],
};
