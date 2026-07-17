export const siteConfig = {
  name: "Sky Bozum",
  domain: "bozumcu.net",
  phone: "0539 208 01 66",
  email: "sonerkayan17@gmail.com",
  whatsapp:
    "https://wa.me/905392080166?text=Merhaba%2C%20Sky%20Bozum%20%C3%BCzerinden%20g%C3%BCncel%20oran%20almak%20istiyorum.",
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
  sections: { title: string; paragraphs: string[]; bullets?: string[] }[];
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
    rate: "%60 – %70",
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
    rate: "%50",
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
    rate: "%45 – %50",
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
    rate: "%40 – %50",
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
    rate: "%60",
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
    rate: "%60",
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
    summary: "Vodafone mobil ödeme limitinizi uygun dijital ürün alımıyla değerlendirin.",
    logo: "/brands/vodafone/vodafone.svg",
    tone: "rose",
    rate: "%45 – %60",
    popular: true,
    highlights: ["Vodafone rehberi", "Limit kontrolü", "Razer Gold bozum"],
    steps: [
      { title: "Mobil ödemeyi kontrol edin", text: "Hattınızda mobil ödeme özelliği ve kullanılabilir limit bulunmalıdır." },
      { title: "Uygun Razer Gold alın", text: "Desteklenen mağaza ve ödeme yöntemini işlem öncesinde teyit edin." },
      { title: "Kodu bize satın", text: "Kullanılmamış kod için güncel oran alın." },
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
    rate: "%45 – %60",
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
    rate: "%45 – %60",
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
    rate: "%40 – %50",
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
    rate: "%60 – %70",
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
  serviceSlug?: string;
  sections: { title: string; paragraphs: string[]; bullets?: string[] }[];
};

export const articles: ArticleItem[] = [
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
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
