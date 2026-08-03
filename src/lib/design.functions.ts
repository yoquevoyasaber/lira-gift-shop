import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

const gatewayError = (status: number, body: string) => {
  if (status === 429) return new Error("Demasiadas solicitudes, intenta en un momento.");
  if (status === 402) return new Error("Créditos de IA agotados. Contacta al administrador.");
  return new Error(`Error de IA [${status}]: ${body.slice(0, 200)}`);
};

const AnalyzeInput = z.object({
  image: z.string().min(20),
  kind: z.enum(["person", "background"]),
});

/** Analiza una imagen subida y decide si es apta. */
export const analyzeImage = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => AnalyzeInput.parse(d))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Falta LOVABLE_API_KEY");

    const rules =
      data.kind === "person"
        ? `Debe APROBARSE solo si: la imagen muestra claramente a una persona (foto real o ilustración/pixel art de una persona), es decente, sin desnudos, ropa interior, contenido sexual, violencia, sangre, drogas ni texto ofensivo. RECHAZA si no hay ninguna persona (paisajes, objetos, mascotas solas, memes, capturas de pantalla).`
        : `Esta imagen se usará como FONDO de un llavero. Debe APROBARSE solo si es un fondo liso, textura, patrón, degradado o diseño abstracto/decorativo no explícito. RECHAZA fotografías comunes (parques, personas, mascotas, edificios, paisajes, comida) y cualquier contenido explícito, violento u ofensivo.`;

    const res = await fetch(GATEWAY, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        messages: [
          {
            role: "system",
            content: `Eres un moderador de imágenes. ${rules} Responde SOLO con JSON válido: {"ok": true|false, "reason": "motivo breve en español"}`,
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analiza esta imagen y responde el JSON." },
              { type: "image_url", image_url: { url: data.image } },
            ],
          },
        ],
      }),
    });

    if (!res.ok) throw gatewayError(res.status, await res.text());
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = json.choices?.[0]?.message?.content ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return { ok: false, reason: "No se pudo analizar la imagen, intenta con otra." };
    try {
      const parsed = JSON.parse(match[0]) as { ok?: boolean; reason?: string };
      return {
        ok: Boolean(parsed.ok),
        reason: parsed.reason ?? (parsed.ok ? "Imagen aprobada" : "Imagen no permitida"),
      };
    } catch {
      return { ok: false, reason: "No se pudo analizar la imagen, intenta con otra." };
    }
  });

const PixelInput = z.object({ image: z.string().min(20) });

/** Convierte la foto aprobada en un retrato pixel art. */
export const toPixelArt = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PixelInput.parse(d))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Falta LOVABLE_API_KEY");

    const res = await fetch(GATEWAY, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Convierte a esta persona en un retrato estilo pixel art de 16 bits, busto y cabeza, colores suaves y limpios, fondo blanco liso, conservando peinado, color de piel y ropa. Sin texto ni marcos.",
              },
              { type: "image_url", image_url: { url: data.image } },
            ],
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!res.ok) throw gatewayError(res.status, await res.text());
    const json = (await res.json()) as {
      choices?: {
        message?: {
          images?: { image_url?: { url?: string } }[];
          content?: string | { type?: string; image_url?: { url?: string } }[];
        };
      }[];
    };
    const msg = json.choices?.[0]?.message;
    let url = msg?.images?.[0]?.image_url?.url;
    if (!url && Array.isArray(msg?.content)) {
      url = msg.content.find((c) => c?.image_url?.url)?.image_url?.url;
    }
    if (!url) throw new Error("La IA no devolvió la imagen pixel art, intenta de nuevo.");
    return { image: url };
  });
