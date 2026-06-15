import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  CalendarClock,
  Wallet,
  Gift,
  Users,
  QrCode,
  Plus,
} from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { CreditWallet } from "@/components/CreditWallet";
import { PerkCard } from "@/components/PerkCard";
import { LocationCard } from "@/components/LocationCard";
import { Carousel } from "@/components/Carousel";
import { Tabs } from "@/components/Tabs";
import { Badge, Button, LinkButton } from "@/components/ui";

export default async function MemberDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (user.role !== "member") redirect("/dashboard/operator");

  const bookings = await db.booking.findMany({
    where: { userId: user.id },
    include: { space: true, seatType: true },
    orderBy: { start: "asc" },
  });
  const perks = await db.perk.findMany({ take: 6 });
  const suggested = await db.space.findMany({ take: 4, include: { seatTypes: true } });
  const credits = user.wallet?.credits ?? 0;
  const activePlan = user.subscriptions?.find((s) => s.status === "active");
  const next = bookings[0];

  const fmt = (d: Date) =>
    new Date(d).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  const overview = (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* next booking + QR */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-midnight/5 lg:col-span-2">
        <p className="text-small font-semibold text-ink-600">Upcoming booking</p>
        {next ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link href={`/space/${next.space.slug}`} className="font-head text-h3 hover:text-spree">
                {next.space.name}
              </Link>
              <p className="text-small text-ink-600">{next.seatType.label} · {next.hours}h · {fmt(next.start)}</p>
              <Badge tone="success" className="mt-2"><QrCode className="h-3 w-3" /> Ready to check in</Badge>
            </div>
            <div className="grid h-24 w-24 place-items-center rounded-xl bg-midnight text-white">
              <QrCode className="h-12 w-12" />
            </div>
          </div>
        ) : (
          <p className="mt-3 text-small text-ink-600">
            No upcoming bookings. <Link href="/explore" className="font-semibold text-spree">Explore spaces →</Link>
          </p>
        )}
      </div>
      <CreditWallet credits={credits} plan={activePlan?.plan} />

      <div className="lg:col-span-3">
        <p className="mb-3 font-head text-h3">Suggested for you</p>
        <Carousel>
          {suggested.map((s) => (
            <div key={s.id} className="w-80 shrink-0 snap-start">
              <LocationCard
                space={{
                  slug: s.slug, code: s.code, name: s.name, tagline: s.tagline, district: s.district,
                  heroImage: s.heroImage, rating: s.rating, reviewCount: s.reviewCount, greenScore: s.greenScore,
                  fromPrice: Math.min(...s.seatTypes.map((t) => t.pricePerHour)),
                }}
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );

  const bookingsTab = (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-midnight/5">
      <table className="w-full text-left text-small">
        <thead className="bg-ice text-ink-600">
          <tr>
            <th className="px-5 py-3 font-semibold">Space</th>
            <th className="px-5 py-3 font-semibold">Seat</th>
            <th className="px-5 py-3 font-semibold">When</th>
            <th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-midnight/5">
          {bookings.map((b) => (
            <tr key={b.id} className="hover:bg-ice/60">
              <td className="px-5 py-4 font-medium text-midnight">{b.space.name}</td>
              <td className="px-5 py-4 text-ink-600">{b.seatType.label}</td>
              <td className="px-5 py-4 text-ink-600">{fmt(b.start)}</td>
              <td className="px-5 py-4">
                <Badge tone={b.status === "checked_in" ? "success" : "spree"}>{b.status}</Badge>
              </td>
              <td className="px-5 py-4 text-right">
                <button className="text-small font-semibold text-danger hover:underline">Cancel</button>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr><td colSpan={5} className="px-5 py-8 text-center text-ink-600">No bookings yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const walletTab = (
    <div className="grid gap-6 sm:grid-cols-2">
      <CreditWallet credits={credits} plan={activePlan?.plan} />
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-midnight/5">
        <p className="font-head text-h3">Subscription</p>
        {activePlan ? (
          <div className="mt-3 space-y-2 text-small">
            <div className="flex justify-between"><span className="text-ink-600">Plan</span><span className="font-semibold">{activePlan.plan}</span></div>
            <div className="flex justify-between"><span className="text-ink-600">Status</span><Badge tone="success">{activePlan.status}</Badge></div>
            <div className="flex justify-between"><span className="text-ink-600">Renews</span><span>{new Date(activePlan.renewsAt).toLocaleDateString("en-GB")}</span></div>
          </div>
        ) : <p className="mt-3 text-small text-ink-600">No active subscription.</p>}
        <Button variant="outline" className="mt-5 w-full"><Plus className="h-4 w-4" /> Top up credits</Button>
      </div>
    </div>
  );

  const perksTab = (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {perks.map((p) => <PerkCard key={p.id} perk={p} />)}
    </div>
  );

  const teamTab = (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-midnight/5">
      <div className="flex items-center justify-between">
        <p className="font-head text-h3">Your team</p>
        <Button><Plus className="h-4 w-4" /> Invite teammate</Button>
      </div>
      <div className="mt-4 divide-y divide-midnight/5">
        {[[user.name, "Owner", credits], ["Jonas K.", "Member", 8], ["Aylin R.", "Member", 12]].map(([name, role, c]) => (
          <div key={name as string} className="flex items-center justify-between py-3 text-small">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-spree-subtle font-semibold text-spree-hover">
                {(name as string).charAt(0)}
              </span>
              <span className="font-medium text-midnight">{name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-ink-600">{c} credits</span>
              <Badge tone="muted">{role}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-h1">Welcome, {user.name.split(" ")[0]}</h1>
          <p className="text-body text-ink-600">Your bookings, wallet and perks.</p>
        </div>
        <LinkButton href="/explore">Book a desk</LinkButton>
      </div>

      <div className="mt-6">
        <Tabs
          tabs={[
            { label: "Overview", icon: <LayoutDashboard className="h-4 w-4" />, content: overview },
            { label: "Bookings", icon: <CalendarClock className="h-4 w-4" />, content: bookingsTab },
            { label: "Wallet", icon: <Wallet className="h-4 w-4" />, content: walletTab },
            { label: "Perks", icon: <Gift className="h-4 w-4" />, content: perksTab },
            { label: "Team", icon: <Users className="h-4 w-4" />, content: teamTab },
          ]}
        />
      </div>
    </div>
  );
}
