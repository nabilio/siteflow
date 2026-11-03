import { publicUrl } from "@/lib/url";
import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function GET(req: Request) {
  await destroySession();
  return NextResponse.redirect(publicUrl(req, "/login"));
}
export const POST = GET;
