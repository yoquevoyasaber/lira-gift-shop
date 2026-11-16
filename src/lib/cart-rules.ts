export type CartEntry = { id: string; qty: number; designId?: string };
export const uidOf = (i: CartEntry) => i.designId ? `${i.id}|${i.designId}` : i.id;
export function addCartEntry(items: CartEntry[], next: CartEntry): CartEntry[] {
  if (!Number.isInteger(next.qty) || next.qty < 1) throw new Error('Cantidad inválida');
  const existing = items.find(i => uidOf(i) === uidOf(next));
  return existing ? items.map(i => uidOf(i) === uidOf(next) ? { ...i, qty: i.qty + next.qty } : i) : [...items, next];
}
export function replaceOneUnit(items: CartEntry[], uid: string, designId: string): CartEntry[] {
  const item = items.find(i => uidOf(i) === uid);
  if (!item) throw new Error('Este producto ya no está en el carrito');
  const remaining = items.flatMap(i => uidOf(i) !== uid ? [i] : i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []);
  return addCartEntry(remaining, { id: item.id, qty: 1, designId });
}
export function requireAdminTest(isAdmin: boolean) {
  if (!isAdmin) throw new Error('Solo administradoras pueden hacer pruebas de pago');
}
export function validateDemoCard(number: string, expiry: string, cvc: string) {
  return number.replace(/\s/g, '') === '4242424242424242' && /^\d{2}\/\d{2}$/.test(expiry) && /^(0[1-9]|1[0-2])\//.test(expiry) && /^\d{3}$/.test(cvc);
}