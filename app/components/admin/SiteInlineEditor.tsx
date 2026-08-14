"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { addDoc, collection, doc, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { usePathname } from 'next/navigation';
import { getFirebaseClient } from '../../lib/firebase';
import { useSiteEditor } from './SiteEditorProvider';

type EditableTag = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'strong' | 'small';
type FontFamily = 'inherit' | 'Arial' | 'Georgia' | 'Tahoma' | 'Trebuchet MS' | 'Verdana';
type TextAlign = 'left' | 'center' | 'right';
type TextStyle = {
  fontFamily: FontFamily;
  fontSize: number;
  fontWeight: number;
  textAlign: TextAlign;
};
type StoredContent = {
  type?: 'text' | 'image' | 'dom-text' | 'dom-image';
  value?: string;
  alt?: string;
  style?: Partial<TextStyle>;
  pagePath?: string;
  selector?: string;
  href?: string;
};

const defaultTextStyle: TextStyle = {
  fontFamily: 'inherit',
  fontSize: 0,
  fontWeight: 0,
  textAlign: 'left',
};

const fontOptions: Array<{ label: string; value: FontFamily }> = [
  { label: 'Sayfanın yazı tipi', value: 'inherit' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Tahoma', value: 'Tahoma' },
  { label: 'Trebuchet MS', value: 'Trebuchet MS' },
  { label: 'Verdana', value: 'Verdana' },
];

function normalizeStyle(value?: Partial<TextStyle>): TextStyle {
  const fontFamily = fontOptions.some((item) => item.value === value?.fontFamily)
    ? value?.fontFamily as FontFamily
    : defaultTextStyle.fontFamily;
  const fontSize = [0, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64].includes(Number(value?.fontSize))
    ? Number(value?.fontSize)
    : defaultTextStyle.fontSize;
  const fontWeight = [0, 400, 500, 600, 700, 800, 900].includes(Number(value?.fontWeight))
    ? Number(value?.fontWeight)
    : defaultTextStyle.fontWeight;
  const textAlign = ['left', 'center', 'right'].includes(String(value?.textAlign))
    ? value?.textAlign as TextAlign
    : defaultTextStyle.textAlign;
  return { fontFamily, fontSize, fontWeight, textAlign };
}

function toCss(style: TextStyle): CSSProperties {
  return {
    fontFamily: style.fontFamily === 'inherit' ? undefined : style.fontFamily,
    fontSize: style.fontSize || undefined,
    fontWeight: style.fontWeight || undefined,
    textAlign: style.textAlign === 'left' ? undefined : style.textAlign,
  };
}

function useStoredContent(contentKey: string, fallback: StoredContent, expectedType: 'text' | 'image') {
  const [content, setContent] = useState<StoredContent>(fallback);

  useEffect(() => {
    const { db } = getFirebaseClient();
    if (!db) return;
    return onSnapshot(doc(db, 'siteContent', contentKey), (snapshot) => {
      const next = snapshot.data() as StoredContent | undefined;
      if (!next || next.type !== expectedType || typeof next.value !== 'string' || !next.value.trim()) return;
      setContent({ ...fallback, ...next, style: normalizeStyle(next.style) });
    });
  }, [contentKey, expectedType, fallback]);

  return [content, setContent] as const;
}

function EditorFrame({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  useEffect(() => {
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', closeWithEscape);
    return () => window.removeEventListener('keydown', closeWithEscape);
  }, [close]);

  return (
    <div className="site-inline-editor__backdrop" role="presentation" onMouseDown={close}>
      <section className="site-inline-editor__dialog" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="site-inline-editor__close" onClick={close} aria-label="Düzenlemeyi kapat">×</button>
        <p className="site-inline-editor__kicker">SİTE ÜZERİNDE DÜZENLEME</p>
        <h2>{title}</h2>
        {children}
      </section>
    </div>
  );
}

function TypeControls({ style, setStyle }: { style: TextStyle; setStyle: (style: TextStyle) => void }) {
  return (
    <fieldset className="site-inline-editor__type-controls">
      <legend>Yazı görünümü</legend>
      <label>Yazı tipi
        <select value={style.fontFamily} onChange={(event) => setStyle({ ...style, fontFamily: event.target.value as FontFamily })}>
          {fontOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      <label>Boyut
        <select value={style.fontSize} onChange={(event) => setStyle({ ...style, fontSize: Number(event.target.value) })}>
          {[0, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64].map((size) => <option key={size} value={size}>{size ? `${size} px` : 'Sayfanın varsayılanı'}</option>)}
        </select>
      </label>
      <label>Kalınlık
        <select value={style.fontWeight} onChange={(event) => setStyle({ ...style, fontWeight: Number(event.target.value) })}>
          <option value="0">Sayfanın varsayılanı</option>
          <option value="400">Normal</option>
          <option value="500">Orta</option>
          <option value="600">Yarı kalın</option>
          <option value="700">Kalın</option>
          <option value="800">Ekstra kalın</option>
          <option value="900">Çok kalın</option>
        </select>
      </label>
      <label>Hizalama
        <select value={style.textAlign} onChange={(event) => setStyle({ ...style, textAlign: event.target.value as TextAlign })}>
          <option value="left">Sola</option>
          <option value="center">Ortaya</option>
          <option value="right">Sağa</option>
        </select>
      </label>
    </fieldset>
  );
}

async function writeAudit(contentKey: string, uid: string, type: 'text' | 'image') {
  const { db } = getFirebaseClient();
  if (!db) return;
  try {
    await addDoc(collection(db, 'contentAudit'), {
      action: 'site-inline-updated',
      contentKey,
      contentType: type,
      actorId: uid,
      createdAt: serverTimestamp(),
    });
  } catch {
    // Audit kaydı yayınlamayı engellemez; asıl içerik güncellemesi korunur.
  }
}

export function InlineEditableText({
  contentKey,
  defaultValue,
  as: Tag = 'span',
  className,
  id,
  multiline = false,
}: {
  contentKey: string;
  defaultValue: string;
  as?: EditableTag;
  className?: string;
  id?: string;
  multiline?: boolean;
}) {
  const { isAdmin, isEditMode, uid } = useSiteEditor();
  const fallback = useMemo<StoredContent>(() => ({ type: 'text', value: defaultValue, alt: '', style: defaultTextStyle }), [defaultValue]);
  const [stored, setStored] = useStoredContent(contentKey, fallback, 'text');
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(defaultValue);
  const [draftStyle, setDraftStyle] = useState(defaultTextStyle);
  const [status, setStatus] = useState('');
  const textStyle = normalizeStyle(stored.style);
  const value = stored.value || defaultValue;

  const openEditor = () => {
    setDraft(value);
    setDraftStyle(textStyle);
    setStatus('');
    setOpen(true);
  };

  const save = async () => {
    const next = draft.trim();
    if (!next) {
      setStatus('Metin boş bırakılamaz.');
      return;
    }
    const { db } = getFirebaseClient();
    if (!db || !uid) {
      setStatus('Yönetici oturumu doğrulanamadı. Sayfayı yenileyip tekrar deneyin.');
      return;
    }
    setStatus('Yayınlanıyor…');
    const normalized = normalizeStyle(draftStyle);
    try {
      await setDoc(doc(db, 'siteContent', contentKey), {
        type: 'text', value: next, alt: '', style: normalized, pagePath: '', selector: '', href: '', updatedBy: uid, updatedAt: serverTimestamp(),
      });
      setStored({ type: 'text', value: next, alt: '', style: normalized });
      void writeAudit(contentKey, uid, 'text');
      setOpen(false);
    } catch {
      setStatus('Yayınlanamadı. Yetkinizi ve bağlantınızı kontrol edin.');
    }
  };

  return (
    <>
      <Tag id={id} className={`${className || ''}${isAdmin && isEditMode ? ' site-inline-editor__target' : ''}`} style={toCss(textStyle)}>
        {value}
        {isAdmin && isEditMode ? <button type="button" className="site-inline-editor__trigger" onClick={openEditor} aria-label="Bu metni düzenle">Düzenle</button> : null}
      </Tag>
      {open ? <EditorFrame title="Metni düzenle" close={() => setOpen(false)}>
        <label className="site-inline-editor__field">Metin
          {multiline ? <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={6} maxLength={1200} autoFocus /> : <input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={1200} autoFocus />}
        </label>
        <TypeControls style={draftStyle} setStyle={setDraftStyle} />
        <p className="site-inline-editor__preview" style={toCss(draftStyle)}>{draft || 'Önizleme metni'}</p>
        <div className="site-inline-editor__actions"><button type="button" onClick={() => setOpen(false)}>Vazgeç</button><button type="button" onClick={() => void save()}>Kaydet ve yayınla</button></div>
        {status ? <p className="site-inline-editor__status" role="status">{status}</p> : null}
      </EditorFrame> : null}
    </>
  );
}

function allowedImageUrl(value: string) {
  return value.startsWith('/') || /^https:\/\/[^\s]+$/i.test(value);
}

export function InlineEditableImage({
  contentKey,
  defaultSrc,
  alt,
  className,
  width,
  height,
}: {
  contentKey: string;
  defaultSrc: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  const { isAdmin, isEditMode, uid } = useSiteEditor();
  const fallback = useMemo<StoredContent>(() => ({ type: 'image', value: defaultSrc, alt, style: defaultTextStyle }), [alt, defaultSrc]);
  const [stored, setStored] = useStoredContent(contentKey, fallback, 'image');
  const [open, setOpen] = useState(false);
  const [draftSrc, setDraftSrc] = useState(defaultSrc);
  const [draftAlt, setDraftAlt] = useState(alt);
  const [status, setStatus] = useState('');
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const src = failedSource === stored.value ? defaultSrc : (stored.value || defaultSrc);

  const openEditor = () => {
    setDraftSrc(stored.value || defaultSrc);
    setDraftAlt(stored.alt || alt);
    setStatus('');
    setOpen(true);
  };

  const save = async () => {
    const nextSrc = draftSrc.trim();
    const nextAlt = draftAlt.trim();
    if (!allowedImageUrl(nextSrc)) {
      setStatus('Yalnızca https:// ile başlayan güvenli bir görsel bağlantısı veya / ile başlayan site içi yol kullanılabilir.');
      return;
    }
    const { db } = getFirebaseClient();
    if (!db || !uid) {
      setStatus('Yönetici oturumu doğrulanamadı. Sayfayı yenileyip tekrar deneyin.');
      return;
    }
    setStatus('Yayınlanıyor…');
    try {
      await setDoc(doc(db, 'siteContent', contentKey), {
        type: 'image', value: nextSrc, alt: nextAlt.slice(0, 160), style: defaultTextStyle, pagePath: '', selector: '', href: '', updatedBy: uid, updatedAt: serverTimestamp(),
      });
      setFailedSource(null);
      setStored({ type: 'image', value: nextSrc, alt: nextAlt.slice(0, 160), style: defaultTextStyle });
      void writeAudit(contentKey, uid, 'image');
      setOpen(false);
    } catch {
      setStatus('Yayınlanamadı. Yetkinizi ve bağlantınızı kontrol edin.');
    }
  };

  return (
    <>
      <span className={`${isAdmin && isEditMode ? 'site-inline-editor__image-target' : ''}`}>
        <img src={src} alt={stored.alt || alt} className={className} width={width} height={height} onError={() => setFailedSource(stored.value || defaultSrc)} />
        {isAdmin && isEditMode ? <button type="button" className="site-inline-editor__trigger" onClick={openEditor}>Görseli düzenle</button> : null}
      </span>
      {open ? <EditorFrame title="Görseli düzenle" close={() => setOpen(false)}>
        <label className="site-inline-editor__field">Görsel bağlantısı
          <input value={draftSrc} onChange={(event) => setDraftSrc(event.target.value)} placeholder="https://... veya /dosya.webp" maxLength={500} autoFocus />
        </label>
        <label className="site-inline-editor__field">Alternatif metin
          <input value={draftAlt} onChange={(event) => setDraftAlt(event.target.value)} maxLength={160} />
        </label>
        <p className="site-inline-editor__hint">Güvenlik için yalnızca HTTPS bağlantıları veya sitenin kendi <code>/...</code> dosya yolları kabul edilir. Dosya yüklemek için mevcut içerik editörünü kullanın.</p>
        <div className="site-inline-editor__actions"><button type="button" onClick={() => setOpen(false)}>Vazgeç</button><button type="button" onClick={() => void save()}>Kaydet ve yayınla</button></div>
        {status ? <p className="site-inline-editor__status" role="status">{status}</p> : null}
      </EditorFrame> : null}
    </>
  );
}

type PageTarget = {
  kind: 'dom-text' | 'dom-image';
  selector: string;
  value: string;
  alt: string;
  href: string;
  style: TextStyle;
};

function stableSelector(element: HTMLElement) {
  const parts: string[] = [];
  let current: HTMLElement | null = element;
  while (current && current !== document.body) {
    const currentNode: HTMLElement = current;
    if (currentNode.id && /^[A-Za-z][A-Za-z0-9_-]*$/.test(currentNode.id)) {
      parts.unshift(`#${currentNode.id}`);
      break;
    }
    const parent: HTMLElement | null = currentNode.parentElement;
    if (!parent) break;
    const siblings = Array.from(parent.children).filter((item): item is HTMLElement => item instanceof HTMLElement && item.tagName === currentNode.tagName);
    const position = Math.max(1, siblings.indexOf(currentNode) + 1);
    parts.unshift(`${currentNode.tagName.toLowerCase()}:nth-of-type(${position})`);
    current = parent;
  }
  return parts[0]?.startsWith('#') ? parts.join(' > ') : `body > ${parts.join(' > ')}`;
}

function shortHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function editableElement(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  const candidate = target.closest('img, h1, h2, h3, h4, p, li, strong, small, button, a');
  if (!(candidate instanceof HTMLElement)) return null;
  if (candidate.closest('.site-admin-dock, .site-inline-editor__dialog, .site-inline-editor__target, .site-inline-editor__image-target')) return null;
  return candidate;
}

function applyPageContent(item: StoredContent) {
  if (!item.selector || !item.value) return;
  const target = document.querySelector(item.selector);
  if (!(target instanceof HTMLElement)) return;
  if (item.type === 'dom-image' && target instanceof HTMLImageElement) {
    target.src = item.value;
    if (item.alt) target.alt = item.alt;
    return;
  }
  if (item.type !== 'dom-text') return;
  target.textContent = item.value;
  Object.assign(target.style, toCss(normalizeStyle(item.style)));
  if (target instanceof HTMLAnchorElement && item.href) target.href = item.href;
}

export function SitePageEditor() {
  const pathname = usePathname();
  const { isAdmin, isEditMode, uid } = useSiteEditor();
  const [target, setTarget] = useState<PageTarget | null>(null);
  const [draft, setDraft] = useState<PageTarget | null>(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const { db } = getFirebaseClient();
    if (!db) return;
    return onSnapshot(query(collection(db, 'siteContent'), where('pagePath', '==', pathname)), (snapshot) => {
      snapshot.docs.forEach((entry) => applyPageContent(entry.data() as StoredContent));
    });
  }, [pathname]);

  useEffect(() => {
    if (!isAdmin || !isEditMode) return;
    const select = (event: MouseEvent) => {
      const element = editableElement(event.target);
      if (!element) return;
      event.preventDefault();
      event.stopPropagation();
      const image = element instanceof HTMLImageElement;
      const next: PageTarget = {
        kind: image ? 'dom-image' : 'dom-text',
        selector: stableSelector(element),
        value: image ? (element.getAttribute('src') || '') : (element.textContent || '').trim(),
        alt: image ? (element.getAttribute('alt') || '') : '',
        href: element instanceof HTMLAnchorElement ? (element.getAttribute('href') || '') : '',
        style: normalizeStyle({
          fontFamily: element.style.fontFamily as FontFamily || 'inherit',
          fontSize: Number.parseInt(element.style.fontSize, 10) || 0,
          fontWeight: Number.parseInt(element.style.fontWeight, 10) || 0,
          textAlign: element.style.textAlign as TextAlign || 'left',
        }),
      };
      setTarget(next);
      setDraft(next);
      setStatus('');
    };
    document.addEventListener('click', select, true);
    document.body.classList.add('site-page-editor-active');
    return () => {
      document.removeEventListener('click', select, true);
      document.body.classList.remove('site-page-editor-active');
    };
  }, [isAdmin, isEditMode]);

  const save = async () => {
    if (!target || !draft || !uid) return;
    const nextValue = draft.value.trim();
    if (!nextValue) {
      setStatus(target.kind === 'dom-image' ? 'Görsel bağlantısı boş bırakılamaz.' : 'Metin boş bırakılamaz.');
      return;
    }
    if (target.kind === 'dom-image' && !allowedImageUrl(nextValue)) {
      setStatus('Yalnızca HTTPS görsel bağlantısı veya / ile başlayan site içi yol kullanılabilir.');
      return;
    }
    if (draft.href && !(/^(\/|https:\/\/|mailto:|tel:)/i.test(draft.href))) {
      setStatus('Bağlantı /, https://, mailto: veya tel: ile başlamalıdır.');
      return;
    }
    const { db } = getFirebaseClient();
    if (!db) {
      setStatus('Bağlantı kurulamadı. Sayfayı yenileyip tekrar deneyin.');
      return;
    }
    setStatus('Yayınlanıyor…');
    const contentId = `page-${shortHash(`${pathname}|${target.selector}`)}`;
    const style = normalizeStyle(draft.style);
    try {
      await setDoc(doc(db, 'siteContent', contentId), {
        type: target.kind,
        value: nextValue,
        alt: draft.alt.trim().slice(0, 160),
        style,
        pagePath: pathname,
        selector: target.selector,
        href: draft.href.trim().slice(0, 500),
        updatedBy: uid,
        updatedAt: serverTimestamp(),
      });
      applyPageContent({ type: target.kind, value: nextValue, alt: draft.alt, style, selector: target.selector, href: draft.href });
      void writeAudit(contentId, uid, target.kind === 'dom-image' ? 'image' : 'text');
      setTarget(null);
      setDraft(null);
    } catch {
      setStatus('Yayınlanamadı. Yetkinizi ve bağlantınızı kontrol edin.');
    }
  };

  if (!target || !draft || !isAdmin || !isEditMode) return null;
  const isImage = target.kind === 'dom-image';
  return <EditorFrame title={isImage ? 'Görseli düzenle' : 'Sayfa içeriğini düzenle'} close={() => { setTarget(null); setDraft(null); }}>
    <label className="site-inline-editor__field">{isImage ? 'Görsel bağlantısı' : 'Metin'}
      {isImage ? <input value={draft.value} onChange={(event) => setDraft({ ...draft, value: event.target.value })} maxLength={500} autoFocus /> : <textarea value={draft.value} onChange={(event) => setDraft({ ...draft, value: event.target.value })} rows={6} maxLength={1200} autoFocus />}
    </label>
    {isImage ? <label className="site-inline-editor__field">Alternatif metin<input value={draft.alt} onChange={(event) => setDraft({ ...draft, alt: event.target.value })} maxLength={160} /></label> : <TypeControls style={draft.style} setStyle={(style) => setDraft({ ...draft, style })} />}
    {!isImage && target.href ? <label className="site-inline-editor__field">Bağlantı adresi<input value={draft.href} onChange={(event) => setDraft({ ...draft, href: event.target.value })} maxLength={500} /></label> : null}
    <p className="site-inline-editor__hint">Bu değişiklik yalnızca seçili sayfa ve öğe için yayınlanır. Metin HTML olarak değil, güvenli düz metin olarak kaydedilir.</p>
    <div className="site-inline-editor__actions"><button type="button" onClick={() => { setTarget(null); setDraft(null); }}>Vazgeç</button><button type="button" onClick={() => void save()}>Kaydet ve yayınla</button></div>
    {status ? <p className="site-inline-editor__status" role="status">{status}</p> : null}
  </EditorFrame>;
}
