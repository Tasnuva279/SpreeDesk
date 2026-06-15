"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ticket, CreditCard, Check } from "lucide-react";
import { Button } from "./ui";

type SeatType = { id: string; label: string; kind: string; pricePerHour: number };

const SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export function BookingCalendar({
  spaceSlug,
  seatTypes,
  loggedIn,
  walletCredits,
}: {
  spaceSlug: string;
  seatTypes: SeatType[];
  loggedIn: boolean;
  walletCredits: number;
}) {
  const router = useRouter();
  const [seat, setSeat] = useState(seatTypes[0]?.id ?? "");
  const [slot, setSlot] = useState(SLOTS[0]);
  const [hours, setHours] = useState(2);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const selected = seatTypes.find((s) => s.id === seat);
  const price = selected ? selected.pricePerHour * hours : 0;
  const creditsNeeded = hours;
  const creditsUsed = Math.min(walletCredits, creditsNeeded);
  const willPay = creditsUsed < creditsNeeded;
  const toPay = selected ? (creditsNeeded - creditsUsed) * selected.pricePerHour : 0;

  async function book() {
    setBusy(true);
    setStatus(null);
    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spaceSlug, seatTypeId: seat, slot, hours }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setStatus({ ok: false, msg: data.error ?? "Booking failed" });
      return;
    }
    setStatus({
      ok: true,
      msg: data.paid
        ? `Booked — €${data.amountPaid} charged via Stripe (stub).`
        : `Booked — ${data.creditsUsed} credits used.`,
    });
    router.refresh();
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-midnight/5">
      <div className="flex items-baseline justify-between">
        <h3 className="font-head text-h3">Book your spot</h3>
        <span className="inline-flex items-center gap-1 text-small text-ink-600">
          <Ticket className="h-4 w-4 text-spree" /> {walletCredits} credits
        </span>
      </div>

      {/* seat type */}
      <div className="mt-4 space-y-1.5">
        {seatTypes.map((s) => (
          <button
            key={s.id}
            onClick={() => setSeat(s.id)}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-small ring-1 transition ${
              seat === s.id ? "bg-spree-subtle ring-spree" : "ring-midnight/10 hover:bg-ice"
            }`}
          >
            <span className="font-medium">{s.label}</span>
            <span className="text-ink-600">€{s.pricePerHour}/h</span>
          </button>
        ))}
      </div>

      {/* slot */}
      <div className="mt-4">
        <label className="text-small font-semibold text-midnight">Time slot</label>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {SLOTS.map((t) => (
            <button
              key={t}
              onClick={() => setSlot(t)}
              className={`rounded-lg py-1.5 text-small ring-1 transition ${
                slot === t ? "bg-midnight text-white ring-midnight" : "ring-midnight/10 hover:bg-ice"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* hours */}
      <div className="mt-4">
        <label className="text-small font-semibold text-midnight">Duration: {hours}h</label>
        <input
          type="range"
          min={1}
          max={8}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="mt-2 w-full accent-spree"
        />
      </div>

      {/* summary */}
      <div className="mt-4 space-y-1.5 rounded-xl bg-ice p-4 text-small">
        <div className="flex justify-between"><span>Price</span><span className="font-semibold">€{price}</span></div>
        <div className="flex justify-between text-ink-600">
          <span className="inline-flex items-center gap-1"><Ticket className="h-3.5 w-3.5" /> Credits used</span>
          <span>{creditsUsed}</span>
        </div>
        {willPay && (
          <div className="flex justify-between text-ink-600">
            <span className="inline-flex items-center gap-1"><CreditCard className="h-3.5 w-3.5" /> Card</span>
            <span>€{toPay}</span>
          </div>
        )}
      </div>

      {loggedIn ? (
        <Button onClick={book} loading={busy} disabled={!seat} className="mt-4 w-full">
          Book now
        </Button>
      ) : (
        <p className="mt-4 rounded-xl bg-ice p-3 text-center text-small text-ink-600">
          Click <b>Sign in</b> (top right) to book as the demo member.
        </p>
      )}

      {status && (
        <p className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl p-3 text-center text-small font-medium ${
          status.ok ? "bg-ok/10 text-ok" : "bg-danger/10 text-danger"
        }`}>
          {status.ok && <Check className="h-4 w-4" />} {status.msg}
        </p>
      )}
    </div>
  );
}
