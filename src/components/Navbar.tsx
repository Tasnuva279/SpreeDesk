"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ShoppingCart, Menu, X } from "lucide-react";
import { Wordmark } from "./Logo";
import { RoleSwitcher } from "./RoleSwitcher";
import { useCart } from "@/lib/cart";

const SERVICES = [
  { href: "/pricing#passes", label: "Coworking Pass", desc: "Hour & day passes" },
  { href: "/pricing#memberships", label: "Memberships", desc: "FlexPass & Infinity" },
  { href: "/services/meeting-rooms", label: "Meeting Rooms", desc: "2–40 people" },
  { href: "/services/private-office", label: "Private Office", desc: "Dedicated desks" },
  { href: "/services/event-venue", label: "Event Venue", desc: "Host up to 40" },
];

export function Navbar({
  user,
}: {
  user: { name: string; role: string; email: string } | null;
}) {
  const { count } = useCart();
  const [openServices, setOpenServices] = useState(false);
  const [mobile, setMobile] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-midnight/10 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" aria-label="SpreeDesk home"><Wordmark /></Link>

        <nav className="hidden items-center gap-6 text-small font-medium text-ink-600 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setOpenServices(true)}
            onMouseLeave={() => setOpenServices(false)}
          >
            <button className="flex items-center gap-1 py-2 transition hover:text-midnight">
              Services <ChevronDown className="h-4 w-4" />
            </button>
            {openServices && (
              <div className="absolute left-0 top-full w-64 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-midnight/10">
                {SERVICES.map((s) => (
                  <Link key={s.href} href={s.href} className="block rounded-xl px-3 py-2 hover:bg-ice">
                    <p className="font-semibold text-midnight">{s.label}</p>
                    <p className="text-xs text-ink-600">{s.desc}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/locations" className="transition hover:text-midnight">Locations</Link>
          <Link href="/perks" className="transition hover:text-midnight">Perks</Link>
          <Link href="/pricing" className="transition hover:text-midnight">Pricing</Link>
          <Link href="/onboard" className="transition hover:text-midnight">For Operators</Link>
        </nav>

        <div className="flex items-center gap-2">
          {count > 0 && (
            <Link
              href="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-lg text-midnight ring-1 ring-midnight/10 hover:bg-ice"
              aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-spree px-1 text-xs font-bold text-white">
                {count}
              </span>
            </Link>
          )}
          <div className="hidden sm:block">
            <RoleSwitcher user={user ? { name: user.name, role: user.role } : null} />
          </div>
          <button onClick={() => setMobile(!mobile)} className="grid h-10 w-10 place-items-center rounded-lg ring-1 ring-midnight/10 lg:hidden">
            {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobile && (
        <div className="border-t border-midnight/10 bg-white px-5 py-3 lg:hidden">
          <div className="flex flex-col gap-1 text-small font-medium text-midnight">
            {[["Locations", "/locations"], ["Pricing", "/pricing"], ["Perks", "/perks"], ["Meeting Rooms", "/services/meeting-rooms"], ["For Operators", "/onboard"]].map(([l, h]) => (
              <Link key={h} href={h} onClick={() => setMobile(false)} className="rounded-lg px-2 py-2 hover:bg-ice">{l}</Link>
            ))}
          </div>
          <div className="mt-3"><RoleSwitcher user={user ? { name: user.name, role: user.role } : null} /></div>
        </div>
      )}
    </header>
  );
}
