import { cookies } from "next/headers";
import { db } from "./db";

// --- MVP mock auth ---
// In production this is replaced by NextAuth (magic-link + OAuth).
// Here we simply store the logged-in user's email in a cookie so the
// role-aware UI and booking logic work end-to-end without SMTP/keys.

export const SESSION_COOKIE = "spreedesk_session";

export async function getCurrentUser() {
  const email = cookies().get(SESSION_COOKIE)?.value;
  if (!email) return null;
  return db.user.findUnique({
    where: { email },
    include: { wallet: true, operatorProfile: true, subscriptions: true },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}
