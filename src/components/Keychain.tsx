import { getBackground, getFont, qrImageUrl, type DesignData } from "@/lib/customization";
import { spotifyCodeUrl } from "@/lib/songs";
import { PAYMENT_INFO } from "@/lib/payment";

const frameStyle = (d: DesignData) => {
  const bg = getBackground(d.backgroundId);
  return d.customBackground
    ? { backgroundImage: `url(${d.customBackground})`, backgroundSize: "cover" as const }
    : { backgroundImage: bg.css };
};

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
  const bg = getBackground(d.backgroundId);
  const text = d.customBackground ? "#ffffff" : bg.text;

  return (
    <div
      className="mx-auto w-full max-w-[260px] rounded-[22px] p-3 shadow-lg ring-1 ring-black/10"
      style={frameStyle(d)}
    >
      <button
        type="button"
        onClick={onPhoto}
        className="mx-auto block h-28 w-28 overflow-hidden rounded-2xl border-2 border-white/70 bg-white/70 shadow-inner"
      >
        {d.photo ? (
          <img src={d.photo} alt="Pixel art" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center px-2 text-center text-[10px] font-semibold text-neutral-500">
            Toca para subir tu foto
          </span>
        )}
      </button>

      <div className="mt-3 space-y-1.5" style={{ color: text }}>
        {(
          [
            ["name", "NOMBRE"],
            ["birth", "FECHA DE NAC."],
            ["gender", "GÉNERO"],
            ["quality", "CUALIDAD"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => onField?.(k)}
            className="flex w-full items-baseline gap-1 border-b border-current/25 pb-0.5 text-left text-[10px]"
          >
            <span className="font-bold tracking-wide">{label}:</span>
            <span className="flex-1 truncate opacity-90">
              {d.front[k] || <span className="italic opacity-60">tocar para editar</span>}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onSong}
        className="mt-3 flex w-full items-center gap-2 rounded-lg bg-white/80 p-1.5 text-left"
      >
        {d.song ? (
          <img
            src={spotifyCodeUrl(d.song.id, "FFFFFF", "black")}
            alt="Código de Spotify"
            className="h-8 flex-1 object-contain"
          />
        ) : (
          <div className="h-8 flex-1 rounded bg-neutral-200" />
        )}
      </button>
      <button
        type="button"
        onClick={onSong}
        className="mt-1 block w-full truncate text-center text-[10px] font-semibold"
        style={{ color: text }}
      >
        {d.song ? `${d.song.title} — ${d.song.artist}` : "Elegir canción"}
      </button>
    </div>
  );
}

export function KeychainBack({ d, url }: { d: DesignData; url: string }) {
  const bg = getBackground(d.backgroundId);
  const text = d.customBackground ? "#ffffff" : bg.text;

  return (
    <div
      className="mx-auto w-full max-w-[260px] rounded-[22px] p-4 text-center shadow-lg ring-1 ring-black/10"
      style={frameStyle(d)}
    >
      <div className="text-sm font-bold" style={{ color: text, fontFamily: "'Dancing Script', cursive" }}>
        Especialmente para ti
      </div>
      <div className="mt-2 space-y-1 text-left text-[10px]" style={{ color: text }}>
        <div className="border-b border-current/25 pb-0.5">
          <b>DE:</b> {d.back.from || <i className="opacity-60">—</i>}
        </div>
        <div className="border-b border-current/25 pb-0.5">
          <b>PARA:</b> {d.back.to || <i className="opacity-60">—</i>}
        </div>
      </div>
      <div className="mt-3 rounded-xl bg-white p-2">
        <img src={qrImageUrl(url)} alt="Código QR del mensaje" className="mx-auto h-24 w-24" />
      </div>
      <div className="mt-1 text-[10px] font-bold tracking-widest" style={{ color: text }}>
        ¡ESCANÉAME!
      </div>
      <div className="mt-2 text-[8px] leading-tight opacity-80" style={{ color: text }}>
        Lira · {PAYMENT_INFO.email}
      </div>
    </div>
  );
}

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
  const bg = getBackground(d.backgroundId);

  return (
    <div
      className="mx-auto w-full max-w-[300px] rounded-2xl p-4 shadow-lg ring-1 ring-black/10"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg,#fffdf7 0px,#fffdf7 21px,#e9e2d2 22px)",
      }}
    >
      {d.photo && (
        <img
          src={d.photo}
          alt="Pixel art"
          className="mx-auto h-24 w-24 rounded-xl border-2 border-white object-cover shadow"
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
          <img
            src={spotifyCodeUrl(d.song.id, "FFFFFF", "black")}
            alt="Código de Spotify"
            className="mx-auto mt-2 h-10 object-contain"
          />
        </div>
      )}
    </div>
  );
}
