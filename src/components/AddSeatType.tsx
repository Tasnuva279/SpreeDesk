"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, AlertCircle, Loader2 } from "lucide-react";

const KINDS = [
  { value: "hotdesk", label: "Hotdesk" },
  { value: "meeting_room", label: "Meeting room" },
  { value: "private_office", label: "Private office" },
  { value: "event_venue", label: "Event venue" },
];

export function AddSeatType({ spaces }: { spaces: { id: string; name: string }[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [form, setForm] = useState({
    spaceId: spaces[0]?.id ?? "",
    kind: "hotdesk",
    label: "",
    pricePerHour: "",
    capacity: "1",
    available: "10",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function validate() {
    const e: Record<string, string> = {};
    if (!form.spaceId) e.spaceId = "Choose a space.";
    if (!form.label.trim()) e.label = "Label is required.";
    if (!(Number(form.pricePerHour) > 0)) e.pricePerHour = "Price must be greater than 0.";
    if (!(Number(form.capacity) >= 1)) e.capacity = "Capacity must be at least 1.";
    if (!(Number(form.available) >= 0)) e.available = "Cannot be negative.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;
    setBusy(true);
    const res = await fetch("/api/seattype", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setServerError(data.error ?? "Could not add seat type.");
    setOpen(false);
    setForm((f) => ({ ...f, label: "", pricePerHour: "" }));
    router.refresh();
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-spree px-4 py-2.5 text-small font-semibold text-white hover:bg-spree-hover">
        <Plus className="h-4 w-4" /> Add seat type
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-midnight/50 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg" noValidate>
            <div className="flex items-center justify-between">
              <h3 className="font-head text-h3">Add seat type</h3>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-lg text-ink-600 hover:bg-ice"><X className="h-5 w-5" /></button>
            </div>

            {serverError && (
              <p className="mt-4 flex items-center gap-2 rounded-lg bg-danger/10 px-3 py-2 text-small text-danger">
                <AlertCircle className="h-4 w-4 shrink-0" /> {serverError}
              </p>
            )}

            <div className="mt-4 space-y-3">
              <Field label="Space" error={errors.spaceId}>
                <select value={form.spaceId} onChange={(e) => set("spaceId", e.target.value)} className="field">
                  {spaces.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </Field>
              <Field label="Type" error={errors.kind}>
                <select value={form.kind} onChange={(e) => set("kind", e.target.value)} className="field">
                  {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
                </select>
              </Field>
              <Field label="Label" error={errors.label}>
                <input value={form.label} onChange={(e) => set("label", e.target.value)} placeholder="e.g. Quiet hotdesk" className="field" />
              </Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="€ / hour" error={errors.pricePerHour}>
                  <input type="number" min={1} value={form.pricePerHour} onChange={(e) => set("pricePerHour", e.target.value)} className="field" />
                </Field>
                <Field label="Capacity" error={errors.capacity}>
                  <input type="number" min={1} value={form.capacity} onChange={(e) => set("capacity", e.target.value)} className="field" />
                </Field>
                <Field label="Available" error={errors.available}>
                  <input type="number" min={0} value={form.available} onChange={(e) => set("available", e.target.value)} className="field" />
                </Field>
              </div>
            </div>

            <button disabled={busy} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-spree py-2.5 text-small font-semibold text-white hover:bg-spree-hover disabled:opacity-60">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Add seat type
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-small font-semibold text-midnight">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 inline-flex items-center gap-1 text-xs text-danger"><AlertCircle className="h-3 w-3" /> {error}</span>}
    </label>
  );
}
