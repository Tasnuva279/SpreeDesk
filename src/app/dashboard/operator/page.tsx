import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  CalendarCheck,
  BarChart3,
  Megaphone,
  Settings,
  Plus,
  Download,
  Star,
} from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { OperatorStats } from "@/components/OperatorStats";
import { Sidebar } from "@/components/Sidebar";
import { AddSeatType } from "@/components/AddSeatType";
import { Badge, Button, LinkButton } from "@/components/ui";

export default async function OperatorDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (user.role !== "operator") redirect("/dashboard/member");

  const profile = await db.operatorProfile.findUnique({
    where: { userId: user.id },
    include: { spaces: { include: { seatTypes: true, bookings: { include: { user: true, seatType: true, space: true } } } } },
  });
  const spaces = profile?.spaces ?? [];
  const allBookings = spaces.flatMap((s) => s.bookings);
  const revenue = Math.round(allBookings.reduce((s, b) => s + b.amountPaid, 0));
  const booked = allBookings.length;
  const totalSeats = spaces.reduce((sum, s) => sum + s.seatTypes.reduce((a, t) => a + t.available, 0), 0);
  const occupancy = totalSeats + booked > 0 ? Math.min(100, Math.round((booked / (totalSeats + booked)) * 100)) : 0;
  const avgDwell = booked ? Math.round((allBookings.reduce((a, b) => a + b.hours, 0) / booked) * 10) / 10 : 0;

  // fake 7-day revenue series for the chart
  const series = [320, 410, 280, 520, 470, 610, Math.max(80, revenue % 700)];
  const maxBar = Math.max(...series);

  const overview = (
    <div className="space-y-6">
      {booked === 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-spree-subtle p-5 ring-1 ring-spree/20">
          <div>
            <p className="font-head text-h3 text-midnight">No bookings yet</p>
            <p className="text-small text-ink-600">Share your space link to get your first members in the door.</p>
          </div>
          {spaces[0] && (
            <Link href={`/space/${spaces[0].slug}`} className="inline-flex items-center gap-1.5 rounded-lg bg-spree px-4 py-2.5 text-small font-semibold text-white hover:bg-spree-hover">
              Share space link
            </Link>
          )}
        </div>
      )}
      <OperatorStats occupancy={occupancy} revenue={revenue} bookings={booked} avgDwell={avgDwell} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-midnight/5 lg:col-span-2">
          <p className="font-head text-h3">Revenue · last 7 days</p>
          <div className="mt-5 flex h-40 items-end gap-3">
            {series.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-spree/80 transition hover:bg-spree" style={{ height: `${(v / maxBar) * 100}%` }} />
                <span className="text-xs text-ink-600">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-midnight/5">
          <p className="font-head text-h3">Occupancy</p>
          <div className="mt-6 grid place-items-center">
            <div className="relative grid h-32 w-32 place-items-center rounded-full"
              style={{ background: `conic-gradient(#1ABC9C ${occupancy}%, #E6F7F4 0)` }}>
              <div className="grid h-24 w-24 place-items-center rounded-full bg-white">
                <span className="font-head text-h2 text-midnight">{occupancy}%</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-small text-ink-600">Live across {spaces.length} spaces</p>
        </div>
      </div>
    </div>
  );

  const inventory = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-h3">Inventory</h2>
        <AddSeatType spaces={spaces.map((s) => ({ id: s.id, name: s.name }))} />
      </div>
      {spaces.map((s) => (
        <div key={s.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-midnight/5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <Link href={`/space/${s.slug}`} className="font-head text-h3 hover:text-spree">{s.name}</Link>
              <p className="text-small text-ink-600">{s.address} · {s.desks} desks · {s.rooms} rooms</p>
            </div>
            <Badge tone="midnight">{s.bookings.length} bookings</Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {s.seatTypes.map((t) => (
              <span key={t.id} className="rounded-lg bg-ice px-4 py-2 text-small">
                {t.label}: <b>{t.available}</b> open · €{t.pricePerHour}/h
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const bookingsSection = (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-midnight/5">
      <table className="w-full text-left text-small">
        <thead className="bg-ice text-ink-600">
          <tr>
            <th className="px-5 py-3 font-semibold">Member</th>
            <th className="px-5 py-3 font-semibold">Space</th>
            <th className="px-5 py-3 font-semibold">Seat</th>
            <th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-midnight/5">
          {allBookings.map((b) => (
            <tr key={b.id} className="hover:bg-ice/60">
              <td className="px-5 py-4 font-medium text-midnight">{b.user.name}</td>
              <td className="px-5 py-4 text-ink-600">{b.space.name}</td>
              <td className="px-5 py-4 text-ink-600">{b.seatType.label}</td>
              <td className="px-5 py-4"><Badge tone="spree">{b.status}</Badge></td>
              <td className="px-5 py-4 text-right">
                <button className="text-small font-semibold text-danger hover:underline">Refund</button>
              </td>
            </tr>
          ))}
          {allBookings.length === 0 && (
            <tr><td colSpan={5} className="px-5 py-8 text-center text-ink-600">No bookings yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const analytics = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-h3">Analytics</h2>
        <Button variant="outline"><Download className="h-4 w-4" /> Export CSV</Button>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-midnight/5">
        <p className="font-head text-h3">Occupancy heatmap</p>
        <div className="mt-4 grid grid-cols-12 gap-1">
          {Array.from({ length: 84 }).map((_, i) => {
            const t = ((i * 37) % 100) / 100;
            // higher contrast: non-linear ramp, alpha 0.06 → 1.0
            const alpha = Math.round((0.06 + Math.pow(t, 1.5) * 0.94) * 100) / 100;
            const pct = Math.round(t * 100);
            return (
              <div
                key={i}
                title={`${pct}% occupied`}
                className="aspect-square rounded-sm ring-1 ring-midnight/5"
                style={{ background: `rgba(0,43,69,${alpha})` }}
              />
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-ink-600">
          <span>7 days × 12 hours</span>
          <span className="flex items-center gap-2" title="Cell colour = occupancy: lighter is quieter, darker is busier">
            Less
            {[0.1, 0.3, 0.55, 0.8, 1].map((a) => (
              <span key={a} className="h-3.5 w-3.5 rounded-sm ring-1 ring-midnight/5" style={{ background: `rgba(0,43,69,${a})` }} />
            ))}
            More
          </span>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-midnight/5">
        <p className="font-head text-h3">Top customers</p>
        <div className="mt-3 divide-y divide-midnight/5">
          {["Lena Professional", "Jonas K.", "Aylin R."].map((n, i) => (
            <div key={n} className="flex items-center justify-between py-3 text-small">
              <span className="font-medium text-midnight">{n}</span>
              <span className="text-ink-600">{12 - i * 3} bookings</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const community = (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-midnight/5">
        <p className="font-head text-h3">New announcement</p>
        <textarea className="field mt-3 h-24 resize-none" placeholder="Share news with your community…" />
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2">
            <Badge tone="muted">Newsletter</Badge>
            <Badge tone="muted">Referral codes</Badge>
          </div>
          <Button>Schedule</Button>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-midnight/5">
        <p className="font-head text-h3">Scheduled events</p>
        <div className="mt-3 divide-y divide-midnight/5 text-small">
          {[["Founder coffee morning", "Fri 09:00"], ["UX meetup", "Tue 18:30"]].map(([t, w]) => (
            <div key={t} className="flex items-center justify-between py-3">
              <span className="font-medium text-midnight">{t}</span>
              <span className="text-ink-600">{w}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const settings = (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-midnight/5">
        <p className="font-head text-h3">Billing</p>
        <div className="mt-3 flex items-center justify-between text-small">
          <span className="text-ink-600">Current plan</span>
          <Badge tone="spree">{profile?.plan}</Badge>
        </div>
        <p className="mt-2 text-small text-ink-600">Payouts via Stripe Connect (stubbed in MVP).</p>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-midnight/5">
        <p className="font-head text-h3">Microsite theme</p>
        <div className="mt-3 flex gap-3">
          {["#1ABC9C", "#002B45", "#6C5CE7", "#E17055"].map((c) => (
            <button key={c} title={c} aria-label={`Theme ${c}`} className="h-10 w-10 rounded-xl ring-1 ring-midnight/10 transition hover:scale-105 hover:ring-2 hover:ring-midnight/30" style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-h1">{profile?.company}</h1>
          <p className="inline-flex items-center gap-2 text-body text-ink-600">
            Plan <Badge tone="spree">{profile?.plan}</Badge>
            <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.7</span>
          </p>
        </div>
        <LinkButton href="/onboard" variant="outline"><Plus className="h-4 w-4" /> Add a space</LinkButton>
      </div>

      <Sidebar
        sections={[
          { label: "Overview", icon: <LayoutDashboard className="h-4 w-4" />, content: overview },
          { label: "Inventory", icon: <Boxes className="h-4 w-4" />, content: inventory },
          { label: "Bookings", icon: <CalendarCheck className="h-4 w-4" />, content: bookingsSection },
          { label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, content: analytics },
          { label: "Community", icon: <Megaphone className="h-4 w-4" />, content: community },
          { label: "Settings", icon: <Settings className="h-4 w-4" />, content: settings },
        ]}
      />
    </div>
  );
}
