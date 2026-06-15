import { Check } from "lucide-react";
import { LinkButton, SectionHeading, Badge } from "@/components/ui";
import { AddToCart } from "@/components/AddToCart";
import { memberPlans, operatorPlans } from "@/lib/plans";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 space-y-16">
      <div className="text-center">
        <Badge tone="spree">Transparent pricing</Badge>
        <h1 className="mt-4 text-h1">Plans for members and operators</h1>
        <p className="mx-auto mt-2 max-w-xl text-body text-ink-600">
          Professionals pay for what they use. Operators keep more as they grow.
        </p>
      </div>

      {/* Member plans */}
      <section id="passes" className="scroll-mt-24">
        <SectionHeading eyebrow="For professionals" title="Passes & memberships" subtitle="Add to cart and check out in seconds." />
        <div id="memberships" className="mt-8 grid gap-5 scroll-mt-24 sm:grid-cols-2 lg:grid-cols-4">
          {memberPlans.map((p) => (
            <div key={p.name} className={`flex flex-col rounded-2xl p-6 shadow-sm ring-1 ${p.highlight ? "bg-midnight text-white ring-midnight" : "bg-white ring-midnight/5"}`}>
              <div className="flex items-center justify-between">
                <p className="font-head text-h3">{p.name}</p>
                {p.highlight && <Badge tone="spree" className="bg-spree text-white">Popular</Badge>}
              </div>
              <p className="mt-3">
                <span className={`font-head text-h1 ${p.highlight ? "text-white" : "text-midnight"}`}>{p.price}</span>
                <span className={p.highlight ? "text-white/70" : "text-ink-600"}> {p.unit}</span>
              </p>
              <p className={`mt-2 text-small ${p.highlight ? "text-white/80" : "text-ink-600"}`}>{p.includes}</p>
              <ul className="mt-4 flex-1 space-y-2 text-small">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <Check className={`h-4 w-4 ${p.highlight ? "text-spree-subtle" : "text-spree"}`} />
                    <span className={p.highlight ? "text-white/90" : "text-ink-600"}>{perk}</span>
                  </li>
                ))}
              </ul>
              <AddToCart
                variant={p.highlight ? "primary" : "outline"}
                className="mt-6"
                label={`Add ${p.name}`}
                item={{ type: p.type, title: p.name, subtitle: p.includes, price: p.amount }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Operator plans */}
      <section>
        <SectionHeading eyebrow="For operators" title="Operator plans" subtitle="Commission drops as you scale." />
        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-midnight/5">
          <table className="w-full text-left text-small">
            <thead className="bg-ice text-ink-600">
              <tr>
                <th className="px-5 py-3 font-semibold">Plan</th>
                <th className="px-5 py-3 font-semibold">Monthly</th>
                <th className="px-5 py-3 font-semibold">Commission</th>
                <th className="px-5 py-3 font-semibold">Seats</th>
                <th className="hidden px-5 py-3 font-semibold md:table-cell">Key features</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight/5">
              {operatorPlans.map((p) => (
                <tr key={p.name} className="hover:bg-ice/60">
                  <td className="px-5 py-4 font-semibold text-midnight">{p.name}</td>
                  <td className="px-5 py-4">{p.price}</td>
                  <td className="px-5 py-4"><Badge tone="spree">{p.commission}</Badge></td>
                  <td className="px-5 py-4">{p.seats}</td>
                  <td className="hidden px-5 py-4 text-ink-600 md:table-cell">{p.features.join(" · ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 text-center">
          <LinkButton href="/onboard">List your space — free to start</LinkButton>
        </div>
      </section>
    </div>
  );
}
