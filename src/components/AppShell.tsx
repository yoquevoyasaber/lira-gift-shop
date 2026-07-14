import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, User, Home, MessageCircle, ShoppingCart } from "lucide-react";
import { LOGO_URL } from "@/lib/products";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-md">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
          <button aria-label="Menu" className="p-1">
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img src={LOGO_URL} alt="Lira" className="h-9 w-9 rounded-lg" />
          </Link>
          <button aria-label="Cuenta" className="p-1">
            <User className="h-6 w-6" />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 pb-24">{children}</main>

      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 bg-primary text-primary-foreground">
        <div className="flex items-center justify-around py-3">
          <Link to="/" aria-label="Inicio" className={pathname === "/" ? "opacity-100" : "opacity-80"}>
            <Home className="h-7 w-7" />
          </Link>
          <button aria-label="Mensajes" className="opacity-80">
            <MessageCircle className="h-7 w-7" />
          </button>
          <button aria-label="Carrito" className="opacity-80">
            <ShoppingCart className="h-7 w-7" />
          </button>
        </div>
      </nav>
    </div>
  );
}
