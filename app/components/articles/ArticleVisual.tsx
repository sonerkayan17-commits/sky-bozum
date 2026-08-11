import Image from 'next/image';
import type { ArticleItem } from '../../lib/site';

function getKind(article: ArticleItem) {
  const value = `${article.title} ${article.category}`.toLocaleLowerCase('tr-TR');
  if (/hediye|gift|kod|steam|razer|apple|amazon|eneba/.test(value)) return 'gift';
  if (/mobil ödeme|vodafone|turkcell|telekom|paycell|pokus|fatura/.test(value)) return 'mobile';
  if (/yemek|pluxee|sodexo|multinet|tokenflex|ticket|setcard|metropol/.test(value)) return 'meal';
  if (/istanbulkart|ulaşım|ulasim/.test(value)) return 'transport';
  return 'wallet';
}

const premiumArticleInfographics: Record<string, { src: string; alt: string; caption: string }> = {
  'mobil-odeme-guvenli-mi': {
    src: '/images/bilgi-merkezi/v40-guide-system/article-infographics/mobil-odeme-guvenlik-kontrol-listesi.webp',
    alt: 'Mobil ödemede güvenlik önlemleri ve işlem öncesi kontrol listesi',
    caption: 'Mobil ödeme işleminden önce uygulanması gereken temel güvenlik kontrolleri.',
  },
  'mobil-odeme-limiti-nasil-ogrenilir': {
    src: '/images/bilgi-merkezi/v40-guide-system/article-infographics/mobil-odeme-limiti-ogrenme-rehberi.webp',
    alt: 'Vodafone, Turkcell ve Türk Telekom mobil ödeme limiti öğrenme yöntemleri',
    caption: 'Operatör bazında kullanılabilir mobil ödeme limitini kontrol etme yolları.',
  },
  'vodafone-mobil-odeme-nedir': {
    src: '/images/bilgi-merkezi/v40-guide-system/article-infographics/vodafone-mobil-odeme-rehberi.webp',
    alt: 'Vodafone Mobil Ödeme kullanım ve güvenlik rehberi',
    caption: 'Vodafone Mobil Ödeme sisteminin çalışma biçimi ve temel kontrol noktaları.',
  },
  'turkcell-mobil-odeme-nasil-kullanilir': {
    src: '/images/bilgi-merkezi/v40-guide-system/article-infographics/turkcell-mobil-odeme-rehberi.webp',
    alt: 'Turkcell Mobil Ödeme kullanım rehberi',
    caption: 'Turkcell Mobil Ödeme kullanımı için adım adım görsel rehber.',
  },
  'turk-telekom-mobil-odeme-rehberi': {
    src: '/images/bilgi-merkezi/v40-guide-system/article-infographics/turk-telekom-mobil-odeme-rehberi.webp',
    alt: 'Türk Telekom Mobil Ödeme kullanım ve limit rehberi',
    caption: 'Türk Telekom Mobil Ödeme sisteminin kullanım, limit ve güvenlik özeti.',
  },
};

export default function ArticleVisual({ article, index = 0 }: { article: ArticleItem; index?: number }) {
  const infographic = index === 0 ? premiumArticleInfographics[article.slug] : undefined;
  if (infographic) {
    return (
      <figure className={`article-inline-visual article-inline-visual--${getKind(article)}`}>
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-[#080d16] shadow-[0_26px_80px_-48px_rgba(56,189,248,.45)]">
          <Image src={infographic.src} alt={infographic.alt} fill sizes="(max-width: 1023px) 100vw, 820px" className="object-contain p-2 sm:p-4" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/[.02]" />
        </div>
        <figcaption>{infographic.caption}</figcaption>
      </figure>
    );
  }
  if (article.slug === 'hepsipay-nedir-nasil-kullanilir' && index === 0) {
    return (
      <figure className={`article-inline-visual article-inline-visual--${getKind(article)}`}>
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            src="/images/bilgi-merkezi/hepsipay/hepsipay-nedir-nasil-kullanilir/hepsipay-nedir-nasil-kullanilir-content.svg"
            alt="Hepsipay cüzdan oluşturma, ödeme yöntemi seçme ve işlemi tamamlama adımları"
            fill
            sizes="(max-width: 1023px) 100vw, 820px"
            className="object-contain p-2 sm:p-4"
          />
        </div>
        <figcaption>Hepsipay kullanımının üç temel adımını gösteren açıklayıcı süreç görseli.</figcaption>
      </figure>
    );
  }

  const premiumContentVisual = /financell|faturaya ek cihaz|cihaz finansman/i.test(`${article.title} ${article.category}`)
    ? '/images/bilgi-merkezi/v40-guide-system/guide-device-finance.webp'
    : (index === 1 && article.faq?.length
      ? '/images/bilgi-merkezi/v40-guide-system/guide-article-layout.webp'
      : undefined);
  if (premiumContentVisual) {
    return (
      <figure className={`article-inline-visual article-inline-visual--${getKind(article)}`}>
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0e17]">
          <Image src={premiumContentVisual} alt={`${article.title} için premium açıklayıcı rehber görseli`} fill sizes="(max-width: 1023px) 100vw, 820px" className="object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/[.025]" />
        </div>
        <figcaption>{article.title} için hazırlanan görsel destekli rehber anlatımı.</figcaption>
      </figure>
    );
  }

  return null;
}
