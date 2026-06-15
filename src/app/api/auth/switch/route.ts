import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";
import { db } from "@/lib/db";

// MVP mock auth: set/clear the session cookie. Replace with NextAuth callbacks.
export async function POST(req: Request) {
  const { email } = await req.json();
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Unknown demo user" }, { status: 404 });
  }
  const res = NextResponse.json({ ok: true, role: user.role });
  res.cookies.set(SESSION_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
