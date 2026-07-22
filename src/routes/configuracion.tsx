import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useSettings, type FontSize } from "@/lib/settings";
import { Moon, Sun, Type, Bell, Globe } from "lucide-react";

export const Route = createFileRoute("/configuracion")({
  head: () => ({ meta: [{ title: "Configuración — Lira" }] }),
  component: Configuracion,
});

function Configuracion() {
  const { dark, setDark, fontSize, setFontSize } = useSettings();

  return (
    <AppShell>
      <div className="bg-primary/10 py-2 text-center text-sm font-semibold tracking-wide text-primary">
        CONFIGURACIÓN
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
          <div className="flex items-center gap-3">
            {dark ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
            <div>
              <div className="font-semibold text-foreground">Modo oscuro</div>
              <div className="text-xs text-muted-foreground">Cambia el tono de la app</div>
            </div>
          </div>
          <button
            role="switch"
            aria-checked={dark}
            onClick={() => setDark(!dark)}
            className={`relative h-6 w-11 rounded-full transition ${dark ? "bg-primary" : "bg-muted"}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition ${dark ? "left-5" : "left-0.5"}`}
            />
          </button>
        </div>

        <div className="rounded-lg bg-secondary p-4">
          <div className="mb-3 flex items-center gap-3">
            <Type className="h-5 w-5 text-primary" />
            <div>
              <div className="font-semibold text-foreground">Tamaño de letra</div>
              <div className="text-xs text-muted-foreground">Ajusta el tamaño del texto</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(["sm", "md", "lg"] as FontSize[]).map((s) => (
              <button
                key={s}
                onClick={() => setFontSize(s)}
                className={`rounded-md py-2 text-sm font-semibold ${
                  fontSize === s ? "bg-primary text-primary-foreground" : "bg-background text-foreground border border-border"
                }`}
              >
                {s === "sm" ? "Pequeño" : s === "md" ? "Normal" : "Grande"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-secondary p-4 opacity-70">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <div className="font-semibold text-foreground">Notificaciones</div>
              <div className="text-xs text-muted-foreground">Próximamente</div>
            </div>
          </div>
          <div className="h-6 w-11 rounded-full bg-muted" />
        </div>

        <div className="flex items-center justify-between rounded-lg bg-secondary p-4 opacity-70">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-primary" />
            <div>
              <div className="font-semibold text-foreground">Idioma</div>
              <div className="text-xs text-muted-foreground">Español</div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
