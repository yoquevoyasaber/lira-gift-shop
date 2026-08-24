/**
 * Datos de cobro y contacto de Lira.
 */
export const PAYMENT_INFO = {
  bankName: "Banco Pichincha",
  accountType: "Cuenta de Ahorros",
  accountNumber: "0000000000",
  accountHolder: "Lira Regalos",
  idNumber: "0000000000",
  email: "Liraa_gifts@gmail.com",
  /** Solo dígitos, con código de país (Ecuador). */
  whatsapp: "593968718145",
  whatsappPretty: "+593 96 871 8145",
};

/** Enlace directo al WhatsApp de Lira (funciona en móvil y escritorio). */
export const whatsappLink = (text?: string) =>
  `https://wa.me/${PAYMENT_INFO.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const whatsappOrderLink = (orderId: string, total: number) =>
  whatsappLink(
    `¡Hola Lira! Acabo de hacer el pedido ${orderId.slice(0, 8).toUpperCase()} por $${total.toFixed(2)}.`,
  );

/**
 * Dominio público y estable de la app (no depende del editor).
 * Se usa para los códigos QR de las cartas digitales: al escanear el QR se
 * abre esta página real, no el editor de Lovable.
 */
export const PUBLIC_SITE = "https://project--4c2e0ba4-db8e-4dad-bf88-94aa543bd7c6.lovable.app";

export const messageUrlFor = (designId: string) => `${PUBLIC_SITE}/m/${designId}`;
