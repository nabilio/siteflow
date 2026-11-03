import { NextResponse } from "next/server";
import { canAccessSite, getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const siteId = new URL(req.url).searchParams.get("siteId") || "";
  const session = await getSession();
  if (!canAccessSite(session, siteId)) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  const media = await prisma.media.findMany({ where: { siteId }, orderBy: { createdAt: "desc" }, take: 300 });
  return NextResponse.json(media);
}
