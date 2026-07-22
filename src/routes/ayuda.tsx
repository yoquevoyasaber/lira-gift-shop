import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/ayuda")({
  head: () => ({ meta: [{ title: "Ayuda — Lira" }] }),
  component: Ayuda,
});

const FAQS = [
  { q: "¿Cómo hago un pedido?", a: "Elige el combo que más te guste, selecciona la cantidad y presiona Comprar. También puedes pedirle al asistente IA una recomendación." },
  { q: "¿Cuánto tarda la entrega?", a: "Las entregas locales tardan entre 24 y 48 horas. Para pedidos personalizados grandes se coordina la fecha por WhatsApp." },
  { q: "¿Puedo personalizar mi combo?", a: "¡Claro! Escríbenos por WhatsApp o al correo con la idea que tengas y armamos tu combo ideal." },
  { q: "¿Qué métodos de pago aceptan?", a: "Aceptamos transferencia bancaria, pagos móviles y efectivo contra entrega en la zona." },
  { q: "¿Hacen entregas fuera de la ciudad?", a: "Sí, coordinamos envíos según la ubicación. Consulta disponibilidad al momento del pedido." },
  { q: "¿Puedo cambiar o cancelar mi pedido?", a: "Sí, siempre y cuando aún no haya sido preparado. Escríbenos lo antes posible." },
];

function Ayuda() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <AppShell>
      <div className="bg-primary/10 py-2 text-center text-sm font-semibold tracking-wide text-primary">
        AYUDA · PREGUNTAS FRECUENTES
      </div>
      <div className="space-y-2 p-4">
        {FAQS.map((f, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-border bg-secondary">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between p-3 text-left"
            >
              <span className="text-sm font-semibold text-foreground">{f.q}</span>
              <ChevronDown className={`h-4 w-4 text-primary transition ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="border-t border-border bg-background p-3 text-sm text-muted-foreground">{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
