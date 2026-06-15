import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Real-Time Inventory API.
// Operators (or their PMS) POST seat availability updates here; in production
// this also ingests iCal feeds. Body: { spaceSlug, updates: [{ seatTypeId, available }] }
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { spaceSlug, updates } = body ?? {};
  if (!spaceSlug || !Array.isArray(updates)) {
    return NextResponse.json(
      { error: "Expected { spaceSlug, updates: [{ seatTypeId, available }] }" },
      { status: 400 }
    );
  }

  const space = await db.space.findUnique({ where: { slug: spaceSlug } });
  if (!space) {
    return NextResponse.json({ error: "Space not found" }, { status: 404 });
  }

  let applied = 0;
  for (const u of updates) {
    if (!u?.seatTypeId || typeof u.available !== "number") continue;
    await db.seatType.updateMany({
      where: { id: u.seatTypeId, spaceId: space.id },
      data: { available: Math.max(0, Math.floor(u.available)) },
    });
    applied++;
  }

  // Production: broadcast over Pusher so member dashboards update live.
  return NextResponse.json({ ok: true, applied });
}
