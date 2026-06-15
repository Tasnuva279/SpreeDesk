"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Horizontal snap carousel with arrow controls (perks, related spaces).
export function Carousel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) =>
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={() => scroll(-1)}
          className="hit grid place-items-center rounded-full bg-white shadow-sm ring-1 ring-midnight/10 hover:bg-ice"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => scroll(1)}
          className="hit grid place-items-center rounded-full bg-white shadow-sm ring-1 ring-midnight/10 hover:bg-ice"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
