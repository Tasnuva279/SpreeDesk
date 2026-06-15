import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star, MapPin, Leaf, Clock, Building2, Navigation, Coffee, Volume2,
  Bike, Dumbbell, Dog, Phone, PartyPopper, Car, Users, Moon,
} from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { BookingCalendar } from "@/components/BookingCalendar";
import { Gallery } from "@/components/Gallery";
import { OsmMap } from "@/components/OsmMap";
import { LocationCard } from "@/components/LocationCard";
import { AddToCart } from "@/components/AddToCart";
import { Badge } from "@/components/ui";

const amenityIcons: Record<string, React.ElementType> = {
  coffee: Coffee, quiet: Volume2, "river-view": Navigation, events: PartyPopper,
  rooftop: Building2, wellness: Dumbbell, "dog-friendly": Dog, "bike-parking": Bike,
  "phone-booths": Phone, parking: Car, community: Users, "late-hours": Moon,
};

const cartType: Record<string, "pass" | "room" | "office" | "event"> = {
  hotdesk: "pass", meeting_room: "room", private_office: "office", event_venue: "event",
};

const reviews = [
  { name: "Sara M.", rating: 5, text: "Great light and fast wifi. The espresso perk is a nice touch." },
  { name: "Tom B.", rating: 4, text: "Quiet floor was perfect for deep work. Boardroom booking was instant." },
  { name: "Nina P.", rating: 5, text: "Loved the location — booked an hour between meetings, super easy." },
];

export default async function SpaceMicrosite({ params }: { params: { slug: string } }) {
  const space = await db.space.findUnique({
    where: { slug: params.slug },
    include: { seatTypes: true, perks: true, operator: true },
  });
  if (!space) notFound();

  const user = await getCurrentUser();
  const walletCredits = user?.wallet?.credits ?? 0;
  const amenities = space.amenities.split(",");
  const gallery = [space.heroImage, ...space.images.split(",")];

  const related = await db.space.findMany({
    where: { slug: { not: space.slug } },
    take: 3,
    include: { seatTypes: true },
    orderBy: { rating: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <Gallery images={gallery} name={space.name} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          {/* header */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="midnight" className="font-bold tracking-wide">{space.code}</Badge>
              <h1 className="text-h1">{space.name}</h1>
              <Badge tone="spree"><Leaf className="h-3 w-3" /> Green {space.greenScore}</Badge>
            </div>
            <p className="mt-2 text-body italic text-ink-600">“{space.tagline}”</p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-small text-ink-600">
              <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {space.rating} · {space.reviewCount} reviews</span>
              <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {space.address}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {space.hours}</span>
              <span className="inline-flex items-center gap-1"><Building2 className="h-4 w-4" /> by {space.operator.company}</span>
            </div>
          </div>

          {/* services & rates */}
          <section>
            <h2 className="text-h3">Services & rates</h2>
            <div className="mt-3 space-y-3">
              {space.seatTypes.map((s) => (
                <div key={s.id} className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-midnight/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} alt={s.label} className="h-20 w-28 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-midnight">{s.label}</p>
                    <p className="text-small text-ink-600">Up to {s.capacity} · {s.available} available · €{s.pricePerHour}/h</p>
                  </div>
                  <AddToCart
                    variant="outline"
                    label={`Add · €${s.pricePerHour}`}
                    item={{
                      type: cartType[s.kind] ?? "pass",
                      title: s.label,
                      subtitle: `${space.name} (${space.code})`,
                      price: s.pricePerHour,
                      spaceSlug: space.slug,
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* amenities */}
          <section>
            <h2 className="text-h3">Amenities</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {amenities.map((a) => {
                const Icon = amenityIcons[a] ?? Star;
                return (
                  <div key={a} className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-small shadow-sm ring-1 ring-midnight/5">
                    <Icon className="h-4 w-4 text-spree" /> {a}
                  </div>
                );
              })}
            </div>
          </section>

          {/* about */}
          <section>
            <h2 className="text-h3">About</h2>
            <p className="mt-2 text-body text-ink-600">{space.description}</p>
          </section>

          {/* perks */}
          <section>
            <h2 className="text-h3">Perks included</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {space.perks.map((p) => (
                <Badge key={p.id} tone="muted" className="px-3 py-1.5 text-small">{p.title}</Badge>
              ))}
            </div>
          </section>

          {/* map */}
          <section>
            <h2 className="text-h3">Location</h2>
            <div className="mt-3">
              <OsmMap lat={space.lat} lng={space.lng} zoom={15} label={space.address} />
            </div>
          </section>

          {/* reviews */}
          <section>
            <h2 className="text-h3">Reviews</h2>
            <div className="mt-3 space-y-3">
              {reviews.map((r) => (
                <div key={r.name} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-midnight/5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-midnight">{r.name}</p>
                    <span className="flex gap-0.5 text-amber-400">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400" />)}</span>
                  </div>
                  <p className="mt-2 text-small text-ink-600">{r.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* sticky booking */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingCalendar
            spaceSlug={space.slug}
            seatTypes={space.seatTypes.map((s) => ({ id: s.id, label: s.label, kind: s.kind, pricePerHour: s.pricePerHour }))}
            loggedIn={!!user && user.role === "member"}
            walletCredits={walletCredits}
          />
        </aside>
      </div>

      <section className="mt-14">
        <h2 className="text-h2">More Berlin locations</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {related.map((s) => (
            <LocationCard key={s.id} space={{
              slug: s.slug, code: s.code, name: s.name, tagline: s.tagline, district: s.district,
              heroImage: s.heroImage, rating: s.rating, reviewCount: s.reviewCount, greenScore: s.greenScore,
              fromPrice: Math.min(...s.seatTypes.map((t) => t.pricePerHour)),
            }} />
          ))}
        </div>
      </section>
    </div>
  );
}
