'use client';

import { useEffect, useRef, useState } from 'react';

type Props = { value: string; onChange: (value: string) => void; placeholder?: string; rows?: number };
const allowedTags = new Set(['P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'H2', 'H3', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'A']);

export function sanitizeArticleHtml(source: string) {
  if (typeof window === 'undefined') return source;
  const safeDocument = document.implementation.createHTMLDocument('article');
  safeDocument.body.innerHTML = source;
  [...safeDocument.body.querySelectorAll('*')].forEach((element) => {
    if (!allowedTags.has(element.tagName)) { element.replaceWith(...Array.from(element.childNodes)); return; }
    [...element.attributes].forEach((attribute) => {
      if (element.tagName === 'A' && attribute.name === 'href' && /^(https?:|mailto:|\/)/i.test(attribute.value)) return;
      element.removeAttribute(attribute.name);
    });
    if (element.tagName === 'A') { element.setAttribute('rel', 'nofollow noopener noreferrer'); element.setAttribute('target', '_blank'); }
  });
  return safeDocument.body.innerHTML.trim();
}

export default function RichArticleEditor({ value, onChange, placeholder }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState(false);
  useEffect(() => { if (editorRef.current && editorRef.current.innerHTML !== value) editorRef.current.innerHTML = value; }, [value]);
  const commit = () => onChange(sanitizeArticleHtml(editorRef.current?.innerHTML || ''));
  const command = (name: string, value?: string) => { editorRef.current?.focus(); document.execCommand(name, false, value); commit(); };
  const addLink = () => { const href = window.prompt('Bağlantı adresi'); if (href && /^(https?:|mailto:|\/)/i.test(href)) command('createLink', href); };
  return <div className="rich-editor">
    <div className="rich-editor-toolbar" role="toolbar" aria-label="Makale biçimlendirme araçları">
      <button type="button" title="Kalın" onClick={() => command('bold')}><b>B</b></button><button type="button" title="İtalik" onClick={() => command('italic')}><i>I</i></button><button type="button" title="Altı çizili" onClick={() => command('underline')}><u>U</u></button><span />
      <button type="button" title="Başlık" onClick={() => command('formatBlock', 'h2')}>H2</button><button type="button" title="Alt başlık" onClick={() => command('formatBlock', 'h3')}>H3</button><button type="button" title="Alıntı" onClick={() => command('formatBlock', 'blockquote')}>❝</button><span />
      <button type="button" title="Madde listesi" onClick={() => command('insertUnorderedList')}>•≡</button><button type="button" title="Numaralı liste" onClick={() => command('insertOrderedList')}>1≡</button><button type="button" title="Bağlantı ekle" onClick={addLink}>↗</button><button type="button" title="Biçimlendirmeyi temizle" onClick={() => command('removeFormat')}>Tx</button><span />
      <button type="button" className={preview ? 'is-active' : ''} title="Önizleme" onClick={() => setPreview((current) => !current)}>◉ Önizleme</button>
    </div>
    {preview ? <div className="rich-editor-preview" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(value) }} /> : <div ref={editorRef} className="rich-editor-canvas" contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" aria-label="Makale metni" data-placeholder={placeholder || 'Makalenizi yazın. Biçimlendirme araçlarını üst menüden kullanabilirsiniz.'} onInput={commit} onBlur={commit} />}
    <p className="rich-editor-note">Başlık, alıntı, liste ve bağlantılar desteklenir. Kaydetmeden önce önizleme ile kontrol edin.</p>
  </div>;
}
