"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, PartyPopper, Upload, MapPin } from "lucide-react";
import { Button } from "@/components/ui";

type Form = {
  email: string; name: string; company: string; spaceName: string;
  color: string; address: string; desks: number; rooms: number; agree: boolean;
};

const COLORS = ["#1ABC9C", "#002B45", "#6C5CE7", "#E17055"];
const STEPS = ["Account", "Brand", "Location", "Inventory", "Legal", "Publish"];

export default function OnboardWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<Form>({
    email: "", name: "", company: "", spaceName: "",
    color: COLORS[0], address: "", desks: 20, rooms: 2, agree: false,
  });
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const canNext =
    (step === 0 && !!form.email && !!form.spaceName) ||
    step === 1 ||
    (step === 2 && !!form.address) ||
    step === 3 ||
    (step === 4 && form.agree) ||
    step === 5;

  async function publish() {
    setBusy(true);
    const res = await fetch("/api/onboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setBusy(false);
    if (res.ok) { setDone(true); setTimeout(() => { router.push("/dashboard/operator"); router.refresh(); }, 1400); }
    else alert(data.error ?? "Something went wrong");
  }

  if (done) {
    return (
      <div className="mx-auto grid max-w-md place-items-center px-5 py-24 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-spree-subtle text-spree">
          <PartyPopper className="h-8 w-8" />
        </span>
        <h1 className="mt-4 text-h2">You&apos;re live!</h1>
        <p className="mt-2 text-body text-ink-600">{form.spaceName} is now on the marketplace. Taking you to your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-12">
      <h1 className="text-h1">List your space</h1>
      <p className="text-body text-ink-600">Go live in about five minutes.</p>

      {/* progress bar */}
      <div className="mt-6 flex items-center gap-1.5">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1.5 rounded-full ${i <= step ? "bg-spree" : "bg-midnight/10"}`} />
            <p className={`mt-1.5 text-xs ${i === step ? "font-semibold text-midnight" : "text-ink-600"}`}>{s}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-midnight/5">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-h3">Account</h2>
            <Field label="Your email"><input className="field" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@space.com" /></Field>
            <Field label="Your name"><input className="field" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Max Operator" /></Field>
            <Field label="Space name"><input className="field" value={form.spaceName} onChange={(e) => set("spaceName", e.target.value)} placeholder="Spreebogen Loft" /></Field>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-h3">Brand</h2>
            <Field label="Company"><input className="field" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Spreebogen Spaces" /></Field>
            <Field label="Logo">
              <div className="flex h-24 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-midnight/15 text-small text-ink-600">
                <Upload className="h-4 w-4" /> Drag a logo or click to upload
              </div>
            </Field>
            <Field label="Colour preset">
              <div className="flex gap-3">
                {COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => set("color", c)} title={c} aria-label={`Colour ${c}`}
                    className={`h-10 w-10 rounded-xl ring-2 transition hover:scale-105 ${form.color === c ? "ring-midnight" : "ring-transparent hover:ring-midnight/30"}`} style={{ background: c }} />
                ))}
              </div>
            </Field>
            <div className="h-20 rounded-xl" style={{ background: `linear-gradient(135deg, ${form.color}, #002B45)` }} />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-h3">Location</h2>
            <Field label="Address"><input className="field" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Paulstraße 3, 10557 Berlin" /></Field>
            <div className="relative grid h-32 place-items-center overflow-hidden rounded-xl bg-[linear-gradient(135deg,#002B45,#1ABC9C)] text-white">
              <MapPin className="h-7 w-7" />
              <span className="absolute bottom-2 right-2 text-xs text-white/70">Drag pin to fine-tune</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Desks"><input className="field" type="number" value={form.desks} onChange={(e) => set("desks", Number(e.target.value))} /></Field>
              <Field label="Meeting rooms"><input className="field" type="number" value={form.rooms} onChange={(e) => set("rooms", Number(e.target.value))} /></Field>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-h3">Inventory & pricing</h2>
            <p className="text-small text-ink-600">Berlin defaults — adjust anytime from your dashboard, or bulk-upload a CSV.</p>
            <div className="space-y-2 text-small">
              <div className="flex justify-between rounded-xl bg-ice px-4 py-3"><span>Hotdesk</span><b>€3 / h · {form.desks} desks</b></div>
              <div className="flex justify-between rounded-xl bg-ice px-4 py-3"><span>Meeting room</span><b>€12 / h · {form.rooms} rooms</b></div>
            </div>
            <div className="flex h-16 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-midnight/15 text-small text-ink-600">
              <Upload className="h-4 w-4" /> Bulk-upload pricing CSV
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-h3">Legal & payout</h2>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#635BFF] px-4 py-3 text-small font-semibold text-white">
              Connect with Stripe
            </button>
            <p className="text-xs text-ink-600">Stripe Connect OAuth is stubbed in the MVP.</p>
            <label className="flex items-start gap-2 text-small text-ink-600">
              <input type="checkbox" checked={form.agree} onChange={(e) => set("agree", e.target.checked)} className="mt-0.5 h-4 w-4 accent-spree" />
              I accept the SpreeDesk operator terms and the revenue-share agreement.
            </label>
          </div>
        )}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-h3">Ready to publish</h2>
            <div className="rounded-xl bg-ice p-4 text-small">
              <p><b>{form.spaceName}</b> — {form.company || "your company"}</p>
              <p className="text-ink-600">{form.address}</p>
              <p className="text-ink-600">{form.desks} desks · {form.rooms} rooms</p>
            </div>
            <p className="text-small text-ink-600">Publishing creates your microsite and lists you in the marketplace.</p>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <Button variant="tertiary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>Continue</Button>
          ) : (
            <Button onClick={publish} loading={busy}>Publish space</Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-small font-semibold text-midnight">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
