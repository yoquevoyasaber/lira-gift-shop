import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, ShoppingBag } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/carrito")({
  head: () => ({ meta: [{ title: "Carrito — Lira" }] }),
  component: Carrito,
});

function Carrito() {
  const { detailed, remove, clear, totalPrice, totalCount } = useCart();

  return (
    <AppShell>
      <div className="bg-primary/10 py-2 text-center text-sm font-semibold tracking-wide text-primary">
        MI CARRITO
      </div>

      {detailed.length === 0 ? (
        <div className="flex flex-col items-center gap-3 p-10 text-center">
          <ShoppingBag className="h-16 w-16 text-primary/40" />
          <h2 className="text-lg font-bold text-foreground">Tu carrito está vacío</h2>
          <p className="text-sm text-muted-foreground">
            Aún no has añadido ningún combo. Explora nuestros productos y encuentra el regalo perfecto.
          </p>
          <Link
            to="/"
            className="mt-2 rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="p-3">
          <div className="space-y-3">
            {detailed.map((i) => (
              <div key={i.id} className="flex gap-3 rounded-lg border border-border bg-card p-2 shadow-sm">
                <img src={i.product.image} alt={i.product.name} className="h-20 w-20 rounded-md object-cover" />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{i.product.name}</div>
                    <div className="text-xs text-muted-foreground">Cantidad: {i.qty}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">
                      ${(i.product.price * i.qty).toFixed(2)}
                    </span>
                    <button
                      onClick={() => remove(i.id)}
                      aria-label="Eliminar"
                      className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-secondary p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Productos</span>
              <span className="font-semibold">{totalCount}</span>
            </div>
            <div className="mt-1 flex justify-between text-base">
              <span className="font-bold text-foreground">Total</span>
              <span className="font-bold text-primary">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button className="mt-4 w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground">
            Finalizar compra
          </button>
          <button onClick={clear} className="mt-2 w-full py-2 text-sm text-muted-foreground underline">
            Vaciar carrito
          </button>
        </div>
      )}
    </AppShell>
  );
}
