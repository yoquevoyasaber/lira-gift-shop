import type { Product } from "./products";

/* ---------------- Dulces ---------------- */

export type Sweet = { id: string; name: string; emoji: string };

/** Cada gama agrupa dulces de un mismo rango de precio (nunca se muestra el precio). */
export const SWEET_TIERS: Record<"a" | "b" | "c", Sweet[]> = {
  a: [
    { id: "gomitas", name: "Gomitas surtidas", emoji: "🍬" },
    { id: "chupetes", name: "Chupetes de sabores", emoji: "🍭" },
    { id: "jellybeans", name: "Jelly beans", emoji: "🫘" },
    { id: "malvaviscos", name: "Malvaviscos", emoji: "☁️" },
    { id: "caramelos", name: "Caramelos masticables", emoji: "🍮" },
    { id: "chicles", name: "Chicles de menta", emoji: "🌿" },
  ],
  b: [
    { id: "kitkat", name: "KitKat", emoji: "🍫" },
    { id: "snickers", name: "Snickers", emoji: "🥜" },
    { id: "mms", name: "M&M's", emoji: "🔴" },
    { id: "kinder", name: "Kinder Bueno", emoji: "🤎" },
    { id: "trufas", name: "Trufas de chocolate", emoji: "🍥" },
    { id: "pringles", name: "Pringles mini", emoji: "🥔" },
  ],
  c: [
    { id: "ferrero", name: "Ferrero Rocher", emoji: "🌟" },
    { id: "raffaello", name: "Raffaello", emoji: "🥥" },
    { id: "macarons", name: "Macarons franceses", emoji: "🍡" },
    { id: "lindt", name: "Lindt Lindor", emoji: "🍫" },
    { id: "kinderjoy", name: "Kinder Joy", emoji: "🥚" },
    { id: "bombones", name: "Bombones de licor", emoji: "🍾" },
  ],
};

export const tierForProduct = (p: Product): "a" | "b" | "c" =>
  p.price < 20 ? "a" : p.price < 38 ? "b" : "c";

/** Número de dulces incluidos según el precio del combo. */
export const sweetSlots = (p: Product) => Math.max(3, Math.min(8, Math.round(p.price / 7)));

/* ---------------- Fondos y paletas del llavero ---------------- */

export type Background = {
  id: string;
  label: string;
  /** fondo principal de la tarjeta */
  css: string;
  /** color base (hex) usado para el código de Spotify */
  base: string;
  text: string;
  accent: string;
  /** color de la barra superior / detalles */
  band: string;
  bars: "white" | "black";
  /** patrón decorativo del fondo (se superpone al css) */
  pattern?: string;
};

export const BACKGROUNDS: Background[] = [
  {
    id: "celeste",
    label: "Celeste suave",
    css: "linear-gradient(160deg,#eef8fc 0%,#faf1e4 100%)",
    base: "FAF1E4",
    text: "#204a5c",
    accent: "#8fc7db",
    band: "#bcdcea",
    bars: "black",
  },
  {
    id: "rosa",
    label: "Rosa Lira",
    css: "linear-gradient(160deg,#ffeef4 0%,#fff7f9 100%)",
    base: "FFF7F9",
    text: "#7a2340",
    accent: "#f191ac",
    band: "#ffc9d9",
    bars: "black",
  },
  {
    id: "crema",
    label: "Crema clásico",
    css: "linear-gradient(160deg,#fbf4e6 0%,#f1e5cf 100%)",
    base: "FBF4E6",
    text: "#5b4326",
    accent: "#c8a878",
    band: "#e3cda5",
    bars: "black",
  },
  {
    id: "lavanda",
    label: "Lavanda",
    css: "linear-gradient(160deg,#f2edff 0%,#fbf8ff 100%)",
    base: "F2EDFF",
    text: "#3f2c73",
    accent: "#a894e8",
    band: "#d6c9ff",
    bars: "black",
  },
  {
    id: "menta",
    label: "Menta",
    css: "linear-gradient(160deg,#e6faf0 0%,#f6fdf9 100%)",
    base: "E6FAF0",
    text: "#1f5340",
    accent: "#86d3ae",
    band: "#b7ead2",
    bars: "black",
  },
  {
    id: "durazno",
    label: "Durazno",
    css: "linear-gradient(160deg,#ffeee2 0%,#fff8f1 100%)",
    base: "FFEEE2",
    text: "#8a4525",
    accent: "#f0a97c",
    band: "#ffd3b8",
    bars: "black",
  },
  {
    id: "cielo",
    label: "Cielo con nubes",
    css: "linear-gradient(160deg,#dff0ff 0%,#f6fbff 100%)",
    base: "DFF0FF",
    text: "#1f456e",
    accent: "#7fb6ea",
    band: "#b9dcff",
    bars: "black",
    pattern:
      "radial-gradient(circle at 20% 18%, rgba(255,255,255,.9) 12px, transparent 13px), radial-gradient(circle at 30% 22%, rgba(255,255,255,.9) 16px, transparent 17px), radial-gradient(circle at 78% 12%, rgba(255,255,255,.75) 14px, transparent 15px)",
  },
  {
    id: "girasol",
    label: "Girasol",
    css: "linear-gradient(160deg,#fff6d6 0%,#fffdf2 100%)",
    base: "FFF6D6",
    text: "#7a5a10",
    accent: "#e8bf4f",
    band: "#ffe59a",
    bars: "black",
  },
  {
    id: "coral",
    label: "Coral tropical",
    css: "linear-gradient(160deg,#ffe6e2 0%,#fff2ec 100%)",
    base: "FFE6E2",
    text: "#8c2f38",
    accent: "#f47f76",
    band: "#ffc2b8",
    bars: "black",
  },
  {
    id: "puntos",
    label: "Lunares pastel",
    css: "linear-gradient(160deg,#fff5fa 0%,#fdf3ff 100%)",
    base: "FFF5FA",
    text: "#6b2b5c",
    accent: "#e39ad4",
    band: "#f6cfe8",
    bars: "black",
    pattern:
      "radial-gradient(rgba(227,154,212,.35) 1.6px, transparent 1.7px)",
  },
  {
    id: "cuadricula",
    label: "Cuaderno",
    css: "linear-gradient(160deg,#fdfcf7 0%,#f7f4ea 100%)",
    base: "FDFCF7",
    text: "#3d4451",
    accent: "#9aa7bd",
    band: "#cfd8e6",
    bars: "black",
    pattern:
      "linear-gradient(rgba(154,167,189,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(154,167,189,.22) 1px, transparent 1px)",
  },
  {
    id: "terracota",
    label: "Terracota",
    css: "linear-gradient(160deg,#f6e2d3 0%,#eccbb4 100%)",
    base: "F6E2D3",
    text: "#6b3320",
    accent: "#c9764c",
    band: "#e0a882",
    bars: "black",
  },
  {
    id: "noche",
    label: "Noche estrellada",
    css: "linear-gradient(160deg,#1f2544 0%,#3b2f63 100%)",
    base: "1F2544",
    text: "#f4f1ff",
    accent: "#8f86d8",
    band: "#443a76",
    bars: "white",
    pattern:
      "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1.2px)",
  },
  {
    id: "galaxia",
    label: "Galaxia",
    css: "linear-gradient(160deg,#241b3d 0%,#4b2a63 55%,#7b3f74 100%)",
    base: "241B3D",
    text: "#fbeeff",
    accent: "#c58ae0",
    band: "#5a3676",
    bars: "white",
    pattern: "radial-gradient(rgba(255,255,255,.7) 1px, transparent 1.2px)",
  },
  {
    id: "negro",
    label: "Negro elegante",
    css: "linear-gradient(160deg,#111111 0%,#2b2b2b 100%)",
    base: "111111",
    text: "#f5f5f5",
    accent: "#c9a227",
    band: "#2f2f2f",
    bars: "white",
  },
  {
    id: "esmeralda",
    label: "Esmeralda",
    css: "linear-gradient(160deg,#0f3d33 0%,#1d6b57 100%)",
    base: "0F3D33",
    text: "#ecfff8",
    accent: "#6fd8b3",
    band: "#1b5a4a",
    bars: "white",
  },
  {
    id: "vino",
    label: "Vino tinto",
    css: "linear-gradient(160deg,#3d1020 0%,#6b1e35 100%)",
    base: "3D1020",
    text: "#ffeaf0",
    accent: "#e0899e",
    band: "#5a1a2c",
    bars: "white",
  },
  {
    id: "atardecer",
    label: "Atardecer",
    css: "linear-gradient(160deg,#ffd9a0 0%,#ff9aa9 100%)",
    base: "FFD9A0",
    text: "#6d2f2f",
    accent: "#e8794f",
    band: "#ffc07f",
    bars: "black",
  },
];

export const getBackground = (id: string) =>
  BACKGROUNDS.find((b) => b.id === id) ?? BACKGROUNDS[0];

/* ---------------- Estilos (diseño) de la identificación ---------------- */

export type IdStyle = {
  id: string;
  label: string;
  /** decoración de la barra superior */
  topper: "estrellas" | "corazones" | "chispas" | "lunares" | "ninguno";
  /** forma del marco de la foto */
  photo: "dashed" | "solid" | "polaroid" | "circle";
  /** radio de la tarjeta */
  radius: number;
  /** los campos van en cápsulas o en líneas */
  fields: "capsulas" | "lineas";
};

export const ID_STYLES: IdStyle[] = [
  { id: "clasico", label: "Clásico", topper: "estrellas", photo: "dashed", radius: 18, fields: "capsulas" },
  { id: "romantico", label: "Romántico", topper: "corazones", photo: "polaroid", radius: 22, fields: "capsulas" },
  { id: "kawaii", label: "Kawaii", topper: "chispas", photo: "circle", radius: 26, fields: "capsulas" },
  { id: "minimal", label: "Minimal", topper: "ninguno", photo: "solid", radius: 12, fields: "lineas" },
  { id: "retro", label: "Retro", topper: "lunares", photo: "solid", radius: 8, fields: "lineas" },
  { id: "ficha", label: "Ficha pro", topper: "estrellas", photo: "solid", radius: 14, fields: "lineas" },
];

export const getIdStyle = (id: string) => ID_STYLES.find((s) => s.id === id) ?? ID_STYLES[0];

/* ---------------- Tipografías de la carta ---------------- */

export type CardFont = { id: string; label: string; family: string; decorative: boolean };

export const CARD_FONTS: CardFont[] = [
  { id: "pacifico", label: "Fiesta", family: "'Pacifico', cursive", decorative: true },
  { id: "lobster", label: "Retro", family: "'Lobster', cursive", decorative: true },
  { id: "bungee", label: "Pop", family: "'Bungee', cursive", decorative: true },
  { id: "dancing", label: "Elegante", family: "'Dancing Script', cursive", decorative: true },
  { id: "caveat", label: "Manuscrita", family: "'Caveat', cursive", decorative: false },
  { id: "poppins", label: "Normal", family: "'Poppins', sans-serif", decorative: false },
];

export const getFont = (id: string) => CARD_FONTS.find((f) => f.id === id) ?? CARD_FONTS[5];

export const countWords = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;

/** Reglas: tipografías decoradas solo para mensajes muy cortos (máx 4 palabras). */
export const MAX_WORDS = 30;
export const MAX_WORDS_DECORATIVE = 4;

export const qrImageUrl = (url: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=1&ecc=M&data=${encodeURIComponent(url)}`;

/* ---------------- Tipo del diseño ---------------- */

export type DesignData = {
  productId: string;
  sweets: string[];
  keychain: boolean;
  photo: string | null;
  backgroundId: string;
  styleId: string;
  customBackground: string | null;
  front: { name: string; birth: string; gender: string; quality: string };
  song: { id: string; title: string; artist: string } | null;
  card: { text: string; fontId: string };
  back: { from: string; to: string };
};
