'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import './article-cover-field.css';

async function compressCover(file: File) {
  if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) throw new Error('Yalnız JPG, PNG veya WebP görsel seçin.');
  if (file.size > 8 * 1024 * 1024) throw new Error('Kapak görseli 8 MB boyutunu aşamaz.');
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Görsel okunamadı.'));
    reader.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const item = new Image();
    item.onload = () => resolve(item);
    item.onerror = () => reject(new Error('Görsel açılamadı.'));
    item.src = source;
  });
  for (const [size, quality] of [[720, 0.64], [600, 0.56], [480, 0.5]] as const) {
    const scale = Math.min(1, size / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
    const result = canvas.toDataURL('image/webp', quality);
    if (result.length <= 26000) return result;
  }
  throw new Error('Görsel kapak için fazla ayrıntılı. Daha küçük veya sade bir görsel deneyin.');
}

export default function ArticleCoverField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState('');

  async function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setNotice('');
    try {
      onChange(await compressCover(file));
      setNotice('Kapak küçültülüp WebP olarak hazırlandı. Makaleyi kaydettiğinizde yayına alınır.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Kapak görseli hazırlanamadı.');
    } finally {
      event.target.value = '';
    }
  }

  return <div className="article-cover-field">
    <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="/images/... veya https://..." maxLength={26000} />
    <div><input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => void selectFile(event)} /><button type="button" className="admin-secondary compact" onClick={() => fileRef.current?.click()}>Bilgisayardan kapak seç</button>{value && <button type="button" className="admin-secondary compact" onClick={() => onChange('')}>Kapağı kaldır</button>}</div>
    {value && <div className="article-cover-field-preview" style={{ backgroundImage: `url("${value.startsWith('https://') ? encodeURI(value) : value}")` }} role="img" aria-label="Seçilen makale kapağı" />}
    <small>Yerel görseller tarayıcıda küçültülür. HTTPS bağlantısı veya mevcut site içi görsel yolu da kullanılabilir.</small>
    {notice && <small className="article-cover-field-notice">{notice}</small>}
  </div>;
}
