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
      (p) =>
        `- id: ${p.id} | ${p.name} | $${p.price} | ${p.description} | Categorías: ${p.categories.join(", ")}`,
    ).join("\n");

    const ids = PRODUCTS.map((p) => p.id).join(", ");

    const system = `Eres el asistente de regalos de Lira, un emprendimiento de combos de regalos personalizados (rosas, dulces, detalles).

REGLAS ESTRICTAS:
1. SOLO puedes hablar y recomendar productos del catálogo de Lira que aparece abajo. Nunca inventes productos, precios ni marcas que no estén en el catálogo.
2. Si te preguntan algo que no tiene que ver con elegir un regalo de Lira, responde amablemente que solo puedes ayudar a escoger combos de Lira.
3. Haz preguntas breves sobre a quién va dirigido el regalo, la ocasión y el presupuesto antes de recomendar.
4. Responde en español, cálida y cercana, con emojis moderados y máximo 4 líneas.
5. Cuando recomiendes productos, TERMINA tu mensaje con una última línea exactamente con este formato:
[[PRODUCTOS: id1, id2]]
usando solo los ids del catálogo (máximo 2). Si todavía no recomiendas nada, no incluyas esa línea.

Ids válidos: ${ids}

Catálogo de Lira:
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
    const raw = json.choices?.[0]?.message?.content ?? "Lo siento, no pude responder.";

    const match = raw.match(/\[\[PRODUCTOS:([^\]]*)\]\]/i);
    const productIds = match
      ? match[1]
          .split(",")
          .map((s) => s.trim())
          .filter((id) => PRODUCTS.some((p) => p.id === id))
      : [];
    const content = raw.replace(/\[\[PRODUCTOS:[^\]]*\]\]/gi, "").trim();

    return { content, productIds };
  });
