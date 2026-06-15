import { Wallet, Plus } from "lucide-react";

export function CreditWallet({
  credits,
  plan,
  max = 40,
}: {
  credits: number;
  plan?: string;
  max?: number;
}) {
  const pct = Math.min(100, Math.round((credits / max) * 100));
  return (
    <div className="rounded-2xl bg-gradient-to-br from-midnight to-spree p-6 text-white shadow-md">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-small text-white/80">
          <Wallet className="h-4 w-4" /> Credits Wallet
        </span>
        {plan && (
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">{plan}</span>
        )}
      </div>
      <p className="mt-3 font-head text-[40px] font-bold leading-none">{credits}</p>
      <p className="mt-1 text-small text-white/70">of {max} credits</p>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/20">
        <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-xs text-white/60">1 h = 1 · 1 day = 8</p>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-small font-semibold hover:bg-white/25">
          <Plus className="h-4 w-4" /> Top up
        </button>
      </div>
    </div>
  );
}
