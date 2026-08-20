"use client";

// performance-audit: allow-dynamic-img — published admin images can use approved HTTPS sources.

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { deferClientTask } from '../../lib/defer-client-task';
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
  type?: 'text' | 'image';
  value?: string;
  alt?: string;
  style?: Partial<TextStyle>;
};
type InlineEditableTextProps = {
  contentKey: string;
  defaultValue: string;
  as?: EditableTag;
  className?: string;
  id?: string;
  multiline?: boolean;
};
type InlineEditableImageProps = {
  contentKey: string;
  defaultSrc: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

const defaultTextStyle: TextStyle = {
  fontFamily: 'inherit',
  fontSize: 0,
  fontWeight: 0,
  textAlign: 'left',
};

const AdminInlineEditableText = dynamic(() => import('./SiteInlineEditorAdmin').then((module) => module.InlineEditableText));
const AdminInlineEditableImage = dynamic(() => import('./SiteInlineEditorAdmin').then((module) => module.InlineEditableImage));

function normalizeStyle(value?: Partial<TextStyle>): TextStyle {
  const fontFamily = ['inherit', 'Arial', 'Georgia', 'Tahoma', 'Trebuchet MS', 'Verdana'].includes(String(value?.fontFamily))
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

function usePublishedContent(contentKey: string, fallback: StoredContent, expectedType: 'text' | 'image') {
  const [content, setContent] = useState(fallback);

  useEffect(() => {
    let active = true;
    let unsubscribe: () => void = () => undefined;
    const cancel = deferClientTask(async () => {
      const [{ getFirebaseClient }, { doc, onSnapshot }] = await Promise.all([
        import('../../lib/firebase'),
        import('firebase/firestore'),
      ]);
      if (!active) return;
      const { db } = getFirebaseClient();
      if (!db) return;
      unsubscribe = onSnapshot(doc(db, 'siteContent', contentKey), (snapshot) => {
        const next = snapshot.data() as StoredContent | undefined;
        if (!next || next.type !== expectedType || typeof next.value !== 'string' || !next.value.trim()) return;
        const resolved = { ...fallback, ...next, style: normalizeStyle(next.style) };
        setContent((current) => JSON.stringify(current) === JSON.stringify(resolved) ? current : resolved);
      });
    }, { delay: 20_000, intentEvents: false });
    return () => { active = false; cancel(); unsubscribe(); };
  }, [contentKey, expectedType, fallback]);

  return content;
}

function PublishedText({ contentKey, defaultValue, as: Tag = 'span', className, id }: InlineEditableTextProps) {
  const fallback = useMemo<StoredContent>(() => ({ type: 'text', value: defaultValue, alt: '', style: defaultTextStyle }), [defaultValue]);
  const stored = usePublishedContent(contentKey, fallback, 'text');
  return <Tag id={id} className={className} style={toCss(normalizeStyle(stored.style))}>{stored.value || defaultValue}</Tag>;
}

function PublishedImage({ contentKey, defaultSrc, alt, className, width, height }: InlineEditableImageProps) {
  const fallback = useMemo<StoredContent>(() => ({ type: 'image', value: defaultSrc, alt, style: defaultTextStyle }), [alt, defaultSrc]);
  const stored = usePublishedContent(contentKey, fallback, 'image');
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const storedSource = stored.value || defaultSrc;
  const src = failedSource === storedSource ? defaultSrc : storedSource;

  return (
    <span>
      <img
        src={src}
        alt={stored.alt || alt}
        className={className}
        width={width}
        height={height}
        onError={() => setFailedSource(storedSource)}
      />
    </span>
  );
}

export function InlineEditableText(props: InlineEditableTextProps) {
  const { isAdmin } = useSiteEditor();
  return isAdmin ? <AdminInlineEditableText {...props} /> : <PublishedText {...props} />;
}

export function InlineEditableImage(props: InlineEditableImageProps) {
  const { isAdmin } = useSiteEditor();
  return isAdmin ? <AdminInlineEditableImage {...props} /> : <PublishedImage {...props} />;
}
