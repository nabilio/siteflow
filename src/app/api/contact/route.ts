import { publicUrl } from "@/lib/url";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const form = await req.formData();
  // Anti-spam : champ caché qui doit rester vide
  if (String(form.get("website") || "")) return NextResponse.json({ ok: true });
  const siteId = String(form.get("siteId") || "");
  const name = String(form.get("name") || "").trim();
  const message = String(form.get("message") || "").trim();
  if (!siteId || !name || !message) return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  const site = await prisma.site.findUnique({ where: { id: siteId } });
  if (!site) return NextResponse.json({ error: "Site inconnu" }, { status: 404 });
  await prisma.message.create({
    data: {
      siteId,
      name,
      email: String(form.get("email") || "").trim() || null,
      phone: String(form.get("phone") || "").trim() || null,
      subject: String(form.get("subject") || "").trim() || null,
      message,
    },
  });
  const back = String(form.get("back") || "/contact");
  return NextResponse.redirect(publicUrl(req, `${back}${back.includes("?") ? "&" : "?"}envoye=1#contact`), 303);
}
