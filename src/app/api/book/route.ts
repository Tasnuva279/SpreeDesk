import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// Booking logic:
//  1. find availability for the seat type
//  2. deduct credits from the wallet
//  3. if credits are insufficient, charge the remainder via Stripe (stubbed)
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { spaceSlug, seatTypeId, slot, hours } = await req.json();
  const h = Math.max(1, Math.min(8, Number(hours) || 1));

  const space = await db.space.findUnique({ where: { slug: spaceSlug } });
  if (!space) {
    return NextResponse.json({ error: "Space not found" }, { status: 404 });
  }

  const seat = await db.seatType.findFirst({
    where: { id: seatTypeId, spaceId: space.id },
  });
  if (!seat) {
    return NextResponse.json({ error: "Seat type not found" }, { status: 404 });
  }
  if (seat.available < 1) {
    return NextResponse.json({ error: "No availability for that seat" }, { status: 409 });
  }

  const wallet = await db.creditWallet.findUnique({ where: { userId: user.id } });
  const available = wallet?.credits ?? 0;
  const creditsUsed = Math.min(available, h);
  const hoursToPay = h - creditsUsed;
  const amountPaid = hoursToPay * seat.pricePerHour;

  // Build a start Date from the chosen slot (today + slot hour)
  const [hh, mm] = String(slot || "09:00").split(":").map(Number);
  const start = new Date();
  start.setHours(hh || 9, mm || 0, 0, 0);

  // --- Stripe payment (STUB) ---
  // In production: create a PaymentIntent here and confirm before writing the booking.
  // The /api/stripe webhook then reconciles invoice.payment_succeeded.
  const paid = amountPaid > 0;

  const [booking] = await db.$transaction([
    db.booking.create({
      data: {
        userId: user.id,
        spaceId: space.id,
        seatTypeId: seat.id,
        start,
        hours: h,
        creditsUsed,
        amountPaid,
        status: "confirmed",
      },
    }),
    db.seatType.update({
      where: { id: seat.id },
      data: { available: { decrement: 1 } },
    }),
    ...(wallet && creditsUsed > 0
      ? [
          db.creditWallet.update({
            where: { userId: user.id },
            data: { credits: { decrement: creditsUsed } },
          }),
        ]
      : []),
  ]);

  return NextResponse.json({
    ok: true,
    bookingId: booking.id,
    creditsUsed,
    paid,
    amountPaid,
  });
}
