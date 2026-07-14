import { useEffect, useState } from "react";
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
          <img
            key={p.id}
            src={p.image}
            alt={p.name}
            className="h-64 w-full flex-shrink-0 object-cover"
          />
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
