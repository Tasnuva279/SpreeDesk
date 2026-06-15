"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string; // unique line id
  type: "pass" | "membership" | "room" | "office" | "event";
  title: string;
  subtitle: string;
  price: number; // unit price in EUR
  qty: number;
  spaceSlug?: string;
};

type CartCtx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "id" | "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "spreedesk_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const api = useMemo<CartCtx>(() => {
    const add: CartCtx["add"] = (item, qty = 1) => {
      setItems((cur) => {
        const key = `${item.type}:${item.title}:${item.spaceSlug ?? ""}`;
        const existing = cur.find((c) => `${c.type}:${c.title}:${c.spaceSlug ?? ""}` === key);
        if (existing) {
          return cur.map((c) => (c === existing ? { ...c, qty: c.qty + qty } : c));
        }
        return [...cur, { ...item, qty, id: key + ":" + cur.length }];
      });
    };
    return {
      items,
      add,
      remove: (id) => setItems((cur) => cur.filter((c) => c.id !== id)),
      setQty: (id, qty) =>
        setItems((cur) => cur.map((c) => (c.id === id ? { ...c, qty: Math.max(1, qty) } : c))),
      clear: () => setItems([]),
      count: items.reduce((n, c) => n + c.qty, 0),
      subtotal: items.reduce((s, c) => s + c.price * c.qty, 0),
    };
  }, [items]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
