/** Catálogo general de canciones (sin API de Spotify). */
export type Song = { id: string; title: string; artist: string };

export const SONGS: Song[] = [
  { id: "7qiZfU4dY1lWllzX7mPBI3", title: "Shape of You", artist: "Ed Sheeran" },
  { id: "0tgVpDi06FyKpA1z0VMD4v", title: "Perfect", artist: "Ed Sheeran" },
  { id: "0VjIjW4GlUZAMYd2vXMi3b", title: "Blinding Lights", artist: "The Weeknd" },
  { id: "4LRPiXqCikLlN15c3yImP7", title: "As It Was", artist: "Harry Styles" },
  { id: "6habFhsOp2NvshLv26DqMb", title: "Despacito", artist: "Luis Fonsi, Daddy Yankee" },
  { id: "1IHWl5LamUGEuP4ozKQSXZ", title: "Tití Me Preguntó", artist: "Bad Bunny" },
  { id: "3z8h0TU7ReDPLIbEnYhWZb", title: "Bohemian Rhapsody", artist: "Queen" },
  { id: "3AJwUDP919kvQ9QcozQPxg", title: "Yellow", artist: "Coldplay" },
  { id: "7BqBn9nzAq8spo5e7cZ0dJ", title: "Just the Way You Are", artist: "Bruno Mars" },
  { id: "4kflIGfjdZJW4ot2ioixTB", title: "Someone Like You", artist: "Adele" },
  { id: "3U4isOIWM3VvDubwSI3y7a", title: "All of Me", artist: "John Legend" },
  { id: "1rfofaqEpACxVEHIZBJe6W", title: "Havana", artist: "Camila Cabello" },
  { id: "6dGnYIeXmHdcikdzNNDMm2", title: "Here Comes the Sun", artist: "The Beatles" },
  { id: "2b8fOow8UzyDFAE27YhOZM", title: "Memories", artist: "Maroon 5" },
  { id: "4iJyoBOLtHqaGxP12qzhQI", title: "Peaches", artist: "Justin Bieber" },
  { id: "1vrd6UOGamcKNGnSHJQlSt", title: "Love Story", artist: "Taylor Swift" },
  { id: "1BxfuPKGuaTgP7aM0Bbdwr", title: "Cruel Summer", artist: "Taylor Swift" },
  { id: "0V3wPSX9ygBnCm8psDIegu", title: "Anti-Hero", artist: "Taylor Swift" },
  { id: "5uCax9HTNlzGybIStD3vDh", title: "Say You Won't Let Go", artist: "James Arthur" },
  { id: "6RUKPb4LETWmmr3iAEQktW", title: "Something Just Like This", artist: "The Chainsmokers, Coldplay" },
  { id: "6b2RcmUt1g9N9mQ3CbjX2Y", title: "Photograph", artist: "Ed Sheeran" },
  { id: "2plbrEY59IikOBgBGLjaoe", title: "Die With A Smile", artist: "Lady Gaga, Bruno Mars" },
  { id: "0yLdNVWF3Srea0uzk55zFn", title: "Flowers", artist: "Miley Cyrus" },
  { id: "1r9xUipOqoNwggBpENDsvJ", title: "Un Año", artist: "Sebastián Yatra, Reik" },
];

export const searchSongs = (q: string) => {
  const s = q.trim().toLowerCase();
  if (!s) return SONGS.slice(0, 8);
  return SONGS.filter(
    (x) => x.title.toLowerCase().includes(s) || x.artist.toLowerCase().includes(s),
  ).slice(0, 8);
};

/** Código escaneable oficial de Spotify (imagen pública, no requiere API). */
export const spotifyCodeUrl = (trackId: string, bgHex: string, barColor: "white" | "black") =>
  `https://scannables.scdn.co/uri/plain/png/${bgHex.replace("#", "")}/${barColor}/640/spotify:track:${trackId}`;

export const spotifyEmbedUrl = (trackId: string) =>
  `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`;
