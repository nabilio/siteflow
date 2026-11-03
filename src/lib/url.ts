/** URL publique absolue (derrière le proxy de l'hébergeur, req.url contient l'hôte interne, ex. 0.0.0.0). */
export function publicUrl(req: Request, pathAndQuery: string) {
  const h = req.headers;
  const host = h.get("x-forwarded-host") || h.get("host") || new URL(req.url).host;
  const proto = (h.get("x-forwarded-proto") || new URL(req.url).protocol.replace(":", "")).split(",")[0].trim();
  return new URL(pathAndQuery, `${proto}://${host}`);
}
