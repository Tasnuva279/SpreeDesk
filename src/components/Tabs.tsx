"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export function Tabs({
  tabs,
}: {
  tabs: { label: string; icon?: React.ReactNode; content: React.ReactNode }[];
}) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="flex gap-1 overflow-x-auto border-b border-midnight/10">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActive(i)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap px-4 py-3 text-small font-semibold transition",
              i === active
                ? "border-b-2 border-spree text-midnight"
                : "border-b-2 border-transparent text-ink-600 hover:text-midnight"
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
      <div className="pt-6 animate-fade-in">{tabs[active].content}</div>
    </div>
  );
}
