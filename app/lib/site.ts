import { getRateRange } from './rates';
import { featuredArticles } from './featuredArticles';
import { hepsipayArticles } from './hepsipayArticles';
import { v21ExtendedArticles } from './v21ExtendedArticles';

export { siteConfig } from './site-config';

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
    name: "Paycell Bozdur: Razer Gold ve Dijital Kod Rehberi",
    shortName: "Paycell",
    category: "Mobil Ödeme",
    description: "Paycell bozdur aramasından gelenler için Razer Gold ve desteklenen dijital ürün satın alma rehberi.",
    summary: "Sky Bozum Paycell bakiyesini doğrudan nakde çevirmez. Bu rehber, Paycell kartla güvenli biçimde Razer Gold veya desteklenen başka bir dijital kod satın alma adımlarını açıklar. Aldığınız kullanılmamış kodu hesabınızda kullanabilir veya stok ve uygunluk onayından sonra Sky Bozum'a satabilirsiniz.",
    logo: "/brands/paycell/paycell.svg",
    tone: "orange",
    rate: getRateRange("paycell"),
    popular: true,
    highlights: ["Detaylı satın alma rehberi", "Mağaza ve bölge kontrolü", "Bağımsız güvenlik bilgisi"],
    steps: [
      { title: "Paycell kartınızı kontrol edin", text: "Kartınızın internet alışverişine açık ve bakiyesinin yeterli olduğundan emin olun." },
      { title: "Razer Gold satın alın", text: "Hepsiburada, Trendyol veya ByNoGame üzerindeki uygun Razer Gold ürününü seçin." },
      { title: "Kodu kullanın veya satışını yapın", text: "Kodu hesabınıza yükleyebilir veya stok ve uygunluk onayından sonra Sky Bozum'a satabilirsiniz." },
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
        title: "Paycell ile alınan Razer Gold kodu nasıl değerlendirilir?",
        paragraphs: [
          "Teslim aldığınız kodu kullanmadan önce Sky Bozum'dan güncel oran alın. Oranı kabul ettiğinizde kod doğrulama için iletilir ve uygun bulunması halinde ödeme süreci tamamlanır.",
        ],
      },
      {
        title: "Paycell bozdur veya Paycell nakite çevirme aramasında ne yapılır?",
        paragraphs: [
          "Sky Bozum Paycell bakiyesini veya Paycell hesabındaki parayı doğrudan nakde çevirmez. Bu sayfa, Paycell kartla desteklenen bir mağazadan Razer Gold gibi dijital kodların nasıl güvenli biçimde alınacağını adım adım gösterir. Satın aldığınız kullanılmamış kodu kendi hesabınızda kullanabilir veya kodun türü, bölgesi ve stok durumu onaylandıktan sonra Sky Bozum'a satabilirsiniz.",
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
    name: "Pokus Bozdur: Razer Gold ve Dijital Ürün Rehberi",
    shortName: "Pokus",
    category: "Mobil Ödeme",
    description: "Pokus bozdur aramasından gelenler için Razer Gold ve desteklenen dijital ürün satın alma rehberi.",
    summary: "Sky Bozum Pokus bakiyesini doğrudan nakde çevirmez. Bu rehber, Pokus kartla güvenli biçimde Razer Gold kodu satın alma adımlarını açıklar. Aldığınız kullanılmamış kodu hesabınızda kullanabilir veya stok ve uygunluk onayından sonra Sky Bozum'a satabilirsiniz.",
    logo: "/brands/pokus/pokus.svg",
    tone: "violet",
    rate: getRateRange("pokus"),
    popular: true,
    highlights: ["Pokus kart rehberi", "Razer Gold işlemleri", "Canlı destek"],
    steps: [
      { title: "Kart ayarlarını kontrol edin", text: "Pokus kartın internet alışverişine açık olduğundan emin olun." },
      { title: "Uygun ürünü seçin", text: "Desteklenen mağazadan Razer Gold ürününü seçin." },
      { title: "Kodu kullanın veya satışını yapın", text: "Kodu hesabınıza yükleyebilir veya stok ve uygunluk onayından sonra Sky Bozum'a satabilirsiniz." },
    ],
    sections: [
      { title: "Pokus nedir?", paragraphs: ["Pokus, kart ve dijital ödeme işlemlerinin yönetilebildiği bir finansal teknoloji uygulamasıdır. Kart bilgileri desteklenen e-ticaret sitelerinde kullanılabilir."] },
      { title: "Pokus ile Razer Gold nasıl alınır?", paragraphs: ["Kartla ödeme kabul eden uygun dijital ürün mağazasında Razer Gold ürünü seçilir. Satıcı, teslimat ve ürün bölgesi kontrol edildikten sonra Pokus kart bilgileriyle ödeme yapılır."] },
      { title: "Pokus bozdur veya Pokus nakite çevirme aramasında ne yapılır?", paragraphs: ["Sky Bozum Pokus bakiyesini veya Pokus hesabındaki parayı doğrudan nakde çevirmez. Bu sayfa, Pokus kartla desteklenen bir mağazadan Razer Gold kodunun nasıl güvenli biçimde alınacağını gösterir. Satın aldığınız kullanılmamış kodu kendi hesabınızda kullanabilir veya kodun bölgesi ve stok durumu onaylandıktan sonra Sky Bozum'a satabilirsiniz."] },
    ],
    faq: commonFaq,
  },
  {
    slug: "vodafone-mobil-odeme",
    name: "Vodafone Mobil Ödeme Bozdur: Dijital Kod Rehberi",
    shortName: "Vodafone",
    category: "Mobil Ödeme",
    description: "Vodafone mobil ödeme bozdur ve Vodafone Pay nakite çevirme aramalarına yönelik bağımsız dijital kod rehberi.",
    summary: "Sky Bozum Vodafone mobil ödeme limitini veya Vodafone Pay bakiyesini doğrudan nakde çevirmez. Bu rehber, Vodafone ile güvenli biçimde Razer Gold veya desteklenen başka bir dijital kod satın alma adımlarını açıklar. Aldığınız kullanılmamış kodu hesabınızda kullanabilir veya stok ve uygunluk onayından sonra Sky Bozum'a satabilirsiniz.",
    logo: "/brands/vodafone/vodafone.svg",
    tone: "rose",
    rate: getRateRange("vodafone-mobil-odeme"),
    popular: true,
    highlights: ["Vodafone satın alma rotası", "Limit ve hat kontrolü", "Mağaza uygunluğu", "Bağımsız güvenlik rehberi"],
    steps: [
      { title: "Hat ve limiti kontrol edin", text: "Mobil ödeme özelliğinin açık, hattın uygun ve kullanılabilir limitin yeterli olduğunu doğrulayın." },
      { title: "Mağaza ve ürünü doğrulayın", text: "Tutar, ürün, bölge ve teslimat koşullarını satıcı sayfasında kontrol edin." },
      { title: "Uygun dijital ürünü alın", text: "Desteklenen mağazada Vodafone mobil ödeme seçeneği varsa satın alma adımlarını tamamlayın." },
      { title: "Kodu güvenli saklayın", text: "Kodu hesabınızda kullanana veya seçtiğiniz alıcıya teslim edene kadar üçüncü kişilerle paylaşmayın." },
    ],
    sections: [
      { title: "Vodafone mobil ödeme nedir?", paragraphs: ["Vodafone mobil ödeme, desteklenen dijital alışverişlerin telefon faturasına veya hattın ödeme yöntemine yansıtılmasını sağlayan bir hizmettir."] },
      { title: "Vodafone mobil ödeme limiti nasıl kontrol edilir?", paragraphs: ["Kullanılabilir limit ve hizmet durumu Vodafone uygulaması veya operatör kanalları üzerinden kontrol edilmelidir. Limitler kullanıcıya göre değişebilir."] },
      { title: "Vodafone ile Razer Gold nasıl alınır?", paragraphs: ["Vodafone mobil ödeme kabul eden desteklenen bir mağazada ürün bölgesi, tutarı, satıcısı ve dijital teslimat koşulları kontrol edilir. Satın alınan kod kişisel hesapta kullanılabilir veya kullanıcı tarafından seçilen bağımsız bir alıcıyla değerlendirilebilir."] },
      { title: "Vodafone mobil ödeme bozdur veya Vodafone Pay nakite çevirme aramasında ne yapılır?", paragraphs: ["Sky Bozum Vodafone mobil ödeme limitini veya Vodafone Pay bakiyesini doğrudan nakde çevirmez. Bu sayfa, Vodafone ile desteklenen bir mağazadan Razer Gold veya başka bir dijital kodun nasıl güvenli biçimde alınacağını gösterir. Satın aldığınız kullanılmamış kodu kendi hesabınızda kullanabilir veya ürün ve stok uygunluğu onaylandıktan sonra Sky Bozum'a satabilirsiniz."] },
    ],
    faq: commonFaq,
  },
  {
    slug: "turkcell-mobil-odeme",
    name: "Turkcell Mobil Ödeme Bozdur: Paycell ve Kod Rehberi",
    shortName: "Turkcell",
    category: "Mobil Ödeme",
    description: "Turkcell mobil ödeme bozdur ve Paycell nakite çevirme aramalarına yönelik bağımsız dijital kod rehberi.",
    summary: "Sky Bozum Turkcell mobil ödeme limitini veya Paycell bakiyesini doğrudan nakde çevirmez. Bu rehber, Turkcell veya Paycell ile güvenli biçimde Razer Gold ve desteklenen dijital kodları satın alma adımlarını açıklar. Aldığınız kullanılmamış kodu hesabınızda kullanabilir veya stok ve uygunluk onayından sonra Sky Bozum'a satabilirsiniz.",
    logo: "/brands/turkcell/turkcell.svg",
    tone: "blue",
    rate: getRateRange("turkcell-mobil-odeme"),
    highlights: ["Turkcell limit rehberi", "Paycell kart", "Dijital kod satın alma"],
    steps: [
      { title: "Limitinizi kontrol edin", text: "Turkcell mobil ödeme veya Paycell kullanılabilir bakiyesini kontrol edin." },
      { title: "Uygun mağazayı seçin", text: "Hepsiburada, Trendyol veya ByNoGame üzerindeki uygun ürünü inceleyin." },
      { title: "Kodu kullanın veya satışını yapın", text: "Kodu hesabınıza yükleyebilir veya stok ve uygunluk onayından sonra Sky Bozum'a satabilirsiniz." },
    ],
    sections: [
      { title: "Turkcell mobil ödeme nedir?", paragraphs: ["Turkcell mobil ödeme, desteklenen alışverişlerde ücretin hat veya ilgili ödeme çözümü üzerinden karşılanmasına imkan tanır."] },
      { title: "Turkcell mobil ödeme ile Razer Gold nasıl alınır?", paragraphs: ["Uygun ödeme yöntemi ve mağaza belirlendikten sonra dijital Razer Gold ürünü alınabilir. Paycell kart kullanılan işlemlerde kart ayarları ve limitler kontrol edilmelidir."] },
      { title: "Turkcell ile alınan dijital kod nasıl kullanılır veya satılır?", paragraphs: ["Turkcell veya Paycell ile satın aldığınız kullanılmamış dijital kodu kendi hesabınıza yükleyebilirsiniz. Kodu satmak isterseniz önce ürün adı, tutar, para birimi ve bölge bilgisini Sky Bozum'a iletin; stok ve uygunluk onayı verildikten sonra kullanılmamış kodu doğrudan Sky Bozum'a satabilirsiniz."] },
      { title: "Turkcell mobil ödeme bozdur veya Paycell nakite çevirme aramasında ne yapılır?", paragraphs: ["Sky Bozum Turkcell mobil ödeme limitini veya Paycell bakiyesini doğrudan nakde çevirmez. Bu sayfa, Turkcell ya da Paycell ile desteklenen bir mağazadan Razer Gold gibi dijital kodların nasıl güvenli biçimde alınacağını gösterir. Satın aldığınız kullanılmamış kodu hesabınızda kullanabilir veya stok ve uygunluk onayından sonra Sky Bozum'a satabilirsiniz."] },
    ],
    faq: commonFaq,
  },
  {
    slug: "turk-telekom-mobil-odeme",
    name: "Türk Telekom Mobil Ödeme Bozdur: Pokus ve Kod Rehberi",
    shortName: "Türk Telekom",
    category: "Mobil Ödeme",
    description: "Türk Telekom mobil ödeme bozdur ve Pokus nakite çevirme aramalarına yönelik bağımsız dijital kod rehberi.",
    summary: "Sky Bozum Türk Telekom mobil ödeme limitini veya Pokus bakiyesini doğrudan nakde çevirmez. Bu rehber, Türk Telekom veya Pokus ile güvenli biçimde Razer Gold ve desteklenen dijital ürünleri satın alma adımlarını açıklar. Aldığınız kullanılmamış kodu hesabınızda kullanabilir veya stok ve uygunluk onayından sonra Sky Bozum'a satabilirsiniz.",
    logo: "/brands/turktelekom/turktelekom.svg",
    tone: "blue",
    rate: getRateRange("turk-telekom-mobil-odeme"),
    highlights: ["Türk Telekom rehberi", "Pokus kart", "Mağaza ve ürün kontrolü"],
    steps: [
      { title: "Hizmet durumunu kontrol edin", text: "Mobil ödeme özelliğini ve kullanılabilir limiti kontrol edin." },
      { title: "Razer Gold alın", text: "Uygun mağaza ve ürün için işlem öncesinde bilgi alın." },
      { title: "Kodu kullanın veya satışını yapın", text: "Kodu hesabınıza yükleyebilir veya stok ve uygunluk onayından sonra Sky Bozum'a satabilirsiniz." },
    ],
    sections: [
      { title: "Türk Telekom mobil ödeme nedir?", paragraphs: ["Türk Telekom mobil ödeme, desteklenen dijital hizmet ödemelerinin hat üzerinden yapılmasına imkan sağlayan bir yöntemdir."] },
      { title: "Pokus kart ile Razer Gold nasıl alınır?", paragraphs: ["Pokus kart internet alışverişine açık olduğunda, kartla ödeme kabul eden uygun mağazalarda Razer Gold ürünü satın alınabilir."] },
      { title: "Türk Telekom ile alınan dijital kod nasıl kullanılır veya satılır?", paragraphs: ["Türk Telekom veya Pokus ile satın aldığınız kullanılmamış Razer Gold kodunu kendi hesabınıza yükleyebilirsiniz. Kodu satmak isterseniz önce tutar, para birimi ve bölge bilgisini Sky Bozum'a iletin; stok ve uygunluk onayı verildikten sonra kullanılmamış kodu doğrudan Sky Bozum'a satabilirsiniz."] },
      { title: "Türk Telekom mobil ödeme bozdur veya Pokus nakite çevirme aramasında ne yapılır?", paragraphs: ["Sky Bozum Türk Telekom mobil ödeme limitini veya Pokus bakiyesini doğrudan nakde çevirmez. Bu sayfa, Türk Telekom ya da Pokus ile desteklenen bir mağazadan Razer Gold gibi dijital kodların nasıl güvenli biçimde alınacağını gösterir. Satın aldığınız kullanılmamış kodu hesabınızda kullanabilir veya stok ve uygunluk onayından sonra Sky Bozum'a satabilirsiniz."] },
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
  sources?: readonly { label: string; href: string; publisher: string }[];
  media?: readonly { src: string; alt: string; caption: string }[];
  faq?: readonly { question: string; answer: string }[];
  sections: { title: string; paragraphs: string[]; bullets?: string[]; subsections?: { title: string; paragraphs: string[] }[] }[];
};

export const articles: ArticleItem[] = [
  ...featuredArticles,
  ...hepsipayArticles,
  ...v21ExtendedArticles,
  {
    slug: "paycell-nedir-nasil-kullanilir",
    title: "Paycell Bozdur Rehberi: Kart, Bakiye ve Razer Gold Yöntemi",
    seoTitle: "Paycell Bozdur ve Nakite Çevirme | Dijital Kod Rehberi",
    metaDescription: "Paycell bozdur ve nakite çevirme aramalarında doğrudan bakiye alımı yerine Paycell kartla dijital kod satın alma, güvenlik ve değerlendirme sürecini öğrenin.",
    excerpt: "Paycell kart, uygulama bakiyesi ve Turkcell mobil ödeme limitinin birbirinden nasıl ayrıldığını öğrenin.",
    category: "Paycell",
    readTime: "8 dk",
    updatedAt: "2026-07-29",
    cover: "/images/bilgi-merkezi/editorial-covers-v46/dijital-kod-satin-alma-kontrolu.webp",
    coverAlt: "Dijital kod, bölge uyumu, satıcı güvenliği ve satın alma kontrollerini gösteren metalik rehber kapağı",
    serviceSlug: "paycell",
    keywords: ["paycell bozdur", "paycell nakite çevirme", "paycell bakiye bozum", "paycell nedir", "paycell nasıl kullanılır", "paycell kart", "paycell mobil ödeme", "paycell bakiye"],
    links: [
      { label: "Paycell hizmeti", href: "/hizmetler/paycell" },
      { label: "Turkcell mobil ödeme rehberi", href: "/bilgi-merkezi/turkcell-mobil-odeme-nasil-kullanilir" },
      { label: "Paycell ile Razer Gold alma", href: "/bilgi-merkezi/paycell-ile-razer-gold-nasil-alinir" },
    ],
    sections: [
      { title: "Paycell nedir?", paragraphs: ["Paycell; kart, uygulama bakiyesi ve desteklenen ödeme seçeneklerini tek uygulamada yönetmeye yardımcı olan bir finansal hizmettir. Paycell hesabındaki bakiye, Paycell kartın harcama limiti ve Turkcell hattına tanımlı mobil ödeme limiti aynı kaynak değildir.", "Bir işlemin telefon faturasına mı, kart bakiyesine mi yoksa uygulama içindeki başka bir ödeme kaynağına mı yansıyacağını ödeme ekranından kontrol etmek gerekir. Yalnız Paycell kullanıcısı olmak, her ödemenin mobil ödeme limitiyle yapılacağı anlamına gelmez."] },
      { title: "Paycell nasıl kullanılır?", paragraphs: ["Uygulama içinde hesap doğrulaması tamamlandıktan sonra kullanılabilir özellikler hesap durumuna göre gösterilir. Kartla alışveriş yapılacaksa kartın internet işlemlerine açık olması, yeterli bakiye veya limit bulunması ve ödeme ekranındaki tutarın kontrol edilmesi gerekir.", "Menü adları, kampanyalar ve limitler zamanla değişebileceği için güncel bilgiler Paycell'in resmi uygulaması ve destek kanallarından doğrulanmalıdır."], bullets: ["Ödeme kaynağını işlem öncesinde kontrol edin.", "Tek kullanımlık doğrulama kodlarını paylaşmayın.", "İşlem tamamlandıktan sonra hareketleri uygulamadan inceleyin."] },
      { title: "Paycell bakiyesiyle dijital ürün satın alınabilir mi?", paragraphs: ["Paycell bakiyesi ile Turkcell mobil ödeme limiti farklı kaynaklardır. Dijital ürün satın almadan önce hangi ödeme kaynağının kullanılacağını, mağazanın Paycell kartı kabul edip etmediğini ve ürünün bölge koşullarını kontrol etmek gerekir.", "Sky Bozum Paycell bakiyesini doğrudan nakde çevirmez. Bu rehber, Paycell kartla Razer Gold gibi dijital kodların güvenli biçimde nasıl alınacağını açıklar. Satın aldığınız kullanılmamış kodu hesabınızda kullanabilir veya stok ve uygunluk onayından sonra Sky Bozum'a satabilirsiniz."] },
    ],
  },
  {
    slug: "paycell-ile-razer-gold-nasil-alinir",
    title: "Paycell ile Razer Gold Nasıl Alınır? Güvenli Satın Alma Kontrolü",
    seoTitle: "Paycell ile Razer Gold Nasıl Alınır? Adım Adım Rehber",
    metaDescription: "Paycell kart veya uygun ödeme kaynağıyla Razer Gold alırken mağaza, bölge, para birimi, teslimat ve güvenlik koşullarını nasıl kontrol edeceğinizi öğrenin.",
    excerpt: "Paycell ile Razer Gold alırken ödeme kaynağı, mağaza, bölge ve kod teslimatını doğru kontrol edin.",
    category: "Paycell",
    readTime: "7 dk",
    updatedAt: "2026-07-29",
    serviceSlug: "paycell",
    keywords: ["paycell ile razer gold", "paycell razer gold alma", "razer gold bozdur", "razer gold kodu"],
    links: [
      { label: "Paycell nedir?", href: "/bilgi-merkezi/paycell-nedir-nasil-kullanilir" },
      { label: "Razer Gold nedir?", href: "/bilgi-merkezi/razer-gold-nedir" },
      { label: "Razer Gold hizmeti", href: "/hizmetler/razer-gold-tl" },
    ],
    sections: [
      { title: "Paycell ile Razer Gold alınabilir mi?", paragraphs: ["Paycell kartın veya ödeme ekranında sunulan uygun Paycell kaynağının kabul edildiği bir mağazada Razer Gold satın alınabilir. Kullanılabilir seçenekler mağazaya, hesap durumuna ve güncel ödeme koşullarına göre değişebilir.", "Paycell kart bakiyesi ile Turkcell mobil ödeme limiti aynı şey değildir. Ödeme öncesinde hangi kaynağın kullanılacağını ve toplam tutarın hangi hesaptan düşeceğini açıkça kontrol edin."] },
      { title: "Satın almadan önce hangi bilgiler kontrol edilmeli?", paragraphs: ["Ürün adının Razer Gold olduğundan, kodun para biriminden ve bölgesinden emin olun. TL ve USD ürünleri birbirinin yerine geçmeyebilir; global olarak sunulan ürünlerin de desteklediği ülkeler farklı olabilir.", "Razer Gold bozdur amacıyla kod alınacaksa ürünü satın almadan önce tutar, bölge ve teslim biçiminin kabul edildiğini yazılı olarak teyit edin."], bullets: ["Satıcının güncel değerlendirmelerini kontrol edin.", "Ürün bölgesi ve para birimini okuyun.", "Kodun kullanılmamış ve okunabilir biçimde teslim edileceğini doğrulayın.", "Güncel oranı satın alma öncesinde öğrenin."] },
      { title: "Kod teslim edildikten sonra ne yapılmalı?", paragraphs: ["Sipariş kaydını saklayın ve kodu kişisel Razer hesabınıza yüklemeyin. Hesaba tanımlanan bakiye çoğu durumda tekrar kullanılmamış koda dönüştürülemez.", "Kod değerlendirme işleminde yalnız resmi iletişim kanalını kullanın. Kodu açık yorum alanlarında paylaşmayın ve ödeme yapıldığı söylendiğinde yalnız dekonta değil, banka hesabınızdaki gerçek harekete bakın."] },
    ],
  },
  {
    slug: "vodafone-mobil-odeme-nedir",
    title: "Vodafone Mobil Ödeme Bozdur: Limit ve Dijital Kod Rehberi",
    seoTitle: "Vodafone Mobil Ödeme Bozdur | Dijital Kod Rehberi",
    metaDescription: "Vodafone mobil ödeme bozdur aramasında doğrudan bakiye alımı yerine mobil ödemeyle dijital kod satın alma, limit, onay ve güvenlik sürecini öğrenin.",
    excerpt: "Vodafone mobil ödeme limitini, onay sürecini ve bakiye değerlendirme öncesindeki güvenlik kontrollerini öğrenin.",
    category: "Vodafone",
    readTime: "7 dk",
    updatedAt: "2026-07-29",
    serviceSlug: "vodafone-mobil-odeme",
    keywords: ["vodafone mobil ödeme bozdur", "vodafone mobil ödeme bozdurma", "vodafone mobil ödeme bozum", "vodafone pay nakite çevirme", "vodafone mobil ödeme", "vodafone dijital ürün satın alma", "vodafone mobil ödeme limiti", "vodafone ile dijital kod alma"],
    links: [
      { label: "Vodafone mobil ödeme hizmeti", href: "/hizmetler/vodafone-mobil-odeme" },
      { label: "Mobil ödeme nasıl açılır?", href: "/bilgi-merkezi/mobil-odeme-nasil-acilir" },
      { label: "Mobil ödeme güvenli mi?", href: "/bilgi-merkezi/mobil-odeme-guvenli-mi" },
    ],
    sections: [
      { title: "Vodafone mobil ödeme nedir?", paragraphs: ["Vodafone mobil ödeme, desteklenen dijital ürün ve hizmet bedellerinin telefon hattı üzerinden onaylanmasını sağlayan bir ödeme yöntemidir. Faturalı hatlarda tutar faturaya yansıyabilir; faturasız hatlarda ise uygun işlemler mevcut bakiyeden düşebilir.", "Mobil ödemenin açık olması her mağazada ve her tutarda işlem yapılabileceği anlamına gelmez. Hat durumu, kullanılabilir limit, ürün kategorisi ve güvenlik kontrolleri sonucu etkiler."] },
      { title: "Limit ve onay süreci nasıl çalışır?", paragraphs: ["İşlem sırasında operatör hattın mobil ödemeye açık olup olmadığını ve yeterli kullanılabilir limit bulunup bulunmadığını kontrol eder. Ardından hizmet adı ve toplam tutar gösterilerek kullanıcı onayı alınır.", "Onay mesajındaki firma, ürün veya tutar beklediğiniz işlemle uyuşmuyorsa devam etmeyin. Güncel limit ve hizmet durumu Vodafone'un resmi uygulaması veya müşteri hizmetlerinden doğrulanmalıdır."], bullets: ["Kullanılabilir limiti işlemden önce kontrol edin.", "Toplam tutarı ve varsa hizmet bedelini okuyun.", "Doğrulama kodunu yalnız ilgili ödeme ekranında kullanın."] },
      { title: "Vodafone ile dijital ürün satın alırken nelere dikkat edilmeli?", paragraphs: ["Ürün türü, bölge, para birimi, toplam tutar ve teslimat biçimi satın alma öncesinde kontrol edilmelidir. Onay mesajındaki hizmet adı veya tutar beklediğiniz işlemle uyuşmuyorsa devam etmeyin.", "Sky Bozum Vodafone mobil ödeme limitini veya Vodafone Pay bakiyesini doğrudan nakde çevirmez. Bu rehber, Vodafone ile Razer Gold gibi dijital kodların güvenli biçimde nasıl alınacağını açıklar. Satın aldığınız kullanılmamış kodu hesabınızda kullanabilir veya stok ve uygunluk onayından sonra Sky Bozum'a satabilirsiniz."] },
    ],
  },
  {
    slug: "turkcell-mobil-odeme-nasil-kullanilir",
    title: "Turkcell Mobil Ödeme Bozdur: Paycell, Limit ve Kod Rehberi",
    seoTitle: "Turkcell Mobil Ödeme Bozdur | Paycell Kod Rehberi",
    metaDescription: "Turkcell mobil ödeme bozdur aramasında doğrudan bakiye alımı yerine Paycell veya uygun ödeme yöntemiyle dijital kod satın alma sürecini öğrenin.",
    excerpt: "Turkcell mobil ödeme limiti ile Paycell kart ve uygulama bakiyesi arasındaki farkları net biçimde öğrenin.",
    category: "Turkcell",
    readTime: "7 dk",
    updatedAt: "2026-07-29",
    serviceSlug: "turkcell-mobil-odeme",
    keywords: ["turkcell mobil ödeme bozdur", "turkcell mobil ödeme bozdurma", "turkcell mobil bozum", "paycell nakite çevirme", "turkcell mobil ödeme", "turkcell dijital kod satın alma", "paycell mobil ödeme", "turkcell mobil ödeme limiti"],
    links: [
      { label: "Turkcell mobil ödeme hizmeti", href: "/hizmetler/turkcell-mobil-odeme" },
      { label: "Paycell nedir?", href: "/bilgi-merkezi/paycell-nedir-nasil-kullanilir" },
      { label: "Mobil ödeme limiti", href: "/bilgi-merkezi/mobil-odeme-limiti-nasil-ogrenilir" },
    ],
    sections: [
      { title: "Turkcell mobil ödeme nasıl çalışır?", paragraphs: ["Turkcell mobil ödeme, desteklenen dijital ürün veya hizmetlerin telefon hattı üzerinden onaylanmasına imkân verir. İşlem sırasında hat durumu, kullanılabilir limit ve ürün kategorisi kontrol edilir; ardından tutar kullanıcı onayıyla faturaya veya uygun bakiyeye yansır.", "Mobil ödeme özelliğinin açık olması, her işlem için yeterli limit bulunduğu anlamına gelmez. Kullanılabilir limit, hat geçmişi ve güvenlik değerlendirmeleri sonucu etkileyebilir."] },
      { title: "Paycell ile Turkcell mobil ödeme aynı mı?", paragraphs: ["Hayır. Paycell kart, Paycell uygulama bakiyesi ve Turkcell hattına tanımlanan mobil ödeme limiti farklı ödeme kaynaklarıdır. Satın alma ekranında hangisinin seçildiğini kontrol etmek gerekir.", "Bir Paycell kart işleminin telefon faturasına yansıyacağı varsayılmamalıdır. İşlem hareketi ve kullanılan kaynak uygulama içindeki güncel kayıtlardan doğrulanmalıdır."] },
      { title: "Turkcell ile dijital kod satın alırken güvenlik", paragraphs: ["Dijital kod alınacaksa ürünün türü, tutarı, para birimi, bölgesi ve teslimat biçimi satın alma öncesinde kontrol edilmelidir. Onay ekranında mağaza ve toplam tutar açıkça okunmalıdır.", "Sky Bozum Turkcell mobil ödeme limitini veya Paycell bakiyesini doğrudan nakde çevirmez. Bu rehber Turkcell ya da Paycell ile Razer Gold gibi dijital kodların nasıl alınacağını gösterir. Satın aldığınız kullanılmamış kodu hesabınızda kullanabilir veya stok ve uygunluk onayından sonra Sky Bozum'a satabilirsiniz. Şifre, ekran paylaşımı veya uzaktan erişim isteyen kişilerle işlem yapmayın."] },
    ],
  },
  {
    slug: "turk-telekom-mobil-odeme-rehberi",
    title: "Türk Telekom Mobil Ödeme Bozdur: Pokus ve Kod Rehberi",
    seoTitle: "Türk Telekom Mobil Ödeme Bozdur | Pokus Rehberi",
    metaDescription: "Türk Telekom mobil ödeme bozdur aramasında doğrudan bakiye alımı yerine Pokus veya uygun ödeme yöntemiyle dijital ürün satın alma sürecini öğrenin.",
    excerpt: "Türk Telekom mobil ödeme limiti, Pokus kart ve dijital ürün işlemleri arasındaki farkları öğrenin.",
    category: "Türk Telekom",
    readTime: "7 dk",
    updatedAt: "2026-07-29",
    serviceSlug: "turk-telekom-mobil-odeme",
    keywords: ["türk telekom mobil ödeme bozdur", "türk telekom mobil ödeme bozdurma", "pokus bozdur", "pokus nakite çevirme", "türk telekom mobil ödeme", "türk telekom dijital ürün alım rehberi", "pokus", "mobil ödeme limiti"],
    links: [
      { label: "Türk Telekom mobil ödeme hizmeti", href: "/hizmetler/turk-telekom-mobil-odeme" },
      { label: "Pokus ve Razer Gold rehberi", href: "/bilgi-merkezi/pokus-nedir-razer-gold-nasil-alinir" },
      { label: "Mobil ödeme nasıl açılır?", href: "/bilgi-merkezi/mobil-odeme-nasil-acilir" },
    ],
    sections: [
      { title: "Türk Telekom mobil ödeme nedir?", paragraphs: ["Türk Telekom mobil ödeme, desteklenen dijital ürün ve hizmet bedellerinin telefon hattı üzerinden onaylanmasını sağlayan bir ödeme yöntemidir. Kullanılabilir seçenekler faturalı veya faturasız hat durumuna, limite ve ürün kategorisine göre değişebilir.", "Güncel aktivasyon ve limit bilgisi yalnız operatörün resmi uygulaması, çevrim içi işlem kanalı veya müşteri hizmetlerinden doğrulanmalıdır."] },
      { title: "Pokus ile mobil ödeme limiti arasındaki fark", paragraphs: ["Pokus kart veya cüzdan bakiyesi, Türk Telekom hattına tanımlanan mobil ödeme limitinden farklı bir ödeme kaynağıdır. Bir işlemde hangi kaynağın kullanıldığını ödeme ekranından kontrol etmek gerekir.", "Pokus hesabında bakiye bulunması mobil ödeme limitinin kullanılabilir olduğu; mobil ödeme limitinin bulunması da Pokus kart bakiyesi olduğu anlamına gelmez."] },
      { title: "Türk Telekom ile dijital ürün nasıl satın alınır?", paragraphs: ["Dijital ürün alınacaksa ürünün türü, tutarı, bölgesi, mağazası ve teslim yöntemi satın alma öncesinde kontrol edilmelidir. İşlem sırasında onay mesajındaki hizmet adı ve tutar beklediğiniz bilgiyle eşleşmelidir.", "Sky Bozum Türk Telekom mobil ödeme limitini veya Pokus bakiyesini doğrudan nakde çevirmez. Bu rehber Türk Telekom ya da Pokus ile Razer Gold gibi dijital kodların nasıl alınacağını gösterir. Satın aldığınız kullanılmamış kodu hesabınızda kullanabilir veya stok ve uygunluk onayından sonra Sky Bozum'a satabilirsiniz. Beklenmeyen yönlendirme, ekran paylaşımı veya şifre talebi varsa işlemi durdurun."] },
    ],
  },
  {
    slug: "pokus-nedir-razer-gold-nasil-alinir",
    title: "Pokus Bozdur Rehberi: Razer Gold Nasıl Alınır?",
    seoTitle: "Pokus Bozdur ve Nakite Çevirme | Razer Gold Rehberi",
    metaDescription: "Pokus bozdur ve nakite çevirme aramalarında doğrudan bakiye alımı yerine Pokus kartla Razer Gold satın alma ve kod değerlendirme sürecini öğrenin.",
    excerpt: "Pokus kartın kullanımını ve Razer Gold satın alırken dikkat edilmesi gereken ödeme, bölge ve kod kontrollerini öğrenin.",
    category: "Pokus",
    readTime: "7 dk",
    updatedAt: "2026-07-29",
    serviceSlug: "pokus",
    keywords: ["pokus bozdur", "pokus nakite çevirme", "pokus mobil ödeme bozum", "pokus nedir", "pokus razer gold", "pokus ile razer gold", "razer gold bozdur"],
    links: [
      { label: "Pokus hizmeti", href: "/hizmetler/pokus" },
      { label: "Razer Gold nedir?", href: "/bilgi-merkezi/razer-gold-nedir" },
      { label: "Razer Gold kodu nasıl satılır?", href: "/bilgi-merkezi/razer-gold-kodu-nasil-satilir" },
    ],
    sections: [
      { title: "Pokus nedir?", paragraphs: ["Pokus, uygun hesaplarda kart ve cüzdan özellikleri sunan bir ödeme hizmetidir. Pokus kart bakiyesi ile Türk Telekom hattına tanımlanan mobil ödeme limiti farklı kaynaklardır ve ödeme ekranında hangisinin kullanıldığı kontrol edilmelidir.", "Kullanılabilir özellikler, doğrulama seviyesi ve güncel hizmet koşullarına göre değişebilir. Kesin limit ve işlem bilgisi resmi uygulama üzerinden görülmelidir."] },
      { title: "Pokus ile Razer Gold nasıl alınır?", paragraphs: ["Pokus kartın internet alışverişine açık olduğu ve satıcının kartla ödemeyi kabul ettiği durumlarda uygun Razer Gold ürünü satın alınabilir. Ürünün TL veya yabancı para biriminde olması, bölgesi ve kod teslim yöntemi işlem öncesinde kontrol edilmelidir.", "Sky Bozum Pokus bakiyesini doğrudan nakde çevirmez. Satın aldığınız kullanılmamış Razer Gold kodunu kişisel hesabınızda kullanabilir veya kodun bölgesi ve stok durumu onaylandıktan sonra Sky Bozum'a satabilirsiniz."], bullets: ["Ödeme kaynağını doğrulayın.", "Ürün bölgesi ve para birimini okuyun.", "Satıcı ve teslimat bilgilerini kontrol edin.", "Onay ekranındaki tutarı ve hizmet adını okuyun."] },
      { title: "Güvenli kod işlemi için dikkat edilmesi gerekenler", paragraphs: ["Kodun tamamını yalnız işlem için doğruladığınız resmi iletişim kanalında paylaşın. Sosyal medya yorumları veya açık gruplar kod göndermek için güvenli değildir.", "Ödeme tamamlandığında dekont görüntüsünden önce banka hesabınızdaki gerçek hareketi kontrol edin. Hesap şifresi, kart PIN'i veya uzaktan erişim talep eden kişilerle devam etmeyin."] },
    ],
  },
  {
    slug: "razer-gold-nedir",
    title: "Razer Gold Nedir? Kod, PIN, Bölge ve Bozdurma Rehberi",
    seoTitle: "Razer Gold Nedir? Kod ve Razer Gold Bozdurma Rehberi",
    metaDescription: "Razer Gold kodu ve PIN'in ne olduğunu, TL ve USD ürün farklarını, bölge kontrolünü ve Razer Gold bozdur işlemindeki güvenlik adımlarını öğrenin.",
    excerpt: "Razer Gold kodu, PIN, TL–USD ve bölge farklarını; kullanılmamış kodun güvenli biçimde nasıl değerlendirildiğini öğrenin.",
    category: "Razer Gold",
    readTime: "8 dk",
    updatedAt: "2026-07-29",
    serviceSlug: "razer-gold-tl",
    keywords: ["razer gold nedir", "razer gold bozdur", "razer gold bozdurma", "razer gold kodu", "razer gold pin"],
    links: [
      { label: "Razer Gold TL hizmeti", href: "/hizmetler/razer-gold-tl" },
      { label: "Razer Gold kodu nasıl satılır?", href: "/bilgi-merkezi/razer-gold-kodu-nasil-satilir" },
      { label: "Dijital kod bölge hatası", href: "/bilgi-merkezi/dijital-kod-bolge-hatasi-nedir" },
    ],
    sections: [
      { title: "Razer Gold nedir?", paragraphs: ["Razer Gold, desteklenen oyun ve dijital içeriklerde ödeme yapmak için kullanılan bir dijital kredi sistemidir. Satın alınan ürün çoğunlukla kullanılmamış kod veya PIN olarak teslim edilir ve uygun hesaba tanımlandığında bakiye hâline gelir.", "Kodun nominal tutarı nakit para değildir. Kullanım alanı, bölge, para birimi ve Razer'ın güncel hizmet koşullarıyla sınırlıdır."] },
      { title: "Razer Gold kodu ile PIN aynı şey mi?", paragraphs: ["Mağazalar ürün bilgisini kod, PIN veya voucher gibi farklı adlarla gösterebilir. Önemli olan ürünün kullanılmamış olması, doğru para birimi ve bölgede düzenlenmesi ve teslim edilen karakterlerin eksiksiz olmasıdır.", "Kod kişisel hesaba yüklendiğinde artık kullanılmamış kod olarak değerlendirilemez. Razer Gold bozdurma düşünülüyorsa kodu kullanmadan önce uygunluk teyidi alınmalıdır."] },
      { title: "TL, USD ve bölge farkı neden önemlidir?", paragraphs: ["Razer Gold TL ve USD ürünleri farklı para birimleriyle sunulur ve her hesapta aynı biçimde kullanılamayabilir. Ürün sayfasındaki bölge ve para birimi bilgisi satın alma öncesinde okunmalıdır.", "Global ifadesi her ülkenin desteklendiği anlamına gelmeyebilir. Kodun kullanılacağı veya değerlendirileceği kanalın kabul ettiği bölgeyi ayrıca doğrulayın."] },
      { title: "Razer Gold bozdur işlemi nasıl ilerler?", paragraphs: ["Önce kodun tutarı, para birimi ve bölgesi paylaşılır; güncel uygunluk ve oran teyit edilir. Yalnız onaylanan kullanılmamış kod güvenli iletişim kanalı üzerinden iletilir ve doğrulama sonrasında ödeme süreci tamamlanır.", "Gerçekçi olmayan yüksek oran, farklı numaraya yönlendirme, hesap şifresi veya uzaktan erişim talebi önemli risk işaretleridir. Güvenilir işlem açık adımlar ve yazılı tutar bilgisiyle yürütülmelidir."] },
    ],
  },
  {
    slug: "razer-gold-kodu-nasil-satilir",
    title: "Razer Gold Kodu Nasıl Satılır? Güvenli Bozdurma Adımları",
    seoTitle: "Razer Gold Kodu Nasıl Satılır? Razer Gold Bozdur Rehberi",
    metaDescription: "Razer Gold bozdur işleminde kullanılmamış kod, tutar, TL veya USD bölgesi, güncel oran, doğrulama ve ödeme adımlarını öğrenin.",
    excerpt: "Razer Gold kodunu satmadan önce tutar, para birimi, bölge, güncel oran ve güvenlik adımlarını kontrol edin.",
    category: "Razer Gold",
    readTime: "7 dk",
    updatedAt: "2026-07-29",
    serviceSlug: "razer-gold-tl",
    keywords: ["razer gold kodu nasıl satılır", "razer gold bozdur", "razer gold bozdurma", "razer gold kod satışı"],
    links: [
      { label: "Razer Gold nedir?", href: "/bilgi-merkezi/razer-gold-nedir" },
      { label: "Razer Gold TL hizmeti", href: "/hizmetler/razer-gold-tl" },
      { label: "Dijital kod güvenlik rehberi", href: "/bilgi-merkezi/dijital-kod-satin-almadan-once-kontrol-listesi" },
    ],
    sections: [
      { title: "Razer Gold kodu satılmadan önce ne kontrol edilmeli?", paragraphs: ["Kodun kullanılmamış, eksiksiz ve okunabilir olduğundan emin olun. Ürünün nominal tutarı, TL veya USD para birimi ve bölgesi işlem öncesinde doğru paylaşılmalıdır.", "Kod kişisel hesaba yüklenmişse artık kullanılmamış kod olarak gönderilemez. Satın alma belgesi ve sipariş bilgisi olası doğrulama sorunlarında saklanmalıdır."], bullets: ["Kod tutarını doğrulayın.", "Para birimi ve bölgeyi kontrol edin.", "Kodun daha önce kullanılmadığından emin olun.", "Güncel oran ve tahmini ödemeyi yazılı alın."] },
      { title: "Razer Gold bozdur süreci nasıl ilerler?", paragraphs: ["İlk adımda ürün bilgisi paylaşılır ve güncel uygunluk kontrol edilir. Oran kabul edildiğinde yalnız onaylanan kod resmi iletişim kanalı üzerinden gönderilir. Kod doğrulandıktan sonra ödeme bilgisi teyit edilerek süreç tamamlanır.", "Oranlar stok, talep, para birimi ve doğrulama koşullarına göre değişebilir. Bu nedenle eski ekran görüntüsü veya geçmiş işlem oranı güncel teklif olarak kabul edilmemelidir."] },
      { title: "Dolandırıcılık riskini nasıl azaltabilirsiniz?", paragraphs: ["İletişim numarasını doğrudan resmi siteden açın ve son anda farklı hesaba yönlendiren kişileri yeniden doğrulayın. Kodu açık gruplarda veya yorum alanlarında paylaşmayın.", "Ödeme yapıldığı söylendiğinde yalnız dekonta güvenmeyin; banka hesabındaki kullanılabilir bakiye ve işlem hareketini kontrol edin. Kart şifresi, hesap parolası veya uzaktan erişim talep edilmesi standart bir kod doğrulama adımı değildir."] },
    ],
  },
  {
    slug: "apple-gift-card-nedir",
    title: "Apple Gift Card Nedir? iTunes Bozum ve Bölge Rehberi",
    seoTitle: "Apple Gift Card Nedir? iTunes Bozum ve Kullanım Rehberi",
    metaDescription: "Apple Gift Card ve iTunes kodlarının kullanımını, hesap bölgesi kontrolünü, kullanılmamış kod ile yüklenmiş bakiye farkını ve güvenli bozum adımlarını öğrenin.",
    excerpt: "Apple Gift Card, iTunes kodu, hesap bölgesi ve kullanılmamış kod ayrımını; güvenli değerlendirme adımlarıyla birlikte öğrenin.",
    category: "Apple",
    readTime: "8 dk",
    updatedAt: "2026-07-29",
    serviceSlug: "itunes-apple",
    keywords: ["apple gift card nedir", "itunes bozum", "apple gift card bozdurma", "itunes kod bozdurma"],
    links: [
      { label: "Apple / iTunes hizmeti", href: "/hizmetler/itunes-apple" },
      { label: "Dijital kod rehberi", href: "/bilgi-merkezi/dijital-kod-hediye-karti-rehberi" },
      { label: "Dijital kod bölge hatası", href: "/bilgi-merkezi/dijital-kod-bolge-hatasi-nedir" },
    ],
    sections: [
      { title: "Apple Gift Card nedir?", paragraphs: ["Apple Gift Card, desteklenen Apple mağazalarında uygulama, oyun, abonelik ve dijital içerik satın almak için kullanılan bir hediye kartıdır. Eski kaynaklarda iTunes Gift Card veya App Store kodu ifadeleriyle karşılaşılabilir; ürün adı değişse de kullanım için hesap bölgesi ve kart koşulları belirleyicidir.", "Kartın nominal değeri nakit para değildir. Kod uygun Apple hesabına tanımlandığında hesap bakiyesine dönüşür ve yeniden kullanılmamış kod hâline getirilemez."] },
      { title: "Bölge ve hesap uyumu neden önemlidir?", paragraphs: ["Apple kodları ülke veya mağaza bölgesine bağlı olabilir. Kodun bölgesi ile Apple hesabının mağaza bölgesi uyuşmadığında etkinleştirme başarısız olabilir.", "Ürün açıklamasındaki ülke, para birimi ve kullanım şartlarını satın almadan önce kontrol edin. 'Global' ifadesini tek başına yeterli kabul etmeyin; desteklenen ülkeler satıcıya ve ürüne göre sınırlandırılabilir."], bullets: ["Kodun ülke ve para birimini doğrulayın.", "Apple hesabının mağaza bölgesini kontrol edin.", "Kodun daha önce kullanılmadığından emin olun."] },
      { title: "iTunes bozum ve Apple Gift Card bozdurma nasıl ilerler?", paragraphs: ["Değerlendirilebilen ürün, çoğunlukla kullanılmamış ve desteklenen bölgeye ait dijital koddur. Hesaba yüklenmiş Apple bakiyesi ile henüz kullanılmamış kod aynı değildir; yüklenmiş bakiye çoğu durumda yeniden koda çevrilemez.", "İşlemden önce kartın tutarı, bölgesi ve güncel uygunluğu yazılı olarak teyit edilmelidir. Kesin teklif alınmadan kodu kullanmayın veya üçüncü kişilerle paylaşmayın."] },
      { title: "Güvenlik kontrolü", paragraphs: ["Kodun tamamını yalnız resmi iletişim kanalını doğruladıktan ve işlem koşullarını kabul ettikten sonra paylaşın. Sosyal medya yorumları, açık gruplar ve taklit hesaplar dijital kod göndermek için güvenli değildir.", "Apple hesabı parolası, kart PIN'i veya tek kullanımlık doğrulama kodu bir bozum işlemi için gerekli değildir. Bu bilgileri isteyen kişilerle devam etmeyin."] },
    ],
  },
  {
    slug: "steam-cuzdan-kodu-nedir",
    title: "Steam Cüzdan Kodu Nedir? Bölge, Para Birimi ve Bozdurma Rehberi",
    seoTitle: "Steam Cüzdan Kodu Nedir? Steam Kodu Bozdurma Rehberi",
    metaDescription: "Steam Cüzdan Kodu ile hesaba yüklenmiş bakiye farkını, bölge ve para birimi kontrolünü ve kullanılmamış Steam kodu için güvenli işlem adımlarını öğrenin.",
    excerpt: "Steam kodu, hesap bakiyesi, bölge ve para birimi farklarını; kullanılmamış kodun güvenli değerlendirme adımlarıyla birlikte öğrenin.",
    category: "Steam",
    readTime: "8 dk",
    updatedAt: "2026-07-29",
    serviceSlug: "steam",
    keywords: ["steam cüzdan kodu nedir", "steam kodu bozdurma", "steam cüzdan kodu", "steam hediye kartı"],
    links: [
      { label: "Steam hizmeti", href: "/hizmetler/steam" },
      { label: "Dijital kod satın alma kontrolü", href: "/bilgi-merkezi/dijital-kod-satin-almadan-once-kontrol-listesi" },
      { label: "Dijital kod bölge hatası", href: "/bilgi-merkezi/dijital-kod-bolge-hatasi-nedir" },
    ],
    sections: [
      { title: "Steam Cüzdan Kodu nedir?", paragraphs: ["Steam Cüzdan Kodu, uygun Steam hesabına tanımlandığında mağaza bakiyesine dönüşen dijital bir üründür. Bu bakiye oyun, indirilebilir içerik ve Steam'in desteklediği diğer satın almalarda kullanılabilir.", "Kullanılmamış kod ile hesaba daha önce yüklenmiş Steam bakiyesi farklıdır. Kod hesaba tanımlandıktan sonra yeniden kullanılmamış koda çevrilemez."] },
      { title: "Bölge ve para birimi nasıl kontrol edilir?", paragraphs: ["Steam kodları belirli para birimi veya bölgeler için sunulabilir. Hesap mağazası, kodun para birimi ve ürün koşulları uyuşmadığında etkinleştirme engellenebilir veya farklı bir dönüşüm uygulanabilir.", "Satın almadan önce ürün sayfasındaki ülke, para birimi ve kullanım açıklamasını okuyun. Eski forum yorumlarını güncel kural olarak kabul etmeyin; platform koşulları değişebilir."], bullets: ["Kodun para birimini doğrulayın.", "Hesabın mağaza bölgesini kontrol edin.", "Teslim edilen ürünün siparişle aynı olduğunu karşılaştırın."] },
      { title: "Steam kodu bozdurma için hangi ürün uygundur?", paragraphs: ["İşlem değerlendirmesi çoğunlukla kullanılmamış, eksiksiz ve bölgesi açıkça belirtilmiş kod üzerinden yapılır. Hesaba yüklenmiş bakiye, envanter ürünü veya oyun hediyesi aynı işlem türü değildir.", "Kodu satın almadan ya da göndermeden önce güncel uygunluğu, oranı ve tahmini ödemeyi yazılı olarak teyit edin. Geçmiş bir işlem oranı yeni işlem için kesin teklif sayılmaz."] },
      { title: "Kod güvenliği", paragraphs: ["Steam kodunu açık forumlarda, yorum alanlarında veya birden fazla kişiye aynı anda göndermeyin. Kodu gören kişi kullanabileceği için tam kod yalnız doğrulanmış resmi kanalda paylaşılmalıdır.", "Steam hesap parolası, e-posta şifresi veya Steam Guard kodu istenmesi standart bir kod kontrolü değildir. Hesap erişimi talep eden kişilerle işlemi sonlandırın."] },
    ],
  },
  {
    slug: "sanal-kart-ile-razer-gold-alma",
    title: "Sanal Kart ile Razer Gold Nasıl Alınır? Güvenli Alışveriş Rehberi",
    seoTitle: "Sanal Kart ile Razer Gold Alma ve Güvenlik Rehberi",
    metaDescription: "Sanal kartla Razer Gold alırken kart limiti, internet alışverişi, 3D doğrulama, ürün bölgesi ve kullanılmamış kod kontrolünü adım adım öğrenin.",
    excerpt: "Sanal kart limiti, 3D doğrulama, satıcı güvenliği ve Razer Gold kod bölgesi için satın alma öncesi kontrol listesi.",
    category: "Kartlar",
    readTime: "8 dk",
    updatedAt: "2026-07-29",
    serviceSlug: "kredi-karti-sanal-kart",
    keywords: ["sanal kart ile razer gold alma", "sanal kart razer gold", "razer gold satın alma", "sanal kart güvenliği"],
    links: [
      { label: "Kart ve sanal kart hizmeti", href: "/hizmetler/kredi-karti-sanal-kart" },
      { label: "Razer Gold nedir?", href: "/bilgi-merkezi/razer-gold-nedir" },
      { label: "Razer Gold TL ve USD farkı", href: "/bilgi-merkezi/razer-gold-tl-ve-usd-farki" },
    ],
    sections: [
      { title: "Sanal kart satın alma öncesinde nasıl hazırlanır?", paragraphs: ["Sanal kart, ana karta bağlı olarak oluşturulan ve internet alışverişinde ayrı limit belirlemeye imkân veren kart bilgisidir. Alışverişten önce yalnız gerekli tutar kadar limit tanımlamak olası fazla çekim riskini azaltır.", "Kartın internet ve yurt dışı alışveriş ayarları, satıcının ödeme altyapısına göre gerekli olabilir. Bankanın resmi uygulamasındaki ayarları kontrol edin; kart bilgilerini mesaj yoluyla kimseye göndermeyin."] },
      { title: "Razer Gold ürününde hangi bilgiler kontrol edilmeli?", paragraphs: ["Ürünün Razer Gold TL veya USD olması, bölgesi, nominal tutarı ve teslimat yöntemi satın alma öncesinde okunmalıdır. Yalnız ürün görseline bakarak seçim yapmak yanlış para birimi veya bölge alınmasına yol açabilir.", "Bozdurma amacı varsa güncel ürün uygunluğunu ve oranı satın almadan önce teyit edin. Kod teslim edildikten sonra kişisel hesaba yüklemeyin."], bullets: ["TL veya USD bilgisini doğrulayın.", "Bölge ve tutarı kontrol edin.", "Satıcı ve teslimat koşullarını okuyun.", "Kesin uygunluk almadan satın alma yapmayın."] },
      { title: "Ödeme sırasında güvenlik", paragraphs: ["Ödeme sayfasının alan adını kontrol edin ve yalnız sizin başlattığınız işlem için gelen 3D Secure kodunu resmi ödeme ekranına girin. Doğrulama kodunu telefonla veya mesajla isteyen kişilere iletmeyin.", "İşlem tutarı beklediğinizden farklıysa onay vermeyin. Satın alma tamamlandıktan sonra sanal kart limitini sıfırlamak veya kartı kapatmak ek koruma sağlayabilir."] },
      { title: "Kod teslim edildiğinde", paragraphs: ["Kod geldiğinde ürün adı, tutar, para birimi ve bölgeyi sipariş özetiyle karşılaştırın. Uyuşmazlık varsa kodu kullanmadan satıcı desteğine başvurun.", "Kodu değerlendirecekseniz yalnız resmi iletişim kanalında ve önceden teyit edilen süreçte paylaşın. Sipariş belgesini ve teslimat kaydını olası kontrol için saklayın."] },
    ],
  },
  {
    slug: "mobil-odeme-bozum-nedir",
    title: "Mobil Ödeme Bozum Nedir? Mobil Ödeme Bozdurma Rehberi",
    seoTitle: "Mobil Ödeme Bozum Nedir? Güvenli Bozdurma Rehberi",
    metaDescription: "Mobil ödeme bozum ve mobil ödeme bozdurma sürecinin ne olduğunu, operatör limiti, dijital ürün, oran, güvenlik ve ödeme adımlarıyla öğrenin.",
    excerpt: "Operatör mobil ödeme limitinin uygun dijital ürün üzerinden değerlendirilmesini, oran ve güvenlik kontrolleriyle birlikte öğrenin.",
    category: "Mobil Ödeme",
    readTime: "9 dk",
    updatedAt: "2026-07-29",
    serviceSlug: "sms-mobil-odeme",
    keywords: ["mobil ödeme bozum", "mobil ödeme bozdur", "mobil ödeme bozdurma", "güvenilir mobil bozumcu"],
    links: [
      { label: "Mobil ödeme hizmeti", href: "/hizmetler/sms-mobil-odeme" },
      { label: "Mobil ödeme güvenli mi?", href: "/bilgi-merkezi/mobil-odeme-guvenli-mi" },
      { label: "Bozum talebi nasıl oluşturulur?", href: "/bilgi-merkezi/bozum-talebi-nasil-olusturulur" },
    ],
    sections: [
      { title: "Mobil ödeme bozum nedir?", paragraphs: ["Mobil ödeme bozum, operatör tarafından hatta tanımlanan kullanılabilir mobil ödeme limitiyle uygun bir dijital ürün satın alınması ve kullanılmamış ürünün güncel koşullarla değerlendirilmesi sürecidir. Bu işlem doğrudan telefon faturasındaki tutarın bankaya aktarılması anlamına gelmez.", "Operatör limiti, Paycell veya Pokus cüzdan bakiyesi ve banka kartı bakiyesi farklı ödeme kaynaklarıdır. İşlem öncesinde hangi kaynağın kullanılacağı açıkça belirlenmelidir."] },
      { title: "Mobil ödeme bozdurma süreci nasıl ilerler?", paragraphs: ["Önce operatör, kullanılabilir tutar ve uygun ürün bilgisi paylaşılır. Güncel oran ve ürün uygunluğu teyit edildikten sonra kullanıcı kendi hattından satın alma işlemini onaylar. Kullanılmamış dijital ürün doğrulandığında ödeme süreci tamamlanır.", "Ürün ve tutar onayı alınmadan yapılan satın alma, yanlış bölge veya desteklenmeyen ürün riski oluşturur. Bu nedenle önce bilgi almak, sonra işlem yapmak daha güvenlidir."], bullets: ["Operatör ve kullanılabilir limiti doğrulayın.", "Ürün türünü ve bölgesini önceden teyit edin.", "Güncel oranı yazılı alın.", "Ödeme bildirimi geldiğinde banka hareketini kontrol edin."] },
      { title: "Güvenilir mobil bozumcu nasıl seçilir?", paragraphs: ["Güvenilir bir süreçte iletişim bilgileri açık, oran ve tahmini ödeme işlemden önce yazılı, talep edilen bilgiler ise işlemle sınırlıdır. Gerçekçi olmayan yüksek oran, farklı numaraya yönlendirme ve hesap şifresi isteme önemli risk işaretleridir.", "Yalnız marka logosuna veya sosyal medya profil adına güvenmeyin. İletişim numarasını resmi alan adından açın ve kodu yalnız doğrulanan görüşmede paylaşın."] },
      { title: "Mobil ödeme bozumda paylaşılmaması gereken bilgiler", paragraphs: ["Operatör hesabı parolası, banka şifresi, kart PIN'i ve uzaktan erişim yetkisi mobil ödeme bozdurma için gerekli değildir. Tek kullanımlık SMS kodu yalnız kullanıcının kendi başlattığı ve tutarını gördüğü işlemin resmi onay ekranında kullanılmalıdır.", "Şüpheli bir istekle karşılaşırsanız işlemi durdurun ve operatörünüzün resmi kanalından hizmet durumunu kontrol edin."] },
    ],
  },
  {
    slug: "mobil-odeme-guvenli-mi",
    title: "Mobil Ödeme Güvenli mi? Riskler ve Kontrol Listesi",
    seoTitle: "Mobil Ödeme Güvenli mi? Bozum Güvenlik Rehberi",
    metaDescription: "Mobil ödeme ve mobil ödeme bozdurma sürecinde onay mesajı, satıcı, dijital ürün, kişisel bilgi ve resmi iletişim güvenliğini kontrol edin.",
    excerpt: "Mobil ödeme kullanırken tutar, onay mesajı, satıcı ve kişisel bilgi güvenliği açısından uygulanacak temel kontroller.",
    category: "Güvenlik",
    readTime: "9 dk",
    updatedAt: "2026-07-29",
    serviceSlug: "sms-mobil-odeme",
    keywords: ["mobil ödeme güvenli mi", "mobil ödeme bozdurma güvenli mi", "güvenilir mobil bozumcu", "mobil ödeme güvenliği"],
    links: [
      { label: "Mobil ödeme bozum nedir?", href: "/bilgi-merkezi/mobil-odeme-bozum-nedir" },
      { label: "Mobil bozumda dolandırıcılık riskleri", href: "/bilgi-merkezi/mobil-bozum-yaparken-dolandirilabilir-miyim" },
      { label: "Mobil ödeme hizmeti", href: "/hizmetler/sms-mobil-odeme" },
    ],
    sections: [
      { title: "Mobil ödeme hangi koşullarda daha güvenlidir?", paragraphs: ["Mobil ödeme; işlemi kendi hattınızdan, bildiğiniz bir hizmette ve tutarı açıkça görerek onayladığınızda kontrollü bir ödeme yöntemi olabilir. Güvenlik yalnız altyapıya değil, onay ekranının okunmasına ve işlem yapılan tarafın doğrulanmasına da bağlıdır.", "Onay mesajındaki hizmet adı veya tutar beklediğiniz işlemle uyuşmuyorsa devam etmeyin. Ne satın alındığını açıklamayan ya da acele ettiren yönlendirmeler güvenli kabul edilmemelidir."], bullets: ["Hizmet adı ve tutarı onaydan önce okuyun.", "Kullanılabilir limiti operatörün resmi kanalından kontrol edin.", "Yalnız kendi başlattığınız işlemi onaylayın."] },
      { title: "Mobil ödeme bozdurma sürecindeki başlıca riskler", paragraphs: ["Sahte destek hesapları, taklit ödeme sayfaları, yanlış tutarlı onay mesajları ve uygunluğu teyit edilmemiş dijital ürünler başlıca risklerdir. Tutarın telefon faturasına yansıması, karşı taraftaki sürecin kendiliğinden güvenilir olduğu anlamına gelmez.", "Kodu veya ürünü ödeme koşulları yazılı hâle gelmeden göndermek geri alınması zor bir kayıp oluşturabilir. İletişim numarasını resmi alan adından açın ve son anda değişen hesap bilgilerini yeniden doğrulayın."] },
      { title: "Hangi bilgiler paylaşılmamalı?", paragraphs: ["Operatör hesabı parolası, banka şifresi, kart PIN'i ve uzaktan erişim yetkisi mobil ödeme işlemi için gerekli değildir. Tek kullanımlık doğrulama kodu yalnız sizin başlattığınız ve tutarını gördüğünüz resmi işlem ekranında kullanılmalıdır.", "Ekran paylaşımı veya uzaktan erişim uygulaması kurma talebiyle karşılaşırsanız işlemi durdurun. Güvenilir hizmet, hesabınızın tamamına erişim istemeden ilerler."] },
      { title: "İşlem öncesi kısa kontrol listesi", paragraphs: ["Satın alınacak dijital ürünün türünü, tutarını, bölgesini ve teslimat biçimini önceden öğrenin. Güncel oran ve ürün uygunluğunu yazılı olarak teyit etmek yanlış satın alma riskini azaltır.", "Şüpheli bir durum oluşursa yeni deneme yapmayın; operatörün resmi destek kanalından mobil ödeme durumunu kontrol edin."], bullets: ["Resmi iletişim kanalını doğrulayın.", "Ürün ve bölge bilgisini teyit edin.", "Oran ve tahmini ödemeyi yazılı alın.", "Ödeme bildirimi sonrası banka hareketini kontrol edin."] },
    ],
  },
  {
    slug: "mobil-bozum-yaparken-dolandirilabilir-miyim",
    title: "Mobil Bozum Yaparken Dolandırılabilir miyim? Güvenlik Rehberi",
    seoTitle: "Mobil Bozum Dolandırıcılığı: Güvenilir Bozumcu Kontrolü",
    metaDescription: "Mobil ödeme bozum dolandırıcılığındaki kırmızı bayrakları, güvenilir mobil bozumcu kontrolünü, kod gönderme ve ödeme doğrulama adımlarını öğrenin.",
    excerpt: "Sahte hesap, gerçekçi olmayan oran, kodun erken gönderilmesi ve ödeme doğrulama risklerine karşı uygulanabilir güvenlik adımları.",
    category: "Güvenlik",
    readTime: "9 dk",
    updatedAt: "2026-07-29",
    serviceSlug: "sms-mobil-odeme",
    keywords: ["mobil bozum dolandırıcılığı", "güvenilir mobil bozumcu", "mobil ödeme bozdurma güvenli mi", "bozum dolandırıcılığı"],
    links: [
      { label: "Mobil ödeme güvenli mi?", href: "/bilgi-merkezi/mobil-odeme-guvenli-mi" },
      { label: "Mobil ödeme bozum nedir?", href: "/bilgi-merkezi/mobil-odeme-bozum-nedir" },
      { label: "Bozum talebi oluşturma", href: "/bilgi-merkezi/bozum-talebi-nasil-olusturulur" },
    ],
    sections: [
      { title: "Dolandırıcılık riski hangi aşamalarda oluşur?", paragraphs: ["Risk çoğunlukla kimliği belirsiz hesapla iletişim kurulması, gerçekçi olmayan oran teklifinin kabul edilmesi veya dijital kodun ödeme koşulları netleşmeden gönderilmesi aşamasında oluşur. Kullanılmış dijital kod geri alınamayabileceği için işlem sırası önemlidir.", "Yüksek oran tek başına güven göstergesi değildir. İletişim bilgilerinin tutarlı olması, ürünün açıkça tanımlanması ve tahmini ödemenin işlemden önce yazılı verilmesi gerekir."] },
      { title: "En önemli kırmızı bayraklar", paragraphs: ["Piyasanın belirgin biçimde üzerinde oran, hemen karar verme baskısı, son anda farklı numara veya IBAN'a yönlendirme ve işlemle ilgisiz doğrulama kodu talepleri önemli uyarılardır. Profil fotoğrafı veya marka logosu kimlik doğrulaması sayılmaz.", "Kart şifresi, operatör hesabı parolası, banka giriş bilgisi veya cihazınıza uzaktan erişim istenirse işlemi sonlandırın."], bullets: ["Numarayı resmi siteden açın.", "Kodu açık alanda paylaşmayın.", "Oran, ürün ve ödeme yöntemini yazılı teyit edin.", "Aşırı yüksek oran karşısında yeniden doğrulama yapın."] },
      { title: "Güvenilir mobil bozumcu nasıl kontrol edilir?", paragraphs: ["Alan adı, iletişim numarası ve kullanılan mesaj hesabı birbiriyle uyumlu olmalıdır. İşlemin adımları, hangi bilginin neden istendiği ve ödeme zamanı anlaşılır biçimde açıklanmalıdır.", "Taklit hesap riskini azaltmak için size gelen mesajdaki bağlantıya tıklamak yerine resmi siteyi kendiniz açın. Aynı marka adıyla açılmış farklı sosyal medya profillerini resmi kanal kabul etmeyin."] },
      { title: "Daha güvenli işlem sırası", paragraphs: ["Önce ürün ve tutarı paylaşın, güncel uygunluk ile oranı alın, yalnız onaylanan ürünü satın alın ve kodu doğrulanmış resmi konuşmada gönderin. Ödeme bildirildiğinde dekont görüntüsünden önce banka hesabındaki gerçek hareketi kontrol edin.", "Konuşma, sipariş ve ödeme kaydını bir süre saklayın. Sorun yaşanırsa tarih, tutar ve ürün bilgisiyle aynı resmi görüşme üzerinden destek isteyin."] },
    ],
  },
  {
    slug: "dijital-kod-bolge-hatasi-nedir",
    title: "Dijital Kod Bölge Hatası Nedir? Nasıl Önlenir?",
    seoTitle: "Dijital Kod Bölge Hatası: Apple, Steam ve Razer Gold",
    metaDescription: "Apple Gift Card, Steam ve Razer Gold kodlarında ülke, mağaza bölgesi ve para birimi uyuşmazlığının nedenlerini ve satın alma öncesi kontrolleri öğrenin.",
    excerpt: "Dijital kodlarda ülke, mağaza bölgesi ve para birimi uyuşmazlığını satın alma öncesinde fark etme rehberi.",
    category: "Dijital Kodlar",
    readTime: "8 dk",
    updatedAt: "2026-07-29",
    keywords: ["dijital kod bölge hatası", "apple gift card bölge hatası", "steam kod bölge hatası", "razer gold bölge"],
    links: [
      { label: "Apple Gift Card rehberi", href: "/bilgi-merkezi/apple-gift-card-nedir" },
      { label: "Steam Cüzdan Kodu rehberi", href: "/bilgi-merkezi/steam-cuzdan-kodu-nedir" },
      { label: "Razer Gold TL ve USD farkı", href: "/bilgi-merkezi/razer-gold-tl-ve-usd-farki" },
    ],
    sections: [
      { title: "Dijital kod bölge hatası ne anlama gelir?", paragraphs: ["Dijital kodlar belirli ülke, mağaza bölgesi veya para birimi için üretilebilir. Kod ile kullanılacağı hesabın bölgesi uyuşmadığında platform etkinleştirmeyi reddedebilir; bu durum tek başına kodun sahte olduğunu göstermez.", "Apple Gift Card, Steam Cüzdan Kodu ve Razer Gold gibi ürünlerde bölge tanımı farklı biçimlerde gösterilebilir. Bu nedenle yalnız marka adına değil, ülke ve para birimi bilgisine de bakılmalıdır."] },
      { title: "Global kod her ülkede çalışır mı?", paragraphs: ["'Global' ifadesi her ürün ve satıcı için aynı kapsamı taşımaz. Desteklenen ülkeler, hesap türleri veya istisnalar ürün açıklamasında ayrıca belirtilmiş olabilir.", "Global ibaresine dayanarak satın alma yapmak yerine satıcı açıklamasını ve platformun güncel kullanım koşullarını kontrol edin."] },
      { title: "Satın almadan önce yapılacak kontroller", paragraphs: ["Ürünün ülkesini, para birimini, kullanılacağı platformu ve hesabın mağaza bölgesini karşılaştırın. Bozdurma amacı varsa ilgili ürün ve bölgenin güncel olarak desteklenip desteklenmediğini de önceden sorun."], bullets: ["TL, USD veya diğer para birimini doğrulayın.", "Hesap ve kod bölgesini karşılaştırın.", "Global ürünün desteklenen ülkelerini okuyun.", "Kesin uygunluk almadan kod satın almayın."] },
      { title: "Bölge hatası alındığında ne yapılmalı?", paragraphs: ["Kodu art arda farklı hesaplarda denemek yerine hata mesajını, sipariş numarasını ve ürün açıklamasını kaydedin. Satıcının resmi destek kanalına bölge ve teslimat bilgileriyle başvurun.", "Kodun tamamını ekran görüntüsüyle açık alanlarda yayımlamayın. Hesap bölgesini yalnız bir kodu kullanmak için değiştirmek yeni kısıtlamalara yol açabileceğinden platformun resmi koşulları incelenmeden bu yönteme başvurmayın."] },
    ],
  },
  {
    slug: "dijital-kod-satin-almadan-once-kontrol-listesi",
    title: "Dijital Kod Satın Almadan Önce 10 Önemli Kontrol",
    seoTitle: "Dijital Kod Satın Alma Kontrolü: Bölge, Satıcı ve Güvenlik",
    metaDescription: "Razer Gold, Apple Gift Card ve Steam kodu satın almadan önce ürün, bölge, para birimi, satıcı, teslimat ve bozdurma uygunluğunu kontrol edin.",
    excerpt: "Yanlış bölge, hatalı ürün ve güvensiz satıcı riskini azaltan 10 maddelik dijital kod satın alma kontrolü.",
    category: "Dijital Kodlar",
    readTime: "8 dk",
    updatedAt: "2026-07-29",
    keywords: ["dijital kod satın alma", "hediye kartı güvenli mi", "dijital kod bölge kontrolü", "dijital kod bozdurma"],
    links: [
      { label: "Dijital kod bölge hatası", href: "/bilgi-merkezi/dijital-kod-bolge-hatasi-nedir" },
      { label: "Kod teslim edilince ne yapılmalı?", href: "/bilgi-merkezi/dijital-kod-teslim-edilince-ne-yapilmali" },
      { label: "Dijital kod ve hediye kartı rehberi", href: "/bilgi-merkezi/dijital-kod-hediye-karti-rehberi" },
    ],
    sections: [
      { title: "Ürün ve bölge kontrolleri", paragraphs: ["Dijital ürünlerde yanlış marka, para birimi veya bölge seçimi satın alma sonrasında kolayca düzeltilemeyebilir. Sepete eklemeden önce ürün adı, nominal değer ve kullanılacağı ülkeyi ayrı ayrı kontrol edin."], bullets: ["1. Marka ve ürün türü doğru mu?", "2. Kod değeri ve para birimi doğru mu?", "3. Kod bölgesi hesapla uyumlu mu?", "4. Ürün tek kod mu, parçalı kod mu?", "5. Teslimat biçimi ve süresi açık mı?"] },
      { title: "Satıcı ve ödeme kontrolleri", paragraphs: ["Aynı ürün birden fazla satıcı tarafından sunulabilir. Satıcının yakın tarihli yorumları, dijital ürün teslimat geçmişi ve sorun çözme yaklaşımı yalnız toplam puandan daha açıklayıcıdır.", "Ödeme sayfasındaki alan adı ve sipariş özeti beklediğiniz bilgilerle uyuşmalıdır. Farklı tutarlı veya tanımadığınız işyeri adına gelen doğrulama ekranını onaylamayın."], bullets: ["6. Satıcı adı ve geçmişi tutarlı mı?", "7. Güncel yorumlarda teslimat sorunu var mı?", "8. Ödeme alan adı ve tutarı doğru mu?"] },
      { title: "Bozdurma ve teslimat kontrolleri", paragraphs: ["Kod bozdurulacaksa ürün, bölge ve güncel oran satın almadan önce teyit edilmelidir. Her dijital kartın değerlendirme koşulu aynı değildir; yalnız markanın daha önce kabul edilmiş olması yeni ürünün de uygun olduğu anlamına gelmez."], bullets: ["9. Güncel bozdurma uygunluğu ve oran teyit edildi mi?", "10. Sipariş ve teslimat kaydını saklayabilecek misiniz?"] },
      { title: "Kod teslim edildikten sonra", paragraphs: ["Ürün adı, değer, para birimi ve bölgeyi sipariş özetiyle karşılaştırın. Uyuşmazlık varsa kodu kullanmadan satıcı desteğine yazın.", "Tam kodu açık alanlarda paylaşmayın. Bozdurma yapılacaksa yalnız doğrulanmış resmi iletişim kanalında ve önceden kabul edilen koşullarla ilerleyin."] },
    ],
  },
  {
    slug: "mobil-odeme-limiti-nasil-ogrenilir",
    title: "Mobil Ödeme Limiti Nasıl Öğrenilir?",
    seoTitle: "Mobil Ödeme Limiti Nasıl Öğrenilir? Operatör Kontrolü",
    metaDescription: "Vodafone, Turkcell ve Türk Telekom hatlarında toplam ve kullanılabilir mobil ödeme limitinin resmi kanallardan nasıl kontrol edileceğini öğrenin.",
    keywords: ["mobil ödeme limiti nasıl öğrenilir", "kullanılabilir mobil ödeme limiti", "vodafone mobil ödeme limiti", "turkcell mobil ödeme limiti", "türk telekom mobil ödeme limiti"],
    excerpt: "Vodafone, Turkcell ve Türk Telekom hatlarında kullanılabilir mobil ödeme limitini kontrol ederken dikkat edilmesi gerekenler.",
    category: "Mobil Ödeme",
    readTime: "7 dk",
  updatedAt: "2026-07-29",
    serviceSlug: "sms-mobil-odeme",
    links: [
      { label: "Bilgi Merkezi", href: "/bilgi-merkezi" },
      { label: "İlgili hizmetler", href: "/hizmetler" },
    ],
    sections: [
      { title: "Mobil ödeme limiti nedir?", paragraphs: ["Mobil ödeme limiti, hattınız üzerinden belirli bir dönem içinde kullanabileceğiniz ödeme üst sınırını ifade eder. Toplam limit ile o anda kullanılabilir kalan limit aynı şey değildir; daha önce yapılan işlemler ve bekleyen hareketler kullanılabilir tutarı azaltabilir.", "Limitler her kullanıcıda aynı olmayabilir. Hat türü, ödeme geçmişi, operatör politikaları ve hizmet durumu gibi etkenler nedeniyle internette gördüğünüz başka bir kullanıcının limiti sizin hattınız için geçerli kabul edilmemelidir."] },
      { title: "Kullanılabilir limit nasıl kontrol edilir?", paragraphs: ["En güvenli kontrol, operatörünüzün kendi uygulaması, müşteri hizmetleri veya resmi bilgilendirme kanalı üzerinden yapılır. Üçüncü taraf bir sayfaya hat şifresi ya da doğrulama kodu girmek yerine resmi kanaldaki güncel kullanılabilir tutarı esas alın.", "Kontrol sırasında toplam limit, kalan limit, işlem başına sınır ve dönemsel kullanım bilgilerini birbirinden ayırın. Bir satın almanın toplam limite sığması, işlem başına sınırı da geçtiği anlamına gelmez."], bullets: ["Operatörün resmi uygulamasını veya destek kanalını kullanın.", "Toplam limit yerine kullanılabilir kalan tutarı kontrol edin.", "Bekleyen ya da faturaya henüz yansımamış işlemleri hesaba katın."] },
      { title: "Limit neden beklenenden düşük görünebilir?", paragraphs: ["Yakın zamanda yapılan harcamalar, dönemsel güvenlik kısıtlamaları veya mobil ödeme hizmetinin geçici olarak kapalı olması kullanılabilir limiti etkileyebilir. Aynı işlemi art arda denemek ek güvenlik kontrolüne yol açabilir.", "Limit görünmüyorsa veya tutarsızsa yeni satın alma yapmadan önce operatör desteğinden hizmet durumunu doğrulayın. Bozum amacıyla ürün almadan önce hem kullanılabilir limiti hem ürün uygunluğunu teyit etmek gereksiz harcama riskini azaltır."] },
    ],
  },
  {
    slug: "sanal-kart-guvenli-mi",
    title: "Sanal Kart Güvenli mi? Kullanım ve Limit Rehberi",
    seoTitle: "Sanal Kart Güvenli mi? Limit ve İnternet Alışverişi",
    metaDescription: "Sanal kartla internet alışverişinde limit belirleme, ödeme sayfasını doğrulama ve dijital ürün satın alırken kart bilgilerini koruma adımları.",
    keywords: ["sanal kart güvenli mi", "sanal kart limiti", "internet alışverişi güvenliği", "sanal kart dijital ürün"],
    excerpt: "Sanal kartla internet alışverişinde limit belirleme, kart bilgilerini koruma ve dijital ürün satın alma güvenliği.",
    category: "Kartlar",
    readTime: "8 dk",
  updatedAt: "2026-07-29",
    serviceSlug: "kredi-karti-sanal-kart",
    links: [
      { label: "Bilgi Merkezi", href: "/bilgi-merkezi" },
      { label: "İlgili hizmetler", href: "/hizmetler" },
    ],
    sections: [
      { title: "Sanal kartın güvenlik avantajı", paragraphs: ["Sanal kart, internet alışverişi için ayrı kart bilgileri ve kontrol edilebilir harcama limiti sunabilir. Ana kart limitinin tamamını alışveriş sitesine açmak yerine yalnız planlanan işlem kadar limit tanımlamak, izinsiz yüksek tutarlı harcama riskini azaltır.", "Ancak sanal kart kullanmak her siteyi otomatik olarak güvenli yapmaz. Sahte ödeme sayfasına girilen sanal kart bilgileri, kartta kullanılabilir limit bulunduğu sürece kötüye kullanılabilir."], bullets: ["İşlem öncesinde yalnız gereken tutar kadar limit tanımlayın.", "Alışveriş sonrasında limiti düşürün veya kartı geçici olarak kapatın.", "Kart bilgilerini mesajla ya da ekran görüntüsüyle paylaşmayın."] },
      { title: "Ödeme sayfasında ne kontrol edilmeli?", paragraphs: ["Adres çubuğundaki alan adı, ödeme tutarı ve satıcı bilgisi işlem onayından önce kontrol edilmelidir. Tarayıcıdaki kilit simgesi bağlantının şifreli olduğunu gösterir; satıcının güvenilirliğini tek başına kanıtlamaz.", "Dijital ürünlerde teslimat ve iade koşulları ayrıca önemlidir. Kod teslim edildikten sonra iade seçeneği sınırlı olabileceği için ürün türü, bölgesi ve değeri ödeme öncesinde doğrulanmalıdır."] },
      { title: "Şüpheli işlem görülürse", paragraphs: ["Kart hareketlerinde tanımadığınız bir işlem görürseniz sanal kartı kapatın veya limitini sıfırlayın ve kartı sağlayan kuruluşun resmi destek kanalına başvurun. İşlem bilgilerini paylaşırken tam kart numarası ve güvenlik kodu göndermeyin.", "Tek kullanımlık doğrulama kodu yalnız sizin başlattığınız ve tutarını gördüğünüz işlem için girilmelidir. Telefonda veya mesajda bu kodu isteyen kişilere iletmeyin."] },
    ],
  },
  {
    slug: "razer-gold-tl-ve-usd-farki",
    title: "Razer Gold TL ve USD Kodları Arasındaki Farklar",
    seoTitle: "Razer Gold TL ve USD Farkı: Bölge ve Para Birimi",
    metaDescription: "Razer Gold TL ve USD kodları arasındaki para birimi, ülke, hesap bölgesi ve kullanım farklarını kod satın almadan önce karşılaştırın.",
    keywords: ["razer gold tl usd farkı", "razer gold tl", "razer gold usd", "razer gold bölge"],
    excerpt: "Razer Gold TL ve USD kodlarında para birimi, bölge, hesap uyumu ve bozum öncesi kontrol edilmesi gereken farklar.",
    category: "Razer Gold",
    readTime: "7 dk",
  updatedAt: "2026-07-29",
    serviceSlug: "razer-gold-tl",
    links: [
      { label: "Bilgi Merkezi", href: "/bilgi-merkezi" },
      { label: "İlgili hizmetler", href: "/hizmetler" },
    ],
    sections: [
      { title: "Temel fark para birimi ve bölgedir", paragraphs: ["Razer Gold TL kodları Türk lirası, USD kodları ise dolar değeri üzerinden sunulur. Kodun üzerinde yazan tutarı yalnız kur çevirisi olarak değerlendirmek yeterli değildir; kullanım bölgesi ve hesabın desteklediği para birimi de önem taşır.", "Aynı sayısal değere sahip iki kod farklı para birimindeyse ekonomik değerleri ve işlem koşulları farklı olur. Ürün adında TL veya USD ibaresinin açıkça görülmesi gerekir."] },
      { title: "Kod seçerken hangi bilgiler kontrol edilmeli?", paragraphs: ["Kodun para birimi, ülke veya bölge bilgisi, kullanılacağı platform ve satıcının teslimat açıklaması birlikte kontrol edilmelidir. Global olarak tanımlanan ürünlerde bile desteklenen ülkeler satıcı açıklamasında sınırlandırılabilir."], bullets: ["TL veya USD para birimini doğrulayın.", "Kodun bölgesini ve desteklenen hesabı kontrol edin.", "Satın almadan önce stok ve bozum uygunluğunu sorun.", "Kod değerini kur hesabıyla tek başına karşılaştırmayın."] },
      { title: "Bozum oranı neden farklı olabilir?", paragraphs: ["TL ve USD kodlarının talebi, kullanılabildiği bölge ve stok durumu aynı olmayabilir. Bu nedenle iki para birimi için farklı bilgilendirme oranları görülebilir.", "Kesin oran almadan yalnız döviz kuruna bakarak beklenen ödeme hesaplamak doğru sonuç vermeyebilir. Kod satın alınmadan önce para birimi ve tutar açıkça belirtilerek güncel uygunluk alınmalıdır."] },
    ],
  },
  {
    slug: "dijital-kod-teslim-edilince-ne-yapilmali",
    title: "Dijital Kod Teslim Edilince Ne Yapılmalı?",
    seoTitle: "Dijital Kod Teslim Edilince Ne Yapılmalı?",
    metaDescription: "Dijital kod tesliminden sonra ürün, tutar, bölge ve sipariş kaydını kontrol edin; kodu kullanmadan önce güvenli saklama adımlarını uygulayın.",
    keywords: ["dijital kod teslim edildi", "dijital kod kontrolü", "hediye kartı güvenliği", "kod teslimatı"],
    excerpt: "Dijital kod teslimatından sonra sipariş, bölge, tutar ve kod güvenliği için izlenecek kontrollü adımlar.",
    category: "Dijital Kodlar",
    readTime: "7 dk",
  updatedAt: "2026-07-29",
    serviceSlug: "razer-gold-tl",
    links: [
      { label: "Bilgi Merkezi", href: "/bilgi-merkezi" },
      { label: "İlgili hizmetler", href: "/hizmetler" },
    ],
    sections: [
      { title: "Önce siparişle karşılaştırın", paragraphs: ["Kod teslim edildiğinde ilk olarak ürün adı, para birimi, değer ve bölge bilgisini siparişinizle karşılaştırın. Yanlış ürün gönderilmişse kodu kullanmaya çalışmadan satıcı desteğine başvurmak çözüm ihtimalini korur.", "Sipariş numarası, teslimat zamanı ve ürün açıklamasını saklayın. Yalnız kod ekran görüntüsü, satın almanın hangi şartlarla yapıldığını kanıtlamak için yeterli olmayabilir."], bullets: ["Ürün adı ve kod değeri siparişle aynı mı?", "Para birimi ve bölge doğru mu?", "Teslimat kaydı ve sipariş numarası duruyor mu?", "Kod herkese kapalı güvenli bir yerde mi?"] },
      { title: "Kodu nasıl korumalısınız?", paragraphs: ["Dijital kod, onu gören kişi tarafından kullanılabilir. Bu nedenle tam kodu forumlarda, yorum alanlarında veya birden fazla destek hesabına göndermeyin. Ekran görüntüsü paylaşmanız gerekiyorsa kod karakterlerini kapatın.", "Bozum yapılacaksa yalnız daha önce doğruladığınız resmi iletişim kanalı üzerinden ilerleyin. Aynı kodu eş zamanlı olarak farklı kişilere göndermek işlem anlaşmazlığına yol açabilir."] },
      { title: "Hata veya gecikme durumunda", paragraphs: ["Kod görünmüyor, eksik teslim edilmiş veya siparişten farklıysa satıcının resmi destek kaydını açın. Mesajınızda sipariş numarası, ürün adı ve teslimat sorununu belirtin; kart şifresi veya hesap parolası göndermeyin.", "Kodun kullanılmış olduğu belirtiliyorsa deneme zamanı ve hata mesajını kaydedin. Kodu tekrar tekrar farklı hesaplarda kullanmaya çalışmak yerine satıcıdan teslimat ve aktivasyon kaydının incelenmesini isteyin."] },
    ],
  },

  {
    slug: "bozum-talebi-nasil-olusturulur",
    title: "Bozum Talebi Nasıl Oluşturulur?",
    seoTitle: "Bozum Talebi Nasıl Oluşturulur? Güvenli İşlem Adımları",
    metaDescription: "Mobil ödeme bozum veya dijital kod bozdurma talebinde ürün, tutar, bölge ve ödeme bilgilerini güvenli biçimde nasıl hazırlayacağınızı öğrenin.",
    keywords: ["bozum talebi nasıl oluşturulur", "mobil ödeme bozum talebi", "dijital kod bozdurma", "güvenilir mobil bozumcu"],
    excerpt: "Sky Bozum üzerinden mobil ödeme bozum veya dijital kod işlemi başlatırken hazırlanması gereken bilgiler ve güvenli talep adımları.",
    category: "İletişim",
    readTime: "9 dk",
  updatedAt: "2026-07-29",
    links: [
      { label: "Bilgi Merkezi", href: "/bilgi-merkezi" },
      { label: "İlgili hizmetler", href: "/hizmetler" },
    ],
    sections: [
      {
        title: "Bozum talebine başlamadan önce",
        paragraphs: [
          "Bozum talebi oluşturmak, yalnızca bir mesaj gönderip fiyat sormaktan ibaret değildir. Sağlıklı bir süreç için önce hangi dijital kodu değerlendirmek istediğinizi, toplam tutarı ve ürünün para birimini netleştirmeniz gerekir. Razer Gold TL, Razer Gold USD, Apple Gift Card ve Steam kodlarında süreç ayrıntıları farklı olabilir. Paycell, Pokus veya operatör mobil ödeme seçenekleri ise doğrudan bozum ürünü değil, dijital kodun hangi yöntemle satın alındığını açıklayan bilgilerdir.",
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
          "Doğru hazırlanmış bir bozum talebi; ürün türü, tutar, para birimi, güncel oran onayı ve doğru IBAN bilgisinden oluşur. Bu düzen hem mobil ödeme bozdurma sürecin daha açık ilerlemesine yardımcı olur hem de yanlış işlem riskini azaltır. Her adımda resmi kanalı kullanmak ve hassas bilgileri korumak temel güvenlik kuralıdır.",
          "Talebinizi başlatmak için Sky Bozum iletişim sayfasına gidin ve resmi WhatsApp butonunu kullanın. Ürün adını ve tutarı yazın; güncel oran ve uygunluk bilgisini aldıktan sonra işleme devam edin."
        ]
      }
    ]
  },
  {
    slug: "guncel-bozum-orani-nasil-ogrenilir",
    title: "Güncel Bozum Oranı Nasıl Öğrenilir?",
    seoTitle: "Güncel Bozum Oranı Nasıl Öğrenilir?",
    metaDescription: "Mobil ödeme bozum, Razer Gold bozdur ve iTunes bozum işlemlerinde güncel oranın neden işlem öncesinde yazılı olarak teyit edilmesi gerektiğini öğrenin.",
    keywords: ["güncel bozum oranı", "mobil ödeme bozum oranı", "razer gold bozdur oranı", "itunes bozum oranı"],
    excerpt: "Mobil ödeme bozum ve dijital kod işlemlerinde güncel oranı doğru kanaldan öğrenme, hesaplama ve teyit etme rehberi.",
    category: "İletişim",
    readTime: "9 dk",
  updatedAt: "2026-07-29",
    links: [
      { label: "Bilgi Merkezi", href: "/bilgi-merkezi" },
      { label: "İlgili hizmetler", href: "/hizmetler" },
    ],
    sections: [
      { title: "Bozum oranı neden değişir?", paragraphs: ["Mobil ödeme bozum, dijital kod ve sanal kart işlemlerinde oranlar her zaman aynı kalmaz. Ürünün türü, para birimi, bölgesi, kullanılabilir stok, piyasa talebi ve işlem tutarı güncel oranı etkileyebilir. Bu nedenle haftalar önce görülen bir oranı bugünkü işlem için kesin kabul etmek doğru değildir. Sky Bozum üzerinden işlem yapmadan önce ürün ve tutar özelinde güncel bilgi almak gerekir.", "Oran değişkenliği özellikle Razer Gold TL ile USD, Apple Gift Card bölgeleri veya farklı mobil ödeme yöntemleri arasında belirgindir. Aynı marka altındaki iki ürün bile farklı kullanım koşullarına sahip olabilir. Güvenli bozum yaklaşımı, ürünü satın almadan veya kodu göndermeden önce güncel oranı yazılı olarak teyit etmektir."], subsections: [{ title: "Taban oran ile kesin oran arasındaki fark", paragraphs: ["Sitede gösterilen taban veya bilgilendirme oranları genel fikir verir. Kesin oran ise işlem anındaki ürün, tutar ve uygunluk kontrolünden sonra paylaşılır. Hesabınızı kesin tutar üzerinden yapmak için destek hattından güncel teyit alın."] }] },
      { title: "Oran sormak için doğru mesaj nasıl yazılır?", paragraphs: ["‘Oran nedir?’ gibi tek cümlelik bir mesaj, hangi ürün için bilgi istendiğini açıklamaz. Daha hızlı yanıt için ürün adını, toplam tutarı, para birimini ve varsa bölgeyi aynı mesajda belirtin. Örneğin ‘Paycell ile satın aldığım 3.000 TL değerindeki kullanılmamış Razer Gold TL kodu için güncel kod oranı nedir?’ mesajı değerlendirme için gerekli temel bilgileri içerir.", "Paycell, Pokus veya operatör adı yalnız dijital kodun hangi ödeme yöntemiyle satın alındığını açıklar; Sky Bozum bu marka bakiyelerini doğrudan satın almaz. Kod henüz satın alınmadıysa bunu da açıkça yazın; böylece ürün ve bölge bilgisine ilişkin genel yönlendirme alınabilir."], bullets: ["Dijital kodun adını yazın.", "Toplam tutarı ve para birimini belirtin.", "Kodun bölgesini biliyorsanız ekleyin.", "Ürünün satın alınıp alınmadığını açıklayın."] },
      { title: "Oran hesaplaması nasıl yapılır?", paragraphs: ["Oran yüzde olarak verildiğinde tahmini ödeme, toplam tutarın oranla çarpılmasıyla hesaplanır. Örneğin 5.000 TL tutar için yüzde 60 oran verilirse tahmini ödeme 3.000 TL olur. Ancak işlem masrafı, ürün parçalı yapısı veya farklı koşullar varsa kesin sonuç destek mesajında açıklanmalıdır.", "Sky Bozum oran hesaplama sayfası hızlı bir tahmin sağlar; yine de bu sonuç otomatik teklif veya işlem garantisi değildir. İşleme başlamadan önce destek hattından kesin oranı ve ödenecek tutarı yazılı olarak alın. Böylece kod gönderildikten sonra tutar konusunda anlaşmazlık yaşanmaz."], subsections: [{ title: "Yuvarlama ve parçalı kodlar", paragraphs: ["Birden fazla koddan oluşan işlemlerde her kodun değeri veya bölgesi farklıysa toplam hesap değişebilir. Parçalı kodların listesini önceden belirtmek, nihai ödemenin doğru hesaplanmasına yardımcı olur."] }] },
      { title: "Sahte oran tekliflerine karşı dikkat", paragraphs: ["Piyasanın çok üzerinde görünen bir oran her zaman avantaj anlamına gelmez. Sahte hesaplar kullanıcıyı hızlı karar vermeye zorlayabilir, resmi olmayan bağlantıya yönlendirebilir veya kodu oran teyidi olmadan isteyebilir. Alan adını, telefon numarasını ve iletişim kanalını kontrol etmeden dijital kod paylaşmayın.", "Sky Bozum taklidi yapan hesaplardan korunmak için yalnız bozumcu.net üzerindeki iletişim bağlantılarını kullanın. Size farklı bir numaradan ulaşılırsa mevcut resmi konuşma üzerinden doğrulama isteyin. Şifre, SMS kodu veya kart PIN’i isteyen tekliflerden uzak durun."], bullets: ["Aşırı yüksek oranlarda resmi kanalı yeniden kontrol edin.", "Kod göndermeden önce ödeme koşulunu yazılı alın.", "Kısa süre baskısıyla karar vermeyin.", "Hesap şifresi veya doğrulama kodu paylaşmayın."] },
      { title: "Oranı ne zaman yeniden teyit etmek gerekir?", paragraphs: ["Teklif ile işlem arasında uzun süre geçtiyse oran yeniden sorulmalıdır. Piyasa ve stok koşulları kısa sürede değişebilir. Ayrıca tutar, ürün veya para birimi değiştiğinde önceki teklif geçerli sayılmamalıdır. Yeni bilgileri aynı konuşmada paylaşarak güncel hesap isteyin.", "İşlem bölündüyse veya ek kod eklendiyse toplam tutarı tekrar yazın. Ödeme öncesinde nihai tutarın iki tarafça açıkça görülmesi şeffaf işlem için önemlidir. Eski ekran görüntüsü yerine güncel konuşmadaki teyidi esas alın." ] },
      { title: "Güncel oran için resmi kanalı kullanın", paragraphs: ["Güncel bozum oranını öğrenmenin en güvenli yolu ürün türü ve tutarla birlikte Sky Bozum resmi destek hattına yazmaktır. Bilgilendirme oranlarını başlangıç noktası olarak kullanın; kesin tutarı işlem anında doğrulayın. Bu yöntem hem mobil ödeme bozum hem de dijital kod işlemlerinde beklentiyi netleştirir.", "Sky Bozum iletişim sayfasını açın, resmi WhatsApp bağlantısından mesaj gönderin ve ürününüzü açıkça belirtin. Güncel oranı aldıktan sonra oran hesaplama sayfasıyla tahmini ödemenizi kontrol edebilir ve onay verdiğinizde güvenli süreç üzerinden devam edebilirsiniz."] }
    ]
  },
  {
    slug: "islem-destegi-nasil-alinir",
    title: "İşlem Desteği Nasıl Alınır?",
    seoTitle: "Bozum İşlem Desteği Nasıl Alınır?",
    metaDescription: "Devam eden mobil ödeme bozum veya dijital kod işlemlerinde ürün, tutar ve işlem saati bilgileriyle güvenli destek talebi oluşturun.",
    keywords: ["bozum işlem desteği", "mobil ödeme bozum destek", "dijital kod işlem desteği", "sky bozum destek"],
    excerpt: "Devam eden veya tamamlanan mobil ödeme bozum işlemlerinde doğru bilgiyle destek talebi oluşturma ve güvenli takip adımları.",
    category: "İletişim",
    readTime: "9 dk",
  updatedAt: "2026-07-29",
    links: [
      { label: "Bilgi Merkezi", href: "/bilgi-merkezi" },
      { label: "İlgili hizmetler", href: "/hizmetler" },
    ],
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
    seoTitle: "Sky Bozum İletişim Rehberi: Resmî ve Güvenli Kanallar",
    metaDescription: "Sky Bozum resmî WhatsApp, telefon ve e-posta kanallarını doğrulayın; mobil ödeme bozum ve dijital kod işlemlerinde güvenli iletişim kurun.",
    keywords: ["sky bozum iletişim", "güvenilir mobil bozumcu", "mobil ödeme bozum iletişim", "bozumcu.net iletişim"],
    excerpt: "Sky Bozum resmi iletişim kanalları, güvenlik kontrolleri, hızlı mesaj hazırlığı ve işlem sonrası destek hakkında kapsamlı rehber.",
    category: "İletişim",
    readTime: "10 dk",
  updatedAt: "2026-07-29",
    links: [
      { label: "Bilgi Merkezi", href: "/bilgi-merkezi" },
      { label: "İlgili hizmetler", href: "/hizmetler" },
    ],
    sections: [
      { title: "Sky Bozum ile nasıl iletişim kurulur?", paragraphs: ["Sky Bozum ile iletişim kurmak için bozumcu.net üzerindeki resmi iletişim merkezini kullanabilirsiniz. Sayfada WhatsApp, telefon ve e-posta seçenekleri bulunur. Güncel oran, bozum talebi ve devam eden işlem desteği için işlem kaydını yazılı tutmak için WhatsApp tercih edilebilir. Kurumsal veya ayrıntılı yazılı taleplerde e-posta tercih edilebilir.", "İletişim kanalını doğrudan siteden açmak, benzer isim kullanan sahte hesaplardan korunmanıza yardımcı olur. Telefon numarasını kaydetmeden önce sayfadaki numarayla eşleştirin. Sosyal medya yorumunda veya forum mesajında gördüğünüz bir numarayı resmi kabul etmeyin."], subsections: [{ title: "Resmi kanal kontrolü", paragraphs: ["Alan adının bozumcu.net olduğuna, bağlantının güvenli biçimde açıldığına ve WhatsApp numarasının sitedeki numarayla aynı olduğuna bakın. Şüphe durumunda işlemi başlatmadan önce iletişim sayfasını yeniden açın."] }] },
      { title: "Hangi konu için hangi kanal kullanılmalı?", paragraphs: ["Bozum talebi ve güncel oran bilgisi için WhatsApp üzerinden ürün ve tutar bilgisi göndermek en pratik yöntemdir. Devam eden işlem desteği de konuşma geçmişinin korunması amacıyla aynı WhatsApp görüşmesinden yürütülmelidir. Telefon görüşmesi gerekiyorsa resmi numara aranabilir; ancak oran ve ödeme gibi kritik ayrıntıların yazılı teyidi faydalıdır.", "E-posta, iş birliği, kurumsal talepler veya ayrıntılı belge gerektiren konular için kullanılabilir. E-posta içinde kart bilgisi, şifre veya doğrulama kodu bulunmamalıdır. Hangi kanal seçilirse seçilsin, hesabınıza giriş sağlayan verileri paylaşmamak temel kuraldır."], bullets: ["Oran ve bozum talebi: WhatsApp", "Devam eden işlem: Mevcut WhatsApp konuşması", "Kurumsal ve uzun talepler: E-posta", "Acil doğrulama: Resmi telefon numarası"] },
      { title: "Hızlı yanıt için mesaj hazırlığı", paragraphs: ["Destek ekibine yazmadan önce dijital kod türünü, toplam tutarı, ürünün para birimini ve ödeme yapılacak IBAN bilgisini hazırlayın. İlk mesajda kodu göndermek zorunda değilsiniz. Önce kod uygunluğu ve güncel oran teyit edilmelidir. Açık bir mesaj, ek soru sayısını azaltır ve kod değerlendirme sürecinin daha net ilerlemesine yardımcı olur.", "Örneğin ‘Paycell ile satın alınmış 2.500 TL Razer Gold TL kodu için güncel kod oranını öğrenmek istiyorum’ mesajı yeterli başlangıç bilgisini sunar. Paycell burada yalnız satın alma yöntemini açıklar; Sky Bozum Paycell bakiyesini doğrudan satın almaz. Birden fazla kod varsa adet ve değerleri de yazın. Kodların tamamını oran onayı gelmeden paylaşmayın."], subsections: [{ title: "Hazır mesaj örneği", paragraphs: ["Merhaba, [dijital kod adı] için [tutar] tutarında kod değerlendirme talebi oluşturmak istiyorum. Ürün [para birimi/bölge] bilgisindedir. Güncel kod oranı ve uygunluk bilgisini paylaşabilir misiniz?"] }] },
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
