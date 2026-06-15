import Link from "next/link";
import { Wordmark } from "./Logo";
import { Linkedin, Instagram, Github, Globe } from "lucide-react";

export function Footer() {
  const cols = [
    { title: "Product", links: [["Locations", "/locations"], ["Perks", "/perks"], ["Pricing", "/pricing"]] },
    { title: "Operators", links: [["List your space", "/onboard"], ["Operator dashboard", "/dashboard/operator"]] },
    { title: "Company", links: [["About & roadmap", "/about"], ["Pricing", "/pricing"]] },
  ];
  return (
    <footer className="mt-20 border-t border-midnight/10 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Wordmark />
          <p className="mt-3 max-w-xs text-small text-ink-600">
            Any desk, any time. On-demand coworking across Berlin, with one pass.
          </p>
          <div className="mt-4 flex gap-2">
            {[Linkedin, Instagram, Github].map((Icon, i) => (
              <span key={i} className="hit grid place-items-center rounded-lg text-ink-600 ring-1 ring-midnight/10 hover:text-spree">
                <Icon className="h-5 w-5" />
              </span>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-small font-semibold text-midnight">{c.title}</p>
            <ul className="mt-3 space-y-2 text-small text-ink-600">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-spree">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-midnight/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-4 text-small text-ink-600">
          <span>© {new Date().getFullYear()} SpreeDesk · Berlin Edition · MVP demo</span>
          <button className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 hover:bg-ice" aria-label="Language: English / Deutsch">
            <Globe className="h-4 w-4" /> EN / DE
          </button>
        </div>
      </div>
    </footer>
  );
}
