import Link from "next/link";
import {
  Search, CalendarCheck, QrCode, ArrowRight, Star, Armchair,
  Users, Building2, PartyPopper, IdCard, Clock, MapPin,
} from "lucide-react";
import { db } from "@/lib/db";
import { LocationCard } from "@/components/LocationCard";
import { PerkCard } from "@/components/PerkCard";
import { Carousel } from "@/components/Carousel";
import { Accordion } from "@/components/Accordion";
import { HomeSearch } from "@/components/landing/HomeSearch";
import { LinkButton, SectionHeading } from "@/components/ui";
import { memberPlans } from "@/lib/plans";

const BERLIN_HERO =
  "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1600&q=80";

export default async function LandingPage() {
  const spaces = await db.space.findMany({
    include: { seatTypes: true },
    orderBy: { rating: "desc" },
  });
  const perks = await db.perk.findMany({ distinct: ["title"], take: 8 });

  const services = [
    { icon: Armchair, t: "Coworking Pass", d: "Hotdesks by the hour or day.", href: "/pricing#passes" },
    { icon: IdCard, t: "Memberships", d: "Roam any location on one pass.", href: "/pricing#memberships" },
    { icon: Users, t: "Meeting Rooms", d: "From 4 to 40 people.", href: "/services/meeting-rooms" },
    { icon: Building2, t: "Private Office", d: "A dedicated team space.", href: "/services/private-office" },
    { icon: PartyPopper, t: "Event Venue", d: "Host demo nights & launches.", href: "/services/event-venue" },
  ];

  const steps = [
    { icon: Search, t: "Choose a space", d: "Six Berlin locations, filtered by area and vibe." },
    { icon: CalendarCheck, t: "Book or add to cart", d: "Pass, room or membership — checkout in seconds." },
    { icon: QrCode, t: "Check in", d: "Scan the QR on arrival. First hour is free." },
  ];

  const testimonials = [
    { name: "Jonas K.", role: "Freelance designer · Kreuzberg", quote: "I hop between Mitte and Friedrichshain on one FlexPass. No more empty monthly desk." },
    { name: "Aylin R.", role: "Startup founder · Neukölln", quote: "Booked a boardroom in 30 seconds for a last-minute pitch. The perks paid for the day." },
    { name: "Marco D.", role: "Remote PM · Charlottenburg", quote: "The credits wallet just makes sense — an hour here, a full day there." },
  ];

  const faqs = [
    { q: "What is the FlexPass?", a: "A monthly membership of 40 credits to spend at any SpreeDesk location in Berlin. One hour costs 1 credit; a full day costs 8." },
    { q: "Is the first hour really free?", a: "Yes — new members get their first working hour at any location free, no card needed to browse." },
    { q: "Can I roam between locations?", a: "That's the point. One pass works at all six Berlin locations, from Mitte to Neukölln." },
    { q: "What are the opening hours?", a: "Mon–Sat, 8:00–22:00. Most locations close on Sundays; RAW Hub in Friedrichshain stays open late." },
    { q: "How do operators get paid?", a: "Through Stripe Connect with transparent daily payouts and a commission that drops as you grow." },
    { q: "Do you offer day passes?", a: "Yes — Hour Pass, Day Pass, FlexPass 40 and Infinity. Compare them on the Pricing page." },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BERLIN_HERO} alt="Berlin skyline" className="h-full w-full object-cover" />
          {/* ~60% overlay: darker on the left for text legibility, photo shows on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-midnight/80 via-midnight/55 to-midnight/25" />
        </div>
        <div className="mx-auto max-w-6xl px-5 py-24 lg:py-32">
          <div className="max-w-2xl text-white animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-small font-semibold backdrop-blur">
              <MapPin className="h-4 w-4" /> Berlin · 6 locations · first hour free
            </span>
            <h1 className="mt-5 text-[40px] font-bold leading-[44px] [text-shadow:0_2px_16px_rgba(0,20,35,0.55)] sm:text-[56px] sm:leading-[60px]">
              Discover SpreeDesk.<br />
              <span className="text-spree-subtle">Your place to work awaits.</span>
            </h1>
            <p className="mt-4 max-w-lg text-body text-white/85">
              On-demand desks, meeting rooms and memberships across Berlin's best
              coworking spaces. One pass, any location, all the perks.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href="/pricing#memberships">Memberships</LinkButton>
              <LinkButton href="/locations" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                Locations
              </LinkButton>
            </div>
            <div className="mt-6 max-w-md"><HomeSearch /></div>
          </div>
        </div>
      </section>

      {/* Services strip */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <SectionHeading center eyebrow="Services" title="Everything you need to get to work" />
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          {services.map((s) => (
            <Link key={s.t} href={s.href} className="group rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-midnight/5 transition hover:-translate-y-1 hover:shadow-md">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-spree-subtle text-spree-hover transition group-hover:bg-spree group-hover:text-white">
                <s.icon className="h-6 w-6" />
              </span>
              <p className="mt-3 font-head text-small font-semibold text-midnight">{s.t}</p>
              <p className="mt-1 text-xs text-ink-600">{s.d}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Locations */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex items-end justify-between">
          <SectionHeading eyebrow="Berlin" title="Find your location" subtitle="Six neighbourhoods, one pass." />
          <Link href="/locations" className="hidden items-center gap-1 text-small font-semibold text-spree hover:gap-2 sm:inline-flex">
            All locations <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {spaces.slice(0, 6).map((s) => (
            <LocationCard
              key={s.id}
              space={{
                slug: s.slug, code: s.code, name: s.name, tagline: s.tagline, district: s.district,
                heroImage: s.heroImage, rating: s.rating, reviewCount: s.reviewCount, greenScore: s.greenScore,
                fromPrice: Math.min(...s.seatTypes.map((t) => t.pricePerHour)),
              }}
            />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <SectionHeading center eyebrow="Simple" title="How it works" />
          <div className="mx-auto mt-8 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.t} className="rounded-2xl bg-ice p-6 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-white text-spree-hover shadow-sm">
                  <s.icon className="h-6 w-6" />
                </span>
                <p className="mt-2 text-xs font-semibold text-ink-600">Step {i + 1}</p>
                <h3 className="mt-1 text-h3">{s.t}</h3>
                <p className="mt-1 text-small text-ink-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <SectionHeading eyebrow="SpreePerks" title="Perks, included" subtitle="Benefits from Berlin partners, redeemed at checkout." />
        <div className="mt-8">
          <Carousel>
            {perks.map((p) => (
              <div key={p.id} className="w-72 shrink-0 snap-start"><PerkCard perk={p} /></div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* Pricing snapshot */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <SectionHeading center eyebrow="Membership" title="Pick your pass" subtitle="Pay as you go or go unlimited." />
        <div className="mx-auto mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {memberPlans.map((p) => (
            <div key={p.name} className={`flex flex-col rounded-2xl p-6 shadow-sm ring-1 ${p.highlight ? "bg-midnight text-white ring-midnight" : "bg-white ring-midnight/5"}`}>
              <p className="font-head text-h3">{p.name}</p>
              <p className="mt-2">
                <span className={`font-head text-h2 ${p.highlight ? "text-white" : "text-midnight"}`}>{p.price}</span>
                <span className={p.highlight ? "text-white/70" : "text-ink-600"}> {p.unit}</span>
              </p>
              <p className={`mt-2 text-small ${p.highlight ? "text-white/80" : "text-ink-600"}`}>{p.includes}</p>
              <LinkButton href="/pricing" variant={p.highlight ? "primary" : "outline"} className="mt-5">Choose</LinkButton>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <SectionHeading center eyebrow="Loved in Berlin" title="What members say" />
          <div className="mx-auto mt-8 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl bg-ice p-6">
                <div className="flex gap-0.5 text-amber-400">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400" />)}</div>
                <p className="mt-3 text-body text-midnight">“{t.quote}”</p>
                <p className="mt-4 text-small font-semibold text-midnight">{t.name}</p>
                <p className="text-small text-ink-600">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hours / community banner */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-midnight p-8 text-white md:p-12">
          <div>
            <h2 className="text-h2 text-white">Open Mon–Sat, 8:00–22:00.</h2>
            <p className="mt-2 inline-flex items-center gap-2 text-white/75">
              <Clock className="h-4 w-4" /> Closed Sundays · RAW Hub stays open late · join the community for €10 off
            </p>
          </div>
          <LinkButton href="/locations">Book a tour <ArrowRight className="h-4 w-4" /></LinkButton>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-14">
        <SectionHeading center title="Frequently asked" />
        <div className="mt-8"><Accordion items={faqs} /></div>
      </section>
    </>
  );
}
