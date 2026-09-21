import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GUAYAQUIL_ZONES, formatEcPhone, isValidEcPhone } from "@/lib/ecuador";
import { LOGO_URL } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth";

type Search = { next?: string };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    next: typeof s.next === "string" ? s.next : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Iniciar sesión — Lira" },
      { name: "description", content: "Entra o crea tu cuenta de Lira para guardar tus pedidos." },
      { property: "og:title", content: "Iniciar sesión — Lira" },
      { property: "og:description", content: "Entra o crea tu cuenta de Lira." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { next } = useSearch({ from: "/auth" });

  useEffect(() => {
    if (user) void navigate({ to: next ?? "/perfil" });
  }, [user, next, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    setBusy(true);
    try {
      if (mode === "register" && !isValidEcPhone(phone)) {
        throw new Error("El teléfono debe ser un celular de Ecuador (10 dígitos, empieza en 09).");
      }
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMsg("¡Bienvenida de vuelta! 🌸");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName, phone, address },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setMsg("Te enviamos un correo para confirmar tu cuenta. Revisa tu bandeja de entrada.");
        } else {
          setMsg("¡Cuenta creada! 🎉");
        }
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ocurrió un error");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setErr("");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) setErr(result.error.message ?? "No se pudo iniciar sesión con Google");
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setErr("");
    setMsg("");
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: fullName, phone, address });
    if (error) setErr(error.message);
    else {
      setMsg("Datos guardados ✨");
      await refreshProfile();
    }
    setBusy(false);
  };

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setPhone(profile.phone);
      setAddress(profile.address);
    }
  }, [profile]);

  if (loading) {
    return (
      <AppShell>
        <div className="p-10 text-center text-sm text-muted-foreground">Cargando…</div>
      </AppShell>
    );
  }

  if (user) {
    return (
      <AppShell>
        <div className="p-10 text-center text-sm text-muted-foreground">Abriendo tu perfil…</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-6">
        <div className="mb-6 flex flex-col items-center gap-2">
          <img src={LOGO_URL} alt="Lira" className="h-20 w-20 rounded-2xl shadow-lg dark:grayscale" />
          <h1 className="text-xl font-bold text-primary">Bienvenida a Lira</h1>
        </div>

        <div className="mb-4 grid grid-cols-2 rounded-lg bg-secondary p-1">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md py-2 text-sm font-semibold ${
                mode === m ? "bg-primary text-primary-foreground" : "text-secondary-foreground"
              }`}
            >
              {m === "login" ? "Iniciar sesión" : "Registrarse"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "register" && (
            <>
              <Field value={fullName} onChange={setFullName} placeholder="Nombre completo" required />
              <Field
                value={phone}
                onChange={(v) => setPhone(formatEcPhone(v))}
                placeholder="Celular de Ecuador (0968 718 145)"
                type="tel"
                required
              />
              <select
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Sector de entrega en Guayaquil…</option>
                {GUAYAQUIL_ZONES.map((z) => (
                  <option key={z.id} value={z.label}>
                    {z.label}
                  </option>
                ))}
              </select>
            </>
          )}
          <Field value={email} onChange={setEmail} placeholder="Correo electrónico" type="email" required />
          <Field
            value={password}
            onChange={setPassword}
            placeholder="Contraseña"
            type="password"
            required
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Un momento…" : mode === "login" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">o</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <button
          onClick={() => void google()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card py-3 text-sm font-semibold text-foreground"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z" />
            <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z" />
            <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1z" />
            <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
          </svg>
          Continuar con Google
        </button>

        <Messages msg={msg} err={err} />
      </div>
    </AppShell>
  );
}

function Messages({ msg, err }: { msg: string; err: string }) {
  return (
    <>
      {msg && (
        <div className="mt-4 rounded-lg bg-primary/10 p-3 text-center text-sm text-primary">{msg}</div>
      )}
      {err && (
        <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
          {err}
        </div>
      )}
    </>
  );
}

function Field({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      required={required}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
    />
  );
}
