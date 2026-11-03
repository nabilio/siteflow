import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { MIGRATIONS } from "./migrations-data";

/**
 * Applique les migrations manquantes au démarrage (compatible avec `prisma migrate deploy` :
 * même table _prisma_migrations). Permet une installation sans terminal sur hébergement mutualisé.
 */
export async function runMigrations() {
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS \`_prisma_migrations\` (
    \`id\` VARCHAR(36) NOT NULL,
    \`checksum\` VARCHAR(64) NOT NULL,
    \`finished_at\` DATETIME(3) NULL,
    \`migration_name\` VARCHAR(255) NOT NULL,
    \`logs\` TEXT NULL,
    \`rolled_back_at\` DATETIME(3) NULL,
    \`started_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`applied_steps_count\` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  const done = await prisma.$queryRawUnsafe<{ migration_name: string }[]>(
    "SELECT migration_name FROM `_prisma_migrations` WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL",
  );
  const applied = new Set(done.map((r) => r.migration_name));
  let count = 0;
  for (const m of MIGRATIONS) {
    if (applied.has(m.name)) continue;
    const statements = m.sql
      .split("\n").filter((l) => !l.trim().startsWith("--")).join("\n")
      .split(/;\s*(?:\n|$)/).map((s) => s.trim()).filter(Boolean);
    for (const st of statements) await prisma.$executeRawUnsafe(st);
    await prisma.$executeRawUnsafe(
      "INSERT INTO `_prisma_migrations` (id, checksum, finished_at, migration_name, applied_steps_count) VALUES (?, ?, NOW(3), ?, ?)",
      randomUUID(), m.checksum, m.name, statements.length,
    );
    count++;
    console.log(`[siteflow] migration appliquée : ${m.name}`);
  }
  return count;
}

/** Crée le superadmin au premier démarrage si la base n'a aucun utilisateur. */
export async function ensureAdmin() {
  if ((await prisma.user.count()) > 0) return;
  const email = process.env.SEED_ADMIN_EMAIL?.toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn("[siteflow] Aucun utilisateur et SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD absents : impossible de créer le superadmin.");
    return;
  }
  await prisma.user.create({ data: { email, name: "Super admin", role: "SUPERADMIN", passwordHash: await bcrypt.hash(password, 10) } });
  console.log(`[siteflow] superadmin créé : ${email}`);
}
