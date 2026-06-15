"use client";

import { useState } from "react";
import { Plus, Check, ShoppingCart } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart";
import { cn } from "@/lib/cn";

export function AddToCart({
  item,
  variant = "primary",
  className,
  label = "Add to cart",
}: {
  item: Omit<CartItem, "id" | "qty">;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  label?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const styles: Record<string, string> = {
    primary: "bg-spree text-white hover:bg-spree-hover shadow-sm",
    outline: "ring-1 ring-midnight/15 text-midnight hover:bg-midnight/5",
    ghost: "text-spree hover:bg-spree-subtle",
  };

  return (
    <button
      onClick={() => {
        add(item);
        setAdded(true);
        setTimeout(() => setAdded(false), 1400);
      }}
      title={added ? "Added to cart" : label}
      aria-label={label}
      className={cn(
        "inline-flex min-w-[112px] items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-small font-semibold transition",
        styles[variant],
        className
      )}
    >
      {added ? <Check className="h-4 w-4 shrink-0" /> : variant === "primary" ? <ShoppingCart className="h-4 w-4 shrink-0" /> : <Plus className="h-4 w-4 shrink-0" />}
      {added ? "Added" : label}
    </button>
  );
}
