import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy, Check, Upload, MessageCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { PAYMENT_INFO, whatsappOrderLink } from "@/lib/payment";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Finalizar compra — Lira" },
      { name: "description", content: "Completa tus datos y paga tu combo de regalo Lira." },
      { property: "og:title", content: "Finalizar compra — Lira" },
      { property: "og:description", content: "Completa tu pedido de Lira." },
    ],
  }),
  component: Checkout,
});

type Step = "form" | "pay" | "done";

function Checkout() {
  const { detailed, totalPrice, clear } = useCart();
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName((v) => v || profile.full_name);
      setPhone((v) => v || profile.phone);
      setAddress((v) => v || profile.address);
    }
  }, [profile]);

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/auth", search: { next: "/checkout" } });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <AppShell>
        <div className="p-10 text-center text-sm text-muted-foreground">Cargando…</div>
      </AppShell>
    );
  }

  if (step === "form" && detailed.length === 0) {
    return (
      <AppShell>
        <div className="p-10 text-center">
          <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>
          <Link to="/" className="mt-4 inline-block rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground">
            Ver productos
          </Link>
        </div>
      </AppShell>
    );
  }

  const createOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const total = totalPrice;
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total,
          full_name: fullName,
          phone,
          address,
          notes,
          status: "pending_payment",
        })
        .select("id")
        .single();
      if (error) throw error;

      const items = detailed.map((i) => ({
        order_id: order.id,
        product_id: i.product.id,
        product_name: i.product.name,
        unit_price: i.product.price,
        qty: i.qty,
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(items);
      if (itemsErr) throw itemsErr;

      await supabase.from("profiles").upsert({ id: user.id, full_name: fullName, phone, address });

      setOrderId(order.id);
      setOrderTotal(total);
      clear();
      setStep("pay");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "No se pudo crear el pedido");
    } finally {
      setBusy(false);
    }
  };

  const payTest = async () => {
    if (!orderId) return;
    setBusy(true);
    setErr("");
    try {
      await new Promise((r) => setTimeout(r, 1400));
      const { error } = await supabase
        .from("orders")
        .update({ status: "paid_test" })
        .eq("id", orderId);
      if (error) throw error;
      setStep("done");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "No se pudo procesar el pago de prueba");
    } finally {
      setBusy(false);
    }
  };

  const uploadReceipt = async (file: File) => {
    if (!orderId) return;
    setBusy(true);
    setErr("");
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/${orderId}.${ext}`;
      const { error } = await supabase.storage
        .from("comprobantes")
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const { error: upErr } = await supabase
        .from("orders")
        .update({ receipt_path: path, status: "payment_review" })
        .eq("id", orderId);
      if (upErr) throw upErr;
      setStep("done");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "No se pudo subir el comprobante");
    } finally {
      setBusy(false);
    }
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AppShell>
      <div className="bg-primary/10 py-2 text-center text-sm font-semibold tracking-wide text-primary">
        FINALIZAR COMPRA
      </div>

      <div className="p-4">
        {step === "form" && (
          <form onSubmit={createOrder} className="space-y-3">
            <div className="rounded-lg bg-secondary p-3">
              {detailed.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="text-secondary-foreground">
                    {i.qty}× {i.product.name}
                  </span>
                  <span className="font-semibold">${(i.qty * i.product.price).toFixed(2)}</span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-bold">
                <span>Total</span>
                <span className="text-primary">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Input value={fullName} onChange={setFullName} placeholder="Nombre completo" required />
            <Input value={phone} onChange={setPhone} placeholder="Teléfono / WhatsApp" required />
            <Input value={address} onChange={setAddress} placeholder="Dirección de entrega" required />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas para tu pedido (opcional)"
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
            />

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-60"
            >
              {busy ? "Creando pedido…" : "Confirmar pedido"}
            </button>
          </form>
        )}

        {step === "pay" && orderId && (
          <div className="space-y-4">
            <div className="rounded-lg bg-primary/10 p-4 text-center">
              <div className="text-sm text-muted-foreground">Pedido</div>
              <div className="text-lg font-bold text-primary">
                #{orderId.slice(0, 8).toUpperCase()}
              </div>
              <div className="mt-1 text-2xl font-bold text-foreground">
                ${orderTotal.toFixed(2)}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 text-sm">
              <div className="mb-2 font-bold text-foreground">Datos para la transferencia</div>
              <div className="mb-2 rounded-md bg-primary/10 p-2 text-xs font-semibold text-primary">
                MODO DE PRUEBA · ningún cobro real se procesa
              </div>
              <Row label="Banco" value={PAYMENT_INFO.bankName} />
              <Row label="Tipo" value={PAYMENT_INFO.accountType} />
              <Row label="Número" value={PAYMENT_INFO.accountNumber} />
              <Row label="Titular" value={PAYMENT_INFO.accountHolder} />
              <Row label="Cédula/RUC" value={PAYMENT_INFO.idNumber} />
              <Row label="Correo" value={PAYMENT_INFO.email} />
              <button
                onClick={() => void copy(PAYMENT_INFO.accountNumber)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm font-semibold"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copiado" : "Copiar número de cuenta"}
              </button>
            </div>

            <button
              onClick={() => void payTest()}
              disabled={busy}
              className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-60"
            >
              {busy ? "Procesando pago…" : "Pagar ahora (pago de prueba)"}
            </button>

            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-primary/50 p-6 text-center">
              <Upload className="h-8 w-8 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Subir comprobante de pago
              </span>
              <span className="text-xs text-muted-foreground">JPG, PNG o PDF</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                disabled={busy}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadReceipt(f);
                }}
              />
            </label>

            <a
              href={whatsappOrderLink(orderId, orderTotal)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-secondary py-3 text-sm font-semibold text-secondary-foreground"
            >
              <MessageCircle className="h-4 w-4" /> Escribirnos por WhatsApp
            </a>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold text-foreground">¡Pedido recibido! 🌸</h2>
            <p className="text-sm text-muted-foreground">
              Estamos verificando tu comprobante. Te contactaremos por WhatsApp para coordinar la
              entrega.
            </p>
            {orderId && (
              <a
                href={whatsappOrderLink(orderId, orderTotal)}
                target="_blank"
                rel="noreferrer"
                className="mt-2 rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground"
              >
                Avisar por WhatsApp
              </a>
            )}
            <Link to="/" className="mt-1 text-sm text-primary underline">
              Volver a la tienda
            </Link>
          </div>
        )}

        {err && (
          <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
            {err}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border/60 py-1.5 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <input
      value={value}
      required={required}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
    />
  );
}
