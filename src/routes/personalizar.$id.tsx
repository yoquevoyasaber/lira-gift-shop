import { createFileRoute, notFound, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  AlertCircle,
  Upload,
  Music,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DigitalCard, KeychainBack, KeychainFront } from "@/components/Keychain";
import { getProduct } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { analyzeImage, toPixelArt } from "@/lib/design.functions";
import { searchSongs, type Song } from "@/lib/songs";
import {
  BACKGROUNDS,
  CARD_FONTS,
  MAX_WORDS,
  MAX_WORDS_DECORATIVE,
  SWEET_TIERS,
  countWords,
  getFont,
  sweetSlots,
  tierForProduct,
  type DesignData,
} from "@/lib/customization";

export const Route = createFileRoute("/personalizar/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `Personaliza ${loaderData.product.name} — Lira` : "Personalizar — Lira" },
      {
        name: "description",
        content: "Elige tus dulces, personaliza el llavero de identificación y crea una carta digital con música.",
      },
      { property: "og:title", content: "Personaliza tu combo — Lira" },
      { property: "og:description", content: "Dulces, llavero pixel art y carta digital con canción." },
    ],
  }),
  component: Personalizar,
  notFoundComponent: () => (
    <AppShell>
      <div className="p-8 text-center text-muted-foreground">Producto no encontrado.</div>
    </AppShell>
  ),
});

const STEPS = ["Dulces", "Llavero", "Frente", "Carta", "Reverso"] as const;

/** Reduce la imagen antes de analizarla / guardarla. */
function fileToDataUrl(file: File, max = 640): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Archivo de imagen inválido"));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.85));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function Personalizar() {
  const { product } = Route.useLoaderData();
  const navigate = useNavigate();
  const { add } = useCart();
  const analyze = useServerFn(analyzeImage);
  const pixelate = useServerFn(toPixelArt);

  const slots = sweetSlots(product);
  const sweets = SWEET_TIERS[tierForProduct(product)];

  const [step, setStep] = useState(0);
  const [designId] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
  );
  const [d, setD] = useState<DesignData>({
    productId: product.id,
    sweets: [],
    keychain: true,
    photo: null,
    backgroundId: "celeste",
    customBackground: null,
    front: { name: "", birth: "", gender: "", quality: "" },
    song: null,
    card: { text: "", fontId: "poppins" },
    back: { from: "", to: "" },
  });

  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState<{ kind: "err" | "ok"; text: string } | null>(null);
  const [songOpen, setSongOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const photoRef = useRef<HTMLInputElement>(null);
  const bgRef = useRef<HTMLInputElement>(null);
  const fieldRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const set = (patch: Partial<DesignData>) => setD((p) => ({ ...p, ...patch }));

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 6000);
    return () => clearTimeout(t);
  }, [msg]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const messageUrl = `${origin}/m/${designId}`;

  const toggleSweet = (id: string) =>
    setD((p) => {
      if (p.sweets.includes(id)) return { ...p, sweets: p.sweets.filter((s) => s !== id) };
      if (p.sweets.length >= slots) return p;
      return { ...p, sweets: [...p.sweets, id] };
    });

  const handlePhoto = async (file: File) => {
    setBusy("Analizando tu foto con IA…");
    setMsg(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      const verdict = await analyze({ data: { image: dataUrl, kind: "person" } });
      if (!verdict.ok) {
        setMsg({ kind: "err", text: `Imagen no elegible: ${verdict.reason}` });
        return;
      }
      setBusy("Convirtiendo a pixel art…");
      const res = await pixelate({ data: { image: dataUrl } });
      set({ photo: res.image });
      setMsg({ kind: "ok", text: "¡Listo! Tu pixel art se integró al llavero." });
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "No se pudo procesar la imagen" });
    } finally {
      setBusy("");
    }
  };

  const handleBg = async (file: File) => {
    setBusy("Analizando el fondo con IA…");
    setMsg(null);
    try {
      const dataUrl = await fileToDataUrl(file, 720);
      const verdict = await analyze({ data: { image: dataUrl, kind: "background" } });
      if (!verdict.ok) {
        setMsg({ kind: "err", text: `Fondo no elegible: ${verdict.reason}` });
        return;
      }
      set({ customBackground: dataUrl });
      setMsg({ kind: "ok", text: "Fondo aprobado y aplicado." });
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "No se pudo procesar el fondo" });
    } finally {
      setBusy("");
    }
  };

  /** Validación por paso: devuelve el error y a qué paso ir. */
  const problems = useMemo(() => {
    const list: { step: number; text: string }[] = [];
    if (d.sweets.length < slots)
      list.push({ step: 0, text: `Te faltan dulces por elegir (${d.sweets.length}/${slots}).` });
    if (d.keychain) {
      if (!d.photo) list.push({ step: 2, text: "Falta subir la foto para el pixel art del llavero." });
      const empty = Object.entries(d.front).filter(([, v]) => !v.trim());
      if (empty.length) list.push({ step: 2, text: "Faltan datos del frente del llavero." });
      if (!d.song) list.push({ step: 2, text: "Falta elegir la canción del código de Spotify." });
      if (!d.card.text.trim()) list.push({ step: 3, text: "Falta escribir el mensaje de la carta digital." });
      if (!d.back.from.trim() || !d.back.to.trim())
        list.push({ step: 4, text: "Faltan los campos DE y PARA del reverso." });
    }
    const words = countWords(d.card.text);
    if (words > MAX_WORDS) list.push({ step: 3, text: `El mensaje es muy largo (máx. ${MAX_WORDS} palabras).` });
    if (getFont(d.card.fontId).decorative && words > MAX_WORDS_DECORATIVE)
      list.push({
        step: 3,
        text: `Esa tipografía decorada solo admite mensajes de hasta ${MAX_WORDS_DECORATIVE} palabras.`,
      });
    return list;
  }, [d, slots]);

  const finish = async () => {
    if (problems.length) {
      const p = problems[0];
      setStep(p.step);
      setMsg({ kind: "err", text: `Te olvidaste de algo: ${p.text}` });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const { data: session } = await supabase.auth.getUser();
      const { error } = await supabase.from("designs").insert({
        id: designId,
        user_id: session.user?.id ?? null,
        product_id: product.id,
        data: d as unknown as Record<string, unknown>,
      });
      if (error) throw error;
      add(product.id, 1, designId);
      void navigate({ to: "/checkout" });
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "No se pudo guardar tu personalización" });
    } finally {
      setSaving(false);
    }
  };

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  return (
    <AppShell>
      <div className="bg-primary/10 py-2 text-center text-sm font-semibold tracking-wide text-primary">
        PERSONALIZA TU COMBO
      </div>

      <div className="flex items-center gap-1 px-3 py-3">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1.5 rounded-full ${i <= step ? "bg-primary" : "bg-secondary"}`} />
            <div className={`mt-1 text-center text-[10px] ${i === step ? "font-bold text-primary" : "text-muted-foreground"}`}>
              {s}
            </div>
          </div>
        ))}
      </div>

      {msg && (
        <div
          className={`mx-3 mb-2 flex items-start gap-2 rounded-lg p-3 text-sm ${
            msg.kind === "err" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
          }`}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{msg.text}</span>
        </div>
      )}

      {busy && (
        <div className="mx-3 mb-2 flex items-center gap-2 rounded-lg bg-secondary p-3 text-sm text-secondary-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> {busy}
        </div>
      )}

      <div className="px-3 pb-4">
        {/* -------- Paso 0: dulces -------- */}
        {step === 0 && (
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              Tu <b className="text-foreground">{product.name}</b> incluye{" "}
              <b className="text-primary">{slots} dulces</b>. Elige tus favoritos:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {sweets.map((s) => {
                const active = d.sweets.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleSweet(s.id)}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-left text-sm transition ${
                      active
                        ? "border-primary bg-primary/10 font-semibold text-primary"
                        : "border-border bg-card text-foreground"
                    }`}
                  >
                    <span className="text-xl">{s.emoji}</span>
                    <span className="flex-1">{s.name}</span>
                    {active && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 text-center text-sm font-semibold text-muted-foreground">
              {d.sweets.length}/{slots} elegidos
              {d.sweets.length > 0 && d.sweets.length < slots && " · puedes repetir en otro combo"}
            </div>
          </div>
        )}

        {/* -------- Paso 1: ¿llavero? -------- */}
        {step === 1 && (
          <div className="space-y-3 py-4 text-center">
            <Sparkles className="mx-auto h-10 w-10 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              ¿Deseas añadir el llavero de identificación?
            </h2>
            <p className="text-sm text-muted-foreground">
              Incluye tu retrato en pixel art, código de Spotify con tu canción y un QR con una carta
              digital.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  set({ keychain: true });
                  next();
                }}
                className="rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground"
              >
                Sí, personalizarlo
              </button>
              <button
                onClick={() => {
                  set({ keychain: false });
                  setStep(4);
                }}
                className="rounded-lg border border-border px-6 py-2.5 font-semibold text-foreground"
              >
                No, gracias
              </button>
            </div>
          </div>
        )}

        {/* -------- Paso 2: frente del llavero -------- */}
        {step === 2 && d.keychain && (
          <div className="space-y-4">
            <KeychainFront
              d={d}
              onPhoto={() => photoRef.current?.click()}
              onSong={() => setSongOpen(true)}
              onField={(k) => fieldRefs.current[k]?.focus()}
            />
            <input
              ref={photoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handlePhoto(f);
                e.target.value = "";
              }}
            />

            <button
              onClick={() => photoRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/50 py-3 text-sm font-semibold text-primary"
            >
              <Upload className="h-4 w-4" />
              {d.photo ? "Cambiar foto (se analiza con IA)" : "Subir foto de la persona"}
            </button>
            <p className="-mt-2 text-center text-xs text-muted-foreground">
              Puedes subir una foto real o tu propio pixel art. La IA revisa que sea apta.
            </p>

            <div>
              <div className="mb-2 text-sm font-bold text-foreground">Fondo del llavero</div>
              <div className="grid grid-cols-4 gap-2">
                {BACKGROUNDS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => set({ backgroundId: b.id, customBackground: null })}
                    aria-label={b.label}
                    className={`h-12 rounded-lg ring-2 ${
                      d.backgroundId === b.id && !d.customBackground ? "ring-primary" : "ring-transparent"
                    }`}
                    style={{ backgroundImage: b.css }}
                  />
                ))}
              </div>
              <button
                onClick={() => bgRef.current?.click()}
                className="mt-2 w-full rounded-lg border border-border py-2 text-xs font-semibold text-foreground"
              >
                O sube tu propio fondo (solo fondos lisos o con diseños)
              </button>
              <input
                ref={bgRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleBg(f);
                  e.target.value = "";
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-bold text-foreground">Datos del frente</div>
              {(
                [
                  ["name", "Nombre"],
                  ["birth", "Fecha de nacimiento"],
                  ["gender", "Género"],
                  ["quality", "Cualidad"],
                ] as const
              ).map(([k, label]) => (
                <input
                  key={k}
                  ref={(el) => {
                    fieldRefs.current[k] = el;
                  }}
                  value={d.front[k]}
                  placeholder={label}
                  onChange={(e) => set({ front: { ...d.front, [k]: e.target.value } })}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              ))}
            </div>

            <button
              onClick={() => setSongOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary py-3 text-sm font-semibold text-secondary-foreground"
            >
              <Music className="h-4 w-4" />
              {d.song ? `${d.song.title} — ${d.song.artist}` : "Buscar canción para el código"}
            </button>
          </div>
        )}

        {/* -------- Paso 3: carta digital -------- */}
        {step === 3 && d.keychain && (
          <div className="space-y-4">
            <div className="rounded-lg bg-primary/10 p-3 text-xs text-primary">
              Este mensaje especial será visible en una página web al escanear el código QR del
              llavero.
            </div>
            <DigitalCard d={d} />
            <textarea
              value={d.card.text}
              onChange={(e) => set({ card: { ...d.card, text: e.target.value } })}
              rows={3}
              placeholder="Escribe tu mensaje especial…"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
            />
            <div className="-mt-2 text-right text-xs text-muted-foreground">
              {countWords(d.card.text)}/{MAX_WORDS} palabras
            </div>
            <div>
              <div className="mb-2 text-sm font-bold text-foreground">Tipografía</div>
              <div className="grid grid-cols-3 gap-2">
                {CARD_FONTS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => set({ card: { ...d.card, fontId: f.id } })}
                    style={{ fontFamily: f.family }}
                    className={`rounded-lg border p-2 text-sm ${
                      d.card.fontId === f.id ? "border-primary bg-primary/10 text-primary" : "border-border"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Las tipografías decoradas son solo para mensajes cortos (hasta{" "}
                {MAX_WORDS_DECORATIVE} palabras).
              </p>
            </div>
          </div>
        )}

        {/* -------- Paso 4: reverso -------- */}
        {step === 4 && (
          <div className="space-y-4">
            {d.keychain ? (
              <>
                <KeychainBack d={d} url={messageUrl} />
                <div className="space-y-2">
                  <input
                    value={d.back.from}
                    placeholder="De…"
                    onChange={(e) => set({ back: { ...d.back, from: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                  <input
                    value={d.back.to}
                    placeholder="Para…"
                    onChange={(e) => set({ back: { ...d.back, to: e.target.value } })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  El QR llevará a tu carta digital con la canción.
                </p>
              </>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Tu combo irá sin llavero de identificación. Ya puedes finalizar.
              </p>
            )}

            {problems.length > 0 && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <b>Te falta personalizar:</b>
                <ul className="mt-1 space-y-1">
                  {problems.map((p, i) => (
                    <li key={i}>
                      <button onClick={() => setStep(p.step)} className="underline">
                        {p.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => void finish()}
              disabled={saving}
              className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-60"
            >
              {saving ? "Guardando…" : "Finalizar y proceder al pago"}
            </button>
          </div>
        )}

        {/* -------- Navegación -------- */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={step === 0 ? () => void navigate({ to: "/producto/$id", params: { id: product.id } }) : prev}
            className="flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-semibold"
          >
            <ArrowLeft className="h-4 w-4" /> Atrás
          </button>
          {step < STEPS.length - 1 && (
            <button
              onClick={() => (d.keychain ? next() : setStep(4))}
              className="flex items-center gap-1 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
            >
              Siguiente <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link to="/producto/$id" params={{ id: product.id }} className="text-xs text-muted-foreground underline">
            Ver info del combo
          </Link>
        </div>
      </div>

      {songOpen && (
        <SongPicker
          onClose={() => setSongOpen(false)}
          onPick={(s: Song) => {
            set({ song: s });
            setSongOpen(false);
          }}
        />
      )}
    </AppShell>
  );
}

function SongPicker({ onClose, onPick }: { onClose: () => void; onPick: (s: Song) => void }) {
  const [q, setQ] = useState("");
  const results = searchSongs(q);
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50" onClick={onClose}>
      <div
        className="max-h-[80vh] w-full overflow-y-auto rounded-t-2xl bg-background p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 text-sm font-bold text-foreground">Busca tu canción</div>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nombre de la canción o artista…"
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
        />
        <div className="mt-2 divide-y divide-border">
          {results.map((s) => (
            <button
              key={s.id}
              onClick={() => onPick(s)}
              className="flex w-full items-center gap-2 py-3 text-left"
            >
              <Music className="h-4 w-4 text-primary" />
              <span className="flex-1">
                <span className="block text-sm font-semibold text-foreground">{s.title}</span>
                <span className="block text-xs text-muted-foreground">{s.artist}</span>
              </span>
            </button>
          ))}
          {results.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No encontramos esa canción en el catálogo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
