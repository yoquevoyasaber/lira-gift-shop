import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, CreditCard, Lock, ShieldCheck, MessageCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useIsAdmin } from "@/lib/roles";
import { supabase } from "@/integrations/supabase/client";
import { whatsappOrderLink } from "@/lib/payment";
import { validateDemoCard } from "@/lib/cart-rules";
import { createAdminTestOrder } from "@/lib/admin-test.functions";
import { GUAYAQUIL_ZONES, formatEcPhone, isValidEcPhone, zoneLabel } from "@/lib/ecuador";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Finalizar compra — Lira" },
      { name: "description", content: "Completa tus datos de entrega y paga tu combo de regalo Lira con tarjeta." },
      { property: "og:title", content: "Finalizar compra — Lira" },
      { property: "og:description", content: "Paga tu combo de regalo Lira de forma segura." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Checkout,
});

type Step = "form" | "pay" | "done";
const fmtCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
const fmtExp = (v: string) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };
const brandOf = (n: string) => n.startsWith("4") ? "VISA" : /^5[1-5]/.test(n) ? "Mastercard" : /^3[47]/.test(n) ? "AMEX" : /^36|^30/.test(n) ? "Diners" : "";

function Checkout() {
  const { detailed, totalPrice, clear } = useCart();
  const { user, profile, loading } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [card, setCard] = useState("");
  const [holder, setHolder] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName((v) => v || profile.full_name);
      setPhone((v) => v || profile.phone);
      const z = GUAYAQUIL_ZONES.find((zz) => (profile.address ?? "").startsWith(zz.label));
      if (z) setZoneId((v) => v || z.id);
    }
  }, [profile]);

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/auth", search: { next: "/checkout" } });
  }, [loading, user, navigate]);

  if (loading || !user) return <AppShell><div className="p-10 text-center text-sm text-muted-foreground">Cargando…</div></AppShell>;

  if (step !== "done" && detailed.length === 0) {
    return (
      <AppShell>
        <div className="p-10 text-center">
          <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>
          <Link to="/" className="mt-4 inline-block rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground">Ver productos</Link>
        </div>
      </AppShell>
    );
  }

  const fullAddress = () => `${zoneLabel(zoneId)} · ${address}`;

  const toPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEcPhone(phone)) return setErr("El teléfono debe ser un celular de Ecuador (10 dígitos, empieza en 09).");
    if (!zoneId) return setErr("Elige uno de los sectores de entrega disponibles en Guayaquil.");
    setErr("");
    void supabase.from("profiles").upsert({ id: user.id, full_name: fullName, phone, address: fullAddress() });
    setStep("pay");
  };

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const digits = card.replace(/\s/g, "");
    if (digits.length < 15 || !/^\d{2}\/\d{2}$/.test(exp) || !/^\d{3,4}$/.test(cvc) || !holder.trim()) {
      return setErr("Revisa los datos de la tarjeta: número, nombre, vencimiento (MM/AA) y CVC.");
    }
    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      if (!isAdmin || !validateDemoCard(card, exp, cvc)) {
        throw new Error("Tu banco rechazó el pago. Verifica los datos o escríbenos por WhatsApp para pagar de otra forma.");
      }
      const res = await createAdminTestOrder({ data: {
        items: detailed.map((i) => ({ id: i.product.id, qty: i.qty, ...(i.designId ? { designId: i.designId } : {}) })),
        fullName, phone, address: fullAddress(), notes, last4: digits.slice(-4),
      } });
      setOrderId(res.id);
      setOrderTotal(res.total);
      clear();
      setStep("done");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "No se pudo procesar el pago");
    } finally {
      setBusy(false);
    }
  };

  const digits = card.replace(/\s/g, "");
  const brand = brandOf(digits);

  return (
    <AppShell>
      <div className="bg-primary/10 py-2 text-center text-sm font-semibold tracking-wide text-primary">
        {step === "form" ? "1 · DATOS DE ENTREGA" : step === "pay" ? "2 · PAGO" : "PEDIDO CONFIRMADO"}
      </div>
      <div className="space-y-4 p-4">
        {step !== "done" && (
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Tu compra</span>
            <div className="mt-3 space-y-1">
              {detailed.map((i) => (
                <div key={i.uid} className="flex justify-between text-sm text-muted-foreground">
                  <span>{i.qty}× {i.product.name}</span><span>${(i.qty * i.product.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-baseline justify-between border-t border-border pt-2">
              <span className="text-sm font-semibold text-foreground">Total</span>
              <span className="text-3xl font-bold text-foreground">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}

        {step === "form" && (
          <form onSubmit={toPay} className="space-y-3">
            <Input value={fullName} onChange={setFullName} placeholder="Nombre completo" required />
            <Input value={phone} onChange={(v) => setPhone(formatEcPhone(v))} placeholder="Celular de Ecuador (0968 718 145)" required />
            <select value={zoneId} onChange={(e) => setZoneId(e.target.value)} required className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none">
              <option value="">Sector de entrega en Guayaquil…</option>
              {GUAYAQUIL_ZONES.map((z) => <option key={z.id} value={z.id}>{z.label}{z.note ? ` (${z.note})` : ""}</option>)}
            </select>
            <Input value={address} onChange={setAddress} placeholder="Calle, número y referencia" required />
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas para tu pedido (opcional)" rows={2} className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none" />
            {err && <ErrBox msg={err} />}
            <button type="submit" className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground">Continuar al pago</button>
          </form>
        )}

        {step === "pay" && (
          <form onSubmit={pay} className="space-y-4">
            {isAdmin && (
              <div className="rounded-xl border border-dashed border-primary bg-primary/5 p-3 text-xs text-foreground">
                <div className="font-bold text-primary">Modo administradora · tarjeta de prueba</div>
                Número <b>4242 4242 4242 4242</b> · vencimiento cualquier fecha futura (ej. 12/30) · CVC <b>123</b>. No se cobra dinero real.
              </div>
            )}
            <div className="text-xs font-semibold text-muted-foreground">Elige tu método de pago</div>
            <div className="grid grid-cols-4 gap-2">
              {["VISA", "Mastercard", "Diners", "AMEX"].map((b) => (
                <div key={b} className={`rounded-lg border py-2 text-center text-[11px] font-bold ${brand === b ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"}`}>{b}</div>
              ))}
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center border-b border-border px-4">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <input inputMode="numeric" autoComplete="cc-number" value={card} onChange={(e) => setCard(fmtCard(e.target.value))} placeholder="1234 1234 1234 1234" className="w-full bg-transparent px-3 py-4 text-base tracking-wider text-foreground outline-none" />
                {brand && <span className="text-xs font-bold text-primary">{brand}</span>}
              </div>
              <input autoComplete="cc-name" value={holder} onChange={(e) => setHolder(e.target.value.toUpperCase())} placeholder="NOMBRE COMO APARECE EN LA TARJETA" className="w-full border-b border-border bg-transparent px-4 py-4 text-sm text-foreground outline-none" />
              <div className="grid grid-cols-2">
                <input inputMode="numeric" autoComplete="cc-exp" value={exp} onChange={(e) => setExp(fmtExp(e.target.value))} placeholder="MM / AA" className="border-r border-border bg-transparent px-4 py-4 text-base text-foreground outline-none" />
                <input inputMode="numeric" autoComplete="cc-csc" type="password" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="CVC" className="bg-transparent px-4 py-4 text-base text-foreground outline-none" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-secondary p-4">
              <div className="text-sm">
                <div className="text-muted-foreground">Medio de pago</div>
                <div className="font-semibold text-foreground">Tarjeta {digits.length >= 4 ? `***${digits.slice(-4)}` : ""}</div>
                <div className="mt-1 text-muted-foreground">Total a pagar</div>
                <div className="text-lg font-bold text-foreground">${totalPrice.toFixed(2)} USD</div>
              </div>
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
            {err && <ErrBox msg={err} />}
            <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-60">
              <Lock className="h-4 w-4" /> {busy ? "Procesando pago…" : `Pagar $${totalPrice.toFixed(2)}`}
            </button>
            <button type="button" onClick={() => setStep("form")} className="w-full text-sm text-primary underline">Cambiar datos de entrega</button>
            <p className="text-center text-[11px] text-muted-foreground">Conexión cifrada · No guardamos los datos de tu tarjeta</p>
          </form>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-8 w-8" /></div>
            <h2 className="text-lg font-bold text-foreground">¡Pago aprobado! 🌸</h2>
            {orderId && <p className="text-sm text-muted-foreground">Pedido #{orderId.slice(0, 8).toUpperCase()} · ${orderTotal.toFixed(2)}. Te contactaremos por WhatsApp para coordinar la entrega.</p>}
            {orderId && (
              <a href={whatsappOrderLink(orderId, orderTotal)} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-2 rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground">
                <MessageCircle className="h-4 w-4" /> Escribir a Lira por WhatsApp
              </a>
            )}
            <Link to="/perfil" className="text-sm text-primary underline">Ver mis pedidos</Link>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function ErrBox({ msg }: { msg: string }) {
  return <div className="rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">{msg}</div>;
}

function Input({ value, onChange, placeholder, required }: { value: string; onChange: (v: string) => void; placeholder: string; required?: boolean }) {
  return <input value={value} required={required} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none" />;
}
