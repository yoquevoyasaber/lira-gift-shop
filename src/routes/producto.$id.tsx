import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CATEGORIES, getProduct, PRODUCTS } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { ProductImage } from "@/components/ProductImage";

export const Route = createFileRoute("/producto/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Lira` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — Lira` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [{ title: "Producto no encontrado — Lira" }],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <AppShell>
      <div className="p-8 text-center text-muted-foreground">Producto no encontrado.</div>
    </AppShell>
  ),
  errorComponent: ({ error }) => (
    <AppShell>
      <div className="p-8 text-center text-destructive">{error.message}</div>
    </AppShell>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { add } = useCart();

  const catLabels = product.categories
    .map((c: string) => CATEGORIES.find((x) => x.id === c)?.label)
    .filter(Boolean)
    .join(", ");

  const similar = PRODUCTS.filter(
    (p) => p.id !== product.id && p.categories.some((c) => product.categories.includes(c)),
  ).slice(0, 4);

  const handleAdd = () => {
    add(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <AppShell>
      <div className="bg-primary/10 py-2 text-center text-sm font-semibold tracking-wide text-primary">
        INFO DEL PRODUCTO
      </div>

      <div className="p-3">
        <ProductImage src={product.image} alt={product.name} className="aspect-square w-full" imgClassName="p-4" />

        <div className="mt-3 flex items-center justify-between">
          <h1 className="text-lg font-bold uppercase text-foreground">{product.name}</h1>
          <span className="text-lg font-bold text-primary">/ ${product.price.toFixed(2)}</span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <p className="col-span-2 rounded-md bg-secondary p-2 text-xs text-secondary-foreground">
            {product.description}
          </p>
          <div className="rounded-md bg-secondary p-2 text-xs text-secondary-foreground">
            <div className="font-bold">CATEGORÍAS</div>
            <div className="mt-1">{catLabels}</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Menos"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-lg font-bold">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            aria-label="Más"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border"
          >
            <Plus className="h-4 w-4" />
          </button>
          <Link
            to="/personalizar/$id"
            params={{ id: product.id }}
            className="ml-2 flex items-center gap-2 rounded-md bg-primary px-5 py-2 font-semibold text-primary-foreground shadow"
          >
            <ShoppingCart className="h-5 w-5" /> Personalizar
          </Link>
        </div>
      </div>

      <div className="mt-4 bg-primary/10 py-2 text-center text-sm font-semibold tracking-wide text-primary">
        SIMILARES
      </div>

      <div className="grid grid-cols-2 gap-3 p-3">
        {similar.map((p) => (
          <Link
            key={p.id}
            to="/producto/$id"
            params={{ id: p.id }}
            className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
          >
            <ProductImage src={p.image} alt={p.name} rounded="rounded-none" className="aspect-square w-full" />
            <div className="p-2">
              <div className="text-xs font-semibold">{p.name}</div>
              <div className="text-xs font-bold text-primary">${p.price.toFixed(2)}</div>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
