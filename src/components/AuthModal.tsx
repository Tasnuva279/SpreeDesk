"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Mail, Lock, User, AlertCircle, Loader2 } from "lucide-react";

type Mode = "signin" | "signup" | "reset";

export function AuthModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const validEmail = (e: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

  async function finish() {
    onClose();
    router.refresh();
  }

  async function signin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setInfo("");
    if (!validEmail(form.email)) return setError("Enter a valid email address.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setBusy(true);
    const res = await fetch("/api/auth/switch", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email }),
    });
    setBusy(false);
    if (!res.ok) return setError("No account found with that email. Try a demo account or sign up.");
    finish();
  }

  async function signup(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setInfo("");
    if (!form.name.trim()) return setError("Please enter your name.");
    if (!validEmail(form.email)) return setError("Enter a valid email address.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    setBusy(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Could not create account.");
    finish();
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validEmail(form.email)) return setError("Enter a valid email address.");
    setInfo("If an account exists for that email, a reset link is on its way.");
  }

  async function demo(email: string) {
    setBusy(true);
    await fetch("/api/auth/switch", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }),
    });
    setBusy(false);
    finish();
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-midnight/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-head text-h3">
            {mode === "signin" ? "Log in" : mode === "signup" ? "Create your account" : "Reset password"}
          </h2>
          <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-lg text-ink-600 hover:bg-ice">
            <X className="h-5 w-5" />
          </button>
        </div>

        {mode !== "reset" && (
          <div className="mt-4 grid grid-cols-2 rounded-xl bg-ice p-1 text-small font-semibold">
            <button onClick={() => { setMode("signin"); setError(""); }} className={`rounded-lg py-2 ${mode === "signin" ? "bg-white shadow-sm text-midnight" : "text-ink-600"}`}>Log in</button>
            <button onClick={() => { setMode("signup"); setError(""); }} className={`rounded-lg py-2 ${mode === "signup" ? "bg-white shadow-sm text-midnight" : "text-ink-600"}`}>Sign up</button>
          </div>
        )}

        {/* OAuth */}
        {mode !== "reset" && (
          <>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => demo("member@spreedesk.com")} className="rounded-lg py-2.5 text-small font-semibold ring-1 ring-midnight/15 hover:bg-ice">Continue with Google</button>
              <button onClick={() => demo("member@spreedesk.com")} className="rounded-lg py-2.5 text-small font-semibold ring-1 ring-midnight/15 hover:bg-ice">Continue with Apple</button>
            </div>
            <div className="my-4 flex items-center gap-3 text-xs text-ink-600">
              <span className="h-px flex-1 bg-midnight/10" /> or with email <span className="h-px flex-1 bg-midnight/10" />
            </div>
          </>
        )}

        {error && (
          <p className="mb-3 flex items-center gap-2 rounded-lg bg-danger/10 px-3 py-2 text-small text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </p>
        )}
        {info && <p className="mb-3 rounded-lg bg-spree-subtle px-3 py-2 text-small text-spree-hover">{info}</p>}

        {mode === "signin" && (
          <form onSubmit={signin} className="space-y-3">
            <IconField icon={Mail}><input type="email" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} className="w-full bg-transparent py-2.5 text-small outline-none" /></IconField>
            <IconField icon={Lock}><input type="password" placeholder="Password" value={form.password} onChange={(e) => set("password", e.target.value)} className="w-full bg-transparent py-2.5 text-small outline-none" /></IconField>
            <button type="button" onClick={() => { setMode("reset"); setError(""); }} className="text-small font-medium text-spree hover:underline">Forgot password?</button>
            <SubmitButton busy={busy}>Log in</SubmitButton>
            <p className="text-center text-xs text-ink-600">Demo: <button type="button" onClick={() => demo("member@spreedesk.com")} className="font-semibold text-spree">member</button> · <button type="button" onClick={() => demo("operator@spreedesk.com")} className="font-semibold text-spree">operator</button></p>
          </form>
        )}

        {mode === "signup" && (
          <form onSubmit={signup} className="space-y-3">
            <IconField icon={User}><input placeholder="Full name" value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full bg-transparent py-2.5 text-small outline-none" /></IconField>
            <IconField icon={Mail}><input type="email" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} className="w-full bg-transparent py-2.5 text-small outline-none" /></IconField>
            <IconField icon={Lock}><input type="password" placeholder="Password (min 6)" value={form.password} onChange={(e) => set("password", e.target.value)} className="w-full bg-transparent py-2.5 text-small outline-none" /></IconField>
            <IconField icon={Lock}><input type="password" placeholder="Confirm password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} className="w-full bg-transparent py-2.5 text-small outline-none" /></IconField>
            <SubmitButton busy={busy}>Create account</SubmitButton>
          </form>
        )}

        {mode === "reset" && (
          <form onSubmit={reset} className="space-y-3">
            <p className="text-small text-ink-600">Enter your email and we&apos;ll send a reset link.</p>
            <IconField icon={Mail}><input type="email" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} className="w-full bg-transparent py-2.5 text-small outline-none" /></IconField>
            <SubmitButton busy={busy}>Send reset link</SubmitButton>
            <button type="button" onClick={() => { setMode("signin"); setError(""); setInfo(""); }} className="text-small font-medium text-spree hover:underline">Back to log in</button>
          </form>
        )}
      </div>
    </div>
  );
}

function IconField({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-lg px-3 ring-1 ring-midnight/15 focus-within:ring-2 focus-within:ring-spree">
      <Icon className="h-4 w-4 text-ink-600" />
      {children}
    </div>
  );
}

function SubmitButton({ busy, children }: { busy: boolean; children: React.ReactNode }) {
  return (
    <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-spree py-2.5 text-small font-semibold text-white hover:bg-spree-hover disabled:opacity-60">
      {busy && <Loader2 className="h-4 w-4 animate-spin" />} {children}
    </button>
  );
}
