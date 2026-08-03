/**
 * Datos de cobro de Lira.
 * Edita estos valores con la información real del emprendimiento.
 */
export const PAYMENT_INFO = {
  bankName: "Banco Pichincha",
  accountType: "Cuenta de Ahorros",
  accountNumber: "0000000000",
  accountHolder: "Lira Regalos",
  idNumber: "0000000000",
  email: "Liraa_gifts@gmail.com",
  whatsapp: "593000000000", // solo dígitos, con código de país
};

export const whatsappOrderLink = (orderId: string, total: number) =>
  `https://wa.me/${PAYMENT_INFO.whatsapp}?text=${encodeURIComponent(
    `¡Hola Lira! Acabo de hacer el pedido ${orderId.slice(0, 8).toUpperCase()} por $${total.toFixed(2)}. Adjunto mi comprobante de pago.`,
  )}`;
