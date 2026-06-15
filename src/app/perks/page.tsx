import { db } from "@/lib/db";
import { PerksGallery } from "@/components/PerksGallery";

export default async function PerksPage() {
  // distinct by title so per-location perks don't repeat
  const perks = await db.perk.findMany({ distinct: ["title"], orderBy: { category: "asc" } });

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-h1">Perks Gallery</h1>
      <p className="mt-1 max-w-xl text-body text-ink-600">
        Member benefits from Berlin partners — redeemed with a QR at checkout. Filter by what you&apos;re after.
      </p>
      <div className="mt-8">
        <PerksGallery perks={perks} />
      </div>
    </div>
  );
}
