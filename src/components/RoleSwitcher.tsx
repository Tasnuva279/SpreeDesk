"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, UserRound, Building2 } from "lucide-react";
import { AuthModal } from "./AuthModal";

export function RoleSwitcher({
  user,
}: {
  user: { name: string; role: string } | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/auth/switch", { method: "DELETE" });
    router.push("/");
    router.refresh();
    setBusy(false);
  }

  if (user) {
    return (
      <div className="flex items-center gap-3 text-small">
        <span className="hidden items-center gap-2 sm:flex">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-spree-subtle text-spree-hover">
            {user.role === "operator" ? <Building2 className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}
          </span>
          <span className="text-ink-600">
            {user.name.split(" ")[0]} · <span className="font-semibold text-spree-hover">{user.role}</span>
          </span>
        </span>
        <button
          onClick={logout}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium text-ink-600 ring-1 ring-midnight/15 hover:bg-midnight/5"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setAuthOpen(true)}
        className="rounded-lg bg-spree px-4 py-2 text-small font-semibold text-white shadow-sm hover:bg-spree-hover"
      >
        Log in / Sign up
      </button>
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}
