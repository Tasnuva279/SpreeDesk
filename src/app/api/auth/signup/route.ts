import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth";

// MVP mock sign-up: creates a member account (+ empty wallet) and logs in.
// Production: hash the password, send a verification email via NextAuth.
export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email) return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!password || password.length < 6)
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });

  await db.user.create({
    data: { email, name, role: "member", wallet: { create: { credits: 0 } } },
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, email, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}
