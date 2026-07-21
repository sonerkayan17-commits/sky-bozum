import Image from 'next/image';
import type { ArticleItem } from '../../lib/site';

const brandRules = [
  { test: /vodafone/i, src: '/brands/vodafone/vodafone.svg', name: 'Vodafone' },
  { test: /turkcell|financell|paycell/i, src: '/brands/turkcell/turkcell.svg', name: 'Turkcell' },
  { test: /türk telekom|turk telekom|pokus/i, src: '/brands/turktelekom/turktelekom.svg', name: 'Türk Telekom' },
  { test: /apple|itunes|app store/i, src: '/brands/apple/apple.svg', name: 'Apple' },
  { test: /steam/i, src: '/brands/steam/steam.svg', name: 'Steam' },
  { test: /razer/i, src: '/brands/razer/razer.svg', name: 'Razer Gold' },
  { test: /visa/i, src: '/brands/visa/visa.svg', name: 'Visa' },
  { test: /mastercard/i, src: '/brands/mastercard/mastercard.svg', name: 'Mastercard' },
];

function getBrand(article: ArticleItem) {
  const haystack = `${article.title} ${article.category} ${article.keywords?.join(' ') ?? ''}`;
  return brandRules.find((rule) => rule.test.test(haystack));
}

function getKind(article: ArticleItem) {
  const value = `${article.title} ${article.category}`.toLocaleLowerCase('tr-TR');
  if (/hediye|gift|kod|steam|razer|apple|amazon|eneba/.test(value)) return 'gift';
  if (/mobil ödeme|vodafone|turkcell|telekom|paycell|pokus|fatura/.test(value)) return 'mobile';
  if (/yemek|pluxee|sodexo|multinet|tokenflex|ticket|setcard|metropol/.test(value)) return 'meal';
  if (/istanbulkart|ulaşım|ulasim/.test(value)) return 'transport';
  return 'wallet';
}

const labels = {
  wallet: ['Kullanılabilir limit', 'Güvenli ödeme', 'İşlem geçmişi'],
  mobile: ['Hat kontrolü', 'Limit doğrulama', 'İşlem onayı'],
  meal: ['Bakiye kontrolü', 'Üye işyeri', 'Kullanım koşulları'],
  transport: ['Kart bakiyesi', 'Yükleme noktası', 'Geçiş kullanımı'],
  gift: ['Kod bölgesi', 'Tutar kontrolü', 'Güvenli teslimat'],
} as const;

export default function ArticleVisual({ article, index = 0 }: { article: ArticleItem; index?: number }) {
  const brand = getBrand(article);
  const kind = getKind(article);
  const items = labels[kind];
  const title = index === 0 ? `${article.category} işlem görünümü` : `${article.title} kontrol akışı`;

  return (
    <figure className={`article-smart-visual article-smart-visual--${kind}`} aria-label={title}>
      <div className="article-smart-visual__ambient" />
      <div className="article-smart-visual__panel">
        <div className="article-smart-visual__topbar">
          <div className="article-smart-visual__brand">
            <span className="article-smart-visual__logo">
              {brand ? <Image src={brand.src} alt={`${brand.name} logosu`} width={72} height={36} className="object-contain" /> : <b>{article.category.slice(0, 2).toLocaleUpperCase('tr-TR')}</b>}
            </span>
            <div><small>REHBER GÖRSELİ</small><strong>{brand?.name ?? article.category}</strong></div>
          </div>
          <span className="article-smart-visual__status"><i /> Bilgilendirme</span>
        </div>
        <div className="article-smart-visual__screen">
          <div className="article-smart-visual__metric">
            <small>{items[0]}</small><strong>{kind === 'gift' ? 'Kod hazır' : kind === 'transport' ? '₺ •••,••' : '₺ ••••,••'}</strong><span>Güncel koşullar uygulamadan kontrol edilir</span>
          </div>
          <div className="article-smart-visual__steps">
            {items.map((item, step) => <div key={item}><span>{step + 1}</span><p><strong>{item}</strong><small>{step === 2 ? 'Son onaydan önce bilgileri yeniden kontrol edin.' : 'Ürün ve hesap bilgileriyle eşleştiğinden emin olun.'}</small></p><i>✓</i></div>)}
          </div>
        </div>
      </div>
      <figcaption>{title}. Bu görsel, gerçek hesap bilgisi göstermeyen temsili bir kullanıcı arayüzüdür.</figcaption>
    </figure>
  );
}
