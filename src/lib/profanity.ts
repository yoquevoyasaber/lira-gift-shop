/**
 * Filtro de palabras ofensivas para los textos de la identificación y la carta.
 * Revisa palabra por palabra (normalizando acentos y sustituciones tipo l33t).
 */

const BAD_WORDS = [
  "puta","puto","putas","putos","mierda","mrd","verga","berga","pendejo","pendeja",
  "cabron","cabrona","chucha","conchatumadre","conchasumadre","malparido","gonorrea",
  "culero","culiao","culiado","huevon","huevona","zorra","perra","maricon","marica",
  "maricona","joto","polla","pinga","coño","cono","carajo","hijueputa","hdp","ptm",
  "gilipollas","imbecil","idiota","estupido","estupida","retrasado","mongolico",
  "pelotudo","boludo","forro","sorete","chinga","chingar","chingada","verguero",
  "puñeta","punheta","panocha","tetas","pezon","pene","vagina","semen","porno",
  "porn","xxx","sexo","follar","fornicar","masturba","violar","violador","nazi",
  "hitler","matate","suicidate","muerete","asesino","droga","cocaina","marihuana",
  "fuck","fucking","shit","bitch","bastard","asshole","dick","pussy","cunt","whore",
  "slut","nigga","nigger","faggot","rape","kill",
];

const LEET: Record<string, string> = {
  "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s",
};

const normalize = (w: string) =>
  w
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split("")
    .map((c) => LEET[c] ?? c)
    .join("")
    .replace(/[^a-z]/g, "")
    .replace(/(.)\1{2,}/g, "$1");

/** Devuelve la primera palabra ofensiva encontrada, o null si el texto es apto. */
export const findProfanity = (text: string): string | null => {
  const words = text.split(/[\s,.;:!?¡¿"'()\-_/\\]+/).filter(Boolean);
  for (const w of words) {
    const n = normalize(w);
    if (!n) continue;
    if (BAD_WORDS.includes(n)) return w;
    // detecta palabras pegadas, ej: "holaputa"
    if (n.length > 5 && BAD_WORDS.some((b) => b.length >= 5 && n.includes(b))) return w;
  }
  return null;
};

export const isClean = (text: string) => findProfanity(text) === null;
