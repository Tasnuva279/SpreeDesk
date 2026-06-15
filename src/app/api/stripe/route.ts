import { NextResponse } from "next/server";

// Stripe webhook (STUB).
// Production: verify the signature with STRIPE_WEBHOOK_SECRET, then handle
// `invoice.payment_succeeded` / `checkout.session.completed` to top up credits
// or activate subscriptions.
export async function POST(req: Request) {
  let event: { type?: string } = {};
  try {
    event = await req.json();
  } catch {
    // raw body / no JSON — fine for the stub
  }

  switch (event.type) {
    case "invoice.payment_succeeded":
      // TODO: mark subscription active / add credits
      break;
    case "checkout.session.completed":
      // TODO: fulfill one-off booking payment
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true, type: event.type ?? "stub" });
}
