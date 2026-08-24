import { useState } from "react";
import {
  getBackground,
  getFont,
  getIdStyle,
  qrImageUrl,
  type DesignData,
} from "@/lib/customization";
import { spotifyCodeUrl } from "@/lib/songs";
import { PAYMENT_INFO } from "@/lib/payment";

/* ---------------- helpers de estilo ---------------- */

const palette = (d: DesignData) => {
  const bg = getBackground(d.backgroundId);
  const style = getIdStyle(d.styleId);
  return { bg, style, text: d.customBackground ? "#ffffff" : bg.text };
};

const surface = (d: DesignData) => {
  const bg = getBackground(d.backgroundId);
  if (d.customBackground) {
    return {
      backgroundImage: `linear-gradient(rgba(0,0,0,.28),rgba(0,0,0,.28)), url(${d.customBackground})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    } as const;
  }
  return {
    backgroundImage: bg.pattern ? `${bg.pattern}, ${bg.css}` : bg.css,
    backgroundSize: bg.pattern
      ? bg.id === "cuadricula"
        ? "14px 14px, 14px 14px, 100% 100%"
        : "16px 16px, 100% 100%"
      : "100% 100%",
  } as const;
};

const photoClasses = (kind: string) => {
  switch (kind) {
    case "dashed":
      return "rounded-lg border-2 border-dashed";
    case "polaroid":
      return "rounded-md border-[6px] border-white shadow-md";
    case "circle":
      return "rounded-full border-2";
    default:
      return "rounded-md border";
  }
};

function Topper({ kind, color }: { kind: string; color: string }) {
  if (kind === "ninguno") return null;
  const icon =
    kind === "estrellas" ? "★" : kind === "corazones" ? "♥" : kind === "chispas" ? "✦" : "●";
  return (
    <div className="flex items-center justify-center gap-1.5 text-[11px]" style={{ color }}>
      <span className="opacity-70">{icon}</span>
      <span className="text-[15px]">{icon}</span>
      <span className="opacity-70">{icon}</span>
    </div>
  );
}

/** Código de Spotify con respaldo si la imagen oficial no carga. */
function SpotifyCode({
  trackId,
  bg,
  bars,
  className,
}: {
  trackId: string;
  bg: string;
  bars: "white" | "black";
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`flex items-end gap-[2px] ${className ?? ""}`}>
        {Array.from({ length: 23 }).map((_, i) => (
          <span
            key={i}
            className="w-[3px] rounded-full"
            style={{
              height: `${30 + ((i * 37) % 60)}%`,
              background: bars === "white" ? "#ffffff" : "#111111",
            }}
          />
        ))}
      </div>
    );
  }
  return (
    <img
      src={spotifyCodeUrl(trackId, bg, bars)}
      alt="Código de Spotify"
      onError={() => setFailed(true)}
      className={`object-contain ${className ?? ""}`}
    />
  );
}

/* ---------------- Frente del llavero ---------------- */

export function KeychainFront({
  d,
  onPhoto,
  onSong,
  onField,
}: {
  d: DesignData;
  onPhoto?: () => void;
  onSong?: () => void;
  onField?: (k: keyof DesignData["front"]) => void;
}) {
  const { bg, style, text } = palette(d);
  const capsule = style.fields === "capsulas";

  return (
    <div
      className="mx-auto w-full max-w-[320px] overflow-hidden shadow-lg ring-1 ring-black/10"
      style={{ ...surface(d), borderRadius: style.radius }}
    >
      {/* Barra superior */}
      <div
        className="flex items-center justify-between px-3 py-1.5"
        style={{ background: d.customBackground ? "rgba(255,255,255,.25)" : bg.band }}
      >
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className="block h-1.5 w-1.5 rounded-full"
              style={{ background: text, opacity: 0.45 }}
            />
          ))}
        </div>
        <Topper kind={style.topper} color={text} />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="block h-2 w-2 rounded-full border"
              style={{ borderColor: text, opacity: 0.5 }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2.5 p-2.5">
        {/* Foto pixel art */}
        <button
          type="button"
          onClick={onPhoto}
          className={`relative h-[104px] w-[86px] shrink-0 overflow-hidden bg-white/70 ${photoClasses(style.photo)}`}
          style={{ borderColor: bg.accent }}
        >
          {d.photo ? (
            <img
              src={d.photo}
              alt="Retrato pixel art"
              className="h-full w-full object-cover"
              style={{ imageRendering: "pixelated" }}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center px-1 text-center text-[9px] font-semibold text-neutral-500">
              Toca para subir tu foto
            </span>
          )}
          <span className="absolute right-1 top-1 text-[10px]" style={{ color: bg.accent }}>
            ✦
          </span>
        </button>

        {/* Campos */}
        <div className="flex-1 space-y-1">
          {(
            [
              ["name", "NOMBRE"],
              ["birth", "F. NACIMIENTO"],
              ["gender", "GÉNERO"],
              ["quality", "CUALIDAD"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => onField?.(k)}
              className={`flex w-full items-baseline gap-1 text-left text-[9px] ${
                capsule ? "rounded-full px-2 py-[3px]" : "border-b pb-[2px]"
              }`}
              style={
                capsule
                  ? {
                      background: d.customBackground ? "rgba(255,255,255,.85)" : "#ffffffcc",
                      color: bg.text,
                    }
                  : { borderColor: text, color: text }
              }
            >
              <span className="font-bold tracking-tight">{label}:</span>
              <span className="flex-1 truncate">
                {d.front[k] || <span className="italic opacity-50">editar</span>}
              </span>
            </button>
          ))}

          <div
            className="flex items-center justify-center gap-1 pt-1 text-[9px] font-bold tracking-widest"
            style={{ color: text }}
          >
            🎧 TU CANCIÓN 🎵
          </div>
          <button
            type="button"
            onClick={onSong}
            className="block w-full truncate rounded-full px-2 py-1 text-center text-[9px] font-semibold"
            style={{ background: bg.accent, color: "#ffffff" }}
          >
            {d.song ? `“${d.song.title}” - ${d.song.artist}` : "Elegir canción"}
          </button>
        </div>
      </div>

      {/* Código de Spotify */}
      <button
        type="button"
        onClick={onSong}
        className="mx-2.5 mb-2.5 flex w-[calc(100%-20px)] items-center gap-2 rounded-full bg-white/90 px-2.5 py-1.5"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1DB954] text-[11px] text-white">
          ♫
        </span>
        {d.song ? (
          <SpotifyCode trackId={d.song.id} bg="FFFFFF" bars="black" className="h-7 flex-1" />
        ) : (
          <div className="h-7 flex-1 rounded bg-neutral-200" />
        )}
      </button>
    </div>
  );
}

/* ---------------- Reverso del llavero ---------------- */

export function KeychainBack({ d, url }: { d: DesignData; url: string }) {
  const { bg, style, text } = palette(d);

  return (
    <div
      className="mx-auto w-full max-w-[320px] overflow-hidden text-center shadow-lg ring-1 ring-black/10"
      style={{ ...surface(d), borderRadius: style.radius }}
    >
      <div
        className="px-3 py-2 text-[15px] font-bold"
        style={{
          background: d.customBackground ? "rgba(255,255,255,.25)" : bg.band,
          color: text,
          fontFamily: "'Dancing Script', cursive",
        }}
      >
        Especialmente para ti
      </div>

      <div className="space-y-1.5 px-4 pt-3 text-left text-[10px]" style={{ color: text }}>
        <div
          className="flex gap-1 rounded-full px-2.5 py-1"
          style={{ background: d.customBackground ? "rgba(255,255,255,.85)" : "#ffffffcc", color: bg.text }}
        >
          <b>DE:</b> {d.back.from || <i className="opacity-50">—</i>}
        </div>
        <div
          className="flex gap-1 rounded-full px-2.5 py-1"
          style={{ background: d.customBackground ? "rgba(255,255,255,.85)" : "#ffffffcc", color: bg.text }}
        >
          <b>PARA:</b> {d.back.to || <i className="opacity-50">—</i>}
        </div>
      </div>

      <div className="mx-auto mt-3 w-fit rounded-xl bg-white p-2 shadow">
        <img src={qrImageUrl(url)} alt="Código QR del mensaje" className="h-28 w-28" />
      </div>
      <div className="mt-1.5 text-[10px] font-bold tracking-[0.2em]" style={{ color: text }}>
        ¡ESCANÉAME!
      </div>
      <div className="px-4 pb-3 pt-2 text-[8px] leading-tight opacity-85" style={{ color: text }}>
        Lira · {PAYMENT_INFO.email} · WhatsApp {PAYMENT_INFO.whatsappPretty}
      </div>
    </div>
  );
}

/* ---------------- Carta digital ---------------- */

export function DigitalCard({
  d,
  onText,
  embed,
}: {
  d: DesignData;
  onText?: () => void;
  embed?: boolean;
}) {
  const font = getFont(d.card.fontId);
  const { bg } = palette(d);

  return (
    <div
      className="mx-auto w-full max-w-[320px] overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/10"
      style={{
        backgroundImage: "repeating-linear-gradient(0deg,#fffdf7 0px,#fffdf7 21px,#e9e2d2 22px)",
      }}
    >
      <div className="h-2 w-full" style={{ background: bg.band }} />
      <div className="p-4">
        {d.photo && (
          <img
            src={d.photo}
            alt="Retrato pixel art"
            className="mx-auto h-24 w-24 rounded-xl border-2 border-white object-cover shadow"
            style={{ imageRendering: "pixelated" }}
          />
        )}
        <button
          type="button"
          onClick={onText}
          className="mt-3 block w-full text-center leading-snug"
          style={{ fontFamily: font.family, color: bg.text, fontSize: font.decorative ? 26 : 16 }}
        >
          {d.card.text || <span className="opacity-60">Editar texto</span>}
        </button>

        {d.song && (
          <div className="mt-4">
            {embed ? (
              <iframe
                title="Reproductor"
                src={`https://open.spotify.com/embed/track/${d.song.id}?utm_source=generator`}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-xl"
              />
            ) : (
              <div className="rounded-xl bg-white/80 p-2 text-center text-[11px] font-semibold text-neutral-600">
                ▶ {d.song.title} — {d.song.artist}
              </div>
            )}
            <div className="mx-auto mt-2 flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1DB954] text-[11px] text-white">
                ♫
              </span>
              <SpotifyCode trackId={d.song.id} bg="FFFFFF" bars="black" className="h-8 w-40" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
