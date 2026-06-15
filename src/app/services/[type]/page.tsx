import { notFound } from "next/navigation";
import Link from "next/link";
import { Users, MapPin, ImageOff } from "lucide-react";
import { db } from "@/lib/db";
import { AddToCart } from "@/components/AddToCart";
import { Badge, SectionHeading } from "@/components/ui";

const TYPES: Record<string, { kinds: string[]; title: string; eyebrow: string; cart: "room" | "office" | "event"; blurb: string }> = {
  "meeting-rooms": { kinds: ["meeting_room"], title: "Meeting Rooms", eyebrow: "From 4 to 40 people", cart: "room", blurb: "Book a room by the hour at any Berlin location — boardrooms, huddle spaces and pitch rooms." },
  "private-office": { kinds: ["private_office"], title: "Private Offices", eyebrow: "Dedicated team space", cart: "office", blurb: "A lockable, dedicated office for your team, available across the network." },
  "event-venue": { kinds: ["event_venue"], title: "Event Venues", eyebrow: "Host up to 40", cart: "event", blurb: "Demo nights, launches and workshops in characterful Berlin spaces." },
};

export function generateStaticParams() {
  return Object.keys(TYPES).map((type) => ({ type }));
}

export default async function ServicePage({ params }: { params: { type: string } }) {
  const cfg = TYPES[params.type];
  if (!cfg) notFound();

  const spaces = await db.space.findMany({
    include: { seatTypes: { where: { kind: { in: cfg.kinds } } } },
    orderBy: { rating: "desc" },
  });
  const offerings = spaces.flatMap((s) => s.seatTypes.map((st) => ({ space: s, seat: st })));

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <SectionHeading eyebrow={cfg.eyebrow} title={cfg.title} subtitle={cfg.blurb} />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {offerings.map(({ space, seat }) => (
          <div key={seat.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-midnight/5">
            {seat.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={seat.image} alt={`${seat.label} at ${space.name}`} loading="lazy" className="h-44 w-full object-cover" />
            ) : (
              <div className="grid h-44 w-full place-items-center bg-ink-100 text-ink-600">
                <ImageOff className="h-7 w-7" />
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center justify-between">
                <Badge tone="midnight" className="font-bold">{space.code}</Badge>
                <span className="inline-flex items-center gap-1 text-small text-ink-600"><Users className="h-4 w-4" /> {seat.capacity}</span>
              </div>
              <h3 className="mt-2 font-head text-h3">{seat.label}</h3>
              <Link href={`/space/${space.slug}`} className="inline-flex items-center gap-1 text-small text-ink-600 hover:text-spree">
                <MapPin className="h-3.5 w-3.5" /> {space.name} · {space.district}
              </Link>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-head text-h3 text-midnight">€{seat.pricePerHour}<span className="text-small font-normal text-ink-600">/h</span></span>
                <AddToCart variant="outline" label="Add to cart" item={{ type: cfg.cart, title: seat.label, subtitle: `${space.name} (${space.code})`, price: seat.pricePerHour, spaceSlug: space.slug }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
