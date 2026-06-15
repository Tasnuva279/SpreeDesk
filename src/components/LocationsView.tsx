"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { LocationCard, type LocationCardData } from "@/components/LocationCard";
import { OsmMap } from "@/components/OsmMap";

type Loc = LocationCardData & { amenities: string; address: string };

export function LocationsView({
  spaces,
  districts,
  initialQuery = "",
}: {
  spaces: Loc[];
  districts: string[];
  initialQuery?: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const [district, setDistrict] = useState("");

  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return spaces.filter((s) => {
      const matchesQ =
        !query ||
        s.name.toLowerCase().includes(query) ||
        s.district.toLowerCase().includes(query) ||
        s.amenities.toLowerCase().includes(query) ||
        s.tagline.toLowerCase().includes(query);
      const matchesD = !district || s.district === district;
      return matchesQ && matchesD;
    });
  }, [spaces, q, district]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h1">Berlin locations</h1>
          <p className="mt-1 text-body text-ink-600">Six neighbourhoods. One pass works at all of them.</p>
        </div>
        <span className="rounded-lg bg-spree-subtle px-3 py-1.5 text-small font-semibold text-spree-hover">
          {filtered.length} spaces
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-white p-2 shadow-sm ring-1 ring-midnight/5">
          <Search className="ml-1.5 h-5 w-5 text-ink-600" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, area or amenity…"
            className="flex-1 bg-transparent px-1 py-1.5 text-body outline-none placeholder:text-ink-600/50"
          />
        </div>
        <select value={district} onChange={(e) => setDistrict(e.target.value)} className="field max-w-[200px]">
          <option value="">All districts</option>
          {districts.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* real map (OpenStreetMap, centred on Berlin) */}
      <div className="mt-6">
        <OsmMap lat={52.515} lng={13.405} zoom={12} marker={false} height="h-56" label={`${filtered.length} SpreeDesk locations in Berlin`} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => <LocationCard key={s.slug} space={s} />)}
        {filtered.length === 0 && (
          <p className="col-span-full rounded-2xl bg-white p-8 text-center text-ink-600 ring-1 ring-midnight/5">
            No locations match — try clearing the filter.
          </p>
        )}
      </div>
    </div>
  );
}
