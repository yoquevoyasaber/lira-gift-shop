import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, RefreshCw, CreditCard, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useIsAdmin } from "@/lib/roles";
import { PRODUCTS } from "@/lib/products";
import { whatsappLink } from "@/lib/payment";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administración — Lira" },
      {
        name: "description",
        content: "Panel interno de Lira: pedidos, estados y compras de prueba.",
      },
      { property: "og:title", content: "Administración — Lira" },
      { property: "og:description", content: "Panel interno de Lira." },
    ],
  }),
  component: Admin,
});

const STATUSES = [
  "pending_payment",
  "payment_review",
  "paid_test",
  "paid",
  "preparing",
  "delivered",
  "cancelled",
] as const;

const LABEL: Record<string, string> = {
  pending_payment: "Pendiente de pago",
  payment_review: "Comprobante en revisión",
  paid_test: "Pagado (prueba)",
  paid: "Pagado",
  preparing: "En preparación",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

function Admin() {
  const { user, loading } = useAuth();
  const { isAdmin, checking } = useIsAdmin();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [testProduct, setTestProduct] = useState(PRODUCTS[0]!.id);

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/auth", search: { next: "/admin" } });
  }, [loading, user, navigate]);

  const orders = useQuery({
    queryKey: ["admin-orders"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, total, status, created_at, full_name, phone, address, notes, payment_method, receipt_path, order_items(product_name, qty, unit_price)",
        )
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const setStatus = async (id: string, status: string) => {
    setBusy(true);
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    setMsg(error ? error.message : "Estado actualizado");
    await orders.refetch();
    setBusy(false);
  };

  const removeOrder = async (id: string) => {
    setBusy(true);
    await supabase.from("order_items").delete().eq("order_id", id);
    const { error } = await supabase.from("orders").delete().eq("id", id);
    setMsg(error ? error.message : "Pedido de prueba eliminado");
    await orders.refetch();
    setBusy(false);
  };

  /** Compra directa dentro de la app: sin transferencia, se marca pagada al instante. */
  const directPurchase = async () => {
    if (!user) return;
    const p = PRODUCTS.find((x) => x.id === testProduct);
    if (!p) return;
    setBusy(true);
    setMsg("");
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total: p.price,
        full_name: "Compra de prueba (admin)",
        phone: "0968718145",
        address: "Prueba interna Lira",
        notes: "Compra directa desde el panel de administración",
        status: "paid_test",
        payment_method: "app_direct",
      })
      .select("id")
      .single();
    if (error) {
      setMsg(error.message);
      setBusy(false);
      return;
    }
    await supabase.from("order_items").insert({
      order_id: order.id,
      product_id: p.id,
      product_name: p.name,
      unit_price: p.price,
      qty: 1,
    });
    setMsg(`Compra directa creada y pagada: ${p.name}`);
    await orders.refetch();
    setBusy(false);
  };

  if (loading || checking) {
    return (
      <AppShell>
        <div className="p-10 text-center text-sm text-muted-foreground">Cargando…</div>
      </AppShell>
    );
  }

  if (!isAdmin) {
    return (
      <AppShell>
        <div className="space-y-3 p-10 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
          <p className="text-sm text-muted-foreground">
            Esta sección es solo para el equipo de Lira.
          </p>
          <Link to="/" className="inline-block text-sm text-primary underline">
            Volver a la tienda
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="bg-primary/10 py-2 text-center text-sm font-semibold tracking-wide text-primary">
        PANEL DE ADMINISTRACIÓN
      </div>

      <div className="space-y-5 p-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
            <CreditCard className="h-4 w-4 text-primary" /> Compra directa de prueba
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Crea un pedido pagado al instante dentro de la app, sin transferencia ni comprobante.
          </p>
          <select
            value={testProduct}
            onChange={(e) => setTestProduct(e.target.value)}
            className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground"
          >
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — ${p.price.toFixed(2)}
              </option>
            ))}
          </select>
          <button
            onClick={() => void directPurchase()}
            disabled={busy}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            Comprar ahora (pago directo de prueba)
          </button>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">Pedidos ({orders.data?.length ?? 0})</h2>
          <button
            onClick={() => void orders.refetch()}
            className="flex items-center gap-1 text-xs font-semibold text-primary"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Actualizar
          </button>
        </div>

        {msg && (
          <div className="rounded-lg bg-primary/10 p-2 text-center text-xs font-semibold text-primary">
            {msg}
          </div>
        )}

        {orders.isLoading && <p className="text-sm text-muted-foreground">Cargando pedidos…</p>}
        {orders.data?.length === 0 && (
          <p className="text-sm text-muted-foreground">Todavía no hay pedidos registrados.</p>
        )}

        <div className="space-y-3">
          {orders.data?.map((o) => (
            <div key={o.id} className="rounded-xl border border-border bg-card p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">#{o.id.slice(0, 8).toUpperCase()}</span>
                <span className="font-bold text-primary">${Number(o.total).toFixed(2)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(o.created_at).toLocaleString("es-EC")} ·{" "}
                {o.payment_method === "app_direct" ? "Pago en la app" : "Transferencia"}
              </div>
              <div className="mt-1 text-xs text-foreground">
                {o.full_name} · {o.phone}
              </div>
              <div className="text-xs text-muted-foreground">{o.address}</div>
              {o.notes && <div className="text-xs italic text-muted-foreground">“{o.notes}”</div>}
              <ul className="mt-1 text-xs text-foreground">
                {o.order_items?.map((it, i) => (
                  <li key={i}>
                    {it.qty}× {it.product_name} (${Number(it.unit_price).toFixed(2)})
                  </li>
                ))}
              </ul>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <select
                  value={o.status}
                  disabled={busy}
                  onChange={(e) => void setStatus(o.id, e.target.value)}
                  className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {LABEL[s]}
                    </option>
                  ))}
                </select>
                <a
                  href={whatsappLink(
                    `Hola ${o.full_name}, te escribimos de Lira por tu pedido #${o.id.slice(0, 8).toUpperCase()} 🌸`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground"
                >
                  WhatsApp
                </a>
                <button
                  onClick={() => void removeOrder(o.id)}
                  disabled={busy}
                  className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
