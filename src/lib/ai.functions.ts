import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PRODUCTS } from "./products";

const Msg = z.object({ role: z.enum(["user", "assistant"]), content: z.string() });
const Input = z.object({ messages: z.array(Msg).min(1) });

export const chatGiftAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const catalog = PRODUCTS.map(
      (p) => `- ${p.name} ($${p.price}): ${p.description} [Categorías: ${p.categories.join(", ")}]`,
    ).join("\n");

    const system = `Eres el asistente de regalos de Lira, un emprendimiento de combos de regalos personalizados (rosas, dulces, detalles).
Ayuda al cliente a escoger el regalo perfecto haciendo preguntas breves sobre a quién va dirigido (mamá, pareja, amigo, XV años, graduación, cumpleaños), la ocasión y su presupuesto.
Sé cálida, cercana y usa emojis con moderación. Responde en español y siempre corto (máximo 4-5 líneas).
Al recomendar, sugiere 1 o 2 productos del catálogo mencionando su nombre y precio.

Catálogo disponible:
${catalog}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        messages: [{ role: "system", content: system }, ...data.messages],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) throw new Error("Demasiadas solicitudes, intenta en un momento.");
      if (res.status === 402) throw new Error("Créditos IA agotados. Contacta al administrador.");
      throw new Error(`Error IA [${res.status}]: ${body}`);
    }

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content ?? "Lo siento, no pude responder.";
    return { content };
  });
