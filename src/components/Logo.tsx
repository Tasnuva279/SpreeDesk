import { cn } from "@/lib/cn";

// Fluid "S" tracing the river Spree; negative space hints at a desk.
export function Logo({
  className,
  mono,
}: {
  className?: string;
  mono?: boolean;
}) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-8 w-8", className)} aria-hidden>
      <rect width="32" height="32" rx="9" fill={mono ? "currentColor" : "#002B45"} />
      <path
        d="M22.5 10.5c-1.6-1.7-4.2-2-6.2-1-1.7.8-2.3 2.6-1.2 3.9 1 1.2 3 1.3 4.7 1.9 2 .7 3.8 2 3.8 4.3 0 2.9-2.9 4.9-6.2 4.9-2.6 0-5-.9-6.6-2.6"
        fill="none"
        stroke={mono ? "#fff" : "#1ABC9C"}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <rect x="9" y="21.5" width="14" height="1.8" rx="0.9" fill={mono ? "#fff" : "#1ABC9C"} opacity="0.5" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 font-head text-lg font-bold text-midnight", className)}>
      <Logo />
      SpreeDesk
    </span>
  );
}
