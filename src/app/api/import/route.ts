import { publicUrl } from "@/lib/url";
import { NextResponse } from "next/server";
import { getSession, isStaff } from "@/lib/auth";
import { importZip } from "@/lib/import-zip";

export async function POST(req: Request) {
  const session = await getSession();
  if (!isStaff(session)) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  try {
    const site = await importZip(Buffer.from(await file.arrayBuffer()), { domain: null });
    return NextResponse.redirect(publicUrl(req, `/studio/sites/${site.id}`), 303);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur" }, { status: 400 });
  }
}
