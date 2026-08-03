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

/* ---------------- Fondos del llavero ---------------- */

export type Background = {
  id: string;
  label: string;
  css: string;
  /** color base (hex) usado para el código de Spotify */
  base: string;
  text: string;
  accent: string;
  bars: "white" | "black";
};

export const BACKGROUNDS: Background[] = [
  {
    id: "celeste",
    label: "Celeste suave",
    css: "linear-gradient(160deg,#dff1f7 0%,#f4e9dc 100%)",
    base: "#DFF1F7",
    text: "#204a5c",
    accent: "#8fc7db",
    bars: "black",
  },
  {
    id: "rosa",
    label: "Rosa Lira",
    css: "linear-gradient(160deg,#ffe2ec 0%,#fff3f6 100%)",
    base: "#FFE2EC",
    text: "#7a2340",
    accent: "#f191ac",
    bars: "black",
  },
  {
    id: "crema",
    label: "Crema clásico",
    css: "linear-gradient(160deg,#f6ecdc 0%,#efe2cd 100%)",
    base: "#F6ECDC",
    text: "#5b4326",
    accent: "#c8a878",
    bars: "black",
  },
  {
    id: "lavanda",
    label: "Lavanda",
    css: "linear-gradient(160deg,#e9e2fb 0%,#f7f3ff 100%)",
    base: "#E9E2FB",
    text: "#3f2c73",
    accent: "#a894e8",
    bars: "black",
  },
  {
    id: "menta",
    label: "Menta",
    css: "linear-gradient(160deg,#dcf5e8 0%,#f2fbf6 100%)",
    base: "#DCF5E8",
    text: "#1f5340",
    accent: "#86d3ae",
    bars: "black",
  },
  {
    id: "noche",
    label: "Noche estrellada",
    css: "linear-gradient(160deg,#1f2544 0%,#3b2f63 100%)",
    base: "#1F2544",
    text: "#f4f1ff",
    accent: "#8f86d8",
    bars: "white",
  },
  {
    id: "negro",
    label: "Negro elegante",
    css: "linear-gradient(160deg,#141414 0%,#2b2b2b 100%)",
    base: "#141414",
    text: "#f5f5f5",
    accent: "#9c9c9c",
    bars: "white",
  },
  {
    id: "atardecer",
    label: "Atardecer",
    css: "linear-gradient(160deg,#ffd9a0 0%,#ff9aa9 100%)",
    base: "#FFD9A0",
    text: "#6d2f2f",
    accent: "#e8794f",
    bars: "black",
  },
];

export const getBackground = (id: string) =>
  BACKGROUNDS.find((b) => b.id === id) ?? BACKGROUNDS[0];

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
  `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&data=${encodeURIComponent(url)}`;

/* ---------------- Tipo del diseño ---------------- */

export type DesignData = {
  productId: string;
  sweets: string[];
  keychain: boolean;
  photo: string | null;
  backgroundId: string;
  customBackground: string | null;
  front: { name: string; birth: string; gender: string; quality: string };
  song: { id: string; title: string; artist: string } | null;
  card: { text: string; fontId: string };
  back: { from: string; to: string };
};
