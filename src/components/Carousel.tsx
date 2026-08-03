import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/products";

export function Carousel() {
  const slides = PRODUCTS.slice(0, 5);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 3000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <div className="relative overflow-hidden bg-secondary">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {slides.map((p) => (
          <Link
            key={p.id}
            to="/producto/$id"
            params={{ id: p.id }}
            className="relative flex h-80 w-full flex-shrink-0 items-center justify-center bg-secondary"
          >
            {/* fondo difuminado para rellenar sin recortar el producto */}
            <img
              src={p.image}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-xl"
            />
            <img
              src={p.image}
              alt={p.name}
              className="relative h-full w-full object-contain p-3"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent px-4 pb-7 pt-8 text-center">
              <div className="text-sm font-bold text-foreground">{p.name}</div>
              <div className="text-sm font-bold text-primary">${p.price.toFixed(2)}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === idx ? "w-4 bg-primary" : "w-1.5 bg-primary/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
