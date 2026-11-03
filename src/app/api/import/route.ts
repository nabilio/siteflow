import { publicUrl } from "@/lib/url";
import { NextResponse } from "next/server";
import { getSession, isStaff } from "@/lib/auth";
import { importZip } from "@/lib/import-zip";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getSession();
  if (!isStaff(session)) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  try {
    const single = process.env.SINGLE_SITE_SLUG;
    if (single) {
      // Installation chez le client : le site importé prend l'identifiant du mode site unique.
      if (await prisma.site.findUnique({ where: { slug: single } })) return NextResponse.json({ error: "Un site est déjà installé." }, { status: 409 });
      const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").toLowerCase().replace(/:\d+$/, "");
      await importZip(Buffer.from(await file.arrayBuffer()), { slug: single, domain: host || null });
      return NextResponse.redirect(publicUrl(req, "/admin"), 303);
    }
    const site = await importZip(Buffer.from(await file.arrayBuffer()), { domain: null });
    return NextResponse.redirect(publicUrl(req, `/studio/sites/${site.id}`), 303);
  } catch (e) {
    if (process.env.SINGLE_SITE_SLUG) return NextResponse.redirect(publicUrl(req, "/setup?erreur=1"), 303);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur" }, { status: 400 });
  }
}
