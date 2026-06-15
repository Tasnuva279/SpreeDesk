"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const [hero, ...rest] = images;

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero}
          alt={name}
          onClick={() => setOpen(hero)}
          className="h-64 w-full cursor-pointer rounded-2xl object-cover sm:h-96"
        />
        <div className="hidden grid-rows-2 gap-3 sm:grid">
          {rest.slice(0, 2).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={`${name} ${i + 2}`}
              onClick={() => setOpen(src)}
              className="h-full w-full cursor-pointer rounded-2xl object-cover"
            />
          ))}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-midnight/80 p-6 backdrop-blur"
          onClick={() => setOpen(null)}
        >
          <button className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white">
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={open} alt={name} className="max-h-[85vh] max-w-full rounded-2xl object-contain" />
        </div>
      )}
    </>
  );
}
