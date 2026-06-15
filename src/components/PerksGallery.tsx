"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { PerkCard } from "@/components/PerkCard";

type Perk = { id: string; title: string; partner: string; description: string; category: string };

export function PerksGallery({ perks }: { perks: Perk[] }) {
  const [active, setActive] = useState("all");

  // de-dupe by title (per-space perks repeat across locations)
  const unique = useMemo(() => {
    const seen = new Set<string>();
    return perks.filter((p) => (seen.has(p.title) ? false : (seen.add(p.title), true)));
  }, [perks]);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(unique.map((p) => p.category)))],
    [unique]
  );
  const shown = active === "all" ? unique : unique.filter((p) => p.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "rounded-full px-4 py-1.5 text-small font-semibold capitalize transition",
              active === c ? "bg-spree text-white" : "bg-white text-ink-600 ring-1 ring-midnight/10 hover:bg-ice"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => <PerkCard key={p.id} perk={p} />)}
      </div>
    </div>
  );
}
