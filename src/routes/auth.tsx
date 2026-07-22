import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { LOGO_URL } from "@/lib/products";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Iniciar sesión — Lira" }] }),
  component: Auth,
});

function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [msg, setMsg] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("Función próximamente disponible. ¡Gracias por tu paciencia!");
  };

  return (
    <AppShell>
      <div className="p-6">
        <div className="mb-6 flex flex-col items-center gap-2">
          <img src={LOGO_URL} alt="Lira" className="h-20 w-20 rounded-2xl shadow-lg" />
          <h1 className="text-xl font-bold text-primary">Bienvenida a Lira</h1>
        </div>

        <div className="mb-4 grid grid-cols-2 rounded-lg bg-secondary p-1">
          <button
            onClick={() => setMode("login")}
            className={`rounded-md py-2 text-sm font-semibold ${mode === "login" ? "bg-primary text-primary-foreground" : "text-secondary-foreground"}`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => setMode("register")}
            className={`rounded-md py-2 text-sm font-semibold ${mode === "register" ? "bg-primary text-primary-foreground" : "text-secondary-foreground"}`}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "register" && (
            <input
              type="text"
              placeholder="Nombre completo"
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />
          )}
          <input
            type="email"
            placeholder="Correo electrónico"
            required
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground"
          >
            {mode === "login" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

        {msg && (
          <div className="mt-4 rounded-lg bg-primary/10 p-3 text-center text-sm text-primary">
            {msg}
          </div>
        )}
      </div>
    </AppShell>
  );
}
