import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "./products";

export type CartItem = { id: string; qty: number; designId?: string };
export type DetailedItem = CartItem & { uid: string; product: Product };

type CartCtx = {
  items: CartItem[];
  add: (id: string, qty?: number, designId?: string) => void;
  remove: (uid: string) => void;
  clear: () => void;
  totalCount: number;
  totalPrice: number;
  detailed: DetailedItem[];
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "lira-cart-v1";

const uidOf = (i: CartItem) => (i.designId ? `${i.id}|${i.designId}` : i.id);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const add = (id: string, qty = 1, designId?: string) =>
    setItems((prev) => {
      const next = { id, qty, designId };
      const found = prev.find((i) => uidOf(i) === uidOf(next));
      if (found)
        return prev.map((i) => (uidOf(i) === uidOf(next) ? { ...i, qty: i.qty + qty } : i));
      return [...prev, next];
    });
  const remove = (uid: string) => setItems((prev) => prev.filter((i) => uidOf(i) !== uid));
  const clear = () => setItems([]);

  const detailed = items
    .map((i) => {
      const product = PRODUCTS.find((p) => p.id === i.id);
      return product ? { ...i, uid: uidOf(i), product } : null;
    })
    .filter(Boolean) as DetailedItem[];

  const totalCount = detailed.reduce((s, i) => s + i.qty, 0);
  const totalPrice = detailed.reduce((s, i) => s + i.qty * i.product.price, 0);

  return (
    <Ctx.Provider value={{ items, add, remove, clear, totalCount, totalPrice, detailed }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
