"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export function HomeSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/locations?q=${encodeURIComponent(q)}`);
      }}
      className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-md ring-1 ring-midnight/5"
    >
      <span className="pl-2 text-ink-600">
        <Search className="h-5 w-5" />
      </span>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Address, area or amenity…"
        className="flex-1 bg-transparent px-1 py-2 text-body outline-none placeholder:text-ink-600/50"
      />
      <button className="rounded-xl bg-spree px-5 py-2.5 text-small font-semibold text-white hover:bg-spree-hover">
        Search
      </button>
    </form>
  );
}
