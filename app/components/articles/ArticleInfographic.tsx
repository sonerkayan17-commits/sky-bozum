import type { ArticleItem } from '../../lib/site';
import type { ArticleEditorialTemplate } from '../../lib/articleEditorialTemplate';

type InfographicStep = {
  label: string;
  detail: string;
  shortDetail: string;
};

type InfographicContent = {
  eyebrow: string;
  title: string;
  summary: string;
  theme: 'operator' | 'wallet' | 'gift-card' | 'game-code' | 'finance' | 'general';
  steps: InfographicStep[];
};

function articleText(article: ArticleItem) {
  return `${article.slug} ${article.title} ${article.category} ${(article.keywords ?? []).join(' ')}`.toLocaleLowerCase('tr-TR');
}

function getContent(article: ArticleItem): InfographicContent {
  const text = articleText(article);

  if (/vodafone|mobil ödeme|mobil odeme|sms/.test(text)) return {
    eyebrow: 'GÖRSEL İŞLEM HARİTASI',
    title: 'Hattan güvenli işlem onayına giden yol',
    summary: 'Mobil ödeme işleminde her aşama, bir sonraki adıma geçmeden önce doğrulanır.',
    theme: 'operator',
    steps: [
      { label: 'Hat', shortDetail: 'Özellik açık', detail: 'Mobil ödeme özelliği açık ve kullanılabilir olmalı.' },
      { label: 'Limit', shortDetail: 'Tutar kontrolü', detail: 'Güncel kullanılabilir tutar işlem öncesinde kontrol edilir.' },
      { label: 'Onay', shortDetail: 'Kullanıcı doğrular', detail: 'Satın alma veya kod üretimi kullanıcı tarafından doğrulanır.' },
      { label: 'Kontrol', shortDetail: 'Ürün eşleşir', detail: 'Ürün türü, tutar ve uygunluk bilgisi eşleştirilir.' },
      { label: 'İşlem', shortDetail: 'Ödeme tamamlanır', detail: 'Onaylanan ürün için ödeme süreci tamamlanır.' },
    ],
  };

  if (/paycell|pokus|vodafone pay|cüzdan|cuzdan/.test(text)) return {
    eyebrow: 'GÖRSEL DÖNÜŞÜM HARİTASI',
    title: 'Dijital cüzdandan değerlendirilebilir ürüne',
    summary: 'Bakiye doğrudan değil, desteklenen ödeme yöntemi ve uygun dijital ürün üzerinden değerlendirilir.',
    theme: 'wallet',
    steps: [
      { label: 'Bakiye', shortDetail: 'Kullanılabilir tutar', detail: 'Cüzdan bakiyesi ve kullanılabilir limit doğrulanır.' },
      { label: 'Kart', shortDetail: 'Ödeme yöntemi', detail: 'Sanal kart veya desteklenen ödeme yöntemi seçilir.' },
      { label: 'Ürün', shortDetail: 'Uygun seçim', detail: 'Uygun dijital ürün güvenli mağazadan alınır.' },
      { label: 'Kod', shortDetail: 'Bölge kontrolü', detail: 'Kodun kullanılmamış ve bölgesinin doğru olduğu kontrol edilir.' },
      { label: 'Bozum', shortDetail: 'Son doğrulama', detail: 'Uygunluk onayı sonrasında işlem tamamlanır.' },
    ],
  };

  if (/apple|itunes|gift card|hediye kart/.test(text)) return {
    eyebrow: 'GÖRSEL KONTROL HARİTASI',
    title: 'Apple Gift Card işleminde temel doğrulama',
    summary: 'Kartın değeri kadar bölgesi ve kod durumu da işlem uygunluğunu belirler.',
    theme: 'gift-card',
    steps: [
      { label: 'Kart', shortDetail: 'Tutar ve para birimi', detail: 'Kartın tutarı, ülkesi ve para birimi belirlenir.' },
      { label: 'Kod', shortDetail: 'Kullanılmamış', detail: 'Kodun okunabilir ve daha önce kullanılmamış olması gerekir.' },
      { label: 'Bölge', shortDetail: 'Hesap uyumu', detail: 'Hesap bölgesi ile kart bölgesinin uyumu kontrol edilir.' },
      { label: 'Onay', shortDetail: 'Oran ve uygunluk', detail: 'Güncel oran ve işlem uygunluğu yazılı olarak alınır.' },
      { label: 'İşlem', shortDetail: 'Ödeme süreci', detail: 'Doğrulama tamamlandığında ödeme süreci başlar.' },
    ],
  };

  if (/razer|steam|oyun|kod/.test(text)) return {
    eyebrow: 'GÖRSEL KOD HARİTASI',
    title: 'Dijital kodun doğrulanmasından ödemeye',
    summary: 'Marka, tutar, para birimi ve bölge bilgisi doğrulanmadan kod paylaşılmaz.',
    theme: 'game-code',
    steps: [
      { label: 'Ürün', shortDetail: 'Marka ve tutar', detail: 'Kodun markası, tutarı ve para birimi belirtilir.' },
      { label: 'Bölge', shortDetail: 'Ülke kısıtı', detail: 'Kodun ülke ve mağaza kısıtlamaları kontrol edilir.' },
      { label: 'Kod', shortDetail: 'Güvenli iletim', detail: 'Kullanılmamış kod güvenli biçimde iletilir.' },
      { label: 'Doğrulama', shortDetail: 'Eş zamanlı kontrol', detail: 'Kod ve işlem koşulları eş zamanlı kontrol edilir.' },
      { label: 'Ödeme', shortDetail: 'İşlem sonucu', detail: 'Onaylanan işlem için ödeme tamamlanır.' },
    ],
  };

  if (/limit|kredi|finans|taksit/.test(text)) return {
    eyebrow: 'GÖRSEL KARAR HARİTASI',
    title: 'Limiti kullanmadan önce beş kontrol',
    summary: 'Kullanılabilir limit tek başına yeterli değildir; kapsam, maliyet ve işlem uygunluğu birlikte değerlendirilir.',
    theme: 'finance',
    steps: [
      { label: 'Kaynak', shortDetail: 'Limit sağlayıcı', detail: 'Limitin hangi uygulama veya kurum tarafından verildiği belirlenir.' },
      { label: 'Kapsam', shortDetail: 'Kullanım alanı', detail: 'Nerede ve hangi ürünlerde kullanılabildiği kontrol edilir.' },
      { label: 'Maliyet', shortDetail: 'Toplam geri ödeme', detail: 'Vade, ücret ve toplam geri ödeme değerlendirilir.' },
      { label: 'Uygunluk', shortDetail: 'Ürün ve yöntem', detail: 'İşleme uygun ürün ve yöntem önceden doğrulanır.' },
      { label: 'Karar', shortDetail: 'Koşullar net', detail: 'Tüm koşullar netleşmeden satın alma yapılmaz.' },
    ],
  };

  return {
    eyebrow: 'GÖRSEL REHBER HARİTASI',
    title: 'Güvenli işlem için temel yol haritası',
    summary: 'Ürün tanımından ödeme aşamasına kadar her adım yazılı ve doğrulanabilir bilgiye dayanır.',
    theme: 'general',
    steps: [
      { label: 'Tanımla', shortDetail: 'Ürün veya limit', detail: 'Ürün, bakiye veya limit türünü doğru belirleyin.' },
      { label: 'Kontrol et', shortDetail: 'Koşullar', detail: 'Tutar, bölge ve kullanım koşullarını doğrulayın.' },
      { label: 'Oran al', shortDetail: 'Yazılı bilgi', detail: 'İşlem öncesinde güncel oranı yazılı olarak alın.' },
      { label: 'Onayla', shortDetail: 'Satın alma öncesi', detail: 'Uygunluk kesinleşmeden ürün satın almayın.' },
      { label: 'Tamamla', shortDetail: 'Ödeme', detail: 'Doğrulama sonrasında ödeme sürecini tamamlayın.' },
    ],
  };
}

function FlowSvg({ content, titleId, descriptionId }: { content: InfographicContent; titleId: string; descriptionId: string }) {
  const nodeX = [74, 221, 368, 515, 662];
  return (
    <svg
      className="article-infographic__svg"
      viewBox="0 0 736 330"
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <title id={titleId}>{content.title}</title>
      <desc id={descriptionId}>{content.summary} Aşamalar: {content.steps.map((step) => step.label).join(', ')}.</desc>
      <defs>
        <linearGradient id={`flow-line-${content.theme}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="0.5" stopColor="currentColor" stopOpacity="0.62" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.18" />
        </linearGradient>
        <filter id={`soft-shadow-${content.theme}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000" floodOpacity="0.24" />
        </filter>
      </defs>

      <path className="article-infographic__rail" d="M74 108 H662" pathLength="100" />
      {nodeX.slice(0, -1).map((x, index) => (
        <path key={x} className="article-infographic__arrow" d={`M${x + 36} 108 H${nodeX[index + 1] - 38}`} />
      ))}

      {content.steps.map((step, index) => {
        const x = nodeX[index];
        const isLast = index === content.steps.length - 1;
        return (
          <g key={step.label} className={`article-infographic__node${isLast ? ' is-final' : ''}`} transform={`translate(${x} 108)`}>
            <circle className="article-infographic__halo" r="42" />
            <circle className="article-infographic__circle" r="31" filter={`url(#soft-shadow-${content.theme})`} />
            <text className="article-infographic__number" textAnchor="middle" dominantBaseline="central">{String(index + 1).padStart(2, '0')}</text>
            <text className="article-infographic__label" y="72" textAnchor="middle">{step.label}</text>
            <foreignObject x="-62" y="90" width="124" height="62">
              <div className="article-infographic__short">{step.shortDetail}</div>
            </foreignObject>
          </g>
        );
      })}

      <g className="article-infographic__legend" transform="translate(28 278)">
        <circle cx="8" cy="8" r="5" />
        <text x="22" y="12">Her düğüm bir sonraki adım için kontrol noktasıdır.</text>
      </g>
    </svg>
  );
}

export default function ArticleInfographic({ article, template = 'guide', label }: { article: ArticleItem; template?: ArticleEditorialTemplate; label?: string }) {
  const content = getContent(article);
  const titleId = `article-infographic-title-${article.slug}`;
  const svgTitleId = `article-infographic-svg-title-${article.slug}`;
  const svgDescriptionId = `article-infographic-svg-description-${article.slug}`;

  return (
    <figure className={`article-infographic article-infographic--${content.theme} article-infographic--${template}`} aria-labelledby={titleId}>
      <figcaption>
        <p>{label ?? content.eyebrow}</p>
        <h2 id={titleId}>{content.title}</h2>
        <span>{content.summary}</span>
      </figcaption>

      <div className="article-infographic__canvas">
        <FlowSvg content={content} titleId={svgTitleId} descriptionId={svgDescriptionId} />
      </div>

      <ol className="article-infographic__details" aria-label="İşlem aşamalarının açıklaması">
        {content.steps.map((step, index) => (
          <li key={step.label}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div><h3>{step.label}</h3><p>{step.detail}</p></div>
          </li>
        ))}
      </ol>

      <p className="article-infographic__note">İşlem koşulları ürün, stok ve servis durumuna göre değişebilir. Satın alma yapmadan önce güncel uygunluk alın.</p>
    </figure>
  );
}
