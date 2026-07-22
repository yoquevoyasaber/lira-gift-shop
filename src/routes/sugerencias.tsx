import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/sugerencias")({
  head: () => ({ meta: [{ title: "Sugerencias — Lira" }] }),
  component: Sugerencias,
});

function Sugerencias() {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSent(true);
    setText("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <AppShell>
      <div className="bg-primary/10 py-2 text-center text-sm font-semibold tracking-wide text-primary">
        SUGERENCIAS
      </div>
      <form onSubmit={submit} className="space-y-4 p-4">
        <p className="text-sm text-muted-foreground">
          Cuéntanos qué productos te gustaría ver o qué mejoras podríamos hacer en la app.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Escribe tu sugerencia aquí..."
          className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-50"
        >
          <Send className="h-4 w-4" /> Enviar sugerencia
        </button>
        {sent && (
          <div className="rounded-lg bg-primary/10 p-3 text-center text-sm font-semibold text-primary">
            ¡Gracias! Tu sugerencia fue enviada.
          </div>
        )}
      </form>
    </AppShell>
  );
}
