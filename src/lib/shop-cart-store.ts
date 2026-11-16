import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchStoreProducts, mutateCart, readShopifyCart, type ShopifyCart } from './shopify';
import { uidOf, type CartEntry } from './cart-rules';
type State = {
  cart: ShopifyCart | null; busy: boolean; error: string;
  reconcile: (items: CartEntry[]) => Promise<void>;
  sync: () => Promise<void>;
};
let queue = Promise.resolve();
export const useShopCart = create<State>()(persist((set, get) => ({
  cart: null, busy: false, error: '',
  reconcile: (items) => {
    queue = queue.catch(() => undefined).then(async () => {
      set({ busy: true, error: '' });
      try {
        if (!items.length) { set({ cart: null }); return; }
        const products = await fetchStoreProducts();
        const lines = items.map(item => {
          const variant = products.flatMap(p => p.variants.nodes).find(v => v.sku === item.id && v.availableForSale);
          if (!variant) throw new Error('Este combo no está cargado para venta en Shopify. Contacta a Lira.');
          return { merchandiseId: variant.id, quantity: item.qty, attributes: [
            { key: 'Lira unidad', value: uidOf(item) },
            ...(item.designId ? [{ key: 'Personalización', value: item.designId }] : []),
          ] };
        });
        let cart = get().cart;
        if (cart) cart = await readShopifyCart(cart.id);
        if (cart?.lines.nodes.length) cart = await mutateCart('cartLinesRemove', { cartId: cart.id, lineIds: cart.lines.nodes.map(l => l.id) });
        cart = cart ? await mutateCart('cartLinesAdd', { cartId: cart.id, lines }) : await mutateCart('cartCreate', { input: { lines } });
        set({ cart });
      } catch (e) { set({ error: e instanceof Error ? e.message : 'No se pudo conectar con el pago seguro.' }); }
      finally { set({ busy: false }); }
    });
    return queue;
  },
  sync: async () => {
    const cart = get().cart;
    if (!cart || get().busy) return;
    try { set({ cart: await readShopifyCart(cart.id) }); } catch (e) { set({ error: e instanceof Error ? e.message : 'No se pudo actualizar el carrito' }); }
  },
}), { name: 'lira-shopify-cart', partialize: s => ({ cart: s.cart }) }));