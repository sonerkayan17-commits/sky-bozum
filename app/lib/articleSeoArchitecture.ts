import type { ArticleItem } from './site';
import { PRIMARY_SITE_DOMAIN } from './siteIdentity';

type ArticleLink = { label: string; href: string };
type ArticleSection = ArticleItem['sections'][number];
type ArticleSource = NonNullable<ArticleItem['sources']>[number];
type IntentKey = 'security' | 'vodafone' | 'turkcell' | 'telekom' | 'razer' | 'apple' | 'mobile' | 'gift' | 'finance' | 'general';

const coreLinks = {
  mobile: { label: 'Mobil ödeme bozdur ve mobil ödeme bozum rehberi', href: '/bilgi-merkezi/mobil-odeme-bozum-nedir' },
  trust: { label: 'Güvenilir mobil bozum siteleri nasıl seçilir?', href: '/bilgi-merkezi/guvenilir-mobil-bozum-sitesi-nasil-secilir' },
  safe: { label: 'Mobil ödeme güvenli mi?', href: '/bilgi-merkezi/mobil-odeme-guvenli-mi' },
  fraud: { label: 'Mobil bozum dolandırıcılığında ne yapılır?', href: '/bilgi-merkezi/mobil-odeme-bozdurma-dolandiriciligi-sonrasi-ne-yapilmali' },
  vodafone: { label: 'Vodafone mobil ödeme bozdurma ve dijital kod rehberi', href: '/bilgi-merkezi/vodafone-mobil-odeme-nedir' },
  turkcell: { label: 'Turkcell mobil ödeme bozdurma ve Paycell rehberi', href: '/bilgi-merkezi/turkcell-mobil-odeme-nasil-kullanilir' },
  telekom: { label: 'Türk Telekom mobil ödeme bozdurma ve Pokus rehberi', href: '/bilgi-merkezi/turk-telekom-mobil-odeme-rehberi' },
  paycell: { label: 'Paycell bozdur ve dijital kod rehberi', href: '/bilgi-merkezi/paycell-nedir-nasil-kullanilir' },
  pokus: { label: 'Pokus bozdur ve Razer Gold rehberi', href: '/bilgi-merkezi/pokus-nedir-razer-gold-nasil-alinir' },
  razer: { label: 'Razer Gold bozdurma rehberi', href: '/bilgi-merkezi/razer-gold-kodu-nasil-satilir' },
  razerInfo: { label: 'Razer Gold nedir, nasıl kullanılır?', href: '/bilgi-merkezi/razer-gold-nedir' },
  apple: { label: 'iTunes bozdurma ve Apple Gift Card rehberi', href: '/bilgi-merkezi/apple-gift-card-nedir' },
  gift: { label: 'Dijital kod ve hediye kartı rehberi', href: '/bilgi-merkezi/dijital-kod-hediye-karti-rehberi' },
  rates: { label: 'Güncel bozum oranı nasıl öğrenilir?', href: '/bilgi-merkezi/guncel-bozum-orani-nasil-ogrenilir' },
} satisfies Record<string, ArticleLink>;

const pillarSlugs = new Set([
  'guvenilir-mobil-bozum-sitesi-nasil-secilir',
  'mobil-odeme-bozum-nedir',
  'mobil-odeme-guvenli-mi',
  'vodafone-mobil-odeme-nedir',
  'turkcell-mobil-odeme-nasil-kullanilir',
  'turk-telekom-mobil-odeme-rehberi',
  'paycell-nedir-nasil-kullanilir',
  'pokus-nedir-razer-gold-nasil-alinir',
  'razer-gold-nedir',
  'razer-gold-kodu-nasil-satilir',
  'apple-gift-card-nedir',
  'guncel-bozum-orani-nasil-ogrenilir',
]);

const officialSources = {
  turkcellMobile: { publisher: 'Turkcell', label: 'Faturana Yansıt sıkça sorulan sorular', href: 'https://www.turkcell.com.tr/servisler/turkcellmobilodeme/sikca-sorulan-sorular' },
  paycell: { publisher: 'Turkcell', label: 'Paycell sıkça sorulan sorular', href: 'https://www.turkcell.com.tr/servisler/paycell/sikca-sorulan-sorular' },
  vodafonePay: { publisher: 'Vodafone Pay', label: 'Vodafone Pay resmî ürün ve koşul sayfası', href: 'https://vodafonepay.com.tr/' },
  telekomMobile: { publisher: 'Türk Telekom', label: 'Mobil ödeme anlaşmalı servisler listesi', href: 'https://bireysel.turktelekom.com.tr/tt-dijital-servisler/Documents/TTMobil-odeme-anlasmali-servisler-listesi.pdf' },
  pokus: { publisher: 'Pokus', label: 'Pokus resmî ürün ve destek sayfası', href: 'https://www.pokus.com.tr/' },
  appleRedeem: { publisher: 'Apple Destek', label: 'Apple Gift Card ve App Store kodunu kullanma', href: 'https://support.apple.com/tr-tr/118242' },
  appleType: { publisher: 'Apple Destek', label: 'Hediye kartının türünü belirleme', href: 'https://support.apple.com/tr-tr/118407' },
  appleProblem: { publisher: 'Apple Destek', label: 'Hediye kartı kullanılamıyorsa yapılacaklar', href: 'https://support.apple.com/tr-tr/108285' },
  razer: { publisher: 'Razer Gold', label: 'Razer Gold resmî ürün sayfası', href: 'https://gold.razer.com/' },
  googleHelpful: { publisher: 'Google Search Central', label: 'Yararlı ve güvenilir içerik oluşturma', href: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content' },
  commerce: { publisher: 'T.C. Ticaret Bakanlığı', label: 'Tüketici bilgilendirme merkezi', href: 'https://ticaret.gov.tr/tuketici' },
} satisfies Record<string, ArticleSource>;

function sourcesFor(intent: IntentKey): ArticleSource[] {
  const byIntent: Record<IntentKey, ArticleSource[]> = {
    security: [officialSources.commerce, officialSources.appleProblem],
    vodafone: [officialSources.vodafonePay, officialSources.commerce],
    turkcell: [officialSources.turkcellMobile, officialSources.paycell],
    telekom: [officialSources.telekomMobile, officialSources.pokus],
    razer: [officialSources.razer, officialSources.commerce],
    apple: [officialSources.appleRedeem, officialSources.appleType, officialSources.appleProblem],
    mobile: [officialSources.turkcellMobile, officialSources.telekomMobile, officialSources.vodafonePay],
    gift: [officialSources.razer, officialSources.appleRedeem, officialSources.commerce],
    finance: [officialSources.commerce, officialSources.paycell],
    general: [officialSources.commerce, officialSources.googleHelpful],
  };
  return byIntent[intent];
}

function dedupeSources(sources: readonly ArticleSource[]) {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const href = source.href.replace(/\/$/, '');
    if (seen.has(href)) return false;
    seen.add(href);
    return true;
  });
}

function normalize(value: string) {
  return value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function currentDomain(value: string) {
  return value
    .replace(/(?:www\.)?bozumcu\.net(?!\.tr)/gi, PRIMARY_SITE_DOMAIN)
    .replace(/sky-bozum\.vercel\.app/gi, PRIMARY_SITE_DOMAIN);
}

function normalizeArticleIdentity(article: ArticleItem): ArticleItem {
  return {
    ...article,
    title: currentDomain(article.title),
    excerpt: currentDomain(article.excerpt),
    seoTitle: article.seoTitle ? currentDomain(article.seoTitle) : undefined,
    metaDescription: article.metaDescription ? currentDomain(article.metaDescription) : undefined,
    coverAlt: article.coverAlt ? currentDomain(article.coverAlt) : undefined,
    keywords: article.keywords?.map(currentDomain),
    links: article.links?.map((link) => ({ ...link, label: currentDomain(link.label) })),
    sources: article.sources?.map((source) => ({ ...source, label: currentDomain(source.label), publisher: currentDomain(source.publisher) })),
    media: article.media?.map((media) => ({ ...media, alt: currentDomain(media.alt), caption: currentDomain(media.caption) })),
    faq: article.faq?.map((item) => ({ question: currentDomain(item.question), answer: currentDomain(item.answer) })),
    sections: article.sections.map((section) => ({
      ...section,
      title: currentDomain(section.title),
      paragraphs: section.paragraphs.map(currentDomain),
      bullets: section.bullets?.map(currentDomain),
      subsections: section.subsections?.map((subsection) => ({
        title: currentDomain(subsection.title),
        paragraphs: subsection.paragraphs.map(currentDomain),
      })),
      relatedLinks: section.relatedLinks?.map((link) => ({ ...link, label: currentDomain(link.label) })),
    })),
  };
}

function articleText(article: ArticleItem) {
  return normalize([
    article.slug,
    article.title,
    article.category,
    article.excerpt,
    ...(article.keywords ?? []),
    ...article.sections.map((section) => section.title),
  ].join(' '));
}

function intentFor(article: ArticleItem): IntentKey {
  const primary = normalize([article.slug, article.title, article.category, article.excerpt].join(' '));
  const fullText = articleText(article);
  if (/vodafone|vodafone pay/.test(primary)) return 'vodafone';
  if (/turkcell|paycell/.test(primary)) return 'turkcell';
  if (/turk telekom|pokus/.test(primary)) return 'telekom';
  if (/razer/.test(primary)) return 'razer';
  if (/itunes|apple|app store/.test(primary)) return 'apple';
  if (/guvenilir|dolandir|sahte|yasal|suphe|magdur/.test(primary)) return 'security';
  if (/mobil odeme|mobil bozum|mobil bozdur|sms/.test(primary)) return 'mobile';
  if (/hediye kart|dijital kod|steam|amazon|eneba/.test(primary)) return 'gift';
  if (/limit|kredi|finans|hepsipay|hepsiburada|hadi|moneypay|yemek kart|pluxee|multinet|tokenflex|ticket|istanbulkart|bim|cepte sok|fair/.test(primary)) return 'finance';
  if (/hediye kart|dijital kod|steam|amazon|eneba/.test(fullText)) return 'gift';
  return 'general';
}

function linksFor(intent: IntentKey): ArticleLink[] {
  const links: Record<IntentKey, ArticleLink[]> = {
    security: [coreLinks.trust, coreLinks.safe, coreLinks.fraud, coreLinks.mobile],
    vodafone: [coreLinks.vodafone, coreLinks.mobile, coreLinks.razer, coreLinks.trust],
    turkcell: [coreLinks.turkcell, coreLinks.paycell, coreLinks.razer, coreLinks.mobile],
    telekom: [coreLinks.telekom, coreLinks.pokus, coreLinks.razer, coreLinks.mobile],
    razer: [coreLinks.razer, coreLinks.razerInfo, coreLinks.turkcell, coreLinks.vodafone, coreLinks.telekom],
    apple: [coreLinks.apple, coreLinks.gift, coreLinks.mobile, coreLinks.trust],
    mobile: [coreLinks.mobile, coreLinks.turkcell, coreLinks.vodafone, coreLinks.telekom, coreLinks.trust],
    gift: [coreLinks.gift, coreLinks.razer, coreLinks.apple, coreLinks.trust],
    finance: [coreLinks.mobile, coreLinks.gift, coreLinks.trust],
    general: [coreLinks.mobile, coreLinks.gift, coreLinks.trust],
  };
  return links[intent];
}

function keywordsFor(intent: IntentKey): string[] {
  const keywords: Record<IntentKey, string[]> = {
    security: ['güvenilir mobil bozum siteleri', 'mobil ödeme güvenli mi', 'mobil ödeme yasal mı', 'mobil bozum dolandırıldım'],
    vodafone: ['vodafone bozdurma', 'vodafone mobil ödeme bozdurma', 'vodafone mobil ödeme bozum', 'vodafone pay bozdur'],
    turkcell: ['turkcell bozdurma', 'turkcell mobil ödeme bozdurma', 'paycell bozdur', 'paycell nakite çevirme'],
    telekom: ['türk telekom bozdurma', 'türk telekom mobil ödeme bozdurma', 'pokus bozdur', 'pokus nakite çevirme'],
    razer: ['razer gold bozdurma', 'razer gold bozdur', 'razer gold satılan siteler', 'razer gold güvenli mi'],
    apple: ['itunes bozdurma', 'itunes bozan siteler', 'apple gift card bozdurma', 'itunes güvenli mi'],
    mobile: ['mobil ödeme bozdur', 'mobil ödeme bozum', 'mobil ödeme bozdurma', 'mobil bozum'],
    gift: ['dijital kod bozdurma', 'hediye kartı bozdurma', 'razer gold bozdurma', 'itunes bozdurma'],
    finance: ['dijital bakiye rehberi', 'mobil ödeme bozum farkı', 'güvenli dijital ürün satın alma'],
    general: ['mobil ödeme bozdur', 'dijital kod bozdurma', 'güvenilir mobil bozum siteleri'],
  };
  return keywords[intent];
}

function supplementalSection(article: ArticleItem, intent: IntentKey): ArticleSection {
  const label: Record<IntentKey, string> = {
    security: 'güvenlik kontrolü',
    vodafone: 'Vodafone ve dijital kod kontrolü',
    turkcell: 'Turkcell, Paycell ve kod kontrolü',
    telekom: 'Türk Telekom, Pokus ve kod kontrolü',
    razer: 'Razer Gold kod kontrolü',
    apple: 'Apple Gift Card kontrolü',
    mobile: 'mobil ödeme ve kod kontrolü',
    gift: 'dijital kod kontrolü',
    finance: 'bakiye ve ürün ayrımı',
    general: 'işlem öncesi kontrol',
  };

  return {
    title: `${article.title}: ${label[intent]} için sonraki adım`,
    paragraphs: [
      `Bu sayfa ${article.title.toLocaleLowerCase('tr-TR')} konusunun belirli bir bölümünü açıklar. Karar vermeden önce ürünün tam adı, tutarı, para birimi, bölgesi ve kullanılmamış durumu ayrı ayrı doğrulanmalıdır.`,
      'Bir sonraki adımda ilgili ana rehberi ve ödeme kaynağınızın sayfasını birlikte okuyun. Böylece yalnız bir başlığa göre hareket etmek yerine ürün, limit, güvenlik ve teslim koşullarını aynı bağlamda değerlendirebilirsiniz.',
    ],
    relatedLinks: linksFor(intent),
  };
}

function intentSection(intent: IntentKey): ArticleSection {
  const sections: Record<IntentKey, ArticleSection> = {
    security: {
      title: 'Güvenilir mobil bozum siteleri nasıl karşılaştırılır?',
      paragraphs: [
        'Güvenilir mobil bozum siteleri yalnız yüksek oran veya hızlı ödeme sözüyle anlaşılmaz. Resmî alan adı, açık işlem modeli, desteklenen ürün, yazılı net tutar, kodun ne zaman isteneceği ve ödemenin hangi hesaba yapılacağı birlikte incelenmelidir. Google sıralaması, reklam veya sosyal medya takipçisi tek başına güven kanıtı değildir.',
        'Mobil ödeme güvenli mi veya mobil ödeme yasal mı sorularının yanıtı da kullanılan yönteme bağlıdır. Operatörün resmî ödeme akışı ile üçüncü bir kişiye şifre, SMS kodu ya da uzaktan erişim vermek aynı işlem değildir. Şüpheli bir görüşmede yeni ödeme ve kod göndermeyi bırakın; banka, operatör ve mağaza kayıtlarını koruyun.',
      ],
      subsections: [
        { title: 'Mobil bozum dolandırıldım diyen kullanıcı ilk ne yapmalı?', paragraphs: ['Görüşmeyi durdurun, yeni kod göndermeyin, parolaları güvenilir bir cihazdan değiştirin ve konuşma ile ödeme kayıtlarını silmeden saklayın. Taklit hesapla gerçek kanalı ayırmak için mesajdaki bağlantıya değil, tarayıcıya kendiniz yazdığınız resmî alan adına güvenin.'] },
        { title: 'Güven kontrolü hangi sırayla yapılmalı?', paragraphs: ['Önce alan adını ve iletişim kanalını, sonra ürün ile bölge uygunluğunu, ardından oran ve tahmini net ödemeyi yazılı doğrulayın. Dijital kod geri döndürülemeyebileceği için bu sıra kod tesliminden önce tamamlanmalıdır.'] },
      ],
      relatedLinks: linksFor('security'),
    },
    vodafone: {
      title: 'Vodafone bozdurma aramalarında hangi işlem gerçekten yapılır?',
      paragraphs: [
        '“Vodafone bozdurma”, “Vodafone mobil ödeme bozdurma” ve “Vodafone mobil ödeme bozum” ifadeleri çoğu zaman hat limitini değerlendirme ihtiyacını anlatır. Sky Bozum Vodafone hattını veya Vodafone Pay bakiyesini doğrudan satın almaz. Rehberler, uygun bir mağazada mobil ödeme ile desteklenen dijital kodu güvenli biçimde satın alma adımlarını açıklar.',
        'Satın alınan kullanılmamış kod kullanıcı tarafından kendi hesabında kullanılabilir. Kod Sky Bozum’a satılacaksa ürün adı, tutar, para birimi, bölge ve güncel stok satın alma yapılmadan önce yazılı olarak doğrulanmalıdır.',
      ],
      subsections: [
        { title: 'Vodafone mobil ödeme bozdurma ile kod satın alma arasındaki fark', paragraphs: ['Doğrudan bakiye alımında ödeme kaynağının kendisi el değiştirir; dijital kod modelinde ise kullanıcı operatörün izin verdiği satın alma akışında ayrı bir ürün edinir. Değerlendirilen unsur hat veya hesap değil, kullanılmamış ve uygunluğu doğrulanmış dijital koddur.'] },
        { title: 'Vodafone Pay bozdur aramasında ne kontrol edilmeli?', paragraphs: ['Vodafone Pay içindeki kart, bakiye ve kampanya hakları aynı özellikte olmayabilir. Hangi kaynağın kullanılacağını uygulama ve ödeme ekranından doğrulayın; şifre, SMS kodu ve kart PIN’i paylaşmayın.'] },
      ],
      relatedLinks: linksFor('vodafone'),
    },
    turkcell: {
      title: 'Turkcell bozdurma ve Paycell bozdur aramalarında doğru işlem yolu',
      paragraphs: [
        '“Turkcell bozdurma”, “Turkcell mobil ödeme bozdurma” veya “Paycell bozdur” araması yapan kullanıcı önce hangi ödeme kaynağını kullandığını ayırmalıdır. Hat mobil ödeme limiti, Paycell kartı ve Paycell uygulama bakiyesi aynı şey değildir. Sky Bozum bu bakiyeleri doğrudan nakde çevirmez; uygun ödeme kaynağıyla dijital kod satın alma yolunu açıklar.',
        'Razer Gold ya da desteklenen başka bir kod alınacaksa mağaza, satıcı, bölge, nominal tutar ve teslimat biçimi kontrol edilir. Kullanılmamış kod, güncel stok ve uygunluk yazılı onaylandıktan sonra Sky Bozum’a satılabilir veya kullanıcı tarafından kullanılabilir.',
      ],
      subsections: [
        { title: 'Turkcell mobil ödeme bozdurma yerine dijital kod rotası', paragraphs: ['Önce Turkcell’in resmî kanalından mobil ödeme durumunu ve kullanılabilir limiti kontrol edin. Ardından satın almak istediğiniz ürünün Sky Bozum’da o anda desteklenip desteklenmediğini sorun; teyit almadan kod satın almayın.'] },
        { title: 'Paycell nakite çevirme aramasında kart ve bakiye ayrımı', paragraphs: ['Paycell ekranında görünen her değer internet alışverişinde kullanılamayabilir. Ödeme öncesinde kartın internet işlemlerine açıklığını, kullanılabilir bakiyeyi ve mağazanın kabul ettiği yöntemi doğrulayın.'] },
      ],
      relatedLinks: linksFor('turkcell'),
    },
    telekom: {
      title: 'Türk Telekom bozdurma ve Pokus bozdur aramalarında doğru işlem yolu',
      paragraphs: [
        '“Türk Telekom bozdurma”, “Türk Telekom mobil ödeme bozdurma” ve “Pokus bozdur” ifadeleri aynı ödeme kaynağını anlatmaz. Türk Telekom hat limiti ile Pokus kart veya uygulama bakiyesi ayrı koşullara sahiptir. Sky Bozum bu kaynakları doğrudan satın almaz; güvenli dijital ürün satın alma adımlarını açıklar.',
        'Kullanıcı uygun mağazadan Razer Gold veya desteklenen başka bir dijital kod alabilir. Kod satılacaksa ürün türü, para birimi, bölge ve stok satın alma öncesinde doğrulanmalı; hesap parolası, SMS doğrulama kodu veya uzaktan erişim hiçbir aşamada paylaşılmamalıdır.',
      ],
      subsections: [
        { title: 'Türk Telekom mobil ödeme bozdurma aramasında önce ne yapılır?', paragraphs: ['Hattın mobil ödemeye açık olup olmadığını ve güncel limiti operatörün resmî kanalından kontrol edin. Sonra mağaza ve dijital ürün uygunluğunu teyit ederek yalnız onaylanan ürünü satın alın.'] },
        { title: 'Pokus nakite çevirme yerine dijital kod satın alma', paragraphs: ['Pokus kart kullanılacaksa internet alışverişi izni, bakiye, güvenlik ayarları ve mağaza kabulü kontrol edilir. Değerlendirme Pokus hesabı üzerinden değil, satın alınan kullanılmamış kod üzerinden yapılır.'] },
      ],
      relatedLinks: linksFor('telekom'),
    },
    razer: {
      title: 'Razer Gold bozdurma öncesi kod nasıl hazırlanır?',
      paragraphs: [
        'Razer Gold bozdurma işleminde yalnız PIN’in varlığı yeterli değildir. Kodun TL veya USD olması, nominal tutarı, satın alındığı bölge, kullanılmamış durumu ve güncel stok birlikte kontrol edilir. “Razer Gold bozdur” aramasından ulaştığınız her teklif aynı ürün türünü kabul etmeyebilir.',
        'Kodu satın almadan önce ürün ve bölge uygunluğunu yazılı sorun. Kod elinizdeyse herkese açık alanda paylaşmayın; tahmini net ödeme ve teslim sırası netleşmeden PIN’in tamamını göndermeyin. Kullanılmış, yanlış bölgeli veya farklı para birimindeki kodlar kabul edilmeyebilir.',
      ],
      subsections: [
        { title: 'Turkcell, Vodafone veya Pokus ile Razer Gold alınabilir mi?', paragraphs: ['Kullanılabilir yöntem mağazaya, ödeme kaynağına ve güncel limitlere göre değişir. İlgili operatör ya da cüzdan rehberinden ödeme kaynağını kontrol edin; ardından Razer Gold ürününün tutar ve bölgesini Sky Bozum’dan teyit edin.'] },
        { title: 'Razer Gold satmak yasal mı ve güvenli mi?', paragraphs: ['Kodun size ait olması, hukuka uygun biçimde edinilmesi ve kullanılmamış olması gerekir. Şifre, SMS kodu veya hesap erişimi paylaşmadan yalnız dijital ürün üzerinden ilerleyin; işlem kaydını ve ödeme hareketini saklayın.'] },
      ],
      relatedLinks: linksFor('razer'),
    },
    apple: {
      title: 'iTunes bozdurma ve Apple Gift Card değerlendirme kontrolü',
      paragraphs: [
        '“iTunes bozdurma” ve “iTunes bozan siteler” aramalarında öncelikle kartın gerçek ürün adı, para birimi ve ülke bölgesi belirlenmelidir. Apple Gift Card kodları bölgeye bağlıdır; TL, USD veya başka bir ülke kodu aynı hesapta kullanılamayabilir. Yanlış bölge seçimi geri döndürülemeyen kayba yol açabilir.',
        'Sky Bozum yalnız desteklenen, kullanılmamış ve güncel stokla uyumlu kodları değerlendirir. Satın alma belgesini saklayın, kodu kazımadan veya teslim etmeden önce uygunluğu sorun ve tahmini net ödemeyi yazılı alın.',
      ],
      subsections: [
        { title: 'iTunes bozdurma işleminde bölge neden önemlidir?', paragraphs: ['Apple hesabının ülke/bölge ayarı ile hediye kartının ülkesi uyumlu olmalıdır. Kartın üzerindeki para birimi tek başına yeterli olmayabilir; ürün açıklaması ve mağaza bölgesi birlikte kontrol edilmelidir.'] },
        { title: 'iTunes bozan siteler nasıl karşılaştırılır?', paragraphs: ['Yalnız oranı değil; kabul edilen bölgeyi, kart tutarını, kod teslim sırasını, yazılı net ödemeyi ve resmî iletişim kanalını birlikte karşılaştırın. Kodun tamamını fiyat sormak amacıyla birden fazla kişiye göndermeyin.'] },
      ],
      relatedLinks: linksFor('apple'),
    },
    mobile: {
      title: 'Mobil ödeme bozdur ve mobil ödeme bozum aramalarında doğru yöntem',
      paragraphs: [
        '“Mobil ödeme bozdur”, “mobil ödeme bozum” ve “mobil ödeme bozdurma” ifadeleri arama sonuçlarında farklı iş modelleri için kullanılabilir. Sky Bozum operatör hattını veya dijital cüzdan bakiyesini doğrudan satın almaz. İlgili rehberler, desteklenen ödeme yöntemiyle dijital kod satın alma ve kullanılmamış kodu güvenli biçimde değerlendirme sürecini anlatır.',
        'Doğru sıra; ödeme kaynağını resmî kanaldan kontrol etmek, alınacak ürünün tür ve bölgesini doğrulamak, güncel stok ile tahmini net ödemeyi yazılı öğrenmek, yalnız bundan sonra satın alma yapmaktır. Böylece desteklenmeyen ürün veya yanlış bölge nedeniyle oluşabilecek kayıp azaltılır.',
      ],
      subsections: [
        { title: 'Turkcell, Vodafone ve Türk Telekom mobil bozum farkları', paragraphs: ['Her operatörün mobil ödeme koşulu, limit ekranı ve desteklenen mağazası değişebilir. Operatör adını taşıyan rehbere giderek hat ve ödeme kaynağına uygun adımları izleyin; bir operatör için geçerli yöntemi diğerine uygulamayın.'] },
        { title: 'Mobil ödeme bozdurma güvenli mi?', paragraphs: ['Güvenlik; şifre veya SMS kodu paylaşmamak, resmî alan adını doğrulamak, ürün ve net tutarı yazılı görmek ve kodu yalnız mutabakat sonrasında iletmekle sağlanır. Aşırı yüksek oran veya acele baskısı varsa işlemi durdurun.'] },
      ],
      relatedLinks: linksFor('mobile'),
    },
    gift: {
      title: 'Dijital kod bozdurma ve hediye kartı değerlendirme farkı',
      paragraphs: [
        'Dijital kod bozdurma işleminde ürün adı, nominal tutar, para birimi, bölge ve kullanılmamış durum birlikte değerlendirilir. Steam, Apple Gift Card, Razer Gold veya mağaza hediye kartları aynı kurallara sahip değildir; bir ürün için verilen oran ve kabul koşulu diğer ürüne uygulanamaz.',
        'Kod satın almadan önce güncel stok ve uygunluk sorulmalı, teslimattan sonra sipariş kaydı saklanmalıdır. Kodun tamamı herkese açık alanda veya birden fazla alıcıyla paylaşılmamalıdır. Desteklenmeyen kartlar için nakit ödeme vaadine güvenilmemelidir.',
      ],
      subsections: [
        { title: 'Razer Gold bozdurma ile iTunes bozdurma aynı mı?', paragraphs: ['Hayır. Razer Gold kodlarında TL/USD ve kullanım bölgesi; Apple Gift Card kodlarında ülke mağazası ve hesap bölgesi öne çıkar. Her ürün kendi rehberi ve güncel stok koşuluyla kontrol edilmelidir.'] },
        { title: 'Dijital kod satarken hangi kayıtlar saklanmalı?', paragraphs: ['Satın alma belgesi, ürün adı, tutar, bölge, teslim zamanı, yazılı teklif ve gerçek banka hareketi işlem tamamlanana kadar korunmalıdır. Kodun kendisini ekran görüntüsüyle herkese açık paylaşmayın.'] },
      ],
      relatedLinks: linksFor('gift'),
    },
    finance: {
      title: 'Bu ürün mobil ödeme bozumundan nasıl ayrılır?',
      paragraphs: [
        'Kart limiti, alışveriş finansmanı, kampanya ödülü, yemek kartı veya uygulama bakiyesi; mobil ödeme limiti ve kullanılmamış dijital kodla aynı ürün değildir. “Bozdurulur mu?” sorusuna yanıt vermeden önce değerin hukuki sahibi, kullanılabildiği mağaza, nakit çekim imkânı ve devredilebilirlik koşulu ayrı ayrı incelenmelidir.',
        'Sky Bozum her bakiye veya limiti satın almaz. Bir ödeme kaynağıyla desteklenen dijital ürün alınabiliyorsa işlem, ödeme kaynağının devri üzerinden değil satın alınan ürünün güncel uygunluğu üzerinden değerlendirilir. Kesin destek bilgisi alınmadan borç doğuran finansman veya vadeli limit kullanılmamalıdır.',
      ],
      subsections: [
        { title: 'Dijital ürün satın alma ile nakite çevirme aynı işlem değildir', paragraphs: ['Satın alma işleminde kullanıcı belirli bir ürün edinir; nakde çevirme iddiasında ise bakiye veya limit doğrudan para gibi sunulur. Ürünün kullanım ve devir koşullarını okumadan bu iki modeli birbirine karıştırmayın.'] },
        { title: 'Benzer rehberlere ne zaman bakılmalı?', paragraphs: ['Ödeme kaynağınız mobil hat, dijital cüzdan veya hediye kartıysa kendi kategori rehberine geçin. Bu sayfadaki limit ya da finansman bilgilerini başka bir ürünün kullanım koşulu olarak kabul etmeyin.'] },
      ],
      relatedLinks: linksFor('finance'),
    },
    general: {
      title: 'Konuyu mobil ödeme bozum ve dijital kod işlemlerinden ayırın',
      paragraphs: [
        'Bir ürünün uygulamada bakiye veya limit olarak görünmesi, doğrudan nakde çevrilebildiği anlamına gelmez. Mobil ödeme bozdur, dijital kod bozdurma ve hediye kartı değerlendirme işlemleri farklı ürünler ve farklı güvenlik kontrolleri içerir. Önce elinizdeki değerin tam adını ve kullanım koşulunu belirleyin.',
        'Sky Bozum yalnız desteklediği dijital kodlarda ürün, bölge, stok ve oran teyidi verir. Desteklenmeyen bakiye veya limit için satın alma vaadinde bulunmaz. İşlem öncesinde resmî ürün koşullarını ve ilgili Sky Bozum rehberini birlikte inceleyin.',
      ],
      subsections: [
        { title: 'Doğru rehberi nasıl seçersiniz?', paragraphs: ['Ödeme kaynağınız hat limiti ise mobil ödeme; kod ise Razer Gold, Apple veya hediye kartı; kart ya da finansman limiti ise ilgili ürün kategorisine gidin. Ürün adını bilmeden oran veya ödeme sözüne göre hareket etmeyin.'] },
      ],
      relatedLinks: linksFor('general'),
    },
  };
  return sections[intent];
}

function conclusionSection(article: ArticleItem, intent: IntentKey): ArticleSection {
  const subject: Record<IntentKey, string> = {
    security: 'güvenli işlem kararını', vodafone: 'Vodafone mobil ödeme kararını', turkcell: 'Turkcell ve Paycell kararını', telekom: 'Türk Telekom ve Pokus kararını', razer: 'Razer Gold bozdurma kararını', apple: 'iTunes ve Apple Gift Card kararını', mobile: 'mobil ödeme bozum kararını', gift: 'dijital kod kararını', finance: 'bakiye ve limit kararını', general: 'işlem kararını',
  };
  return {
    title: `Sonuç: ${subject[intent]} yazılı kontrollerle netleştirin`,
    paragraphs: [
      `${article.title} için bu rehber bir başlangıç noktasıdır. Ürünün tam adı, tutarı, para birimi, bölgesi, satın alma kanalı ve kullanılmamış durumu netleşmeden işlem başlatmayın. Güncel koşullar değişebileceği için stok, oran ve tahmini net ödemeyi aynı görüşmede yazılı olarak doğrulayın.`,
      'Şifre, SMS doğrulama kodu, kart PIN’i, e-posta parolası veya uzaktan erişim yetkisi paylaşmayın. Ödeme tamamlandı denildiğinde yalnız dekont görseline değil, hesabınızdaki gerçek harekete bakın; sipariş ve görüşme kayıtlarını işlem sonuçlanana kadar saklayın.',
    ],
    relatedLinks: [...linksFor(intent).slice(0, 3), coreLinks.rates],
  };
}

function dedupeLinks(links: readonly ArticleLink[], articleSlug: string) {
  const seen = new Set<string>();
  const selfHref = `/bilgi-merkezi/${articleSlug}`;
  return links.filter((link) => {
    if (!link.href.startsWith('/') || link.href === selfHref || seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}

function hasEquivalentSection(sections: ArticleSection[], candidate: ArticleSection) {
  const key = normalize(candidate.title).replace(/^sonuc:?\s*/, '');
  return sections.some((section) => {
    const current = normalize(section.title).replace(/^sonuc:?\s*/, '');
    return current === key || (key.length > 18 && (current.includes(key) || key.includes(current)));
  });
}

function withContextLinks(section: ArticleSection, links: ArticleLink[], articleSlug: string) {
  const current = section.relatedLinks ?? [];
  return { ...section, relatedLinks: dedupeLinks([...current, ...links], articleSlug).slice(0, 5) };
}

function wordCount(article: ArticleItem, sections: ArticleSection[]) {
  const copy = [article.title, article.excerpt, ...sections.flatMap((section) => [
    section.title,
    ...section.paragraphs,
    ...(section.bullets ?? []),
    ...(section.subsections ?? []).flatMap((subsection) => [subsection.title, ...subsection.paragraphs]),
  ])].join(' ');
  return copy.trim().split(/\s+/).filter(Boolean).length;
}

export function enrichArticlesForSeo(source: readonly ArticleItem[]): ArticleItem[] {
  return source.map((sourceArticle) => {
    const article = normalizeArticleIdentity(sourceArticle);
    const intent = intentFor(article);
    const contextLinks = linksFor(intent);
    const originalSections = article.sections.map((section, index) => {
      if (index === 0) return withContextLinks(section, contextLinks.slice(0, 3), article.slug);
      if (index === Math.min(1, article.sections.length - 1)) return withContextLinks(section, contextLinks, article.slug);
      if (index === article.sections.length - 1) return withContextLinks(section, [coreLinks.trust, coreLinks.rates], article.slug);
      return section;
    });
    const sections = [...originalSections];
    const baseWords = wordCount(article, originalSections);
    if (pillarSlugs.has(article.slug)) {
      const intentCopy = intentSection(intent);
      if (!hasEquivalentSection(sections, intentCopy)) sections.push(intentCopy);
    } else if (baseWords < 520) {
      const supplement = supplementalSection(article, intent);
      if (!hasEquivalentSection(sections, supplement)) sections.push(supplement);
    }
    const conclusion = conclusionSection(article, intent);
    if (!sections.some((section) => normalize(section.title).startsWith('sonuc'))) sections.push(conclusion);

    const links = dedupeLinks([...(article.links ?? []), ...contextLinks, coreLinks.rates], article.slug).slice(0, 10);
    const sources = dedupeSources([...(article.sources ?? []), ...sourcesFor(intent)]).slice(0, 5);
    const keywords = [...new Set([...(article.keywords ?? []), ...keywordsFor(intent)])].slice(0, 20);
    const calculatedReadTime = Math.max(4, Math.ceil(wordCount(article, sections) / 180));
    const existingReadTime = Number.parseInt(article.readTime, 10) || 0;

    return {
      ...article,
      updatedAt: '2026-08-25',
      readTime: `${Math.max(existingReadTime, calculatedReadTime)} dk`,
      keywords,
      links,
      sources,
      sections,
    };
  });
}
