import { useEffect, useState } from 'react';
import { toDataURL } from 'qrcode';

export function MessageQR({ url }: { url: string }) {
  const [image, setImage] = useState('');
  useEffect(() => {
    let alive = true;
    void toDataURL(url, { width: 360, margin: 4, errorCorrectionLevel: 'M' }).then(src => { if (alive) setImage(src); });
    return () => { alive = false; };
  }, [url]);
  return <a href={url} target="_blank" rel="noreferrer" aria-label="Abrir mensaje de la carta">
    {image ? <img src={image} alt="Código QR del mensaje" className="h-28 w-28" /> : <span className="block h-28 w-28 bg-muted" />}
  </a>;
}