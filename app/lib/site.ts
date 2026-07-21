import { getRateRange } from './rates';
import { featuredArticles } from './featuredArticles';
import { hepsipayArticles } from './hepsipayArticles';
import { v21ExtendedArticles } from './v21ExtendedArticles';

export const siteConfig = {
  name: "Sky Bozum",
  domain: "bozumcu.net",
  phone: "0539 208 01 66",
  email: "sonerkayan17@gmail.com",
  whatsapp:
    "https://wa.me/905392080166?text=Merhaba%2C%20Sky%20Bozum%20%C3%BCzerinden%20g%C3%BCncel%20oran%20almak%20istiyorum.",
  // Canlı Destek (Tawk.to vb.) entegre edilene kadar tüm "Canlı Destek"
  // butonları bu bağlantıyı kullanır. Widget eklendiğinde yalnızca bu
  // değeri (veya bir onClick handler'ını) değiştirmek yeterlidir.
  liveSupportHref:
    "https://wa.me/905392080166?text=Merhaba%2C%20Sky%20Bozum%20Canl%C4%B1%20Destek%20%C3%BCzerinden%20g%C3%BCncel%20oran%20almak%20istiyorum.",
  liveSupportLabel: "Destek Hattı",
};

export type ServiceTone = "emerald" | "blue" | "violet" | "orange" | "rose" | "slate";

export type ServiceItem = {
  slug: string;
  name: string;
  shortName: string;
  category: string;
  description: string;
  summary: string;
  logo: string;
  tone: ServiceTone;
  rate: string;
  popular?: boolean;
  highlights: string[];
  steps: { title: string; text: string }[];
  sections: { title: string; paragraphs: string[]; bullets?: string[]; subsections?: { title: string; paragraphs: string[] }[] }[];
  faq: { question: string; answer: string }[];
};

const commonFaq = [
  {
    question: "Oranlar sabit mi?",
    answer:
      "Hayır. Oranlar stok, işlem türü ve piyasa koşullarına göre değişebilir. İşleme başlamadan önce WhatsApp üzerinden güncel oran alınmalıdır.",
  },
  {
    question: "İşlem ne kadar sürer?",
    answer:
      "Süre; ürünün doğrulanmasına, işlem yoğunluğuna ve ödeme yöntemine göre değişebilir. Uygun işlemler mümkün olan en kısa sürede sonuçlandırılır.",
  },
  {
    question: "İşlem öncesinde nelere dikkat etmeliyim?",
    answer:
      "Kodun veya bakiyenin size ait olması, kullanılmamış olması ve işlem bilgilerini eksiksiz iletmeniz gerekir. Kesin oran ve uygunluk onayı almadan ürün satın almayın.",
  },
];

export const services: ServiceItem[] = [
  {
    slug: "razer-gold-tl",
    name: "Razer Gold TL Bozum",
    shortName: "Razer Gold TL",
    category: "Dijital Kodlar",
    description: "Razer Gold TL kodlarınızı güncel oranlarla değerlendirin.",
    summary:
      "Kullanmadığınız Razer Gold TL kodlarını Sky Bozum üzerinden güvenli ve hızlı bir süreçle değerlendirebilirsiniz.",
    logo: "/brands/razer/razer.svg",
    tone: "emerald",
    rate: getRateRange("razer-gold-tl"),
    popular: true,
    highlights: ["Hızlı kod kontrolü", "Güncel oran bilgisi", "WhatsApp desteği"],
    steps: [
      { title: "Güncel oran alın", text: "Kod tutarını ve türünü WhatsApp üzerinden iletin." },
      { title: "Kodu gönderin", text: "Onay sonrasında kullanılmamış kodu güvenli biçimde paylaşın." },
      { title: "Kontrol ve ödeme", text: "Kod doğrulandıktan sonra ödeme süreci tamamlanır." },
    ],
    sections: [
      {
        title: "Razer Gold TL nedir?",
        paragraphs: [
          "Razer Gold, oyun ve dijital içerik satın alımlarında kullanılan bir dijital bakiye sistemidir. Türkiye için sunulan TL kodları, desteklenen oyun ve mağazalarda kullanılabilir.",
          "Kodu kullanmayı düşünmüyorsanız, işlem öncesinde güncel oran alarak Sky Bozum üzerinden değerlendirebilirsiniz.",
        ],
      },
      {
        title: "Razer Gold TL bozum nasıl yapılır?",
        paragraphs: [
          "Önce kod tutarını ve kodun bölgesini bize iletin. Stok ve piyasa durumuna göre güncel oran paylaşılır. Oranı kabul ettiğinizde kod kontrol edilir ve uygunluk sağlanırsa ödeme süreci başlatılır.",
        ],
        bullets: ["Kod kullanılmamış olmalıdır.", "Kod bölgesi ve para birimi doğru belirtilmelidir.", "İşlem öncesinde mutlaka oran alınmalıdır."],
      },
    ],
    faq: commonFaq,
  },
  {
    slug: "razer-gold-usd",
    name: "Razer Gold USD Bozum",
    shortName: "Razer Gold USD",
    category: "Dijital Kodlar",
    description: "USD bazlı Razer Gold kodları için uygunluk ve güncel oran bilgisi.",
    summary: "Dolar bazlı Razer Gold kodlarınızı stok uygunluğuna göre değerlendirin.",
    logo: "/brands/razer/razer.svg",
    tone: "emerald",
    rate: getRateRange("razer-gold-usd"),
    highlights: ["USD kod desteği", "Ön kontrol", "Hızlı iletişim"],
    steps: [
      { title: "Kod bölgesini belirtin", text: "USD kodun ülke ve bölge bilgisini iletin." },
      { title: "Uygunluk onayı alın", text: "Stok ve kullanım bölgesi kontrol edilir." },
      { title: "İşlemi tamamlayın", text: "Onaylanan kod için ödeme süreci başlatılır." },
    ],
    sections: [
      { title: "Razer Gold USD nedir?", paragraphs: ["Razer Gold USD, dolar bazında tanımlanan dijital oyun bakiyesidir. Kodun kullanılabildiği bölge ve mağaza koşulları değişebilir."] },
      { title: "USD kodlarda neden ön kontrol gerekir?", paragraphs: ["Bölge kısıtlaması ve stok durumu nedeniyle her USD kod aynı şartlarda işleme alınamayabilir. Bu yüzden kodu satın almadan veya göndermeden önce uygunluk onayı almak önemlidir."] },
    ],
    faq: commonFaq,
  },
  {
    slug: "itunes-apple",
    name: "Apple Gift Card Bozum",
    shortName: "iTunes / Apple",
    category: "Dijital Kodlar",
    description: "Apple Gift Card ve uygun Apple bakiye işlemleri.",
    summary: "Kullanılmamış Apple Gift Card kodlarınızı güncel koşullarla değerlendirin.",
    logo: "/brands/apple/apple.svg",
    tone: "slate",
    rate: getRateRange("itunes-apple"),
    popular: true,
    highlights: ["Apple kod kontrolü", "Bölge doğrulama", "Şeffaf süreç"],
    steps: [
      { title: "Kod bilgisi", text: "Kod tutarı ve ülke bilgisini iletin." },
      { title: "Oran onayı", text: "Güncel stok durumuna göre teklif alın." },
      { title: "Doğrulama", text: "Kod kontrolünden sonra ödeme tamamlanır." },
    ],
    sections: [
      { title: "Apple Gift Card nedir?", paragraphs: ["Apple Gift Card; App Store, oyun, uygulama ve desteklenen Apple içeriklerinde kullanılabilen dijital bir hediye kodudur."] },
      { title: "Apple kodu bozdururken dikkat edilmesi gerekenler", paragraphs: ["Kodun kullanılmamış olması ve ülke bölgesinin doğru belirtilmesi gerekir. Bölge uyuşmazlığı kodun kullanılamamasına neden olabilir."], bullets: ["Kod ekran görüntüsünü herkese açık paylaşmayın.", "Kodun para birimini kontrol edin.", "Satın almadan önce güncel oran alın."] },
    ],
    faq: commonFaq,
  },
  {
    slug: "steam",
    name: "Steam Cüzdan Kodu Bozum",
    shortName: "Steam",
    category: "Dijital Kodlar",
    description: "Steam kodu ve uygun oyun bakiyesi işlemleri.",
    summary: "Kullanmadığınız Steam cüzdan kodlarını uygunluk durumuna göre değerlendirin.",
    logo: "/brands/steam/steam.svg",
    tone: "blue",
    rate: getRateRange("steam"),
    highlights: ["Steam kod desteği", "Bölge kontrolü", "Güncel teklif"],
    steps: [
      { title: "Kod türünü iletin", text: "TL veya yabancı para birimini belirtin." },
      { title: "Uygunluk kontrolü", text: "Kod bölgesi ve stok kontrol edilir." },
      { title: "Ödeme", text: "Doğrulama sonrası ödeme tamamlanır." },
    ],
    sections: [
      { title: "Steam cüzdan kodu nedir?", paragraphs: ["Steam cüzdan kodu, Steam hesabına bakiye eklemek için kullanılan dijital koddur. Oyun ve içerik satın alımlarında kullanılabilir."] },
      { title: "Steam kodu nasıl değerlendirilir?", paragraphs: ["Kodun tutarını, para birimini ve bölgesini bize ileterek güncel uygunluk bilgisi alabilirsiniz."] },
    ],
    faq: commonFaq,
  },
  {
    slug: "paycell",
    name: "Paycell ile Razer Gold",
    shortName: "Paycell",
    category: "Mobil Ödeme",
    description: "Paycell kart ile Razer Gold satın alma ve bozum rehberi.",
    summary: "Paycell kartınızı kullanarak uygun mağazalardan Razer Gold alın ve kodunuzu Sky Bozum'a satın.",
    logo: "/brands/paycell/paycell.svg",
    tone: "orange",
    rate: getRateRange("paycell"),
    popular: true,
    highlights: ["Detaylı satın alma rehberi", "Razer Gold bozum", "7/24 destek"],
    steps: [
      { title: "Paycell kartınızı kontrol edin", text: "Kartınızın internet alışverişine açık ve bakiyesinin yeterli olduğundan emin olun." },
      { title: "Razer Gold satın alın", text: "Hepsiburada, Trendyol veya ByNoGame üzerindeki uygun Razer Gold ürününü seçin." },
      { title: "Kodu bize satın", text: "Teslim aldığınız kullanılmamış kod için güncel oran alın ve işlemi tamamlayın." },
    ],
    sections: [
      {
        title: "Paycell nedir?",
        paragraphs: [
          "Paycell, mobil ödeme ve kart işlemlerinin yönetilebildiği dijital ödeme çözümlerinden biridir. Uygulamada tanımlanan kart bilgileri, desteklenen internet sitelerinde ödeme için kullanılabilir.",
          "Kartın kullanılabilirliği; hesap durumu, limitler ve güncel Paycell koşullarına göre değişebilir. Ödeme öncesinde kart ayarlarını kontrol etmek gerekir.",
        ],
      },
      {
        title: "Paycell nasıl kullanılır?",
        paragraphs: [
          "Paycell uygulamasına giriş yaptıktan sonra kart bölümünden kart numarası, son kullanma tarihi ve güvenlik kodu görüntülenir. İnternet alışverişi ayarları açık olduğunda desteklenen mağazalarda ödeme yapılabilir.",
        ],
        bullets: ["Kullanılabilir bakiyeyi kontrol edin.", "İnternet alışverişi izninin açık olduğundan emin olun.", "Günlük ve aylık limitleri kontrol edin."],
      },
      {
        title: "Paycell kart ile Razer Gold nasıl alınır?",
        paragraphs: [
          "Paycell kart ile Razer Gold satın almak için Razer Gold resmi sayfası yerine kartla ödeme kabul eden Hepsiburada, Trendyol veya ByNoGame üzerindeki uygun dijital ürünler tercih edilir.",
          "Ürün sayfasında satıcı puanını, yorumları, kod bölgesini ve dijital teslimat bilgisini kontrol edin. Ödeme ekranında Paycell kart bilgilerinizi girerek siparişi tamamlayın.",
        ],
      },
      {
        title: "Paycell ile alınan Razer Gold kodu nasıl satılır?",
        paragraphs: [
          "Teslim aldığınız kodu kullanmadan önce Sky Bozum'dan güncel oran alın. Oranı kabul ettiğinizde kod doğrulama için iletilir ve uygun bulunması halinde ödeme süreci tamamlanır.",
        ],
      },
    ],
    faq: [
      { question: "Paycell ile Razer Gold resmi sitesinden kod alınabilir mi?", answer: "Hayır. Paycell kart için Hepsiburada, Trendyol veya ByNoGame üzerindeki uygun Razer Gold ürünleri tercih edilmelidir." },
      { question: "Paycell ile Google Play, Xbox veya Netflix kartı alabilir miyim?", answer: "Sky Bozum bu yöntem için Razer Gold alımını esas alır. İşlem yapmadan önce uygun ürün ve güncel oran için destek ekibine yazın." },
      { question: "Paycell ile aldığım Razer Gold kodunu size satabilir miyim?", answer: "Evet. Kullanılmamış ve uygun Razer Gold kodları, stok durumuna göre güncel oranlarla değerlendirilebilir." },
      ...commonFaq,
    ],
  },
  {
    slug: "pokus",
    name: "Pokus ile Razer Gold",
    shortName: "Pokus",
    category: "Mobil Ödeme",
    description: "Pokus kart ile uygun dijital ürün alımı ve bozum süreci.",
    summary: "Pokus kartla uygun mağazalardan Razer Gold satın alıp kodunuzu değerlendirin.",
    logo: "/brands/pokus/pokus.svg",
    tone: "violet",
    rate: getRateRange("pokus"),
    popular: true,
    highlights: ["Pokus kart rehberi", "Razer Gold işlemleri", "Canlı destek"],
    steps: [
      { title: "Kart ayarlarını kontrol edin", text: "Pokus kartın internet alışverişine açık olduğundan emin olun." },
      { title: "Uygun ürünü seçin", text: "Desteklenen mağazadan Razer Gold ürününü seçin." },
      { title: "Kodu değerlendirin", text: "Kullanılmamış kod için güncel oran alın." },
    ],
    sections: [
      { title: "Pokus nedir?", paragraphs: ["Pokus, kart ve dijital ödeme işlemlerinin yönetilebildiği bir finansal teknoloji uygulamasıdır. Kart bilgileri desteklenen e-ticaret sitelerinde kullanılabilir."] },
      { title: "Pokus ile Razer Gold nasıl alınır?", paragraphs: ["Kartla ödeme kabul eden uygun dijital ürün mağazasında Razer Gold ürünü seçilir. Satıcı, teslimat ve ürün bölgesi kontrol edildikten sonra Pokus kart bilgileriyle ödeme yapılır."] },
      { title: "Pokus bakiyesi nasıl değerlendirilir?", paragraphs: ["Pokus kartla satın aldığınız kullanılmamış Razer Gold kodu için Sky Bozum'dan güncel oran alabilirsiniz."] },
    ],
    faq: commonFaq,
  },
  {
    slug: "vodafone-mobil-odeme",
    name: "Vodafone Mobil Ödeme Bozum",
    shortName: "Vodafone",
    category: "Mobil Ödeme",
    description: "Vodafone mobil ödeme bakiyesini Razer Gold üzerinden değerlendirme rehberi.",
    summary: "Vodafone mobil ödeme limitinizi güvenli kontrol, hesaplama ve Razer Gold işlem rehberiyle değerlendirin.",
    logo: "/brands/vodafone/vodafone.svg",
    tone: "rose",
    rate: getRateRange("vodafone-mobil-odeme"),
    popular: true,
    highlights: ["Vodafone odaklı işlem rotası", "Limit ve hat kontrolü", "Site içi sorun çözme", "Razer Gold değerlendirme"],
    steps: [
      { title: "Hat ve limiti kontrol edin", text: "Mobil ödeme özelliğinin açık, hattın uygun ve kullanılabilir limitin yeterli olduğunu doğrulayın." },
      { title: "Yöntemi netleştirin", text: "Tutar, ürün, bölge ve güncel oran için Sky Bozum üzerinden yazılı uygunluk alın." },
      { title: "Uygun dijital ürünü alın", text: "Onaylanan yöntemle ürünü satın alın; kodu kullanmadan ve üçüncü kişilerle paylaşmadan saklayın." },
      { title: "Kontrol ve ödemeyi tamamlayın", text: "Kod kontrolü tamamlandıktan sonra onaylanan tutar ödeme hesabınıza gönderilir." },
    ],
    sections: [
      { title: "Vodafone mobil ödeme nedir?", paragraphs: ["Vodafone mobil ödeme, desteklenen dijital alışverişlerin telefon faturasına veya hattın ödeme yöntemine yansıtılmasını sağlayan bir hizmettir."] },
      { title: "Vodafone mobil ödeme limiti nasıl kontrol edilir?", paragraphs: ["Kullanılabilir limit ve hizmet durumu Vodafone uygulaması veya operatör kanalları üzerinden kontrol edilmelidir. Limitler kullanıcıya göre değişebilir."] },
      { title: "Vodafone mobil ödeme nasıl değerlendirilir?", paragraphs: ["Uygun satış kanalından Razer Gold satın alındıktan sonra kullanılmamış kod Sky Bozum'a satılabilir. Satın alma öncesinde güncel oran ve yöntem mutlaka teyit edilmelidir."] },
    ],
    faq: commonFaq,
  },
  {
    slug: "turkcell-mobil-odeme",
    name: "Turkcell Mobil Ödeme Bozum",
    shortName: "Turkcell",
    category: "Mobil Ödeme",
    description: "Turkcell mobil ödeme ve Paycell kart ile Razer Gold rehberi.",
    summary: "Turkcell mobil ödeme veya Paycell kart bakiyenizi uygun Razer Gold işlemiyle değerlendirin.",
    logo: "/brands/turkcell/turkcell.svg",
    tone: "blue",
    rate: getRateRange("turkcell-mobil-odeme"),
    highlights: ["Turkcell limit rehberi", "Paycell kart", "Razer Gold bozum"],
    steps: [
      { title: "Limitinizi kontrol edin", text: "Turkcell mobil ödeme veya Paycell kullanılabilir bakiyesini kontrol edin." },
      { title: "Uygun mağazayı seçin", text: "Hepsiburada, Trendyol veya ByNoGame üzerindeki uygun ürünü inceleyin." },
      { title: "Kod bozum", text: "Teslim alınan kullanılmamış kod için güncel oran alın." },
    ],
    sections: [
      { title: "Turkcell mobil ödeme nedir?", paragraphs: ["Turkcell mobil ödeme, desteklenen alışverişlerde ücretin hat veya ilgili ödeme çözümü üzerinden karşılanmasına imkan tanır."] },
      { title: "Turkcell mobil ödeme ile Razer Gold nasıl alınır?", paragraphs: ["Uygun ödeme yöntemi ve mağaza belirlendikten sonra dijital Razer Gold ürünü alınabilir. Paycell kart kullanılan işlemlerde kart ayarları ve limitler kontrol edilmelidir."] },
      { title: "Turkcell bakiyesi nasıl bozdurulur?", paragraphs: ["Alınan Razer Gold kodu kullanılmadan önce Sky Bozum'a iletilir. Güncel oran onaylandıktan sonra doğrulama ve ödeme süreci tamamlanır."] },
    ],
    faq: commonFaq,
  },
  {
    slug: "turk-telekom-mobil-odeme",
    name: "Türk Telekom Mobil Ödeme Bozum",
    shortName: "Türk Telekom",
    category: "Mobil Ödeme",
    description: "Türk Telekom mobil ödeme ve Pokus kart ile Razer Gold rehberi.",
    summary: "Türk Telekom mobil ödeme veya Pokus kart bakiyenizi uygun işlemlerle değerlendirin.",
    logo: "/brands/turktelekom/turktelekom.svg",
    tone: "blue",
    rate: getRateRange("turk-telekom-mobil-odeme"),
    highlights: ["Türk Telekom rehberi", "Pokus kart", "Hızlı oran"],
    steps: [
      { title: "Hizmet durumunu kontrol edin", text: "Mobil ödeme özelliğini ve kullanılabilir limiti kontrol edin." },
      { title: "Razer Gold alın", text: "Uygun mağaza ve ürün için işlem öncesinde bilgi alın." },
      { title: "Kodu değerlendirin", text: "Kullanılmamış kodu güncel oranla satın." },
    ],
    sections: [
      { title: "Türk Telekom mobil ödeme nedir?", paragraphs: ["Türk Telekom mobil ödeme, desteklenen dijital hizmet ödemelerinin hat üzerinden yapılmasına imkan sağlayan bir yöntemdir."] },
      { title: "Pokus kart ile Razer Gold nasıl alınır?", paragraphs: ["Pokus kart internet alışverişine açık olduğunda, kartla ödeme kabul eden uygun mağazalarda Razer Gold ürünü satın alınabilir."] },
      { title: "Türk Telekom bakiyesi nasıl değerlendirilir?", paragraphs: ["Satın alınan kullanılmamış Razer Gold kodu için Sky Bozum'dan güncel oran alınarak bozum işlemi başlatılabilir."] },
    ],
    faq: commonFaq,
  },
  {
    slug: "sms-mobil-odeme",
    name: "SMS Mobil Ödeme Bozum",
    shortName: "SMS Mobil Ödeme",
    category: "Mobil Ödeme",
    description: "Vodafone, Turkcell ve Türk Telekom mobil ödeme işlemleri.",
    summary: "Operatör mobil ödeme bakiyelerini uygun dijital ürün yöntemiyle değerlendirin.",
    logo: "/brands/vodafone/vodafone.svg",
    tone: "rose",
    rate: getRateRange("sms-mobil-odeme"),
    highlights: ["Üç operatör desteği", "Ön bilgilendirme", "Güncel oran"],
    steps: [
      { title: "Operatörü belirtin", text: "Vodafone, Turkcell veya Türk Telekom hattınızı belirtin." },
      { title: "Limit kontrolü", text: "Kullanılabilir mobil ödeme limitini kontrol edin." },
      { title: "Uygun işlem", text: "Destek ekibinin yönlendirdiği yöntemle işlemi tamamlayın." },
    ],
    sections: [
      { title: "SMS mobil ödeme nedir?", paragraphs: ["SMS mobil ödeme, telefon hattı üzerinden onaylanan dijital ödeme işlemlerini ifade eder. Kullanılabilir yöntemler operatöre ve güncel koşullara göre değişir."] },
      { title: "Mobil ödeme bozum süreci", paragraphs: ["Operatör, limit ve işlem türü paylaşılır. Uygunluk onaylandıktan sonra desteklenen dijital ürün yöntemiyle işlem tamamlanır."] },
    ],
    faq: commonFaq,
  },
  {
    slug: "kredi-karti-sanal-kart",
    name: "Kredi Kartı ve Sanal Kart İşlemleri",
    shortName: "Kart İşlemleri",
    category: "Kart Çözümleri",
    description: "Desteklenen kredi kartları ve sanal kartlarla dijital ürün işlemleri.",
    summary: "Uygun kredi kartı ve sanal kartlarla Razer Gold gibi desteklenen ürünleri değerlendirin.",
    logo: "/brands/visa/visa.svg",
    tone: "blue",
    rate: getRateRange("kredi-karti-sanal-kart"),
    highlights: ["Visa ve Mastercard", "Sanal kart desteği", "Ön uygunluk kontrolü"],
    steps: [
      { title: "Kart türünü belirtin", text: "Kredi kartı veya sanal kart türünü paylaşın." },
      { title: "Uygun ürün alın", text: "Desteklenen mağazadan yönlendirilen dijital ürünü satın alın." },
      { title: "Kodu satın", text: "Kullanılmamış kodu güncel oranla değerlendirin." },
    ],
    sections: [
      { title: "Sanal kart nedir?", paragraphs: ["Sanal kart, internet alışverişlerinde kullanılan dijital kart bilgileridir. Harcama limiti kontrol edilebilir ve fiziksel kart bilgilerini paylaşmadan ödeme yapılabilir."] },
      { title: "Kart ile Razer Gold nasıl alınır?", paragraphs: ["Kartla ödeme kabul eden uygun mağazadan Razer Gold ürünü seçilir. Ürün bölgesi, satıcı ve teslimat bilgileri kontrol edilerek ödeme tamamlanır."] },
    ],
    faq: commonFaq,
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export type ArticleItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt?: string;
  updatedAt?: string;
  serviceSlug?: string;
  seoTitle?: string;
  metaDescription?: string;
  cover?: string;
  coverAlt?: string;
  keywords?: readonly string[];
  links?: readonly { label: string; href: string }[];
  media?: readonly { src: string; alt: string; caption: string }[];
  faq?: readonly { question: string; answer: string }[];
  sections: { title: string; paragraphs: string[]; bullets?: string[]; subsections?: { title: string; paragraphs: string[] }[] }[];
};

export const articles: ArticleItem[] = [
  ...featuredArticles,
  ...hepsipayArticles,
  ...v21ExtendedArticles,
  { slug: "paycell-nedir-nasil-kullanilir", title: "Paycell Nedir, Nasıl Kullanılır?", excerpt: "Paycell kart, internet alışverişi ve Razer Gold satın alma sürecini öğrenin.", category: "Paycell", readTime: "8 dk", serviceSlug: "paycell", sections: services.find(s=>s.slug==='paycell')!.sections },
  { slug: "paycell-ile-razer-gold-nasil-alinir", title: "Paycell ile Razer Gold Nasıl Alınır?", excerpt: "Hepsiburada, Trendyol ve ByNoGame üzerinden adım adım Razer Gold rehberi.", category: "Paycell", readTime: "7 dk", serviceSlug: "paycell", sections: services.find(s=>s.slug==='paycell')!.sections.slice(1) },
  { slug: "vodafone-mobil-odeme-nedir", title: "Vodafone Mobil Ödeme Nedir?", excerpt: "Vodafone mobil ödeme limiti ve bakiye değerlendirme yöntemleri.", category: "Vodafone", readTime: "6 dk", serviceSlug: "vodafone-mobil-odeme", sections: services.find(s=>s.slug==='vodafone-mobil-odeme')!.sections },
  { slug: "turkcell-mobil-odeme-nasil-kullanilir", title: "Turkcell Mobil Ödeme Nasıl Kullanılır?", excerpt: "Turkcell mobil ödeme, Paycell kart ve Razer Gold süreci.", category: "Turkcell", readTime: "7 dk", serviceSlug: "turkcell-mobil-odeme", sections: services.find(s=>s.slug==='turkcell-mobil-odeme')!.sections },
  { slug: "turk-telekom-mobil-odeme-rehberi", title: "Türk Telekom Mobil Ödeme Rehberi", excerpt: "Türk Telekom mobil ödeme, Pokus kart ve dijital ürün işlemleri.", category: "Türk Telekom", readTime: "7 dk", serviceSlug: "turk-telekom-mobil-odeme", sections: services.find(s=>s.slug==='turk-telekom-mobil-odeme')!.sections },
  { slug: "pokus-nedir-razer-gold-nasil-alinir", title: "Pokus Nedir, Razer Gold Nasıl Alınır?", excerpt: "Pokus kartın kullanımı ve Razer Gold bozum adımları.", category: "Pokus", readTime: "6 dk", serviceSlug: "pokus", sections: services.find(s=>s.slug==='pokus')!.sections },
  { slug: "razer-gold-nedir", title: "Razer Gold Nedir?", excerpt: "Razer Gold kodları, kullanım alanları ve bozum süreci.", category: "Razer Gold", readTime: "6 dk", serviceSlug: "razer-gold-tl", sections: services.find(s=>s.slug==='razer-gold-tl')!.sections },
  { slug: "razer-gold-kodu-nasil-satilir", title: "Razer Gold Kodu Nasıl Satılır?", excerpt: "Kod doğrulama, güncel oran ve ödeme sürecini öğrenin.", category: "Razer Gold", readTime: "5 dk", serviceSlug: "razer-gold-tl", sections: services.find(s=>s.slug==='razer-gold-tl')!.sections.slice(1) },
  { slug: "apple-gift-card-nedir", title: "Apple Gift Card Nedir?", excerpt: "Apple kodlarının kullanımı, bölge kontrolü ve bozum rehberi.", category: "Apple", readTime: "6 dk", serviceSlug: "itunes-apple", sections: services.find(s=>s.slug==='itunes-apple')!.sections },
  { slug: "steam-cuzdan-kodu-nedir", title: "Steam Cüzdan Kodu Nedir?", excerpt: "Steam kodu, bölge ve para birimi hakkında bilmeniz gerekenler.", category: "Steam", readTime: "5 dk", serviceSlug: "steam", sections: services.find(s=>s.slug==='steam')!.sections },
  { slug: "sanal-kart-ile-razer-gold-alma", title: "Sanal Kart ile Razer Gold Alma Rehberi", excerpt: "Sanal kartla güvenli dijital ürün alışverişi için kontrol listesi.", category: "Kartlar", readTime: "6 dk", serviceSlug: "kredi-karti-sanal-kart", sections: services.find(s=>s.slug==='kredi-karti-sanal-kart')!.sections },
  { slug: "mobil-odeme-bozum-nedir", title: "Mobil Ödeme Bozum Nedir?", excerpt: "Operatör bakiyesini dijital ürün üzerinden değerlendirme süreci.", category: "Mobil Ödeme", readTime: "7 dk", serviceSlug: "sms-mobil-odeme", sections: services.find(s=>s.slug==='sms-mobil-odeme')!.sections },
  {
    slug: "mobil-odeme-guvenli-mi",
    title: "Mobil Ödeme Güvenli mi? Riskler ve Kontrol Listesi",
    excerpt: "Mobil ödeme kullanmadan önce limit, onay mesajı, satıcı ve kişisel bilgi güvenliği açısından kontrol etmeniz gerekenleri öğrenin.",
    category: "Güvenlik",
    readTime: "8 dk",
    serviceSlug: "sms-mobil-odeme",
    sections: [
      { title: "Mobil ödeme ne zaman güvenlidir?", paragraphs: ["Mobil ödeme; işlemi kendi hattınızdan, bildiğiniz bir hizmette ve tutarı açıkça görerek onayladığınızda kontrollü bir ödeme yöntemi olabilir. Güvenlik yalnız kullanılan teknolojiye değil, kullanıcının onay ekranını okumasına ve işlem yaptığı tarafı doğrulamasına da bağlıdır.", "Onay mesajındaki hizmet adı ve tutar beklediğiniz işlemle uyuşmuyorsa işlemi tamamlamayın. Acele ettiren, ekran paylaşımı isteyen veya ne satın alındığını açıklamayan yönlendirmeler güvenli kabul edilmemelidir."], bullets: ["İşlem tutarını ve hizmet adını onaylamadan önce okuyun.", "Hattın kullanılabilir limitini operatörün kendi kanalından kontrol edin.", "Tek kullanımlık kodları ve hesap şifrelerini kimseyle paylaşmayın."] },
      { title: "En sık karşılaşılan riskler", paragraphs: ["Sahte destek hesapları, gerçeğine benzeyen ödeme sayfaları ve farklı tutarda gelen onay mesajları başlıca risklerdir. Mobil ödeme tutarının telefon faturasına yansıması, yapılan işlemin kendiliğinden güvenilir olduğu anlamına gelmez.", "Bir kişi sizden uzaktan erişim uygulaması kurmanızı, ekranınızı paylaşmanızı veya gelen bütün SMS kodlarını iletmenizi istiyorsa işlemi durdurun. Güvenilir bir süreç yalnız gerekli bilgiyi ister ve ne için kullanıldığını açıklar."], bullets: ["Adres çubuğundaki alan adını kontrol edin.", "Tanımadığınız bağlantılardan ödeme ekranı açmayın.", "İşlem geçmişini ve fatura hareketlerini sonradan kontrol edin."] },
      { title: "İşlem öncesi kısa kontrol", paragraphs: ["Satın alınacak dijital ürünün türünü, bölgesini, tutarını ve teslimat biçimini önceden öğrenin. Ürünü aldıktan sonra kullanmadan önce bozum uygunluğunu ve güncel oranı yazılı olarak teyit etmek, yanlış ürün satın alma riskini azaltır.", "Şüpheli bir durum oluşursa yeni işlem yapmayı bırakın; operatörünüzün resmi destek kanalından mobil ödeme durumunu kontrol edin. Güvenlikte en etkili adım, belirsiz bir işlemi tamamlamamaktır."] },
    ],
  },
  {
    slug: "mobil-bozum-yaparken-dolandirilabilir-miyim",
    title: "Mobil Bozum Yaparken Dolandırılabilir miyim?",
    excerpt: "Sahte hesapları, gerçek dışı oranları ve dijital kod dolandırıcılığını ayırt etmek için uygulanabilir güvenlik adımları.",
    category: "Güvenlik",
    readTime: "9 dk",
    serviceSlug: "sms-mobil-odeme",
    sections: [
      { title: "Dolandırıcılık riski nerede oluşur?", paragraphs: ["Mobil bozum işlemlerinde risk çoğunlukla belirsiz kimlikli hesaplar, gerçekçi olmayan oran teklifleri ve kodun ödeme yapılmadan alınması aşamasında oluşur. Dijital kodlar kullanıldıktan sonra geri alınamadığı için gönderim sırası ve yazılı teyit önemlidir.", "Yalnızca yüksek oran vaat edilmesi güven kanıtı değildir. İletişim bilgilerinin tutarlı olması, sürecin açık anlatılması, oran ve tahmini ödemenin işlemden önce yazılı verilmesi gerekir."], bullets: ["İletişim numarasını sitenin resmi sayfasından açın.", "Kodu herkese açık yorum veya forum alanına yazmayın.", "Oran, tutar ve ödeme yöntemini aynı konuşmada teyit edin."] },
      { title: "Kırmızı bayraklar", paragraphs: ["Normalden çok yüksek oran, hemen karar vermeniz için baskı, farklı numaralara yönlendirme ve işlemle ilgisiz doğrulama kodu talepleri önemli uyarılardır. Sahte hesaplar kurumsal logo ve isimleri kopyalayabildiği için yalnız profil görseline güvenmeyin.", "Karşınızdaki taraf kart şifresi, operatör hesabı parolası veya cihazınıza uzaktan erişim isterse devam etmeyin. Bir dijital kodun kontrolü için telefonunuzun tamamına erişim verilmesi gerekmez."], bullets: ["Ödeme yapıldı görüntüsü yerine hesabınızdaki gerçek hareketi kontrol edin.", "Son anda değişen IBAN veya iletişim numarasını yeniden doğrulayın.", "Kullanılmış ya da bölgesi yanlış kod göndermeyin."] },
      { title: "Daha güvenli işlem sırası", paragraphs: ["Önce hizmet ve tutarı bildirin, güncel oranı alın, kod veya ürün uygunluğunu sorun ve yalnız onaylanan yöntemle ilerleyin. Gönderilen bilgiler ile konuşmadaki tutar arasında fark varsa işlem durdurulmalıdır.", "İşlem tamamlanana kadar konuşma kaydını ve ödeme belgesini saklayın. Sorun yaşandığında tarih, tutar ve işlem sırası gibi bilgiler belirsiz anlatımlardan daha faydalıdır."] },
    ],
  },
  {
    slug: "dijital-kod-bolge-hatasi-nedir",
    title: "Dijital Kod Bölge Hatası Nedir, Nasıl Önlenir?",
    excerpt: "Razer Gold, Apple ve Steam kodlarında ülke, para birimi ve hesap bölgesi uyuşmazlığının nedenlerini öğrenin.",
    category: "Dijital Kodlar",
    readTime: "7 dk",
    serviceSlug: "razer-gold-tl",
    sections: [
      { title: "Bölge hatası ne anlama gelir?", paragraphs: ["Dijital kodlar belirli bir ülke, para birimi veya mağaza bölgesi için üretilebilir. Kodun bölgesi ile kullanılacağı hesabın bölgesi uyuşmadığında sistem kodu kabul etmeyebilir; bu durum kodun mutlaka sahte olduğu anlamına gelmez.", "TL ve USD gibi para birimi farklılıkları da bölge kontrolünün parçasıdır. Ürün başlığında yalnız marka adına bakmak yerine ülke, para birimi ve kullanım koşulları birlikte okunmalıdır."] },
      { title: "Satın almadan önce nasıl kontrol edilir?", paragraphs: ["Ürün sayfasındaki bölge bilgisini, satıcının açıklamasını ve teslim edilen kodun para birimini kontrol edin. Hesap ülkesini sırf bir kodu kullanmak için değiştirmek yeni kısıtlamalara yol açabileceğinden, bu tür işlemler resmi hizmet koşulları incelenmeden yapılmamalıdır."], bullets: ["Kodun TL, USD veya başka para biriminde olduğunu doğrulayın.", "Global ifadesinin hangi ülkeleri kapsadığını okuyun.", "Satın almadan önce bozum için bölge uygunluğunu sorun."] },
      { title: "Hata alınırsa ne yapılmalı?", paragraphs: ["Kod hata verdiğinde art arda farklı hesaplarda denemek yerine hata mesajını ve satın alma belgesini kaydedin. Ürünü aldığınız satıcının destek kanalına kodun bölge ve teslimat bilgileriyle başvurun.", "Kodu üçüncü kişilerle paylaşmak sorunu çözmez ve kodun kullanılma riskini artırır. Kodun tamamını ekran görüntüsüyle herkese açık alanda yayımlamayın."] },
    ],
  },
  {
    slug: "dijital-kod-satin-almadan-once-kontrol-listesi",
    title: "Dijital Kod Satın Almadan Önce 10 Kontrol",
    excerpt: "Razer Gold, Apple Gift Card ve Steam kodu satın almadan önce satıcı, bölge, tutar ve teslimatı kontrol edin.",
    category: "Dijital Kodlar",
    readTime: "8 dk",
    serviceSlug: "razer-gold-tl",
    sections: [
      { title: "Ürün ve bölge kontrolleri", paragraphs: ["Dijital ürünlerde yanlış marka, para birimi veya bölge seçimi fiziksel ürünlere göre daha zor düzeltilebilir. Satın alma düğmesine basmadan önce ürün adını, kod değerini ve kullanılacağı ülkeyi ayrı ayrı kontrol edin."], bullets: ["Marka ve ürün türü doğru mu?", "Kod değeri ve para birimi doğru mu?", "Kod bölgesi kullanılacağı hesapla uyumlu mu?", "Ürün tek kod mu, birden fazla kod mu?", "Teslimat dijital ve tahmini süre açık mı?"] },
      { title: "Satıcı ve ödeme kontrolleri", paragraphs: ["Pazar yerlerinde aynı ürün birden fazla satıcı tarafından sunulabilir. Satıcının geçmişi, güncel yorumları ve dijital ürün iade koşulları incelenmelidir. Yalnız en düşük fiyatı seçmek güvenli bir değerlendirme değildir."], bullets: ["Satıcı adı ve puanı tutarlı mı?", "Son yorumlarda teslimat sorunu var mı?", "Ödeme sayfasının alan adı doğru mu?", "Sipariş özeti beklenen tutarı gösteriyor mu?", "Bozum uygunluğu ve güncel oran önceden teyit edildi mi?"] },
      { title: "Kod teslim edildikten sonra", paragraphs: ["Kod geldiğinde sipariş kaydını saklayın ve kodu açık alanlarda paylaşmayın. Bozum yapılacaksa kodu kişisel hesabınızda kullanmadan, önceden teyit edilen süreç üzerinden ilerleyin.", "Teslim edilen ürün açıklamayla uyuşmuyorsa kodu kullanmaya çalışmadan satıcı desteğine yazın. Kullanılmış kodlar için çözüm seçenekleri genellikle daha sınırlıdır."] },
    ],
  },
  {
    slug: "mobil-odeme-limiti-nasil-ogrenilir",
    title: "Mobil Ödeme Limiti Nasıl Öğrenilir?",
    excerpt: "Vodafone, Turkcell ve Türk Telekom hatlarında kullanılabilir mobil ödeme limitini kontrol ederken dikkat edilmesi gerekenler.",
    category: "Mobil Ödeme",
    readTime: "7 dk",
    serviceSlug: "sms-mobil-odeme",
    sections: [
      { title: "Mobil ödeme limiti nedir?", paragraphs: ["Mobil ödeme limiti, hattınız üzerinden belirli bir dönem içinde kullanabileceğiniz ödeme üst sınırını ifade eder. Toplam limit ile o anda kullanılabilir kalan limit aynı şey değildir; daha önce yapılan işlemler ve bekleyen hareketler kullanılabilir tutarı azaltabilir.", "Limitler her kullanıcıda aynı olmayabilir. Hat türü, ödeme geçmişi, operatör politikaları ve hizmet durumu gibi etkenler nedeniyle internette gördüğünüz başka bir kullanıcının limiti sizin hattınız için geçerli kabul edilmemelidir."] },
      { title: "Kullanılabilir limit nasıl kontrol edilir?", paragraphs: ["En güvenli kontrol, operatörünüzün kendi uygulaması, müşteri hizmetleri veya resmi bilgilendirme kanalı üzerinden yapılır. Üçüncü taraf bir sayfaya hat şifresi ya da doğrulama kodu girmek yerine resmi kanaldaki güncel kullanılabilir tutarı esas alın.", "Kontrol sırasında toplam limit, kalan limit, işlem başına sınır ve dönemsel kullanım bilgilerini birbirinden ayırın. Bir satın almanın toplam limite sığması, işlem başına sınırı da geçtiği anlamına gelmez."], bullets: ["Operatörün resmi uygulamasını veya destek kanalını kullanın.", "Toplam limit yerine kullanılabilir kalan tutarı kontrol edin.", "Bekleyen ya da faturaya henüz yansımamış işlemleri hesaba katın."] },
      { title: "Limit neden beklenenden düşük görünebilir?", paragraphs: ["Yakın zamanda yapılan harcamalar, dönemsel güvenlik kısıtlamaları veya mobil ödeme hizmetinin geçici olarak kapalı olması kullanılabilir limiti etkileyebilir. Aynı işlemi art arda denemek ek güvenlik kontrolüne yol açabilir.", "Limit görünmüyorsa veya tutarsızsa yeni satın alma yapmadan önce operatör desteğinden hizmet durumunu doğrulayın. Bozum amacıyla ürün almadan önce hem kullanılabilir limiti hem ürün uygunluğunu teyit etmek gereksiz harcama riskini azaltır."] },
    ],
  },
  {
    slug: "sanal-kart-guvenli-mi",
    title: "Sanal Kart Güvenli mi? Kullanım ve Limit Rehberi",
    excerpt: "Sanal kartla internet alışverişinde limit belirleme, kart bilgilerini koruma ve dijital ürün satın alma güvenliği.",
    category: "Kartlar",
    readTime: "8 dk",
    serviceSlug: "kredi-karti-sanal-kart",
    sections: [
      { title: "Sanal kartın güvenlik avantajı", paragraphs: ["Sanal kart, internet alışverişi için ayrı kart bilgileri ve kontrol edilebilir harcama limiti sunabilir. Ana kart limitinin tamamını alışveriş sitesine açmak yerine yalnız planlanan işlem kadar limit tanımlamak, izinsiz yüksek tutarlı harcama riskini azaltır.", "Ancak sanal kart kullanmak her siteyi otomatik olarak güvenli yapmaz. Sahte ödeme sayfasına girilen sanal kart bilgileri, kartta kullanılabilir limit bulunduğu sürece kötüye kullanılabilir."], bullets: ["İşlem öncesinde yalnız gereken tutar kadar limit tanımlayın.", "Alışveriş sonrasında limiti düşürün veya kartı geçici olarak kapatın.", "Kart bilgilerini mesajla ya da ekran görüntüsüyle paylaşmayın."] },
      { title: "Ödeme sayfasında ne kontrol edilmeli?", paragraphs: ["Adres çubuğundaki alan adı, ödeme tutarı ve satıcı bilgisi işlem onayından önce kontrol edilmelidir. Tarayıcıdaki kilit simgesi bağlantının şifreli olduğunu gösterir; satıcının güvenilirliğini tek başına kanıtlamaz.", "Dijital ürünlerde teslimat ve iade koşulları ayrıca önemlidir. Kod teslim edildikten sonra iade seçeneği sınırlı olabileceği için ürün türü, bölgesi ve değeri ödeme öncesinde doğrulanmalıdır."] },
      { title: "Şüpheli işlem görülürse", paragraphs: ["Kart hareketlerinde tanımadığınız bir işlem görürseniz sanal kartı kapatın veya limitini sıfırlayın ve kartı sağlayan kuruluşun resmi destek kanalına başvurun. İşlem bilgilerini paylaşırken tam kart numarası ve güvenlik kodu göndermeyin.", "Tek kullanımlık doğrulama kodu yalnız sizin başlattığınız ve tutarını gördüğünüz işlem için girilmelidir. Telefonda veya mesajda bu kodu isteyen kişilere iletmeyin."] },
    ],
  },
  {
    slug: "razer-gold-tl-ve-usd-farki",
    title: "Razer Gold TL ve USD Kodları Arasındaki Farklar",
    excerpt: "Razer Gold TL ve USD kodlarında para birimi, bölge, hesap uyumu ve bozum öncesi kontrol edilmesi gereken farklar.",
    category: "Razer Gold",
    readTime: "7 dk",
    serviceSlug: "razer-gold-tl",
    sections: [
      { title: "Temel fark para birimi ve bölgedir", paragraphs: ["Razer Gold TL kodları Türk lirası, USD kodları ise dolar değeri üzerinden sunulur. Kodun üzerinde yazan tutarı yalnız kur çevirisi olarak değerlendirmek yeterli değildir; kullanım bölgesi ve hesabın desteklediği para birimi de önem taşır.", "Aynı sayısal değere sahip iki kod farklı para birimindeyse ekonomik değerleri ve işlem koşulları farklı olur. Ürün adında TL veya USD ibaresinin açıkça görülmesi gerekir."] },
      { title: "Kod seçerken hangi bilgiler kontrol edilmeli?", paragraphs: ["Kodun para birimi, ülke veya bölge bilgisi, kullanılacağı platform ve satıcının teslimat açıklaması birlikte kontrol edilmelidir. Global olarak tanımlanan ürünlerde bile desteklenen ülkeler satıcı açıklamasında sınırlandırılabilir."], bullets: ["TL veya USD para birimini doğrulayın.", "Kodun bölgesini ve desteklenen hesabı kontrol edin.", "Satın almadan önce stok ve bozum uygunluğunu sorun.", "Kod değerini kur hesabıyla tek başına karşılaştırmayın."] },
      { title: "Bozum oranı neden farklı olabilir?", paragraphs: ["TL ve USD kodlarının talebi, kullanılabildiği bölge ve stok durumu aynı olmayabilir. Bu nedenle iki para birimi için farklı bilgilendirme oranları görülebilir.", "Kesin oran almadan yalnız döviz kuruna bakarak beklenen ödeme hesaplamak doğru sonuç vermeyebilir. Kod satın alınmadan önce para birimi ve tutar açıkça belirtilerek güncel uygunluk alınmalıdır."] },
    ],
  },
  {
    slug: "dijital-kod-teslim-edilince-ne-yapilmali",
    title: "Dijital Kod Teslim Edilince Ne Yapılmalı?",
    excerpt: "Dijital kod teslimatından sonra sipariş, bölge, tutar ve kod güvenliği için izlenecek kontrollü adımlar.",
    category: "Dijital Kodlar",
    readTime: "7 dk",
    serviceSlug: "razer-gold-tl",
    sections: [
      { title: "Önce siparişle karşılaştırın", paragraphs: ["Kod teslim edildiğinde ilk olarak ürün adı, para birimi, değer ve bölge bilgisini siparişinizle karşılaştırın. Yanlış ürün gönderilmişse kodu kullanmaya çalışmadan satıcı desteğine başvurmak çözüm ihtimalini korur.", "Sipariş numarası, teslimat zamanı ve ürün açıklamasını saklayın. Yalnız kod ekran görüntüsü, satın almanın hangi şartlarla yapıldığını kanıtlamak için yeterli olmayabilir."], bullets: ["Ürün adı ve kod değeri siparişle aynı mı?", "Para birimi ve bölge doğru mu?", "Teslimat kaydı ve sipariş numarası duruyor mu?", "Kod herkese kapalı güvenli bir yerde mi?"] },
      { title: "Kodu nasıl korumalısınız?", paragraphs: ["Dijital kod, onu gören kişi tarafından kullanılabilir. Bu nedenle tam kodu forumlarda, yorum alanlarında veya birden fazla destek hesabına göndermeyin. Ekran görüntüsü paylaşmanız gerekiyorsa kod karakterlerini kapatın.", "Bozum yapılacaksa yalnız daha önce doğruladığınız resmi iletişim kanalı üzerinden ilerleyin. Aynı kodu eş zamanlı olarak farklı kişilere göndermek işlem anlaşmazlığına yol açabilir."] },
      { title: "Hata veya gecikme durumunda", paragraphs: ["Kod görünmüyor, eksik teslim edilmiş veya siparişten farklıysa satıcının resmi destek kaydını açın. Mesajınızda sipariş numarası, ürün adı ve teslimat sorununu belirtin; kart şifresi veya hesap parolası göndermeyin.", "Kodun kullanılmış olduğu belirtiliyorsa deneme zamanı ve hata mesajını kaydedin. Kodu tekrar tekrar farklı hesaplarda kullanmaya çalışmak yerine satıcıdan teslimat ve aktivasyon kaydının incelenmesini isteyin."] },
    ],
  },

  {
    slug: "bozum-talebi-nasil-olusturulur",
    title: "Bozum Talebi Nasıl Oluşturulur?",
    excerpt: "Sky Bozum üzerinden mobil ödeme bozum veya dijital kod işlemi başlatırken hazırlanması gereken bilgiler ve güvenli talep adımları.",
    category: "İletişim",
    readTime: "9 dk",
    sections: [
      {
        title: "Bozum talebine başlamadan önce",
        paragraphs: [
          "Bozum talebi oluşturmak, yalnızca bir mesaj gönderip fiyat sormaktan ibaret değildir. Sağlıklı bir süreç için önce hangi ürün veya bakiye türünü değerlendirmek istediğinizi, toplam tutarı ve ürünün para birimini netleştirmeniz gerekir. Razer Gold TL, Razer Gold USD, Apple Gift Card, Steam, Paycell, Pokus veya mobil ödeme bozum taleplerinde süreç ayrıntıları farklı olabilir. Bu nedenle ilk mesajda ürün adını açık biçimde yazmak hem yanlış anlaşılmayı hem de gereksiz beklemeyi azaltır.",
          "Sky Bozum iletişim sayfasındaki resmi WhatsApp bağlantısını kullanmak güvenli başlangıcın en önemli adımıdır. Arama motoru reklamları, sosyal medya yorumları veya size özel mesajla gönderilen benzer isimli bağlantılar resmi kanal olmayabilir. Alan adının bozumcu.net olduğunu ve telefon numarasının iletişim sayfasındaki numarayla eşleştiğini kontrol ederek güvenli bozum sürecine başlayabilirsiniz."
        ],
        subsections: [
          { title: "İlk mesajda hangi bilgiler bulunmalı?", paragraphs: ["İlk mesajınızda işlem türünü, tutarı, para birimini ve varsa ürün bölgesini yazın. Örneğin ‘5.000 TL Razer Gold TL bozum oranı öğrenmek istiyorum’ şeklindeki açık bir mesaj, yalnızca ‘oran nedir?’ yazmaktan daha hızlı değerlendirilir. Henüz oran ve uygunluk onayı almadan dijital kodu, kart ekranını veya hassas bilgileri göndermeyin."] }
        ]
      },
      {
        title: "Güncel oran ve uygunluk onayı",
        paragraphs: [
          "Mobil ödeme bozdurma ve dijital kod işlemlerinde oranlar sabit kabul edilmemelidir. Ürün talebi, stok, para birimi, bölge ve işlem yoğunluğu güncel oranı etkileyebilir. Bu nedenle geçmişte görülen bir oranı veya başka bir kullanıcının aldığı teklifi kendi işleminiz için kesin bilgi olarak değerlendirmeyin. İşlem türü ve tutar yazıldıktan sonra güncel uygunluk kontrol edilir ve size işlem öncesinde net bilgi verilir.",
          "Oranı kabul etmeden ürün satın almak veya kullanılmamış kodu göndermek gereksiz risk oluşturabilir. Özellikle mobil ödeme bozum amacıyla dijital ürün satın alınacaksa, hangi ürünün kabul edildiğini ve bölge koşullarını önceden teyit etmek gerekir. Sky Bozum üzerinden verilen bilgilendirme, işlem başlamadan önce karar vermenize yardımcı olur."
        ],
        bullets: ["Ürün adı ve para birimini doğru belirtin.", "Kesin oranı işlemden hemen önce alın.", "Uygunluk onayı olmadan kod satın almayın.", "Oranı kabul ettiğinizi yazılı olarak belirtin."]
      },
      {
        title: "Kod veya bakiye bilgisi nasıl iletilir?",
        paragraphs: [
          "Dijital kod yalnızca güncel oranı kabul ettikten ve resmi iletişim kanalını doğruladıktan sonra iletilmelidir. Kodun kullanılmamış olması, doğru bölgeye ait olması ve başka biriyle paylaşılmamış olması gerekir. Aynı kodu eş zamanlı olarak birden fazla kişiye göndermek doğrulama sürecinde anlaşmazlık oluşturabilir. Kod ekran görüntüsü gönderilecekse gereksiz kişisel bilgiler görüntüden çıkarılmalıdır.",
          "Mobil ödeme bozum veya cüzdan işlemlerinde sizden hesap şifresi, kart PIN’i, internet bankacılığı parolası veya SMS doğrulama kodu istenmez. İşlem için gerekliyse yalnız ürün, tutar, kullanılmamış kod ve ödeme yapılacak IBAN gibi sınırlı bilgiler paylaşılır. Hesabınıza giriş sağlayan herhangi bir bilgiyi isteyen kişiyle işlemi durdurun."
        ],
        subsections: [
          { title: "Hassas bilgi sınırı", paragraphs: ["Tek kullanımlık doğrulama kodları yalnız sizin başlattığınız işlemleri onaylamak içindir. Bu kodları, banka şifresini, kart şifresini veya uygulama parolasını hiçbir destek görevlisine göndermeyin. Güvenli bozum süreci, hesabınıza erişim talep etmeden yürütülmelidir."] }
        ]
      },
      {
        title: "IBAN ve ödeme bilgisinin hazırlanması",
        paragraphs: [
          "İşlem onaylandığında ödemenin yapılacağı IBAN ve hesap sahibinin ad-soyad bilgisi istenir. IBAN’ı kopyalarken eksik karakter kalmamasına ve hesabın aktif olmasına dikkat edin. Farklı bir kişiye ait hesap kullanılacaksa bu durumu işlem başlamadan önce belirtmek, ödeme kontrolünde yaşanabilecek karışıklıkları azaltır.",
          "Ödeme bildirimi geldikten sonra banka hareketlerinizi kendi resmi bankacılık uygulamanızdan kontrol edin. Yalnız ekran görüntüsüne dayanarak ödeme geldiğini varsaymayın. İşlem kaydını, konuşmayı ve ödeme saatini bir süre saklamak işlem sonrası destek gerektiğinde süreci kolaylaştırır."
        ]
      },
      {
        title: "Talep sırasında sorun yaşanırsa",
        paragraphs: [
          "İletişim kesilirse aynı resmi konuşma üzerinden yeniden yazın ve işlem türünü, tutarı ve önceki mesaj saatini belirtin. Yeni bir numaraya yönlendirilirseniz önce bozumcu.net iletişim sayfasından numarayı doğrulayın. Yoğunluk nedeniyle yanıt gecikirse aynı mesajı çok sayıda farklı kanala göndermek yerine mevcut talebinizi kısa bir hatırlatmayla güncelleyin.",
          "Yanlış ürün, hatalı bölge veya kullanılmış kod gibi bir durum fark edilirse yeni işlem denemeleri yapmadan destek isteyin. Sorunu açıkça anlatın; ancak güvenlik amacıyla şifre veya doğrulama kodu paylaşmayın. Açık ve eksiksiz bilgi, işlem desteğinin daha hızlı sonuçlanmasına yardımcı olur."
        ]
      },
      {
        title: "Sky Bozum ile güvenli şekilde iletişime geçin",
        paragraphs: [
          "Doğru hazırlanmış bir bozum talebi; ürün türü, tutar, para birimi, güncel oran onayı ve doğru IBAN bilgisinden oluşur. Bu düzen hem mobil ödeme bozdurma sürecini hızlandırır hem de yanlış işlem riskini azaltır. Her adımda resmi kanalı kullanmak ve hassas bilgileri korumak temel güvenlik kuralıdır.",
          "Talebinizi başlatmak için Sky Bozum iletişim sayfasına gidin ve resmi WhatsApp butonunu kullanın. Ürün adını ve tutarı yazın; güncel oran ve uygunluk bilgisini aldıktan sonra işleme devam edin."
        ]
      }
    ]
  },
  {
    slug: "guncel-bozum-orani-nasil-ogrenilir",
    title: "Güncel Bozum Oranı Nasıl Öğrenilir?",
    excerpt: "Mobil ödeme bozum ve dijital kod işlemlerinde güncel oranı doğru kanaldan öğrenme, hesaplama ve teyit etme rehberi.",
    category: "İletişim",
    readTime: "9 dk",
    sections: [
      { title: "Bozum oranı neden değişir?", paragraphs: ["Mobil ödeme bozum, dijital kod ve sanal kart işlemlerinde oranlar her zaman aynı kalmaz. Ürünün türü, para birimi, bölgesi, kullanılabilir stok, piyasa talebi ve işlem tutarı güncel oranı etkileyebilir. Bu nedenle haftalar önce görülen bir oranı bugünkü işlem için kesin kabul etmek doğru değildir. Sky Bozum üzerinden işlem yapmadan önce ürün ve tutar özelinde güncel bilgi almak gerekir.", "Oran değişkenliği özellikle Razer Gold TL ile USD, Apple Gift Card bölgeleri veya farklı mobil ödeme yöntemleri arasında belirgindir. Aynı marka altındaki iki ürün bile farklı kullanım koşullarına sahip olabilir. Güvenli bozum yaklaşımı, ürünü satın almadan veya kodu göndermeden önce güncel oranı yazılı olarak teyit etmektir."], subsections: [{ title: "Taban oran ile kesin oran arasındaki fark", paragraphs: ["Sitede gösterilen taban veya bilgilendirme oranları genel fikir verir. Kesin oran ise işlem anındaki ürün, tutar ve uygunluk kontrolünden sonra paylaşılır. Hesabınızı kesin tutar üzerinden yapmak için destek hattından güncel teyit alın."] }] },
      { title: "Oran sormak için doğru mesaj nasıl yazılır?", paragraphs: ["‘Oran nedir?’ gibi tek cümlelik bir mesaj, hangi ürün için bilgi istendiğini açıklamaz. Daha hızlı yanıt için ürün adını, toplam tutarı, para birimini ve varsa bölgeyi aynı mesajda belirtin. Örneğin ‘3.000 TL Paycell ile alınmış Razer Gold TL kodu için güncel bozum oranı nedir?’ mesajı değerlendirme için gerekli temel bilgileri içerir.", "Mobil ödeme bozdurma talebinde operatör veya kullanılan uygulama da önemlidir. Vodafone, Turkcell, Türk Telekom, Paycell veya Pokus bilgisini belirtmek doğru rehbere yönlendirilmenizi sağlar. Kod henüz satın alınmadıysa bunu da açıkça yazın; böylece ürün uygunluğu işlem öncesinde kontrol edilebilir."], bullets: ["Ürün veya hizmet adını yazın.", "Toplam tutarı ve para birimini belirtin.", "Kodun bölgesini biliyorsanız ekleyin.", "Ürünün satın alınıp alınmadığını açıklayın."] },
      { title: "Oran hesaplaması nasıl yapılır?", paragraphs: ["Oran yüzde olarak verildiğinde tahmini ödeme, toplam tutarın oranla çarpılmasıyla hesaplanır. Örneğin 5.000 TL tutar için yüzde 60 oran verilirse tahmini ödeme 3.000 TL olur. Ancak işlem masrafı, ürün parçalı yapısı veya farklı koşullar varsa kesin sonuç destek mesajında açıklanmalıdır.", "Sky Bozum oran hesaplama sayfası hızlı bir tahmin sağlar; yine de bu sonuç otomatik teklif veya işlem garantisi değildir. İşleme başlamadan önce destek hattından kesin oranı ve ödenecek tutarı yazılı olarak alın. Böylece kod gönderildikten sonra tutar konusunda anlaşmazlık yaşanmaz."], subsections: [{ title: "Yuvarlama ve parçalı kodlar", paragraphs: ["Birden fazla koddan oluşan işlemlerde her kodun değeri veya bölgesi farklıysa toplam hesap değişebilir. Parçalı kodların listesini önceden belirtmek, nihai ödemenin doğru hesaplanmasına yardımcı olur."] }] },
      { title: "Sahte oran tekliflerine karşı dikkat", paragraphs: ["Piyasanın çok üzerinde görünen bir oran her zaman avantaj anlamına gelmez. Sahte hesaplar kullanıcıyı hızlı karar vermeye zorlayabilir, resmi olmayan bağlantıya yönlendirebilir veya kodu oran teyidi olmadan isteyebilir. Alan adını, telefon numarasını ve iletişim kanalını kontrol etmeden dijital kod paylaşmayın.", "Sky Bozum taklidi yapan hesaplardan korunmak için yalnız bozumcu.net üzerindeki iletişim bağlantılarını kullanın. Size farklı bir numaradan ulaşılırsa mevcut resmi konuşma üzerinden doğrulama isteyin. Şifre, SMS kodu veya kart PIN’i isteyen tekliflerden uzak durun."], bullets: ["Aşırı yüksek oranlarda resmi kanalı yeniden kontrol edin.", "Kod göndermeden önce ödeme koşulunu yazılı alın.", "Kısa süre baskısıyla karar vermeyin.", "Hesap şifresi veya doğrulama kodu paylaşmayın."] },
      { title: "Oranı ne zaman yeniden teyit etmek gerekir?", paragraphs: ["Teklif ile işlem arasında uzun süre geçtiyse oran yeniden sorulmalıdır. Piyasa ve stok koşulları kısa sürede değişebilir. Ayrıca tutar, ürün veya para birimi değiştiğinde önceki teklif geçerli sayılmamalıdır. Yeni bilgileri aynı konuşmada paylaşarak güncel hesap isteyin.", "İşlem bölündüyse veya ek kod eklendiyse toplam tutarı tekrar yazın. Ödeme öncesinde nihai tutarın iki tarafça açıkça görülmesi şeffaf işlem için önemlidir. Eski ekran görüntüsü yerine güncel konuşmadaki teyidi esas alın." ] },
      { title: "Güncel oran için resmi kanalı kullanın", paragraphs: ["Güncel bozum oranını öğrenmenin en güvenli yolu ürün türü ve tutarla birlikte Sky Bozum resmi destek hattına yazmaktır. Bilgilendirme oranlarını başlangıç noktası olarak kullanın; kesin tutarı işlem anında doğrulayın. Bu yöntem hem mobil ödeme bozum hem de dijital kod işlemlerinde beklentiyi netleştirir.", "Sky Bozum iletişim sayfasını açın, resmi WhatsApp bağlantısından mesaj gönderin ve ürününüzü açıkça belirtin. Güncel oranı aldıktan sonra oran hesaplama sayfasıyla tahmini ödemenizi kontrol edebilir ve onay verdiğinizde güvenli süreç üzerinden devam edebilirsiniz."] }
    ]
  },
  {
    slug: "islem-destegi-nasil-alinir",
    title: "İşlem Desteği Nasıl Alınır?",
    excerpt: "Devam eden veya tamamlanan mobil ödeme bozum işlemlerinde doğru bilgiyle destek talebi oluşturma ve güvenli takip adımları.",
    category: "İletişim",
    readTime: "9 dk",
    sections: [
      { title: "İşlem desteği hangi durumlarda gerekir?", paragraphs: ["İşlem desteği; mesajın yarıda kalması, kod doğrulamasının uzaması, ödeme kontrolü, yanlış ürün bilgisi veya tamamlanan işlem hakkında soru oluşması gibi durumlarda kullanılabilir. Sorunun türünü doğru belirtmek, destek ekibinin ilgili işlem kaydına daha hızlı ulaşmasını sağlar. Yalnız ‘işlemim ne oldu?’ yazmak yerine işlem saati, ürün ve tutar bilgisini ekleyin.", "Mobil ödeme bozum ve dijital kod işlemleri farklı kontrol adımlarına sahip olabilir. Kodun bölgesi, para birimi veya kullanılma durumu incelenirken ek süre gerekebilir. Destek talebinde sakin ve açık bir anlatım kullanmak, aynı konuyu çok sayıda yeni konuşmaya bölmekten daha verimlidir."], subsections: [{ title: "Destek talebi ile yeni bozum talebini ayırın", paragraphs: ["Devam eden bir işlem için yeni teklif mesajı açmak yerine mevcut konuşma üzerinden yazın. Böylece önceki oran, gönderilen bilgiler ve işlem zamanı aynı kayıt içinde görülebilir."] }] },
      { title: "Destek mesajında bulunması gereken bilgiler", paragraphs: ["İşlem türü, yaklaşık saat, toplam tutar, ürün adı ve mümkünse konuşmada verilen işlem özeti destek mesajına eklenmelidir. Ödeme ile ilgili soruda IBAN’ın tamamını herkese açık alanda paylaşmak yerine mevcut resmi konuşmada son birkaç haneyi referans olarak belirtmek yeterli olabilir. Hassas banka bilgilerini gereksiz yere tekrarlamayın.", "Kodla ilgili sorunda kodun tamamını yeniden farklı hesaplara göndermeyin. Resmi konuşmada işlem kaydı zaten bulunuyorsa yalnız kodun değeri ve son birkaç karakteriyle referans verilebilir. Destek görevlisi gerekli görürse güvenli kanal içinde ek bilgi ister."], bullets: ["Ürün veya hizmet adını yazın.", "İşlem tarihini ve yaklaşık saati belirtin.", "Tutarı ve para birimini ekleyin.", "Sorunu tek cümlede açıkça özetleyin."] },
      { title: "Ödeme desteği nasıl takip edilir?", paragraphs: ["Ödeme bildirimi aldıysanız banka hesabınızı kendi resmi uygulamanızdan kontrol edin. Bankalar arası transfer, bakım çalışması veya yoğunluk nedeniyle hareketin görünmesi gecikebilir. Ekran görüntüsünde ödeme yazması tek başına yeterli değildir; hesap hareketindeki gerçek kayıt esas alınmalıdır.", "Ödeme görünmüyorsa destek mesajında işlem saatini ve IBAN sahibinin adını belirtin. Tam kart bilgisi, internet bankacılığı şifresi veya SMS doğrulama kodu göndermeyin. İşlem kaydı kontrol edilerek uygun yönlendirme yapılır."], subsections: [{ title: "Dekont güvenliği", paragraphs: ["Dekont paylaşmanız gerekiyorsa TC kimlik numarası, adres, hesap bakiyesi veya ilgisiz hareketler gibi gereksiz kişisel bilgileri kapatın. Yalnız işlemi doğrulamaya yarayan alanlar görünür olmalıdır."] }] },
      { title: "Kod doğrulaması uzarsa ne yapılmalı?", paragraphs: ["Dijital kodlarda doğrulama süresi ürünün türüne, bölgesine ve servis yanıtına göre değişebilir. Aynı kodu tekrar tekrar farklı hesaplarda denemek veya başka kişilere göndermek sorunu büyütebilir. Mevcut resmi konuşmada bekleyen kontrolün durumunu sorun ve yeni işlem yapmadan yanıt bekleyin.", "Kodun yanlış bölgeye ait olduğu veya daha önce kullanıldığı anlaşılırsa satın alma kaydını saklayın. Satıcıya başvurmanız gerektiğinde sipariş numarası ve teslimat bilgisi önemlidir. Sky Bozum desteği işlem kaydı hakkında bilgi verebilir; ancak üçüncü taraf satıcının iade koşullarını değiştiremez." ] },
      { title: "İletişim kopması ve sahte yönlendirme", paragraphs: ["Konuşma kesilirse aynı WhatsApp hattından yeniden yazın. Başka bir numaranın sizi devraldığını söylemesi durumunda bozumcu.net iletişim sayfasındaki resmi numarayla karşılaştırma yapın. Resmi olmayan bir hesap sizden kodu veya doğrulama bilgisini isterse işlemi durdurun.", "Destek sürecinde hiçbir görevli banka şifresi, kart PIN’i, uygulama parolası veya tek kullanımlık SMS kodu istememelidir. Bu bilgileri isteyen kişi işlem kaydına ulaşmaya değil hesabınıza erişmeye çalışıyor olabilir."], bullets: ["Aynı resmi konuşmayı kullanın.", "Yeni numarayı siteden doğrulayın.", "Şifre ve doğrulama kodu paylaşmayın.", "Kodunuzu birden fazla kişiye göndermeyin."] },
      { title: "Sky Bozum işlem desteğine ulaşın", paragraphs: ["Destek talebinizin hızlı değerlendirilebilmesi için ürün, tutar, saat ve sorun özetini tek mesajda paylaşın. Konuşma geçmişini koruyun ve aynı işlemi farklı kanallarda çoğaltmayın. Bu yaklaşım hem güvenliği hem de çözüm hızını artırır.", "Devam eden veya tamamlanan işleminiz için Sky Bozum iletişim sayfasındaki resmi WhatsApp hattını kullanın. Mesajınıza ‘işlem desteği’ yazarak başlayın ve temel bilgileri ekleyin. Resmi kanal üzerinden kayıt kontrol edilerek size uygun yönlendirme sağlanır."] }
    ]
  },
  {
    slug: "sky-bozum-iletisim-rehberi",
    title: "Sky Bozum İletişim Rehberi",
    excerpt: "Sky Bozum resmi iletişim kanalları, güvenlik kontrolleri, hızlı mesaj hazırlığı ve işlem sonrası destek hakkında kapsamlı rehber.",
    category: "İletişim",
    readTime: "10 dk",
    sections: [
      { title: "Sky Bozum ile nasıl iletişim kurulur?", paragraphs: ["Sky Bozum ile iletişim kurmak için bozumcu.net üzerindeki resmi iletişim merkezini kullanabilirsiniz. Sayfada WhatsApp, telefon ve e-posta seçenekleri bulunur. Güncel oran, bozum talebi ve devam eden işlem desteği için en hızlı kanal genellikle WhatsApp’tır. Kurumsal veya ayrıntılı yazılı taleplerde e-posta tercih edilebilir.", "İletişim kanalını doğrudan siteden açmak, benzer isim kullanan sahte hesaplardan korunmanıza yardımcı olur. Telefon numarasını kaydetmeden önce sayfadaki numarayla eşleştirin. Sosyal medya yorumunda veya forum mesajında gördüğünüz bir numarayı resmi kabul etmeyin."], subsections: [{ title: "Resmi kanal kontrolü", paragraphs: ["Alan adının bozumcu.net olduğuna, bağlantının güvenli biçimde açıldığına ve WhatsApp numarasının sitedeki numarayla aynı olduğuna bakın. Şüphe durumunda işlemi başlatmadan önce iletişim sayfasını yeniden açın."] }] },
      { title: "Hangi konu için hangi kanal kullanılmalı?", paragraphs: ["Bozum talebi ve güncel oran bilgisi için WhatsApp üzerinden ürün ve tutar bilgisi göndermek en pratik yöntemdir. Devam eden işlem desteği de konuşma geçmişinin korunması amacıyla aynı WhatsApp görüşmesinden yürütülmelidir. Telefon görüşmesi gerekiyorsa resmi numara aranabilir; ancak oran ve ödeme gibi kritik ayrıntıların yazılı teyidi faydalıdır.", "E-posta, iş birliği, kurumsal talepler veya ayrıntılı belge gerektiren konular için kullanılabilir. E-posta içinde kart bilgisi, şifre veya doğrulama kodu bulunmamalıdır. Hangi kanal seçilirse seçilsin, hesabınıza giriş sağlayan verileri paylaşmamak temel kuraldır."], bullets: ["Oran ve bozum talebi: WhatsApp", "Devam eden işlem: Mevcut WhatsApp konuşması", "Kurumsal ve uzun talepler: E-posta", "Acil doğrulama: Resmi telefon numarası"] },
      { title: "Hızlı yanıt için mesaj hazırlığı", paragraphs: ["Destek ekibine yazmadan önce işlem türünü, toplam tutarı, ürünün para birimini ve ödeme yapılacak IBAN bilgisini hazırlayın. İlk mesajda kodu göndermek zorunda değilsiniz. Önce ürün uygunluğu ve güncel oran teyit edilmelidir. Açık bir mesaj, ek soru sayısını azaltır ve mobil ödeme bozdurma sürecini hızlandırır.", "Örneğin ‘Paycell ile alınmış 2.500 TL Razer Gold TL kodu için güncel oran almak istiyorum’ mesajı yeterli başlangıç bilgisini sunar. Birden fazla kod varsa adet ve değerleri de yazın. Kodların tamamını oran onayı gelmeden paylaşmayın."], subsections: [{ title: "Hazır mesaj örneği", paragraphs: ["Merhaba, [ürün/hizmet adı] için [tutar] tutarında bozum talebi oluşturmak istiyorum. Ürün [para birimi/bölge] bilgisindedir. Güncel oran ve uygunluk bilgisini paylaşabilir misiniz?"] }] },
      { title: "Güvenli iletişim kuralları", paragraphs: ["Sky Bozum işlem sürecinde banka şifresi, kart PIN’i, uygulama parolası veya tek kullanımlık doğrulama kodu istemez. Bu bilgiler hesabınıza erişim sağlar ve hiçbir bozum işlemi için gerekli değildir. Bir kişi resmi destek olduğunu söyleyerek bu verileri talep ederse konuşmayı sonlandırın.", "Dijital kodlar da nakit benzeri değere sahiptir. Kodun tamamını sosyal medya, yorum alanı, forum veya birden fazla mesaj hesabında paylaşmayın. Yalnız resmi kanalı doğruladıktan ve oranı kabul ettikten sonra gerekli bilgiyi iletin. Ekran görüntülerindeki kişisel bilgileri kapatın."], bullets: ["Şifre paylaşmayın.", "SMS doğrulama kodu paylaşmayın.", "Kart PIN’i paylaşmayın.", "Dijital kodu herkese açık alanda göstermeyin."] },
      { title: "Sahte Sky Bozum hesapları nasıl anlaşılır?", paragraphs: ["Sahte hesaplar marka adına benzeyen kullanıcı adları, farklı alan adları veya geçici telefon numaraları kullanabilir. Çok yüksek oran vaadi, hemen kod gönderme baskısı ve resmi olmayan ödeme bağlantısı önemli uyarı işaretleridir. Gerçek iletişim bilgilerini yalnız bozumcu.net üzerinden kontrol edin.", "Bir hesap size ulaştığında numarayı resmi iletişim sayfasındaki numarayla karşılaştırın. Profil resmi veya marka logosu tek başına doğrulama değildir; herkes aynı görseli kullanabilir. Şüphe varsa mevcut konuşmada hiçbir kod veya kişisel bilgi paylaşmadan resmi kanala kendiniz yazın." ] },
      { title: "İşlem sonrası iletişim ve kayıt", paragraphs: ["İşlem tamamlandıktan sonra konuşma ve ödeme kaydını bir süre saklayın. Bir sorun oluşursa işlem tarihi, saati, ürün ve tutar bilgisiyle aynı resmi kanaldan destek isteyin. Yeni bir konuşma açmak yerine mevcut kayıt üzerinden devam etmek incelemeyi kolaylaştırır.", "Ödeme bildirimi aldıktan sonra banka hareketini kendi uygulamanızdan doğrulayın. Dekont veya ekran görüntüsü paylaşmanız gerektiğinde gereksiz kişisel alanları kapatın. Sky Bozum iletişim merkezi, devam eden ve tamamlanan işlemler hakkında kontrollü destek almak için kullanılabilir." ] },
      { title: "Sky Bozum resmi iletişim merkezini kullanın", paragraphs: ["Mobil ödeme bozum, dijital kod bozdurma, güncel oran ve işlem desteği için resmi iletişim merkezi tek başlangıç noktasıdır. Doğru kanal seçimi, açık mesaj ve hassas bilgileri koruma alışkanlığı güvenli bozum sürecinin temelini oluşturur.", "Sky Bozum iletişim sayfasına giderek resmi WhatsApp butonunu açın. İşlem türünü ve tutarı paylaşın, güncel oranı yazılı olarak teyit edin ve yalnız onaydan sonra gerekli işlem bilgilerini gönderin. Böylece süreç daha hızlı, şeffaf ve kontrollü ilerler."] }
    ]
  },

];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
