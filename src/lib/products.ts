import logo from "@/assets/IMG-20260711-WA0032_1.jpg.asset.json";
import p1 from "@/assets/IMG-20260714-WA0003.jpg.asset.json";
import p2 from "@/assets/IMG-20260713-WA0033.jpg.asset.json";
import p3 from "@/assets/IMG-20260710-WA0011.jpg.asset.json";
import p4 from "@/assets/IMG-20260703-WA0003_1.jpg.asset.json";
import p5 from "@/assets/IMG-20260703-WA0004_1.jpg.asset.json";
import p6 from "@/assets/IMG-20260703-WA0002_1.jpg.asset.json";
import p7 from "@/assets/IMG-20260628-WA0050_1.jpg.asset.json";
import p8 from "@/assets/IMG-20260628-WA0049_1.jpg.asset.json";

export const LOGO_URL = logo.url;

export type CategoryId =
  | "general"
  | "bday"
  | "xvanos"
  | "mama"
  | "papa"
  | "parejas"
  | "graduacion";

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "general", label: "General" },
  { id: "bday", label: "Bday" },
  { id: "xvanos", label: "XV Años" },
  { id: "mama", label: "Mamá" },
  { id: "papa", label: "Papá" },
  { id: "parejas", label: "Parejas" },
  { id: "graduacion", label: "Graduación" },
];

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  categories: CategoryId[];
};

export const PRODUCTS: Product[] = [
  {
    id: "abrazo-floral",
    name: "Abrazo Floral",
    price: 18.0,
    image: p1.url,
    description:
      "Caja de regalo personalizable de dos niveles. Opcionalmente incluye llavero con personaje en pixel art y dedicatoria musical.",
    categories: ["mama", "parejas", "bday"],
  },
  {
    id: "dulce-sorpresa",
    name: "Dulce Sorpresa Lira",
    price: 15.5,
    image: p2.url,
    description:
      "Bolsa premium con rosas rojas frescas y una selección de dulces surtidos. Perfecta para sorprender en cualquier ocasión.",
    categories: ["parejas", "general", "bday"],
  },
  {
    id: "true-delight",
    name: "True Delight",
    price: 32.0,
    image: p3.url,
    description:
      "Nuestra caja insignia: rosas rojas premium, chocolates Ferrero, Snickers, Kinder Bueno y un llavero personalizado.",
    categories: ["parejas", "xvanos", "graduacion"],
  },
  {
    id: "corazon-blanco",
    name: "Corazón Blanco",
    price: 40.0,
    image: p4.url,
    description:
      "Caja doble puerta con rosas en forma de corazón iluminadas y cajón inferior con dulces variados y llavero ID.",
    categories: ["parejas", "xvanos", "bday"],
  },
  {
    id: "happiness-box",
    name: "Happiness Box",
    price: 55.0,
    image: p5.url,
    description:
      "Caja circular XL con mezcla de rosas de colores, macarons franceses, Ferrero Rocher, Raffaello y Kinder Joy.",
    categories: ["xvanos", "mama", "graduacion"],
  },
  {
    id: "sweet-love",
    name: "Sweet Love",
    price: 22.0,
    image: p6.url,
    description:
      "Caja cuadrada con dulces surtidos, jelly beans, trufas, rosas rojas y llavero personalizado con código Spotify.",
    categories: ["parejas", "general", "bday"],
  },
  {
    id: "lilyana-minnie",
    name: "Lilyana Minnie",
    price: 28.0,
    image: p7.url,
    description:
      "Caja con rosas rosadas, peluche de Minnie Mouse, cajón inferior con Ferrero, KitKat y Lindt. Ideal para regalar ternura.",
    categories: ["bday", "mama", "general"],
  },
  {
    id: "lira-classic",
    name: "Lira Classic",
    price: 25.0,
    image: p8.url,
    description:
      "Nuestra caja clásica con rosas rojas, M&Ms, Pringles, Ferrero Rocher y llavero ID personalizado.",
    categories: ["papa", "graduacion", "general"],
  },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const getByCategory = (cat: CategoryId) =>
  PRODUCTS.filter((p) => p.categories.includes(cat));
