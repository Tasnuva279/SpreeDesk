import { cn } from "@/lib/cn";
import Link from "next/link";
import { Loader2 } from "lucide-react";

/* ---------- Card ---------- */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-midnight/5",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ---------- Badge ---------- */
export function Badge({
  children,
  tone = "spree",
  className,
}: {
  children: React.ReactNode;
  tone?: "spree" | "midnight" | "muted" | "success" | "danger";
  className?: string;
}) {
  const tones: Record<string, string> = {
    spree: "bg-spree-subtle text-spree-hover",
    midnight: "bg-midnight/10 text-midnight",
    muted: "bg-ink-100 text-ink-600 ring-1 ring-midnight/5",
    success: "bg-ok/15 text-ok",
    danger: "bg-danger/10 text-danger",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/* ---------- Button ---------- */
const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-small font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<string, string> = {
  primary: "bg-spree text-white hover:bg-spree-hover shadow-sm",
  secondary: "bg-midnight text-white hover:bg-midnight/90",
  tertiary: "text-midnight hover:bg-midnight/5",
  destructive: "bg-danger text-white hover:bg-danger/90",
  outline: "ring-1 ring-midnight/15 text-midnight hover:bg-midnight/5",
};

type ButtonProps = {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  loading?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  variant = "primary",
  loading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonBase, variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <Link href={href} className={cn(buttonBase, variants[variant], className)}>
      {children}
    </Link>
  );
}

/* ---------- Section heading ---------- */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={cn(center && "text-center", "max-w-2xl")}>
      {eyebrow && (
        <p className="mb-2 text-small font-semibold uppercase tracking-wide text-spree">
          {eyebrow}
        </p>
      )}
      <h2 className="text-h2">{title}</h2>
      {subtitle && <p className="mt-2 text-body text-ink-600">{subtitle}</p>}
    </div>
  );
}
