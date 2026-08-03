import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send, Sparkles, ShoppingCart } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { chatGiftAssistant } from "@/lib/ai.functions";
import { getProduct } from "@/lib/products";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Asistente de regalos — Lira" },
      { name: "description", content: "Nuestra IA te ayuda a elegir el combo de regalo perfecto." },
      { property: "og:title", content: "Asistente de regalos — Lira" },
      { property: "og:description", content: "Encuentra el regalo perfecto con ayuda de la IA de Lira." },
    ],
  }),
  component: Chat,
});

type Msg = { role: "user" | "assistant"; content: string; productIds?: string[] };

function Chat() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "¡Hola! 🌸 Soy tu asistente de regalos Lira. Cuéntame, ¿para quién es el regalo y cuál es la ocasión?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const call = useServerFn(chatGiftAssistant);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

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
      const res = await call({
        data: { messages: next.map((m) => ({ role: m.role, content: m.content })) },
      });
      setMessages([
        ...next,
        { role: "assistant", content: res.content, productIds: res.productIds },
      ]);
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
            <div key={i} className="space-y-2">
              <div className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
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

              {m.productIds && m.productIds.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {m.productIds.map((id) => {
                    const p = getProduct(id);
                    if (!p) return null;
                    return (
                      <Link
                        key={id}
                        to="/producto/$id"
                        params={{ id }}
                        className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md"
                      >
                        <div className="flex h-32 items-center justify-center bg-secondary">
                          <img src={p.image} alt={p.name} className="h-full w-full object-contain p-1" />
                        </div>
                        <div className="p-2">
                          <div className="text-xs font-semibold text-foreground">{p.name}</div>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-xs font-bold text-primary">
                              ${p.price.toFixed(2)}
                            </span>
                            <span className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground">
                              <ShoppingCart className="h-3 w-3" /> Comprar
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
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
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje…"
            disabled={loading}
            className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
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
