import { Coffee, Bike, Dumbbell, Ticket, Sparkles } from "lucide-react";
import { Badge } from "./ui";

const icons: Record<string, React.ElementType> = {
  coffee: Coffee,
  mobility: Bike,
  wellness: Dumbbell,
  events: Ticket,
};

export function PerkCard({
  perk,
}: {
  perk: { title: string; partner: string; description: string; category: string };
}) {
  const Icon = icons[perk.category] ?? Sparkles;
  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-midnight/5 transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-spree-subtle text-spree-hover">
          <Icon className="h-5 w-5" />
        </span>
        <Badge tone="muted">{perk.category}</Badge>
      </div>
      <h3 className="font-head text-h3 leading-tight">{perk.title}</h3>
      <p className="text-small text-ink-600">{perk.description}</p>
      <p className="mt-auto pt-2 text-xs font-medium text-ink-600">
        by {perk.partner}
      </p>
    </div>
  );
}
