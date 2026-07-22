import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Facebook, Phone, Mail, MessageCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/contacto")({
  head: () => ({ meta: [{ title: "Contacto — Lira" }] }),
  component: Contacto,
});

const CONTACTS = [
  { icon: Instagram, label: "Instagram", value: "@lira.regalos", href: "https://instagram.com/lira.regalos" },
  { icon: Facebook, label: "Facebook", value: "Lira Regalos", href: "https://facebook.com/lira.regalos" },
  { icon: MessageCircle, label: "WhatsApp", value: "+00 000 000 000", href: "https://wa.me/00000000000" },
  { icon: Phone, label: "Teléfono", value: "+00 000 000 000", href: "tel:+00000000000" },
  { icon: Mail, label: "Correo", value: "hola@lira.com", href: "mailto:hola@lira.com" },
];

function Contacto() {
  return (
    <AppShell>
      <div className="bg-primary/10 py-2 text-center text-sm font-semibold tracking-wide text-primary">
        CONTACTO
      </div>
      <div className="space-y-3 p-4">
        <p className="text-center text-sm text-muted-foreground">
          Escríbenos por cualquiera de nuestros canales, ¡te respondemos rápido!
        </p>
        {CONTACTS.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 rounded-lg bg-secondary p-4 shadow-sm hover:bg-accent"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <c.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground">{c.label}</div>
              <div className="text-sm font-bold text-foreground">{c.value}</div>
            </div>
          </a>
        ))}
      </div>
    </AppShell>
  );
}
