import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

type Item = {
  type: string; title: string; subtitle: string; price: number; qty: number; spaceSlug?: string;
};

const MEMBERSHIP_CREDITS: Record<string, number> = {
  "FlexPass 40": 40,
  Infinity: 120,
};

// Checkout: persist an Order, activate memberships (+credits), and create
// bookings for desk/room/office/event line items. Replaces Stripe checkout.
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in to check out." }, { status: 401 });

  const { items, discount = 0 } = (await req.json()) as { items: Item[]; discount?: number };
  if (!items?.length) return NextResponse.json({ error: "Cart is empty." }, { status: 400 });

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = Math.max(0, subtotal - discount);

  // memberships -> subscription + credits
  for (const it of items.filter((i) => i.type === "membership")) {
    const credits = MEMBERSHIP_CREDITS[it.title] ?? 0;
    await db.subscription.create({
      data: { userId: user.id, plan: it.title, status: "active", renewsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) },
    });
    if (credits) {
      await db.creditWallet.upsert({
        where: { userId: user.id },
        update: { credits: { increment: credits } },
        create: { userId: user.id, credits },
      });
    }
  }

  // desk/room/office/event -> bookings
  for (const it of items.filter((i) => ["pass", "room", "office", "event"].includes(i.type))) {
    if (!it.spaceSlug) continue;
    const space = await db.space.findUnique({ where: { slug: it.spaceSlug }, include: { seatTypes: true } });
    if (!space) continue;
    const seat =
      space.seatTypes.find((s) => it.title.toLowerCase().includes(s.label.toLowerCase().split(" ")[0])) ??
      space.seatTypes[0];
    const start = new Date(Date.now() + 1000 * 60 * 60 * 24);
    for (let q = 0; q < it.qty; q++) {
      await db.booking.create({
        data: {
          userId: user.id, spaceId: space.id, seatTypeId: seat.id,
          start, hours: 1, amountPaid: it.price, status: "confirmed",
        },
      });
    }
  }

  const order = await db.order.create({
    data: {
      userId: user.id,
      items: JSON.stringify(items),
      subtotal, discount, total,
    },
  });

  return NextResponse.json({ ok: true, orderId: order.id, total });
}
