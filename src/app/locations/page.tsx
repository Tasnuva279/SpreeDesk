import { db } from "@/lib/db";
import { LocationsView } from "@/components/LocationsView";

export default async function LocationsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const spaces = await db.space.findMany({
    include: { seatTypes: true },
    orderBy: { rating: "desc" },
  });

  const data = spaces.map((s) => ({
    slug: s.slug, code: s.code, name: s.name, tagline: s.tagline, district: s.district,
    heroImage: s.heroImage, rating: s.rating, reviewCount: s.reviewCount, greenScore: s.greenScore,
    amenities: s.amenities, address: s.address,
    fromPrice: Math.min(...s.seatTypes.map((t) => t.pricePerHour)),
  }));

  const districts = Array.from(new Set(spaces.map((s) => s.district)));

  return <LocationsView spaces={data} districts={districts} initialQuery={searchParams.q ?? ""} />;
}
