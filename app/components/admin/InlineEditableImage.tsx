"use client";

import { useEffect, useState } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFirebaseClient } from '../../lib/firebase';
import { useSiteEditor } from './SiteEditorProvider';

type Props = { contentKey: string; defaultSrc: string; alt: string; className?: string };

export default function InlineEditableImage({ contentKey, defaultSrc, alt, className }: Props) {
  const { isAdmin, uid } = useSiteEditor();
  const [src, setSrc] = useState(defaultSrc);
  const [draft, setDraft] = useState(defaultSrc);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState('');
  useEffect(() => {
    const { db } = getFirebaseClient();
    if (!db) return;
    return onSnapshot(doc(db, 'siteContent', contentKey), (snapshot) => {
      const next = snapshot.data()?.value;
      if (typeof next === 'string' && next.trim()) { setSrc(next); setDraft(next); }
    });
  }, [contentKey]);
  async function save(next: string) {
    const { db } = getFirebaseClient();
    if (!db || !uid) return;
    await setDoc(doc(db, 'siteContent', contentKey), { type: 'image', value: next, updatedBy: uid, updatedAt: serverTimestamp() });
    setEditing(false);
  }
  return <span className="inline-editor-image-wrap"><img src={src} alt={alt} className={className} />{isAdmin && <button type="button" className="inline-editor-trigger" onClick={() => { setDraft(src); setEditing(true); }} aria-label="Bu görseli düzenle">Görseli değiştir</button>}{editing && <div className="inline-editor-backdrop" role="presentation"><section className="inline-editor-modal" role="dialog" aria-modal="true" aria-label="Görseli düzenle"><button type="button" className="inline-editor-close" onClick={() => setEditing(false)} aria-label="Kapat">×</button><small>SİTE İÇİ DÜZENLEME</small><h2>Görseli güncelle</h2><label>Görsel bağlantısı<input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="https://..." /></label><p>Görsel bağlantısı kaydedildiğinde sayfadaki görsel anında güncellenir.</p><div><button type="button" onClick={() => setEditing(false)}>Vazgeç</button><button type="button" onClick={() => void save(draft.trim())}>Bağlantıyı kaydet</button></div>{status && <p>{status}</p>}</section></div>}</span>;
}
