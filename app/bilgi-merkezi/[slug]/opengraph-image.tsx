import { ImageResponse } from 'next/og';
import { getArticle } from '../../lib/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Sky Bozum Bilgi Merkezi makale kapağı';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  const title = article?.title ?? 'Sky Bozum Bilgi Merkezi';
  const category = article?.category ?? 'Premium Rehber';

  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', overflow: 'hidden', background: '#090b10', color: 'white', padding: 76, fontFamily: 'Arial, sans-serif' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 82% 8%, rgba(244,63,94,.32), transparent 38%), radial-gradient(circle at 6% 100%, rgba(249,115,22,.18), transparent 38%)' }} />
      <div style={{ position: 'absolute', inset: 28, border: '1px solid rgba(255,255,255,.12)', borderRadius: 34 }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 62, height: 62, borderRadius: 18, background: 'linear-gradient(135deg,#e11d48,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 24 }}>SB</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: 25, fontWeight: 800 }}>Sky Bozum</span><span style={{ fontSize: 18, color: '#94a3b8' }}>Bilgi Merkezi</span></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1000 }}>
          <span style={{ fontSize: 21, color: '#fda4af', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 3 }}>{category}</span>
          <h1 style={{ fontSize: title.length > 65 ? 54 : 64, lineHeight: 1.08, margin: '20px 0 0', fontWeight: 900, letterSpacing: -2 }}>{title}</h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 18 }}><span>Güncel ve anlaşılır rehber</span><span>bozumcu.net</span></div>
      </div>
    </div>,
    size,
  );
}
