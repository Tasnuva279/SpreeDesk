import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40);
}
const u = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const DEFAULTS = ["1556761175-b413da4baf72", "1521737604893-d14cc237f11d", "1524758631624-e2822e304c36"];

// Operator onboarding: create User(operator) + OperatorProfile + Space + SeatTypes,
// log them in, return the new slug.
export async function POST(req: Request) {
  const body = await req.json();
  const { email, name, company, spaceName, address, desks, rooms, district } = body;
  if (!email || !spaceName) {
    return NextResponse.json({ error: "email and spaceName are required" }, { status: 400 });
  }

  let slug = slugify(spaceName);
  if (await db.space.findUnique({ where: { slug } })) slug = `${slug}-${Math.floor(Date.now() % 1000)}`;
  const code = spaceName.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "NEW";

  const user = await db.user.upsert({
    where: { email },
    update: { role: "operator", name: name || email },
    create: { email, name: name || email, role: "operator" },
  });

  let profile = await db.operatorProfile.findUnique({ where: { userId: user.id } });
  if (!profile) {
    profile = await db.operatorProfile.create({ data: { userId: user.id, company: company || spaceName, plan: "Starter" } });
  }

  await db.space.create({
    data: {
      slug, code, name: spaceName, tagline: "New on SpreeDesk",
      district: district || "Berlin",
      blurb: `${spaceName} just launched on SpreeDesk.`,
      description: `${spaceName} just launched on SpreeDesk in ${district || "Berlin"}.`,
      amenities: "coffee,wifi,quiet",
      heroImage: u(DEFAULTS[0], 1400),
      images: DEFAULTS.map((d) => u(d, 900)).join(","),
      address: address || "Berlin", desks: Number(desks) || 10, rooms: Number(rooms) || 1,
      operatorId: profile.id,
      seatTypes: {
        create: [
          { kind: "hotdesk", label: "Hotdesk", pricePerHour: 3, available: Number(desks) || 10, image: u(DEFAULTS[1], 600) },
          { kind: "meeting_room", label: "Meeting Room · 4 ppl", pricePerHour: 12, capacity: 4, available: Number(rooms) || 1, image: u(DEFAULTS[2], 600) },
        ],
      },
    },
  });

  const res = NextResponse.json({ ok: true, slug });
  res.cookies.set(SESSION_COOKIE, email, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}
