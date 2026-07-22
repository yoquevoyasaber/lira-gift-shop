import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { chatGiftAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Asistente de regalos — Lira" }] }),
  component: Chat,
});

type Msg = { role: "user" | "assistant"; content: string };

function Chat() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "¡Hola! 🌸 Soy tu asistente de regalos Lira. Cuéntame, ¿para quién es el regalo y cuál es la ocasión?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const call = useServerFn(chatGiftAssistant);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const res = await call({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.content }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col" style={{ minHeight: "calc(100vh - 8rem)" }}>
        <div className="bg-primary/10 py-2 text-center text-sm font-semibold tracking-wide text-primary">
          <Sparkles className="mr-1 inline h-3 w-3" /> ASISTENTE DE REGALOS
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-3">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-secondary px-3 py-2 text-sm text-muted-foreground">
                Pensando…
              </div>
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-destructive/10 p-2 text-xs text-destructive">{error}</div>
          )}
          <div ref={endRef} />
        </div>

        <form onSubmit={send} className="flex gap-2 border-t border-border bg-background p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje…"
            disabled={loading}
            className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Enviar"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
