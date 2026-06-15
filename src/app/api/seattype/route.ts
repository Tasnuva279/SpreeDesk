import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const KINDS = ["hotdesk", "meeting_room", "private_office", "event_venue"];

// Operator adds a seat type to one of their spaces (validated).
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "operator")
    return NextResponse.json({ error: "Operator access required." }, { status: 403 });

  const { spaceId, kind, label, pricePerHour, capacity, available } = await req.json();

  if (!spaceId) return NextResponse.json({ error: "Choose a space." }, { status: 400 });
  if (!label || !label.trim()) return NextResponse.json({ error: "Label is required." }, { status: 400 });
  if (!KINDS.includes(kind)) return NextResponse.json({ error: "Pick a valid type." }, { status: 400 });
  const price = Number(pricePerHour);
  if (!Number.isFinite(price) || price <= 0) return NextResponse.json({ error: "Price must be greater than 0." }, { status: 400 });
  const cap = Number(capacity);
  if (!Number.isFinite(cap) || cap < 1) return NextResponse.json({ error: "Capacity must be at least 1." }, { status: 400 });
  const avail = Number(available);
  if (!Number.isFinite(avail) || avail < 0) return NextResponse.json({ error: "Availability cannot be negative." }, { status: 400 });

  // ownership check
  const profile = await db.operatorProfile.findUnique({ where: { userId: user.id }, include: { spaces: true } });
  if (!profile?.spaces.some((s) => s.id === spaceId))
    return NextResponse.json({ error: "That space is not yours." }, { status: 403 });

  await db.seatType.create({
    data: { spaceId, kind, label: label.trim(), pricePerHour: price, capacity: cap, available: avail, image: "" },
  });

  return NextResponse.json({ ok: true });
}
