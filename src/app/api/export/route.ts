import { NextResponse } from "next/server";
import { getSession, isStaff } from "@/lib/auth";
import { buildExportZip } from "@/lib/export-zip";

export async function GET(req: Request) {
  const session = await getSession();
  if (!isStaff(session)) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  const siteId = new URL(req.url).searchParams.get("siteId") || "";
  const { buffer, slug } = await buildExportZip(siteId);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="siteflow-${slug}.zip"`,
    },
  });
}
