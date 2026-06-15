"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export function Sidebar({
  sections,
}: {
  sections: { label: string; icon: React.ReactNode; content: React.ReactNode }[];
}) {
  const [active, setActive] = useState(0);
  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
        {sections.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setActive(i)}
            className={cn(
              "flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-2.5 text-small font-medium transition",
              i === active
                ? "bg-midnight text-white shadow-sm"
                : "text-ink-600 hover:bg-white hover:text-midnight"
            )}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </nav>
      <div className="min-w-0 animate-fade-in">{sections[active].content}</div>
    </div>
  );
}
