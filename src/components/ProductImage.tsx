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
        alt={alt}
        loading="lazy"
        className={cn(
          "absolute inset-0 h-full w-full object-contain p-2",
          imgClassName,
        )}
      />
    </div>
  );
}
