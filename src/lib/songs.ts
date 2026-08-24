/** Catálogo general de canciones (sin API de Spotify). */
export type Song = { id: string; title: string; artist: string };

export const SONGS: Song[] = [
  // Pop internacional
  { id: "7qiZfU4dY1lWllzX7mPBI3", title: "Shape of You", artist: "Ed Sheeran" },
  { id: "0tgVpDi06FyKpA1z0VMD4v", title: "Perfect", artist: "Ed Sheeran" },
  { id: "6PCUP3dWmTjcTtXY02oFdT", title: "Photograph", artist: "Ed Sheeran" },
  { id: "1HNkqx9Ahdgi1Ixy2xkKkL", title: "Photograph (Live)", artist: "Ed Sheeran" },
  { id: "0VjIjW4GlUZAMYd2vXMi3b", title: "Blinding Lights", artist: "The Weeknd" },
  { id: "0nJW01T7XtvILxQgC5J7Wh", title: "Save Your Tears", artist: "The Weeknd" },
  { id: "4LRPiXqCikLlN15c3yImP7", title: "As It Was", artist: "Harry Styles" },
  { id: "6UelLqGlWMcVH1E5c4H7lY", title: "Watermelon Sugar", artist: "Harry Styles" },
  { id: "7BqBn9nzAq8spo5e7cZ0dJ", title: "Just the Way You Are", artist: "Bruno Mars" },
  { id: "0lYBSQXN6rCTvUZvg9S0lU", title: "Leave the Door Open", artist: "Silk Sonic" },
  { id: "2plbrEY59IikOBgBGLjaoe", title: "Die With A Smile", artist: "Lady Gaga, Bruno Mars" },
  { id: "4kflIGfjdZJW4ot2ioixTB", title: "Someone Like You", artist: "Adele" },
  { id: "1zwMYTA5nlNjZxYrvBB2pV", title: "Someone You Loved", artist: "Lewis Capaldi" },
  { id: "5uCax9HTNlzGybIStD3vDh", title: "Say You Won't Let Go", artist: "James Arthur" },
  { id: "3U4isOIWM3VvDubwSI3y7a", title: "All of Me", artist: "John Legend" },
  { id: "0yLdNVWF3Srea0uzk55zFn", title: "Flowers", artist: "Miley Cyrus" },
  { id: "1rfofaqEpACxVEHIZBJe6W", title: "Havana", artist: "Camila Cabello" },
  { id: "2b8fOow8UzyDFAE27YhOZM", title: "Memories", artist: "Maroon 5" },
  { id: "3hBBKuWJfxlIlnd9QFoC8k", title: "What Lovers Do", artist: "Maroon 5" },
  { id: "4iJyoBOLtHqaGxP12qzhQI", title: "Peaches", artist: "Justin Bieber" },
  { id: "6epn3r7S14KUqlReYr77hA", title: "Ghost", artist: "Justin Bieber" },
  { id: "6RUKPb4LETWmmr3iAEQktW", title: "Something Just Like This", artist: "The Chainsmokers, Coldplay" },
  { id: "5CtI0qwDJkDQGwXD1H1cLb", title: "Don't Start Now", artist: "Dua Lipa" },
  { id: "39LLxExYz6ewLAcYrzQQyP", title: "Levitating", artist: "Dua Lipa" },
  { id: "463CkQjx2Zk1yXoBuierM9", title: "Levitating (feat. DaBaby)", artist: "Dua Lipa" },
  { id: "1mWdTewIgB3gtBM3TOSFhB", title: "Bad Habits", artist: "Ed Sheeran" },
  { id: "3PfIrDoz19wz7qK7tYeu62", title: "Don't Stop Believin'", artist: "Journey" },
  { id: "4h9wh7iOZ0GGn8QVp4RAOB", title: "I Ain't Worried", artist: "OneRepublic" },
  { id: "7ouMYWpwJ422jRcDASZB7P", title: "Knights of Cydonia", artist: "Muse" },

  // Taylor Swift
  { id: "1vrd6UOGamcKNGnSHJQlSt", title: "Love Story", artist: "Taylor Swift" },
  { id: "1BxfuPKGuaTgP7aM0Bbdwr", title: "Cruel Summer", artist: "Taylor Swift" },
  { id: "0V3wPSX9ygBnCm8psDIegu", title: "Anti-Hero", artist: "Taylor Swift" },
  { id: "1p80LdxRV74UKvL8gnD7ky", title: "Blank Space", artist: "Taylor Swift" },
  { id: "3CeCwYWvdfXbZLXFhBrbnf", title: "Lover", artist: "Taylor Swift" },

  // Clásicos / rock
  { id: "3z8h0TU7ReDPLIbEnYhWZb", title: "Bohemian Rhapsody", artist: "Queen" },
  { id: "5T8EDUDqKcs6OSOwEsfqG7", title: "Don't Stop Me Now", artist: "Queen" },
  { id: "6dGnYIeXmHdcikdzNNDMm2", title: "Here Comes the Sun", artist: "The Beatles" },
  { id: "7iN1s7xHE4ifF5povM6A48", title: "Let It Be", artist: "The Beatles" },
  { id: "1dGr1c8CrMLDpV6mPbImSI", title: "Lover, You Should've Come Over", artist: "Jeff Buckley" },
  { id: "3AJwUDP919kvQ9QcozQPxg", title: "Yellow", artist: "Coldplay" },
  { id: "1mea3bSkSGXuIRvnydlB5b", title: "Viva La Vida", artist: "Coldplay" },
  { id: "0R8P9KfGJCDULmlEoBagcO", title: "Fix You", artist: "Coldplay" },
  { id: "40riOy7x9W7GXjyGp4pjAv", title: "Hotel California", artist: "Eagles" },
  { id: "4u7EnebtmKWzUH433cf5Qv", title: "Bohemian Like You", artist: "The Dandy Warhols" },
  { id: "5ChkMS8OtdzJeqyybCc9R5", title: "Billie Jean", artist: "Michael Jackson" },
  { id: "1s8tP3jP4GZcyHDsjvw218", title: "Sweet Child O' Mine", artist: "Guns N' Roses" },
  { id: "5CQ30WqJwcep0pYcV4AMNc", title: "Stairway to Heaven", artist: "Led Zeppelin" },
  { id: "60a0Rd6pjrkxjPbaKzXjfq", title: "In the End", artist: "Linkin Park" },
  { id: "0u2P5u6lvoDfwTYjAADbn4", title: "Lose Yourself", artist: "Eminem" },

  // Indie / alternativo
  { id: "5ihS6UUlyQAfmp48eSkxuQ", title: "The Less I Know The Better", artist: "Tame Impala" },
  { id: "2X485T9Z5Ly0xyaghN73ed", title: "Let It Happen", artist: "Tame Impala" },
  { id: "0eGsygTp906u18L0Oimnem", title: "Mr. Brightside", artist: "The Killers" },
  { id: "5FVd6KXrgO9B3JPmC8OPst", title: "Do I Wanna Know?", artist: "Arctic Monkeys" },
  { id: "5XeFesFbtLpXzIVDNQP22n", title: "I Wanna Be Yours", artist: "Arctic Monkeys" },
  { id: "0BxE4FqsDD1Ot4YuBXwAPp", title: "505", artist: "Arctic Monkeys" },
  { id: "3hRV0jL3vUpRrcy398teAU", title: "Cigarettes out the Window", artist: "TV Girl" },
  { id: "3AzjcOeAmA57TIOr9zF1ZW", title: "Sweater Weather", artist: "The Neighbourhood" },
  { id: "2QjOHCTQ1Jl3zawyYOpxh6", title: "Sweater Weather (Radio)", artist: "The Neighbourhood" },
  { id: "6l8EbYRtQMgKOyc1gcDHF9", title: "Softcore", artist: "The Neighbourhood" },

  // Latino / español
  { id: "6habFhsOp2NvshLv26DqMb", title: "Despacito", artist: "Luis Fonsi, Daddy Yankee" },
  { id: "1IHWl5LamUGEuP4ozKQSXZ", title: "Tití Me Preguntó", artist: "Bad Bunny" },
  { id: "6Sq7ltF9Qa7SNFBsV5Cogx", title: "Me Porto Bonito", artist: "Bad Bunny, Chencho Corleone" },
  { id: "5w22WNCwafGDpP5rnGpIm2", title: "Ojitos Lindos", artist: "Bad Bunny, Bomba Estéreo" },
  { id: "1r9xUipOqoNwggBpENDsvJ", title: "Un Año", artist: "Sebastián Yatra, Reik" },
  { id: "2tHwzyyOLoWSFqYNjeVMzj", title: "Tacones Rojos", artist: "Sebastián Yatra" },
  { id: "6XjDF6nds4DE2BBbagZol6", title: "Robarte un Beso", artist: "Carlos Vives, Sebastián Yatra" },
  { id: "3lPr8ghNDBLc2uZovNyLs9", title: "Sunflower", artist: "Post Malone, Swae Lee" },
  { id: "5w9c2J52mkdntKOmRLeM2m", title: "Cuando Nos Volvamos a Encontrar", artist: "Carlos Vives, Marc Anthony" },
  { id: "0lizgQ7Qw35od7CYaoMBZb", title: "Vida de Rico", artist: "Camilo" },
  { id: "1uwaMcJsFlpXTnwYRkzcAE", title: "Tutu", artist: "Camilo, Pedro Capó" },
  { id: "7k4t7uLgtOxPwTpFmtJNTY", title: "Calma (Remix)", artist: "Pedro Capó, Farruko" },
  { id: "2ksOAxtIxundQ9jgTNAkbJ", title: "Amorfoda", artist: "Bad Bunny" },
  { id: "3AEZUABDXNtecAOSC1qTfo", title: "Todo de Ti", artist: "Rauw Alejandro" },
  { id: "0y6k1Q1kSpNlPJEcE7dNAB", title: "Museo", artist: "Rauw Alejandro" },
  { id: "1r1a8j5xrp7Xt5cbfyqmwK", title: "Bailando", artist: "Enrique Iglesias" },
  { id: "3P9dLzwZAy0DHDVWr5UfnT", title: "Vivir Mi Vida", artist: "Marc Anthony" },
  { id: "48xEUxrEDN7yiSjKJnLGvA", title: "La Bicicleta", artist: "Carlos Vives, Shakira" },
  { id: "6mICuAdrwEjh6Y6lroV2Kg", title: "Chantaje", artist: "Shakira, Maluma" },
  { id: "3ZFTkvIE7kyPt6Nu3PEa7V", title: "Hips Don't Lie", artist: "Shakira" },
  { id: "1SAkL1mYNJlaqnBQxVZrRl", title: "Colgando en tus Manos", artist: "Carlos Baute, Marta Sánchez" },
  { id: "3ZjnFYlal0fXtkA3lNGiP7", title: "La Camisa Negra", artist: "Juanes" },
  { id: "2mlGPkAx4kwF8Df0GlScsC", title: "A Dios le Pido", artist: "Juanes" },
  { id: "3ZOEytgrvLwQaqXreDs2Jx", title: "Bésame", artist: "Camila" },
  { id: "1JlxNKZdmWJZDkFqRq7wYY", title: "Mientes", artist: "Camila" },
  { id: "6xZ4Q2k2xNJmZgRLNMhOHf", title: "Te Mando Flores", artist: "Fonseca" },
  { id: "5itOtNx0WxtJmi1TQ3RuRd", title: "Andas En Mi Cabeza", artist: "Chino & Nacho, Daddy Yankee" },
  { id: "1TfqLAPs4K3s2rJMoCokcS", title: "Sweater Weather (Cover)", artist: "Acústico" },

  // Baladas / románticas
  { id: "6lanRgr6wXibZr8KgzXxBl", title: "Can't Help Falling in Love", artist: "Elvis Presley" },
  { id: "3XVozq1aeqsJwpXrEZrDJ9", title: "Thinking Out Loud", artist: "Ed Sheeran" },
  { id: "4fzsfWzRhPawzqhX8Qt9F3", title: "A Thousand Years", artist: "Christina Perri" },
  { id: "1EzrEOXmMH3G43AXT1y7pA", title: "I'm Yours", artist: "Jason Mraz" },
  { id: "2QLrYbfBBjxwqcJcOPvJyC", title: "Make You Feel My Love", artist: "Adele" },
  { id: "0hVXuCcriWRGvwMV1r5Yn9", title: "Yellow (Live)", artist: "Coldplay" },
  { id: "3JvrhDOgAt6p7K8mDyZwRd", title: "Iris", artist: "Goo Goo Dolls" },
  { id: "6ECp64rv50XVz93WvxXMGF", title: "The Night We Met", artist: "Lord Huron" },
  { id: "1EzrEOXmMH3G43AXT1y7pA", title: "I Won't Give Up", artist: "Jason Mraz" },

  // K-pop / anime
  { id: "5KawlOMHjWeUjQtnuRs22c", title: "Butter", artist: "BTS" },
  { id: "0t1kP63rueHleOhQkYSXFY", title: "Dynamite", artist: "BTS" },
  { id: "5QDLhrAOJJdNAmCTJ8xMyW", title: "Spring Day", artist: "BTS" },
  { id: "2ekn2ttSfGqwhhate0LSR0", title: "New Jeans", artist: "NewJeans" },
  { id: "3rWDp9tBPQR9z6U5YyRSK4", title: "Ditto", artist: "NewJeans" },
  { id: "0e7ipj03S05BNilyu5bRzt", title: "rockstar", artist: "LiSA" },
  { id: "4NDoJEUwCoQPXKcfjMLPeT", title: "Idol", artist: "YOASOBI" },
];

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Buscador tipo Spotify: tolera acentos, mayúsculas y palabras sueltas
 * ("perfect ed", "bad bunny", "titi") y ordena por relevancia.
 */
export const searchSongs = (q: string, limit = 12) => {
  const s = norm(q);
  if (!s) return SONGS.slice(0, limit);
  const tokens = s.split(" ");

  const scored = SONGS.map((song) => {
    const title = norm(song.title);
    const artist = norm(song.artist);
    const hay = `${title} ${artist}`;
    let score = 0;
    for (const t of tokens) {
      if (!hay.includes(t)) return { song, score: -1 };
      if (title.startsWith(t)) score += 5;
      else if (title.includes(t)) score += 3;
      if (artist.startsWith(t)) score += 3;
      else if (artist.includes(t)) score += 2;
    }
    if (title === s) score += 20;
    return { song, score };
  })
    .filter((r) => r.score >= 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((r) => r.song);
};

/** Código escaneable oficial de Spotify (imagen pública, no requiere API). */
export const spotifyCodeUrl = (trackId: string, bgHex: string, barColor: "white" | "black") =>
  `https://scannables.scdn.co/uri/plain/png/${bgHex.replace("#", "")}/${barColor}/640/spotify:track:${trackId}`;

export const spotifyEmbedUrl = (trackId: string) =>
  `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`;

export const spotifyTrackUrl = (trackId: string) => `https://open.spotify.com/track/${trackId}`;
