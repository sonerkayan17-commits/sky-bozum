import Image from 'next/image';
import type { ArticleItem } from '../../lib/site';
import { premiumArticleCovers } from '../../lib/premiumArticleCovers';
import { getArticleVisualMeta } from '../../lib/articleVisualSystem';

function coverTone(article: ArticleItem) {
  const value = `${article.title} ${article.category} ${article.keywords?.join(' ') ?? ''}`.toLocaleLowerCase('tr-TR');
  if (/vodafone/.test(value)) return 'vodafone';
  if (/paycell/.test(value)) return 'paycell';
  if (/pokus/.test(value)) return 'pokus';
  if (/turkcell|financell/.test(value)) return 'turkcell';
  if (/türk telekom|turk telekom/.test(value)) return 'telekom';
  if (/apple|itunes|app store/.test(value)) return 'apple';
  if (/steam/.test(value)) return 'steam';
  if (/razer/.test(value)) return 'razer';
  if (/hediye|gift|kod|playstation|amazon|eneba|google play/.test(value)) return 'gift';
  if (/güven|guven|dolandır|dolandir/.test(value)) return 'security';
  if (/limit|cihaz|finansman|faturaya ek/.test(value)) return 'finance';
  return 'default';
}

function initials(value: string) {
  return value.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toLocaleUpperCase('tr-TR');
}

const fallbackCovers: Record<string, string> = {
  vodafone: '/images/bilgi-merkezi/vodafone/category/vodafone-category-card.webp',
  paycell: '/images/bilgi-merkezi/editorial-covers-v46/dijital-cuzdan-konu-merkezi.webp',
  pokus: '/images/bilgi-merkezi/editorial-covers-v46/dijital-cuzdan-konu-merkezi.webp',
  turkcell: '/images/bilgi-merkezi/turkcell/category/turkcell-category-card.webp',
  telekom: '/images/bilgi-merkezi/turk-telekom/category/turk-telekom-category-card.webp',
  apple: '/blog-covers/dijital-kod-hediye-karti.svg',
  steam: '/images/bilgi-merkezi/hediye-kartlari/steam-cuzdan-kodu-nedir/steam-cuzdan-kodu-nedir-card.svg',
  razer: '/blog-covers/razer-gold-strateji.webp',
  gift: '/images/bilgi-merkezi/editorial-covers-v46/dijital-kod-satin-alma-kontrolu.webp',
  security: '/images/bilgi-merkezi/premium-reference-v1/mobil-odeme-guvenli-mi/mobil-odeme-guvenli-mi-cover.webp',
  finance: '/images/bilgi-merkezi/editorial-covers-v46/dijital-cuzdan-konu-merkezi.webp',
  default: '/images/bilgi-merkezi/v40-guide-system/guide-hub-hero.webp',
};

export default function ArticleCover({ article, compact = false, dense = false, priority = false, eager = false, className = '' }: { article: ArticleItem; compact?: boolean; dense?: boolean; priority?: boolean; eager?: boolean; className?: string }) {
  const premiumCover = premiumArticleCovers[article.slug];
  const tone = coverTone(article);
  const visualMeta = getArticleVisualMeta(article.slug);
  const uploadedCover = article.cover && (/^https:\/\//i.test(article.cover) || /^data:image\/(webp|jpeg|png);base64,/i.test(article.cover)) ? article.cover : '';
  const cover = uploadedCover || (premiumCover ?? article.cover ?? fallbackCovers[tone] ?? fallbackCovers.default);
  if (cover) {
    const vectorCover = cover.toLowerCase().endsWith('.svg');
    return (
      <div className={`article-premium-cover article-premium-cover--${tone} ${vectorCover ? 'article-premium-cover--vector' : 'article-premium-cover--raster'} relative isolate overflow-hidden bg-[#0a0e17] ${dense ? 'article-cover--dense h-[64px] sm:h-[72px]' : compact ? 'article-cover--compact aspect-[16/9]' : 'article-cover--hero aspect-[16/9] min-h-[260px]'} ${className}`}>
        {uploadedCover ? <div className={`article-cover-image ${vectorCover ? 'article-cover-image--vector' : ''} absolute inset-0 transition duration-700 ease-out group-hover:scale-[1.035]`} role="img" aria-label={article.coverAlt ?? `${article.title} rehber kapağı`} style={{ backgroundImage: `url("${uploadedCover.startsWith('https://') ? encodeURI(uploadedCover) : uploadedCover}")`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: vectorCover ? 'contain' : 'cover' }} /> : <>
        {vectorCover && <Image
          src={cover}
          alt=""
          aria-hidden="true"
          fill
          sizes={dense ? '240px' : compact ? '34vw' : '820px'}
          loading="lazy"
          className="article-cover-ambient object-cover"
        />}
        <Image
          src={cover}
          alt={article.coverAlt ?? `${article.title} rehber kapağı`}
          fill
          sizes={dense ? '(max-width: 640px) 45vw, 240px' : compact ? '(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 34vw' : '(max-width: 1023px) 100vw, 820px'}
          priority={priority}
          loading={priority ? undefined : eager ? 'eager' : 'lazy'}
          decoding={priority || eager ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : undefined}
          className={`article-cover-image ${vectorCover ? 'article-cover-image--vector object-contain' : 'object-cover'} transition duration-700 ease-out group-hover:scale-[1.035]`}
        />
        </>}
        <div className="article-premium-cover__veil pointer-events-none absolute inset-0" />
        <div className="article-premium-cover__shine pointer-events-none absolute inset-0" />
        <div className="article-premium-cover__guide pointer-events-none absolute left-3 top-3 z-[3] flex items-center gap-2">
          <span className="article-premium-cover__guide-mark" aria-hidden="true" />
          <span>Sky Bozum</span>
          <i aria-hidden="true" />
          <span>Bilgi Rehberi</span>
        </div>
        {visualMeta && <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.14em] text-white/75 backdrop-blur-md"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: visualMeta.accent }} />{visualMeta.label}</div>}
      </div>
    );
  }
  return (
    <div className={`article-generated-cover article-generated-cover--${tone} ${compact ? 'min-h-[180px]' : 'min-h-[280px]'} ${className}`} role="img" aria-label={`${article.title} kapak görseli`}>
      <div className="article-generated-grid" />
      <div className="article-generated-glow article-generated-glow-one" />
      <div className="article-generated-glow article-generated-glow-two" />
      <div className="article-generated-content">
        <div className="article-generated-mark">
          <span>{initials(article.category)}</span>
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
