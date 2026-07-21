import Image from 'next/image';
import type { ArticleItem } from '../../lib/site';
import { premiumArticleCovers } from '../../lib/premiumArticleCovers';
import { getArticleVisualMeta } from '../../lib/articleVisualSystem';

const serviceLogos: Record<string, string> = {
  'razer-gold-tl': '/brands/razer/razer.svg',
  'razer-gold-usd': '/brands/razer/razer.svg',
  'itunes-apple': '/brands/apple/apple.svg',
  steam: '/brands/steam/steam.svg',
  paycell: '/brands/paycell/paycell.svg',
  pokus: '/brands/pokus/pokus.svg',
  'vodafone-mobil-odeme': '/brands/vodafone/vodafone.svg',
  'turkcell-mobil-odeme': '/brands/turkcell/turkcell.svg',
  'turk-telekom-mobil-odeme': '/brands/turktelekom/turktelekom.svg',
};

function initials(value: string) {
  return value.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toLocaleUpperCase('tr-TR');
}

export default function ArticleCover({ article, compact = false, priority = false }: { article: ArticleItem; compact?: boolean; priority?: boolean }) {
  const premiumCover = premiumArticleCovers[article.slug];
  const visualMeta = getArticleVisualMeta(article.slug);
  const cover = premiumCover ?? article.cover;
  if (cover) {
    return (
      <div className={`relative isolate overflow-hidden bg-[#0a0e17] ${compact ? 'aspect-[16/9]' : 'aspect-[16/9] min-h-[260px]'}`}>
        <Image
          src={cover}
          alt={article.coverAlt ?? `${article.title} rehber kapağı`}
          fill
          priority={priority || Boolean(visualMeta?.priority)}
          sizes={compact ? '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 420px' : '(max-width: 1023px) 100vw, 720px'}
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/[.025]" />
        {visualMeta && <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.14em] text-white/75 backdrop-blur-md"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: visualMeta.accent }} />{visualMeta.label}</div>}
      </div>
    );
  }
  const logo = article.serviceSlug ? serviceLogos[article.serviceSlug] : undefined;
  return (
    <div className={`article-generated-cover ${compact ? 'min-h-[180px]' : 'min-h-[280px]'}`} role="img" aria-label={`${article.title} kapak görseli`}>
      <div className="article-generated-grid" />
      <div className="article-generated-glow article-generated-glow-one" />
      <div className="article-generated-glow article-generated-glow-two" />
      <div className="article-generated-content">
        <div className="article-generated-mark">
          {logo ? <Image src={logo} alt="" width={88} height={48} className="max-h-12 w-auto max-w-24 object-contain" /> : <span>{initials(article.category)}</span>}
        </div>
        <div className="article-generated-copy">
          <span>{article.category}</span>
          <strong>{article.title}</strong>
          <small>Sky Bozum Bilgi Merkezi</small>
        </div>
      </div>
    </div>
  );
}
