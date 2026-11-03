import { prisma } from "./db";
import { slugify } from "./utils";

/**
 * Stockage des médias EN BASE DE DONNÉES (table MediaData).
 * Raison : sur un hébergement mutualisé, le dossier de l'application est remplacé à chaque déploiement ;
 * la base, elle, est conservée et sauvegardée avec le reste.
 * L'URL publique reste /uploads/<siteId>/<fichier>.
 */
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

export const MAX_UPLOAD = 20 * 1024 * 1024; // 20 Mo (limite max_allowed_packet MySQL mutualisé)

export async function saveUpload(siteId: string, file: File) {
  const ext = ALLOWED_MIME[file.type];
  if (!ext) throw new Error(`Type de fichier non autorisé : ${file.type}`);
  if (file.size > MAX_UPLOAD) throw new Error("Fichier trop volumineux (max 20 Mo). Compressez la vidéo ou l'image.");
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "fichier";
  const name = `${base}-${Date.now().toString(36)}${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  return prisma.media.create({
    data: {
      siteId,
      url: `/uploads/${siteId}/${name}`,
      name: file.name,
      mime: file.type,
      size: file.size,
      data: { create: { data: buf } },
    },
  });
}
