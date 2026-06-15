import { Check } from "lucide-react";
import { Badge, SectionHeading } from "@/components/ui";

export default function AboutPage() {
  const roadmap = [
    { city: "Berlin", when: "Live now", done: true },
    { city: "Hamburg", when: "Q1 2027", done: false },
    { city: "Munich", when: "Q3 2027", done: false },
    { city: "Cologne", when: "2027", done: false },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 space-y-14">
      <div className="max-w-2xl">
        <Badge tone="spree">About</Badge>
        <h1 className="mt-4 text-h1">Coworking, without the commitment.</h1>
        <p className="mt-3 text-body text-ink-600">
          SpreeDesk lets any coworking space in Germany launch a full digital
          presence in under five minutes, and gives professionals on-demand
          access across the city with a single pass and curated perks.
        </p>
      </div>

      <section>
        <SectionHeading eyebrow="Expansion" title="Roadmap" subtitle="Berlin first, then the rest of Germany." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roadmap.map((r) => (
            <div key={r.city} className={`rounded-2xl p-6 shadow-sm ring-1 ${r.done ? "bg-midnight text-white ring-midnight" : "bg-white ring-midnight/5"}`}>
              <p className="font-head text-h3">{r.city}</p>
              <p className={`mt-1 inline-flex items-center gap-1 text-small ${r.done ? "text-spree-subtle" : "text-ink-600"}`}>
                {r.done && <Check className="h-4 w-4" />} {r.when}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
