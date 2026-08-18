export type ProductTone = 'pubg' | 'valorant' | 'lol' | 'metin2' | 'razer';

export type ProductPack = {
  id: string;
  label: string;
  description: string;
};

export type ProductItem = {
  slug: string;
  name: string;
  shortName: string;
  category: string;
  eyebrow: string;
  description: string;
  intro: string;
  tone: ProductTone;
  coverImage: string;
  coverLabel: string;
  coverNote: string;
  packs: ProductPack[];
  howTo: { title: string; text: string }[];
  faq: { question: string; answer: string }[];
  related: string[];
};

const stockNotice = 'Bu ürün şu anda stokta değil. Stok açıldığında ürün sayfası güncellenecektir.';

export const products: ProductItem[] = [
  {
    slug: 'pubg-mobile-uc',
    name: 'PUBG Mobile UC',
    shortName: 'PUBG Mobile UC',
    category: 'Oyun bakiyesi',
    eyebrow: 'UC ürünleri',
    description: 'PUBG Mobile hesabında kullanılabilen UC paketlerini tek ekranda karşılaştırın.',
    intro: 'Paket seçmeden önce hesabınızın bölgesini, oyuncu kimliğini ve teslim koşullarını kontrol edin. UC, oyun içi içeriklerde kullanılan bir bakiyedir; nakit para yerine geçmez.',
    tone: 'pubg',
    coverImage: '/products/pubg-mobile-uc-cover-v3.webp',
    coverLabel: 'PUBG',
    coverNote: 'MOBILE UC',
    packs: ['60', '325', '660', '1.800', '3.850', '8.100'].map((label) => ({ id: label, label: `${label} UC`, description: `PUBG Mobile ${label} UC paketi` })),
    howTo: [
      { title: 'Oyuncu kimliğini kontrol edin', text: 'Satın alma ekranında doğru oyuncu ID’si ve hesap bölgesini seçin.' },
      { title: 'Paketi seçin', text: 'İhtiyacınız olan UC paketini seçmeden önce tutar ve teslim bilgisini okuyun.' },
      { title: 'Teslimi takip edin', text: 'İşlem onayından sonra bakiye veya kod teslim durumunu hesabınızdan takip edin.' },
      { title: 'Kodu kimseyle paylaşmayın', text: 'Destek ekibi sizden hesap şifresi veya SMS doğrulama kodu istemez.' },
    ],
    faq: [
      { question: 'UC ne için kullanılır?', answer: 'UC, PUBG Mobile içindeki desteklenen oyun içi içeriklerde kullanılan sanal bakiyedir.' },
      { question: 'Yanlış oyuncu ID’si girersem ne olur?', answer: 'Teslimat öncesinde ID’yi tekrar kontrol edin. Yanlış hesaba yapılan teslimatlarda iade veya düzeltme mümkün olmayabilir.' },
      { question: 'PUBG Mobile UC stokta mı?', answer: stockNotice },
    ],
    related: ['valorant-vp', 'league-of-legends-rp'],
  },
  {
    slug: 'valorant-vp',
    name: 'Valorant VP',
    shortName: 'Valorant VP',
    category: 'Oyun bakiyesi',
    eyebrow: 'VP ürünleri',
    description: 'Valorant Points paketlerini bölge ve hesap uyumluluğunu kontrol ederek inceleyin.',
    intro: 'VP, Valorant mağazasında kullanılan oyun içi para birimidir. Paket seçerken Riot hesabının bölgesini, tutarı ve teslim biçimini kontrol etmek önemlidir.',
    tone: 'valorant',
    coverImage: '/products/valorant-vp-cover-v3.webp',
    coverLabel: 'VALORANT',
    coverNote: 'POINTS',
    packs: ['375', '825', '1.700', '2.925', '4.325', '8.900'].map((label) => ({ id: label, label: `${label} VP`, description: `Valorant ${label} VP paketi` })),
    howTo: [
      { title: 'Hesap bölgesini doğrulayın', text: 'VP paketleri hesap bölgesiyle uyumlu olmalıdır; satın almadan önce bölge bilgisini okuyun.' },
      { title: 'Paketi karşılaştırın', text: 'Paket tutarını ve güncel katalog bilgisini birlikte değerlendirin.' },
      { title: 'Teslim yöntemini okuyun', text: 'Kod veya doğrudan yükleme seçeneklerinden hangisinin sunulduğunu kontrol edin.' },
      { title: 'Hesap bilgilerinizi paylaşmayın', text: 'Güvenli teslim için şifre, SMS kodu veya uzaktan erişim istenmez.' },
    ],
    faq: [
      { question: 'VP hesabıma nasıl yansır?', answer: 'Ürün koşuluna göre kod kullanımı veya doğrudan yükleme yöntemi uygulanabilir; satın almadan önce teslim biçimini kontrol edin.' },
      { question: 'Bölge uyuşmazlığı neden oluşur?', answer: 'Riot hesap bölgesi ile ürün bölgesi eşleşmediğinde kod veya yükleme kabul edilmeyebilir.' },
      { question: 'Valorant VP stokta mı?', answer: stockNotice },
    ],
    related: ['pubg-mobile-uc', 'league-of-legends-rp'],
  },
  {
    slug: 'league-of-legends-rp',
    name: 'League of Legends RP',
    shortName: 'League of Legends RP',
    category: 'Oyun bakiyesi',
    eyebrow: 'RP ürünleri',
    description: 'League of Legends RP paketlerini hesap bölgesi ve teslim koşullarıyla birlikte inceleyin.',
    intro: 'RP, League of Legends mağazasında kullanılan oyun içi para birimidir. Ürün seçerken sunucu ve hesap bölgesi uyumluluğunu kontrol etmek, yanlış ürün alımını önler.',
    tone: 'lol',
    coverImage: '/products/league-of-legends-rp-cover-v3.webp',
    coverLabel: 'LEAGUE',
    coverNote: 'OF LEGENDS · RP',
    packs: ['460', '1.005', '2.105', '3.625', '5.295', '10.875'].map((label) => ({ id: label, label: `${label} RP`, description: `League of Legends ${label} RP paketi` })),
    howTo: [
      { title: 'Sunucu bilgisine bakın', text: 'RP ürününü hesabınızın bağlı olduğu sunucu ve bölgeyle eşleştirin.' },
      { title: 'RP paketini seçin', text: 'İhtiyacınıza uygun paketin açıklamasını ve teslim yöntemini okuyun.' },
      { title: 'Hesap bilgilerini koruyun', text: 'Destek için hesap şifresi, doğrulama kodu veya uzaktan erişim paylaşmayın.' },
      { title: 'İşlem durumunu izleyin', text: 'Onaylanan siparişlerde teslim adımı hesabınızdan takip edilebilir.' },
    ],
    faq: [
      { question: 'RP ne için kullanılır?', answer: 'RP, League of Legends mağazasında desteklenen dijital içerikleri almak için kullanılır.' },
      { question: 'RP her sunucuda çalışır mı?', answer: 'Hayır. Hesap bölgesi ve sunucu uyumluluğu ürün türüne göre kontrol edilmelidir.' },
      { question: 'League of Legends RP stokta mı?', answer: stockNotice },
    ],
    related: ['valorant-vp', 'metin2-ejder-parasi'],
  },
  {
    slug: 'metin2-ejder-parasi',
    name: 'Metin2 Ejder Parası',
    shortName: 'Metin2 Ejder Parası',
    category: 'Oyun bakiyesi',
    eyebrow: 'EP ürünleri',
    description: 'Metin2 Ejder Parası paketlerini sunucu ve karakter bilgisiyle birlikte değerlendirin.',
    intro: 'Ejder Parası, Metin2 mağazasında kullanılan oyun içi bakiyedir. Paket seçmeden önce sunucu, karakter ve yükleme koşullarını doğru belirlemek gerekir.',
    tone: 'metin2',
    coverImage: '/products/metin2-ejder-parasi-cover-v3.webp',
    coverLabel: 'METİN2',
    coverNote: 'EJDER PARASI',
    packs: ['100', '230', '500', '1.000', '2.000', '5.000'].map((label) => ({ id: label, label: `${label} EP`, description: `Metin2 ${label} Ejder Parası paketi` })),
    howTo: [
      { title: 'Sunucuyu seçin', text: 'Yükleme yapılacak Metin2 sunucusunu işlem öncesinde doğrulayın.' },
      { title: 'Paketi seçin', text: 'EP miktarını ve ürünün hesap/karakter koşullarını okuyun.' },
      { title: 'Teslimi kontrol edin', text: 'Teslim bilgileri ve işlem durumu hesabınızdaki geçmiş alanda görülebilir.' },
      { title: 'Hassas bilgi paylaşmayın', text: 'Şifre veya tek kullanımlık kodlar hiçbir destek akışında istenmez.' },
    ],
    faq: [
      { question: 'Ejder Parası ne için kullanılır?', answer: 'Ejder Parası, Metin2 oyun içi mağazasında desteklenen içerikleri almak için kullanılan bakiyedir.' },
      { question: 'Sunucu seçimi neden önemli?', answer: 'Yanlış sunucu bilgisi yüklemenin doğru hesaba ulaşmamasına neden olabilir.' },
      { question: 'Metin2 Ejder Parası stokta mı?', answer: stockNotice },
    ],
    related: ['league-of-legends-rp', 'razer-gold'],
  },
  {
    slug: 'razer-gold',
    name: 'Razer Gold TL & USD',
    shortName: 'Razer Gold',
    category: 'Dijital kod',
    eyebrow: 'TL & USD ürünleri',
    description: 'Razer Gold TL ve USD PIN seçeneklerini para birimi, bölge ve kullanım koşullarıyla inceleyin.',
    intro: 'Razer Gold PIN kodlarında tutar kadar para birimi, bölge ve kullanılmamış olma şartı da önemlidir. Kodunuzu hesabınıza yüklemeden önce ürün bilgisini doğrulayın.',
    tone: 'razer',
    coverImage: '/products/razer-gold-cover-v3.webp',
    coverLabel: 'RAZER',
    coverNote: 'GOLD · TL / USD',
    packs: ['50 TL', '100 TL', '250 TL', '500 TL', '1.000 TL', '1.500 TL', '5 USD', '10 USD', '20 USD', '50 USD', '100 USD', '200 USD'].map((label) => ({ id: label.toLowerCase().replace(/\s/g, '-'), label, description: `Razer Gold ${label} PIN` })),
    howTo: [
      { title: 'Para birimini doğrulayın', text: 'TL ve USD ürünleri aynı koşullarda değerlendirilmeyebilir; ürün bilgisini okuyun.' },
      { title: 'Bölgeyi kontrol edin', text: 'Kodun ülkesi ve kullanım bölgesi, satın alma öncesinde açıkça belirtilmelidir.' },
      { title: 'Kodu yüklemeyin', text: 'Bozum düşünüyorsanız kullanılmamış kodu kişisel hesabınıza tanımlamayın.' },
      { title: 'Oranı yazılı teyit edin', text: 'Güncel uygunluk ve oran, kodu paylaşmadan önce resmi Sky Bozum kanalından alınmalıdır.' },
    ],
    faq: [
      { question: 'TL ve USD Razer Gold arasındaki fark nedir?', answer: 'Fark para birimi ve bölge koşuludur. Her kod türü aynı hesapta veya aynı işlem koşulunda kullanılamayabilir.' },
      { question: 'Razer Gold PIN bozum için kullanılmamış mı olmalı?', answer: 'Evet. Kişisel hesaba yüklenmiş kodlar kullanılmamış PIN olarak değerlendirilemez.' },
      { question: 'Razer Gold ürünleri stokta mı?', answer: stockNotice },
    ],
    related: ['pubg-mobile-uc', 'valorant-vp'],
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
