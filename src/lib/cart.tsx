import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "./products";
import { addCartEntry, replaceOneUnit, uidOf } from './cart-rules';
import { useShopCart } from './shop-cart-store';

export type CartItem = { id: string; qty: number; designId?: string };
export type DetailedItem = CartItem & { uid: string; product: Product };

type CartCtx = {
  items: CartItem[];
  add: (id: string, qty?: number, designId?: string) => void;
  remove: (uid: string) => void;
  clear: () => void;
  replaceUnit: (uid: string, designId: string) => void;
  totalCount: number;
  totalPrice: number;
  detailed: DetailedItem[];
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "lira-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  useEffect(() => {
    if (hydrated) void useShopCart.getState().reconcile(items);
  }, [items, hydrated]);
  useEffect(() => {
    const sync = () => { if (document.visibilityState === 'visible') void useShopCart.getState().sync(); };
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  const add = (id: string, qty = 1, designId?: string) =>
    setItems((prev) => addCartEntry(prev, { id, qty, designId }));
  const replaceUnit = (uid: string, designId: string) => setItems(prev => replaceOneUnit(prev, uid, designId));
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
    <Ctx.Provider value={{ items, add, replaceUnit, remove, clear, totalCount, totalPrice, detailed }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
