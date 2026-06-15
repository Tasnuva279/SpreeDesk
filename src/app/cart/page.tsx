"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ShoppingCart, Tag, PartyPopper, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui";

const CODES: Record<string, number> = { SPREE10: 10, COMMUNITY: 1, REFER10: 10 };

export default function CartPage() {
  const { items, remove, setQty, subtotal, clear } = useCart();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<{ code: string; value: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ total: number } | null>(null);
  const [error, setError] = useState("");

  const discount = applied ? applied.value : 0;
  const total = Math.max(0, subtotal - discount);

  function applyCode() {
    const v = CODES[code.trim().toUpperCase()];
    if (v) setApplied({ code: code.trim().toUpperCase(), value: v });
    else setApplied(null);
  }

  async function checkout() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, discount }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setError(data.error ?? "Checkout failed"); return; }
    clear();
    setDone({ total: data.total });
  }

  if (done) {
    return (
      <div className="mx-auto grid max-w-md place-items-center px-5 py-24 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-spree-subtle text-spree"><PartyPopper className="h-8 w-8" /></span>
        <h1 className="mt-4 text-h2">Order confirmed</h1>
        <p className="mt-2 text-body text-ink-600">€{done.total} paid. Your passes and bookings are in your dashboard.</p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => { router.push("/dashboard/member"); router.refresh(); }}>Go to dashboard</Button>
          <Button variant="outline" onClick={() => router.push("/locations")}>Keep browsing</Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto grid max-w-md place-items-center px-5 py-24 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-ice text-ink-600"><ShoppingCart className="h-8 w-8" /></span>
        <h1 className="mt-4 text-h2">Your cart is empty</h1>
        <p className="mt-2 text-body text-ink-600">Add a pass, a meeting room or a membership to get started.</p>
        <Link href="/pricing" className="mt-6"><Button>Browse passes <ArrowRight className="h-4 w-4" /></Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-h1">Your cart</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* items */}
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-midnight/5">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-midnight">{it.title}</p>
                <p className="text-small text-ink-600">{it.subtitle}</p>
              </div>
              <div className="flex items-center gap-1 rounded-lg ring-1 ring-midnight/10">
                <button onClick={() => setQty(it.id, it.qty - 1)} className="grid h-8 w-8 place-items-center text-ink-600 hover:text-midnight"><Minus className="h-4 w-4" /></button>
                <span className="w-6 text-center text-small font-semibold">{it.qty}</span>
                <button onClick={() => setQty(it.id, it.qty + 1)} className="grid h-8 w-8 place-items-center text-ink-600 hover:text-midnight"><Plus className="h-4 w-4" /></button>
              </div>
              <span className="w-16 text-right font-head font-semibold text-midnight">€{it.price * it.qty}</span>
              <button onClick={() => remove(it.id)} className="grid h-8 w-8 place-items-center text-ink-600 hover:text-danger"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>

        {/* summary */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-midnight/5">
            <p className="font-head text-h3">Order summary</p>
            <div className="mt-4 flex gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-lg ring-1 ring-midnight/10 px-3">
                <Tag className="h-4 w-4 text-ink-600" />
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Discount code" className="w-full bg-transparent py-2 text-small outline-none" />
              </div>
              <Button variant="outline" onClick={applyCode}>Apply</Button>
            </div>
            {applied && <p className="mt-2 text-small text-spree-hover">Code {applied.code} applied · −€{applied.value}</p>}
            <p className="mt-2 text-xs text-ink-600">Try SPREE10 or REFER10</p>

            <div className="mt-5 space-y-2 text-small">
              <div className="flex justify-between"><span className="text-ink-600">Subtotal</span><span>€{subtotal}</span></div>
              <div className="flex justify-between"><span className="text-ink-600">Discount</span><span>−€{discount}</span></div>
              <div className="flex justify-between border-t border-midnight/10 pt-2 font-head text-h3"><span>Total</span><span>€{total}</span></div>
            </div>

            <Button onClick={checkout} loading={busy} className="mt-5 w-full">Checkout</Button>
            {error && <p className="mt-3 rounded-lg bg-danger/10 p-3 text-center text-small text-danger">{error}</p>}
            <p className="mt-3 text-center text-xs text-ink-600">Payments via Stripe (stubbed in MVP)</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
