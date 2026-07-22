import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { LOGO_URL } from "@/lib/products";

export const Route = createFileRoute("/sobre-lira")({
  head: () => ({ meta: [{ title: "Sobre Lira" }, { name: "description", content: "Conoce el emprendimiento Lira." }] }),
  component: SobreLira,
});

function SobreLira() {
  return (
    <AppShell>
      <div className="bg-primary/10 py-2 text-center text-sm font-semibold tracking-wide text-primary">
        SOBRE LIRA
      </div>
      <div className="p-5 space-y-4">
        <div className="flex flex-col items-center gap-3">
          <img src={LOGO_URL} alt="Lira" className="h-24 w-24 rounded-2xl shadow-lg" />
          <h1 className="text-2xl font-bold text-primary">Lira</h1>
          <p className="text-sm italic text-muted-foreground">True Delight</p>
        </div>
        <div className="rounded-lg bg-secondary p-4 text-sm text-secondary-foreground">
          <h2 className="mb-2 font-bold text-primary">Nuestra historia</h2>
          <p>
            Lira nació con la ilusión de convertir cada regalo en un momento inolvidable.
            Somos un emprendimiento dedicado a diseñar combos personalizados que combinan
            rosas frescas, dulces gourmet y detalles únicos hechos con cariño.
          </p>
        </div>
        <div className="rounded-lg bg-secondary p-4 text-sm text-secondary-foreground">
          <h2 className="mb-2 font-bold text-primary">Nuestra misión</h2>
          <p>
            Crear experiencias que emocionen. Cada caja de Lira se arma pensando en la
            persona que la va a recibir, para que ese instante se guarde en la memoria.
          </p>
        </div>
        <div className="rounded-lg bg-secondary p-4 text-sm text-secondary-foreground">
          <h2 className="mb-2 font-bold text-primary">¿Qué nos hace únicas?</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Diseños 100% personalizables</li>
            <li>Rosas y flores frescas</li>
            <li>Dulces y chocolates seleccionados</li>
            <li>Llaveros y detalles hechos a mano</li>
            <li>Entrega puntual y presentación premium</li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
