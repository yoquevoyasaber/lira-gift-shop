import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, User, Home, MessageCircle, ShoppingCart, X } from "lucide-react";
import { LOGO_URL } from "@/lib/products";
import { useCart } from "@/lib/cart";

const MENU = [
  { to: "/sobre-lira", label: "Sobre Lira" },
  { to: "/contacto", label: "Contacto" },
  { to: "/configuracion", label: "Configuración" },
  { to: "/ayuda", label: "Ayuda" },
  { to: "/sugerencias", label: "Sugerencias" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalCount } = useCart();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-header text-header-foreground shadow-md">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
          <button aria-label="Menu" className="p-1" onClick={() => setMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img src={LOGO_URL} alt="Lira" className="h-10 w-10 rounded-lg dark:grayscale" />
          </Link>
          <Link to="/auth" aria-label="Cuenta" className="p-1">
            <User className="h-6 w-6" />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 pb-24">{children}</main>

      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 bg-header text-header-foreground">
        <div className="flex items-center justify-around py-3">
          <Link to="/" aria-label="Inicio" className={pathname === "/" ? "opacity-100" : "opacity-80"}>
            <Home className="h-7 w-7" />
          </Link>
          <Link to="/chat" aria-label="Asistente IA" className={pathname === "/chat" ? "opacity-100" : "opacity-80"}>
            <MessageCircle className="h-7 w-7" />
          </Link>
          <Link to="/carrito" aria-label="Carrito" className={`relative ${pathname === "/carrito" ? "opacity-100" : "opacity-80"}`}>
            <ShoppingCart className="h-7 w-7" />
            {totalCount > 0 && (
              <span className="absolute -right-2 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-header-foreground px-1 text-xs font-bold text-header">
                {totalCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex bg-header/95 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        >
          <button
            aria-label="Cerrar menú"
            className="absolute right-4 top-4 p-2 text-header-foreground"
            onClick={() => setMenuOpen(false)}
          >
            <X className="h-7 w-7" />
          </button>
          <div className="m-auto flex flex-col items-center gap-6 text-center">
            <img src={LOGO_URL} alt="Lira" className="mb-4 h-20 w-20 rounded-2xl shadow-lg dark:grayscale" />
            {MENU.map((m) => (
              <Link
                key={m.to}
                to={m.to}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-semibold text-header-foreground hover:underline"
              >
                {m.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
