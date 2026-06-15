"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export function Accordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-midnight/10 rounded-2xl bg-white ring-1 ring-midnight/5">
      {items.map((it, i) => (
        <div key={it.q}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            aria-expanded={open === i}
          >
            <span className="font-semibold text-midnight">{it.q}</span>
            <ChevronDown
              className={cn(
                "h-5 w-5 shrink-0 text-spree transition",
                open === i && "rotate-180"
              )}
            />
          </button>
          {open === i && (
            <p className="animate-fade-up px-5 pb-5 text-body text-ink-600">{it.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}
