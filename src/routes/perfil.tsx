import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Package, Settings, ShieldCheck, User as UserIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LOGO_URL } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useIsAdmin } from "@/lib/roles";
import {
  GUAYAQUIL_ZONES,
  formatEcPhone,
  isValidEcPhone,
  zoneLabel,
} from "@/lib/ecuador";
import { findProfanity } from "@/lib/profanity";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Mi perfil — Lira" },
      {
        name: "description",
        content: "Edita tus datos, tu dirección de entrega en Guayaquil y revisa tus compras en Lira.",
      },
      { property: "og:title", content: "Mi perfil — Lira" },
      { property: "og:description", content: "Tus datos y tu historial de compras en Lira." },
    ],
  }),
  component: Perfil,
});

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "Pendiente de pago",
  payment_review: "Comprobante en revisión",
  paid_test: "Pagado (prueba)",
  paid: "Pagado",
  preparing: "En preparación",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

/** Separa "Zona · detalle" guardado en el perfil. */
const splitAddress = (addr: string) => {
  const zone = GUAYAQUIL_ZONES.find((z) => addr.startsWith(z.label));
  return {
    zoneId: zone?.id ?? "",
    detail: zone ? addr.slice(zone.label.length).replace(/^\s*·\s*/, "") : addr,
  };
};

function Perfil() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [detail, setDetail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/auth", search: { next: "/perfil" } });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name);
    setPhone(formatEcPhone(profile.phone));
    const a = splitAddress(profile.address ?? "");
    setZoneId(a.zoneId);
    setDetail(a.detail);
  }, [profile]);

  const orders = useQuery({
    queryKey: ["orders", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, total, status, created_at, payment_method, address, order_items(product_name, qty)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setErr("");
    setMsg("");
    const bad = findProfanity(`${fullName} ${detail}`);
    if (bad) return setErr(`La palabra “${bad}” no está permitida.`);
    if (!fullName.trim()) return setErr("Escribe tu nombre completo.");
    if (!isValidEcPhone(phone)) return setErr("El teléfono debe ser de Ecuador (ej: 0968 718 145).");
    if (!zoneId) return setErr("Elige uno de los sectores de entrega disponibles.");
    if (detail.trim().length < 5) return setErr("Agrega la calle y número o villa de tu dirección.");

    setBusy(true);
    const address = `${zoneLabel(zoneId)} · ${detail.trim()}`;
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: fullName.trim(), phone, address });
    if (error) setErr(error.message);
    else {
      setMsg("Datos guardados ✨");
      await refreshProfile();
    }
    setBusy(false);
  };

  if (loading || !user) {
    return (
      <AppShell>
        <div className="p-10 text-center text-sm text-muted-foreground">Cargando…</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="bg-primary/10 py-2 text-center text-sm font-semibold tracking-wide text-primary">
        MI PERFIL
      </div>

      <div className="space-y-6 p-4">
        <div className="flex flex-col items-center gap-2">
          <img src={LOGO_URL} alt="Lira" className="h-16 w-16 rounded-2xl shadow dark:grayscale" />
          <h1 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <UserIcon className="h-5 w-5 text-primary" />
            {profile?.full_name || "Tu cuenta"}
          </h1>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          {isAdmin && (
            <Link
              to="/admin"
              className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Menú de administradora
            </Link>
          )}
        </div>

        <form onSubmit={save} className="space-y-3 rounded-xl border border-border bg-card p-4">
          <div className="text-sm font-bold text-foreground">Mis datos</div>

          <Labeled label="Nombre completo">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputCls}
              placeholder="Ej: Elizabeth Peralta"
            />
          </Labeled>

          <Labeled label="Teléfono (Ecuador)">
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-border px-3 py-2.5 text-sm text-muted-foreground">
                🇪🇨 +593
              </span>
              <input
                value={phone}
                inputMode="numeric"
                placeholder="0968 718 145"
                onChange={(e) => setPhone(formatEcPhone(e.target.value))}
                className={`${inputCls} flex-1`}
              />
            </div>
            {phone && !isValidEcPhone(phone) && (
              <p className="mt-1 text-xs text-destructive">
                Debe ser un celular ecuatoriano de 10 dígitos que empiece en 09.
              </p>
            )}
          </Labeled>

          <Labeled label="Sector de entrega (Guayaquil)">
            <select
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              className={inputCls}
            >
              <option value="">Elige un sector…</option>
              {GUAYAQUIL_ZONES.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.label}
                  {z.note ? ` (${z.note})` : ""}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted-foreground">
              Solo entregamos en estos sectores verificados de Guayaquil y alrededores.
            </p>
          </Labeled>

          <Labeled label="Calle, número y referencia">
            <input
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              className={inputCls}
              placeholder="Ej: Mz 12 Villa 8, frente al parque"
            />
          </Labeled>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Guardando…" : "Guardar cambios"}
          </button>

          {msg && <p className="text-center text-sm text-primary">{msg}</p>}
          {err && <p className="text-center text-sm text-destructive">{err}</p>}
        </form>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
            <Package className="h-4 w-4 text-primary" /> Historial de compras
          </div>
          {orders.isLoading && <p className="text-sm text-muted-foreground">Cargando pedidos…</p>}
          {orders.data && orders.data.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Todavía no tienes compras. ¡Tu primer combo te espera! 🌸
            </p>
          )}
          <div className="space-y-3">
            {orders.data?.map((o) => (
              <div key={o.id} className="rounded-lg bg-secondary p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-secondary-foreground">
                    #{o.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span className="font-bold text-primary">${Number(o.total).toFixed(2)}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {new Date(o.created_at).toLocaleDateString("es-EC", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · {STATUS_LABEL[o.status] ?? o.status}
                </div>
                <ul className="mt-1 text-xs text-secondary-foreground">
                  {o.order_items?.map((it, i) => (
                    <li key={i}>
                      {it.qty}× {it.product_name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to="/configuracion"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm font-semibold text-foreground"
          >
            <Settings className="h-4 w-4" /> Configuración
          </Link>
          <button
            onClick={() => void signOut()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm font-semibold text-foreground"
          >
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </div>
      </div>
    </AppShell>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none";

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
