import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Carousel } from "@/components/Carousel";
import { ProductImage } from "@/components/ProductImage";
import { CATEGORIES, getByCategory, type CategoryId } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lira — Combos de regalos personalizados" },
      {
        name: "description",
        content:
          "Lira: combos de regalos personalizados con rosas, dulces y detalles únicos para toda ocasión.",
      },
      { property: "og:title", content: "Lira — Combos de regalos personalizados" },
      {
        property: "og:description",
        content: "Combos de regalos personalizados para cada ocasión especial.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [cat, setCat] = useState<CategoryId>("general");
  const items = getByCategory(cat);

  return (
    <AppShell>
      <Carousel />

      <div className="bg-primary/10 py-2 text-center text-sm font-semibold tracking-wide text-primary">
        COMBOS DISPONIBLES
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-border bg-background px-2 py-2 scrollbar-hide">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              cat === c.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {c.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 p-3">
        {items.map((p) => (
          <div
            key={p.id}
            className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
          >
            <Link to="/producto/$id" params={{ id: p.id }}>
              <ProductImage src={p.image} alt={p.name} rounded="rounded-none" className="aspect-square w-full" />
            </Link>
            <div className="p-2">
              <Link
                to="/producto/$id"
                params={{ id: p.id }}
                className="block text-sm font-semibold text-foreground"
              >
                {p.name}
              </Link>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm font-bold text-primary">${p.price.toFixed(2)}</span>
                <Link
                  to="/producto/$id"
                  params={{ id: p.id }}
                  aria-label="Comprar"
                  className="rounded-md bg-primary p-1.5 text-primary-foreground"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-2 py-8 text-center text-sm text-muted-foreground">
            No hay productos en esta categoría todavía.
          </div>
        )}
      </div>
    </AppShell>
  );
}
