export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function cleanDomain(d: string) {
  return d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "");
}

export function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

/** Transforme un lien YouTube en lien d'intégration ; renvoie null pour un fichier vidéo. */
export function youtubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&mute=1&loop=1&playlist=${m[1]}&controls=0&rel=0` : null;
}

export function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : v == null ? fallback : String(v);
}
export function num(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) && v !== "" && v != null ? n : fallback;
}
export function bool(v: unknown): boolean {
  return v === true || v === "true" || v === "on" || v === 1;
}
export function list<T = Record<string, unknown>>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}
