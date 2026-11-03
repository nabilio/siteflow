import fs from "node:fs/promises";
import path from "node:path";
import { slugify } from "./utils";

export function uploadRoot() {
  const dir = process.env.UPLOAD_DIR || "./uploads";
  return path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
}

export const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "application/pdf": ".pdf",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "image/x-icon": ".ico",
  "image/vnd.microsoft.icon": ".ico",
};

export const MAX_UPLOAD = 50 * 1024 * 1024; // 50 Mo

export async function saveUpload(siteId: string, file: File) {
  const ext = ALLOWED_MIME[file.type];
  if (!ext) throw new Error(`Type de fichier non autorisé : ${file.type}`);
  if (file.size > MAX_UPLOAD) throw new Error("Fichier trop volumineux (max 50 Mo)");
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "fichier";
  const name = `${base}-${Date.now().toString(36)}${ext}`;
  const dir = path.join(uploadRoot(), siteId);
  await fs.mkdir(dir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, name), buf);
  return { url: `/uploads/${siteId}/${name}`, name: file.name, mime: file.type, size: file.size };
}

export async function deleteUpload(url: string) {
  if (!url.startsWith("/uploads/")) return;
  const rel = url.replace(/^\/uploads\//, "");
  if (rel.includes("..")) return;
  try {
    await fs.unlink(path.join(uploadRoot(), rel));
  } catch {
    /* déjà supprimé */
  }
}
