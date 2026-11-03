import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params;
  const url = "/uploads/" + parts.map((p) => decodeURIComponent(p)).join("/");
  if (url.includes("..")) return new NextResponse("Not found", { status: 404 });
  const media = await prisma.media.findFirst({ where: { url }, select: { id: true, mime: true, size: true } });
  if (!media) return new NextResponse("Not found", { status: 404 });
  const etag = `"${media.id}"`;
  const headers: Record<string, string> = {
    "Content-Type": media.mime,
    "Cache-Control": "public, max-age=31536000, immutable",
    ETag: etag,
  };
  if (req.headers.get("if-none-match") === etag) return new NextResponse(null, { status: 304, headers });
  const row = await prisma.mediaData.findUnique({ where: { mediaId: media.id } });
  if (!row) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(new Uint8Array(row.data), { headers });
}
