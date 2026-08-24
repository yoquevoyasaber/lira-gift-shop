/**
 * Reglas de entrega y contacto para Ecuador / Guayaquil.
 */

/** Sectores de Guayaquil donde Lira entrega (zonas seguras y verificadas). */
export const GUAYAQUIL_ZONES: { id: string; label: string; note?: string }[] = [
  { id: "alborada", label: "La Alborada", note: "Etapas 1 a 14" },
  { id: "sauces", label: "Sauces", note: "Sauces 1 a 9" },
  { id: "garzota", label: "La Garzota" },
  { id: "samanes", label: "Los Samanes" },
  { id: "kennedy", label: "Kennedy / Kennedy Norte" },
  { id: "urdesa", label: "Urdesa Central y Norte" },
  { id: "ceibos", label: "Los Ceibos" },
  { id: "puertoazul", label: "Puerto Azul" },
  { id: "vianueva", label: "Vía a la Costa (km 1 - km 15)" },
  { id: "samborondon", label: "La Puntilla / Entre Ríos (Samborondón)" },
  { id: "sanborondon2", label: "Vía Samborondón (km 1 - km 8)" },
  { id: "atarazana", label: "La Atarazana" },
  { id: "fae", label: "Ciudadela FAE / Bolivariana" },
  { id: "centro", label: "Centro (9 de Octubre - Malecón)" },
  { id: "urdenor", label: "Urdenor / Mucho Lote" },
  { id: "aurora", label: "La Aurora (Daule)" },
];

export const isValidZone = (id: string) => GUAYAQUIL_ZONES.some((z) => z.id === id);

export const zoneLabel = (id: string) =>
  GUAYAQUIL_ZONES.find((z) => z.id === id)?.label ?? "";

/* ---------------- Teléfono de Ecuador ---------------- */

/** Deja solo dígitos y limita a 10 (formato 09XXXXXXXX). */
export const formatEcPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "").replace(/^593/, "0").slice(0, 10);
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
};

/** Celular ecuatoriano: 10 dígitos que empiezan en 09. También acepta fijo 0X + 8 dígitos. */
export const isValidEcPhone = (raw: string) => {
  const d = raw.replace(/\D/g, "");
  if (d.length === 10 && /^09\d{8}$/.test(d)) return true;
  if (d.length === 9 && /^0[2-7]\d{7}$/.test(d)) return true;
  return false;
};

export const phoneDigits = (raw: string) => raw.replace(/\D/g, "");

/* ---------------- Fecha DD/MM/AAAA ---------------- */

/** Máscara progresiva: el usuario solo escribe números y se agregan las "/". */
export const maskBirthDate = (raw: string) => {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  const day = d.slice(0, 2);
  const month = d.slice(2, 4);
  const year = d.slice(4, 8);
  return [day, month, year].filter((x) => x.length).join("/");
};

export const isValidBirthDate = (v: string) => {
  const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return false;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  const nowYear = new Date().getFullYear();
  if (month < 1 || month > 12) return false;
  if (year < 1920 || year > nowYear) return false;
  const daysInMonth = new Date(year, month, 0).getDate();
  return day >= 1 && day <= daysInMonth;
};
