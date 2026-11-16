export const SHOPIFY_DOMAIN = 'lira-gift-shop-1o9kp-ut3e08ca.myshopify.com';
const TOKEN = '2de37fcb5768a40f9b404ded551248f6';

export async function storefrontApiRequest<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2026-10/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`Shopify [${response.status}]: ${await response.text()}`);
  const body = await response.json() as { data: T; errors?: { message: string }[] };
  if (body.errors?.length) throw new Error(body.errors.map(e => e.message).join(', '));
  return body.data;
}

export type StoreProduct = {
  id: string; handle: string; title: string; description: string; tags: string[];
  images: { nodes: { url: string; altText: string | null }[] };
  variants: { nodes: { id: string; sku: string; availableForSale: boolean; price: { amount: string; currencyCode: string } }[] };
};
export async function fetchStoreProducts() {
  const data = await storefrontApiRequest<{ products: { nodes: StoreProduct[] } }>(`query {
    products(first: 100) { nodes { id handle title description tags images(first: 1) { nodes { url altText } }
    variants(first: 10) { nodes { id sku availableForSale price { amount currencyCode } } } } }
  }`);
  return data.products.nodes;
}

export type ShopifyLine = { id: string; quantity: number; attributes: { key: string; value: string }[] };
export type ShopifyCart = { id: string; checkoutUrl: string; totalQuantity: number; lines: { nodes: ShopifyLine[] } };
const fields = 'id checkoutUrl totalQuantity lines(first:100) { nodes { id quantity attributes { key value } } }';
export async function mutateCart(operation: 'cartCreate' | 'cartLinesAdd' | 'cartLinesRemove', variables: Record<string, unknown>) {
  const args = operation === 'cartCreate' ? '$input:CartInput!' : operation === 'cartLinesAdd' ? '$cartId:ID!,$lines:[CartLineInput!]!' : '$cartId:ID!,$lineIds:[ID!]!';
  const call = operation === 'cartCreate' ? 'input:$input' : operation === 'cartLinesAdd' ? 'cartId:$cartId,lines:$lines' : 'cartId:$cartId,lineIds:$lineIds';
  const data = await storefrontApiRequest<Record<string, { cart: ShopifyCart | null; userErrors: { message: string }[] }>>(`mutation(${args}) { ${operation}(${call}) { cart { ${fields} } userErrors { message } } }`, variables);
  const result = data[operation];
  if (result.userErrors.length) throw new Error(result.userErrors.map(e => e.message).join(', '));
  if (!result.cart) throw new Error('No se pudo crear el carrito de pago.');
  const url = new URL(result.cart.checkoutUrl);
  url.searchParams.set('channel', 'online_store');
  return { ...result.cart, checkoutUrl: url.toString() };
}

export async function readShopifyCart(id: string) {
  const data = await storefrontApiRequest<{ cart: ShopifyCart | null }>(`query($id:ID!) { cart(id:$id) { ${fields} } }`, { id });
  return data.cart;
}