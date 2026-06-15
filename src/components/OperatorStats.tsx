import { Users, Euro, CalendarCheck, Timer, TrendingUp } from "lucide-react";

function Stat({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-midnight/5">
      <div className="flex items-center justify-between">
        <span className="text-small text-ink-600">{label}</span>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-spree-subtle text-spree-hover">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-head text-h2 text-midnight">{value}</p>
      {sub && (
        <p className="mt-1 inline-flex items-center gap-1 text-xs text-spree-hover">
          <TrendingUp className="h-3 w-3" /> {sub}
        </p>
      )}
    </div>
  );
}

export function OperatorStats({
  occupancy,
  revenue,
  bookings,
  avgDwell,
}: {
  occupancy: number;
  revenue: number;
  bookings: number;
  avgDwell: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Stat label="Occupancy" value={`${occupancy}%`} sub="live" icon={Users} />
      <Stat label="Revenue (30d)" value={`€${revenue.toLocaleString()}`} sub="after commission" icon={Euro} />
      <Stat label="Bookings (30d)" value={`${bookings}`} icon={CalendarCheck} />
      <Stat label="Avg. dwell" value={`${avgDwell} h`} icon={Timer} />
    </div>
  );
}
