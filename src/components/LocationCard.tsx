import Link from "next/link";
import { Star, MapPin, ArrowRight, Leaf } from "lucide-react";

export type LocationCardData = {
  slug: string;
  code: string;
  name: string;
  tagline: string;
  district: string;
  heroImage: string;
  rating: number;
  reviewCount: number;
  greenScore: number;
  fromPrice?: number; // optional — only render price when it exists
};

export function LocationCard({ space }: { space: LocationCardData }) {
  return (
    <Link
      href={`/space/${space.slug}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-midnight/5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-44 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={space.heroImage}
          alt={space.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {/* code: top-left */}
        <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-2 py-1 text-xs font-bold tracking-wide text-midnight shadow-sm">
          {space.code}
        </span>
        {/* rating: bottom-left, off the busy area, with shadow */}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-midnight shadow-md">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {space.rating.toFixed(1)}
          <span className="font-normal text-ink-600">({space.reviewCount})</span>
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-head text-h3 leading-tight">{space.name}</h3>
        <p className="mt-1 inline-flex items-center gap-1 text-small text-ink-600">
          <MapPin className="h-3.5 w-3.5" /> {space.district}
        </p>
        <p className="mt-2 text-small italic text-ink-600">“{space.tagline}”</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-spree-hover">
            <Leaf className="h-3.5 w-3.5" /> Green {space.greenScore}
          </span>
          {space.fromPrice != null && (
            <span className="text-small text-ink-600">
              from <span className="font-head font-semibold text-midnight">€{space.fromPrice}</span> per hour
            </span>
          )}
        </div>
        <span className="mt-4 inline-flex items-center gap-1 text-small font-semibold text-spree transition group-hover:gap-2">
          Explore location <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
