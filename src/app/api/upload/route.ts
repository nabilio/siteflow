import { NextResponse } from "next/server";
import { getSession, canAccessSite } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { saveUpload } from "@/lib/storage";

export async function POST(req: Request) {
  const session = await getSession();
  const form = await req.formData();
  const siteId = String(form.get("siteId") || "");
  const file = form.get("file");
  if (!siteId || !(file instanceof File)) return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  if (!canAccessSite(session, siteId)) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  try {
    const saved = await saveUpload(siteId, file);
    const media = await prisma.media.create({ data: { siteId, ...saved } });
    return NextResponse.json(media);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur" }, { status: 400 });
  }
}
