"use client";

import { useEffect, useState } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFirebaseClient } from '../../lib/firebase';
import { useSiteEditor } from './SiteEditorProvider';

type Props = { contentKey: string; defaultValue: string; className?: string; as?: 'span' | 'p' | 'strong' | 'small' };

export default function InlineEditableText({ contentKey, defaultValue, className, as: Tag = 'span' }: Props) {
  const { isAdmin, uid } = useSiteEditor();
  const [value, setValue] = useState(defaultValue);
  const [draft, setDraft] = useState(defaultValue);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const { db } = getFirebaseClient();
    if (!db) return;
    return onSnapshot(doc(db, 'siteContent', contentKey), (snapshot) => {
      const next = snapshot.data()?.value;
      if (typeof next === 'string' && next.trim()) { setValue(next); setDraft(next); }
    });
  }, [contentKey]);

  async function save() {
    const next = draft.trim();
    if (!next) { setStatus('Metin boş bırakılamaz.'); return; }
    const { db } = getFirebaseClient();
    if (!db || !uid) return;
    setStatus('Kaydediliyor...');
    try {
      await setDoc(doc(db, 'siteContent', contentKey), { type: 'text', value: next, updatedBy: uid, updatedAt: serverTimestamp() });
      setEditing(false);
      setStatus('');
    } catch { setStatus('Kaydedilemedi. Yetki veya bağlantı kontrol edilmeli.'); }
  }

  return <span className="inline-editor-wrap"><Tag className={className}>{value}</Tag>{isAdmin && <button type="button" className="inline-editor-trigger" onClick={() => { setDraft(value); setEditing(true); }} aria-label="Bu metni düzenle">Düzenle</button>}{editing && <div className="inline-editor-backdrop" role="presentation"><section className="inline-editor-modal" role="dialog" aria-modal="true" aria-label="Metni düzenle"><button type="button" className="inline-editor-close" onClick={() => setEditing(false)} aria-label="Kapat">×</button><small>SİTE İÇİ DÜZENLEME</small><h2>Metni güncelle</h2><textarea value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={800} rows={6} autoFocus /><div><button type="button" onClick={() => setEditing(false)}>Vazgeç</button><button type="button" onClick={save}>Kaydet</button></div>{status && <p>{status}</p>}</section></div>}</span>;
}
