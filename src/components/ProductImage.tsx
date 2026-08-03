import { cn } from "@/lib/utils";

/**
 * Muestra la foto del producto completa (sin recortes), sobre un fondo
 * difuminado del mismo producto para que se integre con la tarjeta.
 */
export function ProductImage({
  src,
  alt,
  className,
  imgClassName,
  rounded = "rounded-xl",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  rounded?: string;
}) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-secondary", rounded, className)}>
      <img
        src={src}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-125 object-cover opacity-45 blur-2xl saturate-150"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/25" />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn(
          "relative h-full w-full object-contain p-2 drop-shadow-[0_6px_14px_rgba(0,0,0,0.22)]",
          imgClassName,
        )}
      />
    </div>
  );
}
