import { createFileRoute, notFound } from "@tanstack/react-router";
import { DigitalCard } from "@/components/Keychain";
import { supabase } from "@/integrations/supabase/client";
import type { DesignData } from "@/lib/customization";

export const Route = createFileRoute("/m/$id")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("designs")
      .select("data")
      .eq("id", params.id)
      .maybeSingle();
    if (error || !data) throw notFound();
    return { design: data.data as unknown as DesignData };
  },
  head: () => ({
    meta: [
      { title: "Un mensaje especial para ti — Lira" },
      { name: "description", content: "Alguien creó una carta digital con música solo para ti." },
      { property: "og:title", content: "Un mensaje especial para ti — Lira" },
      { property: "og:description", content: "Carta digital con música, creada con Lira." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MessagePage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background p-8 text-center text-muted-foreground">
      Este mensaje ya no está disponible.
    </div>
  ),
});

function MessagePage() {
  const { design } = Route.useLoaderData();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-secondary px-4 py-10">
      {design.back.from && (
        <p className="text-sm text-secondary-foreground">
          De <b>{design.back.from}</b> para <b>{design.back.to}</b>
        </p>
      )}
      <DigitalCard d={design} embed />
      <a href="/" className="text-xs text-secondary-foreground underline">
        Hecho con 💗 por Lira
      </a>
    </div>
  );
}
