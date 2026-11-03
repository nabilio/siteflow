export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.AUTO_MIGRATE === "0") return;
  try {
    const { runMigrations, ensureAdmin } = await import("./lib/migrate");
    await runMigrations();
    await ensureAdmin();
  } catch (e) {
    console.error("[siteflow] démarrage : migration/initialisation en échec :", e);
  }
}
