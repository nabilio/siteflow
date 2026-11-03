import { cookies, headers } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import type { Role } from "@prisma/client";

const COOKIE = "sf_session";
const secret = () => new TextEncoder().encode(process.env.SESSION_SECRET || "dev-secret-change-me");

export type Session = { userId: string; email: string; name: string; role: Role; siteId: string | null };

export async function createSession(s: Session) {
  const token = await new SignJWT(s)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(secret());
  const store = await cookies();
  const h = await headers();
  // Cookie "secure" uniquement si la requête arrive bien en HTTPS (derrière Nginx : x-forwarded-proto)
  const https = (h.get("x-forwarded-proto") || "").split(",")[0].trim() === "https";
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: https,
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<Session | null> {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  const s: Session = { userId: user.id, email: user.email, name: user.name, role: user.role, siteId: user.siteId };
  await createSession(s);
  return s;
}

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}

export function isStaff(s: Session | null) {
  return !!s && (s.role === "SUPERADMIN" || s.role === "ADMIN");
}

/** Vérifie que la session a le droit d'agir sur ce site. */
export function canAccessSite(s: Session | null, siteId: string) {
  if (!s) return false;
  if (isStaff(s)) return true;
  return s.siteId === siteId;
}
