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
  coverPosition?: string;
  coverLabel: string;
  coverNote: string;
  packs: ProductPack[];
  guide: { title: string; text: string; sourceLabel: string; sourceUrl: string };
  howTo: { title: string; text: string }[];
  faq: { question: string; answer: string }[];
  related: string[];
};

const stockNotice = 'Güncel stok ve satış fiyatı ürün sayfasındaki paket kartlarında anlık gösterilir. Stok yoksa satın alma butonu otomatik olarak kapalı kalır.';

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
    coverPosition: '50% 46%',
    coverLabel: 'PUBG',
    coverNote: 'MOBILE UC',
    guide: {
      title: 'PUBG Mobile UC rehberi',
      text: 'UC, PUBG Mobile içindeki premium oyun bakiyesidir. Paket seçerken doğru oyuncu ID’si, hesap bölgesi ve teslim yöntemini birlikte kontrol edin. UC hesabınıza yansımadıysa aynı paketi yeniden almadan önce satın alma kaydını, oyun içi bakiyeyi ve ödeme hareketini kontrol edin; hesap şifresi veya doğrulama kodunu hiçbir destek hesabıyla paylaşmayın.',
      sourceLabel: 'PUBG Mobile yardım merkezinde UC bilgisini aç',
      sourceUrl: 'https://pubgmobile.helpshift.com/hc/en/3-pubg-mobile/faq/35-what-is-uc-in-pubg-mobile/?contact=1',
    },
    packs: ['60', '325', '660', '1.800', '3.850', '8.100'].map((label) => ({ id: label, label: `${label} UC`, description: `PUBG Mobile ${label} UC paketi` })),
    howTo: [
      { title: 'Oyuncu ID’sini doğrulayın', text: 'Oyundaki profil ekranından ID ve kullanıcı adını birlikte kontrol edin; yalnızca kullanıcı adına güvenmeyin.' },
      { title: 'Bölge ve paketi eşleştirin', text: 'Hesap bölgesi, UC paketi ve teslim yönteminin aynı koşullara bağlı olduğundan emin olun.' },
      { title: 'İşlem öncesi toplamı okuyun', text: 'Paket tutarı, varsa hizmet bedeli ve teslim notunu onaylamadan ilerlemeyin.' },
      { title: 'Bakiyeyi tek kez kontrol edin', text: 'Teslim sonrası oyun içi bakiye ve işlem geçmişini kontrol edin; görünmüyorsa tekrar satın alma yapmayın.' },
      { title: 'Hesabı koruyun', text: 'Şifre, SMS kodu, cihaz onayı veya uzaktan erişim isteyen kişilere itibar etmeyin.' },
    ],
    faq: [
      { question: 'UC nedir, nerede kullanılır?', answer: 'UC, PUBG Mobile içindeki desteklenen oyun içi içeriklerde kullanılan premium bakiyedir; nakit para veya banka bakiyesi değildir.' },
      { question: 'UC yüklemek için oyuncu ID’si neden önemlidir?', answer: 'Yükleme hedef hesabın oyuncu ID’siyle eşleşir. Yanlış ID, doğru hesabın dışında bir teslim veya inceleme gerektiren durum oluşturabilir.' },
      { question: 'UC paketi hesabıma gelmediyse ne yapmalıyım?', answer: 'Önce oyun içi bakiyeyi, satın alma geçmişini ve ödeme hareketini kontrol edin. Aynı paketi tekrar almadan önce işlem kaydıyla PUBG Mobile’ın resmî desteğine başvurun.' },
      { question: 'PUBG Mobile UC her bölgede çalışır mı?', answer: 'Paket ve teslim yöntemi hesap bölgesine göre değişebilir. İşlem öncesinde hesap bölgesi ile ürün koşulunun eşleştiğini kontrol edin.' },
      { question: 'UC iade edilebilir mi?', answer: 'İade ve itiraz koşulları ödeme kanalı ile PUBG Mobile kurallarına göre değerlendirilir; satın almadan önce paketi ve hesabı doğrulayın.' },
      { question: 'PUBG Mobile UC bozum için hesap şifresi gerekir mi?', answer: 'Hayır. Şifre, SMS kodu veya cihaz erişimi isteyen kişilerle işlem yapmayın.' },
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
    coverPosition: '50% 42%',
    coverLabel: 'VALORANT',
    coverNote: 'POINTS',
    guide: {
      title: 'Valorant VP rehberi',
      text: 'VP, Riot hesabında Valorant mağazasında kullanılan premium para birimidir. Ön ödemeli kodlarda bölge ve para birimi kilidi bulunabildiği için kodu kullanacağınız hesabın bölgesini işlemden önce doğrulayın. Kod kullanıldıktan sonra doğru hesaba giriş yapıldığından emin olun; hata alırsanız kodu herkese açık biçimde paylaşmadan makbuz ve hata ekranıyla resmî desteğe başvurun.',
      sourceLabel: 'Riot kod kullanma sayfasını aç',
      sourceUrl: 'https://shop.riotgames.com/redeem',
    },
    packs: ['375', '825', '1.700', '2.925', '4.325', '8.900'].map((label) => ({ id: label, label: `${label} VP`, description: `Valorant ${label} VP paketi` })),
    howTo: [
      { title: 'Riot hesabı ve bölgeyi kontrol edin', text: 'Kodun para birimi ile Valorant hesabının bölgesinin uyumlu olduğundan emin olun.' },
      { title: 'VP tutarını ve teslim biçimini okuyun', text: 'Kod mu, doğrudan yükleme mi sunulduğunu ve paketin toplam tutarını işlem öncesinde netleştirin.' },
      { title: 'Kodu doğru hesapta kullanın', text: 'Riot kod ekranında giriş yaptığınız hesabı ve ekrana gelen ürün bilgisini onaylamadan kodu tamamlamayın.' },
      { title: 'Kullanım sonucunu kontrol edin', text: 'VP bakiyesini oyun istemcisinde kontrol edin; görünmüyorsa tekrar denemek yerine işlem kaydını saklayın.' },
      { title: 'Kodu gizli tutun', text: 'Kodu, hesap şifresini veya iki aşamalı doğrulama bilgisini destek adı kullanan kişilerle paylaşmayın.' },
    ],
    faq: [
      { question: 'VP nedir?', answer: 'VP, Valorant mağazasında kostüm, silah görünümü ve benzeri desteklenen içeriklerde kullanılan Riot oyun içi para birimidir.' },
      { question: 'VP kodu hangi hesaba yüklenir?', answer: 'Kod, Riot kod ekranında o anda giriş yapılmış hesaba uygulanır. Onaydan önce kullanıcı adını ve bölgeyi mutlaka kontrol edin.' },
      { question: 'Valorant kodu neden bölgemde çalışmıyor?', answer: 'Ön ödemeli nakit kodları satın alındığı bölge veya para birimiyle sınırlı olabilir. Hesap bölgesi ile kod koşulunu karşılaştırın.' },
      { question: 'Kod kullanılmış veya geçersiz görünürse ne yapmalıyım?', answer: 'Kodu tekrar tekrar denemeyin ve tam kodu herkese açık alanda paylaşmayın. Sipariş belgesi, hata ekranı ve kod bilgisiyle Riot desteğine başvurun.' },
      { question: 'VP yüklemesi gecikirse tekrar kod almalı mıyım?', answer: 'Hayır. Önce istemciyi, hesap geçmişini ve Riot tarafındaki işlem durumunu kontrol edin; ikinci bir kod yeni bir sorunu çözmez.' },
      { question: 'VP kodu iki hesaba bölünebilir mi?', answer: 'Ön ödemeli nakit kodları tek kullanımda bir hesaba uygulanır; kodu kullanmadan önce doğru hesapta olduğunuzu doğrulayın.' },
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
    coverPosition: '50% 42%',
    coverLabel: 'LEAGUE',
    coverNote: 'OF LEGENDS · RP',
    guide: {
      title: 'League of Legends RP rehberi',
      text: 'RP, League of Legends mağazasında kullanılan premium para birimidir. Ön ödemeli kodlarda bölge kilidi ve tek kullanım kuralı önemlidir; kodu doğru Riot hesabında ve doğru istemci bölgesinde kullanın. Kod kullanıldıktan sonra işlem geri alınamayabileceği için onay ekranındaki hesap ve içerik bilgisini kontrol edin, sorun yaşarsanız satın alma kanıtını saklayın.',
      sourceLabel: 'Riot kod kullanma sayfasını aç',
      sourceUrl: 'https://shop.riotgames.com/redeem',
    },
    packs: ['460', '1.005', '2.105', '3.625', '5.295', '10.875'].map((label) => ({ id: label, label: `${label} RP`, description: `League of Legends ${label} RP paketi` })),
    howTo: [
      { title: 'Riot ID ve bölgeyi doğrulayın', text: 'RP kodunun para birimi ile hesabınızın bölge koşulunu işlem öncesinde eşleştirin.' },
      { title: 'RP paketini seçin', text: 'Paket miktarını, teslim yöntemini ve varsa kampanya koşulunu birlikte okuyun.' },
      { title: 'Doğru hesapta kullanın', text: 'Kod ekranındaki kullanıcı ve içerik bilgisini onaylamadan uygulamayı tamamlamayın.' },
      { title: 'RP bakiyesini kontrol edin', text: 'Kod sonrası mağaza bakiyesini ve işlem geçmişini kontrol edin; gecikmede yeni kod kullanmayın.' },
      { title: 'Makbuzu saklayın', text: 'Hata veya itiraz gerekirse satın alma belgesi ve ekran görüntüsü destek incelemesini kolaylaştırır.' },
    ],
    faq: [
      { question: 'RP nedir?', answer: 'RP, League of Legends mağazasında kostüm ve diğer desteklenen dijital içerikleri almak için kullanılan premium para birimidir.' },
      { question: 'RP kodu hangi hesaba gider?', answer: 'Kod, Riot kod sayfasında giriş yaptığınız hesaba uygulanır. Kullanımdan önce hesap adını ve bölgeyi kontrol edin.' },
      { question: 'RP kodu başka bölgedeki hesapta çalışır mı?', answer: 'Ön ödemeli nakit kodlarında bölge ve para birimi kısıtı bulunabilir. Kodun satın alındığı bölge ile hesap bölgesini karşılaştırın.' },
      { question: 'RP kodu iki hesaba bölünebilir mi?', answer: 'Hayır. Ön ödemeli kodlar tek kullanımda bir oyuna ve hesaba uygulanır; tam kodu kullanmadan önce hesabı doğrulayın.' },
      { question: 'RP kodu kullanıldı ama bakiye görünmüyor?', answer: 'İstemciyi yenileyip işlem geçmişini kontrol edin. Kod bilgisini herkese açık paylaşmadan satın alma belgesiyle Riot desteğine başvurun.' },
      { question: 'RP kodlarının süresi var mı?', answer: 'Riot’un ön ödemeli nakit kodları için genel bilgi kodların süresiz olduğunu belirtir; yine de ürün veya satıcı koşulunu satın alma öncesi kontrol edin.' },
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
    coverPosition: '72% 46%',
    coverLabel: 'METİN2',
    coverNote: 'EJDER PARASI',
    guide: {
      title: 'Metin2 Ejder Parası rehberi',
      text: 'Ejder Parası, Metin2 Nesne Market’te kullanılan oyun içi kredidir. Paket veya kupon türünü, hesabı ve sunucu koşulunu işlemden önce doğrulayın; kuponların saklama süresi ürün tipine göre değişebilir. EP ile Ejderha Markası aynı şey değildir: bazı harcamalarda EP kullanımı ayrıca marka kazandırabilir. Teslim görünmüyorsa tekrar işlem başlatmadan oyun içi marketi ve hesap geçmişini kontrol edin.',
      sourceLabel: 'Gameforge Metin2 Wiki’de Ejderha Parası bilgisini aç',
      sourceUrl: 'https://tr-wiki.metin2.gameforge.com/index.php?stable=1&title=EM',
    },
    packs: ['100', '230', '500', '1.000', '2.000', '5.000'].map((label) => ({ id: label, label: `${label} EP`, description: `Metin2 ${label} Ejder Parası paketi` })),
    howTo: [
      { title: 'Hesap ve sunucu bilgisini doğrulayın', text: 'Yükleme yapılacak Gameforge hesabını ve sunucuyu işlem öncesinde açıkça belirtin.' },
      { title: 'EP ile kuponu ayırın', text: 'Doğrudan bakiye mi, kullanılabilir kupon/kod mu sunulduğunu ürün açıklamasından kontrol edin.' },
      { title: 'Süre ve kullanım koşulunu okuyun', text: 'Kupon veya etkinlik ürünlerinde saklama/son kullanım koşulu bulunabilir; ekran görüntüsünü saklayın.' },
      { title: 'Nesne Market bakiyesini kontrol edin', text: 'Teslim sonrası oyun içi marketteki EP bakiyesini ve işlem geçmişini kontrol edin.' },
      { title: 'Hesap güvenliğini koruyun', text: 'Şifre, SMS kodu veya uzaktan erişim isteyen kişilerle işlem yapmayın.' },
    ],
    faq: [
      { question: 'Ejderha Parası (EP) nedir?', answer: 'EP, Metin2 Nesne Market’te desteklenen oyun içi ürünleri almak için kullanılan dijital kredidir.' },
      { question: 'EP ile Ejderha Markası aynı mı?', answer: 'Hayır. Gameforge Wiki’de EP harcandığında bazı durumlarda Ejderha Markası elde edilebildiği, ancak iki bakiyenin aynı olmadığı belirtilir.' },
      { question: 'EP yüklemesi için sunucu neden sorulur?', answer: 'Hesap ve sunucu eşleşmesi teslim yöntemine göre önem taşıyabilir. Yanlış bilgi, işlemin incelenmesini veya düzeltme gerektirmesini doğurabilir.' },
      { question: 'EP kuponlarının süresi olur mu?', answer: 'Kupon ve etkinlik ürünlerinde süre ürüne göre değişebilir. Doğrudan EP ile kuponu aynı kabul etmeyin; ürün açıklamasındaki tarihi kontrol edin.' },
      { question: 'EP teslim edilmediğinde ne yapmalıyım?', answer: 'Nesne Market’i, hesap geçmişini ve işlem kaydını kontrol edin; aynı işlemi tekrarlamadan Gameforge’un resmî destek kanalına başvurun.' },
      { question: 'Metin2 hesabımın şifresini paylaşmalı mıyım?', answer: 'Hayır. Şifre, tek kullanımlık kod veya uzaktan erişim isteyen kişilerle işlem yapmayın.' },
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
    coverPosition: '58% 50%',
    coverLabel: 'RAZER',
    coverNote: 'GOLD · TL / USD',
    guide: {
      title: 'Razer Gold TL & USD rehberi',
      text: 'Razer Gold PIN’i yüklemek için gold.razer.com üzerinde doğru bölge cüzdanına giriş yapılır, Reload Now alanından PIN yöntemi seçilir ve iki aşamalı doğrulama tamamlanır. TL ve USD kodları aynı koşullarda değerlendirilmez; PIN’in bölgesi, tam kodu ve kullanım durumu işlem öncesinde doğrulanmalıdır. Bozum düşünülüyorsa kodu kendi cüzdanınıza yüklemeyin; yüklenen bakiye PIN olarak incelenemez.',
      sourceLabel: 'Razer Gold resmî yardım merkezini aç',
      sourceUrl: 'https://gold.razer.com/us/en/help?section=0',
    },
    packs: ['50 TL', '100 TL', '250 TL', '500 TL', '1.000 TL', '1.500 TL', '5 USD', '10 USD', '20 USD', '50 USD', '100 USD', '200 USD'].map((label) => ({ id: label.toLowerCase().replace(/\s/g, '-'), label, description: `Razer Gold ${label} PIN` })),
    howTo: [
      { title: 'TL / USD ve bölgeyi doğrulayın', text: 'PIN’in para birimi ile Razer Gold cüzdan bölgesinin eşleştiğini kontrol edin.' },
      { title: 'PIN’i seri numarasından ayırın', text: 'Razer’ın yardım bilgisinde yükleme için tam PIN’in girilmesi gerektiği belirtilir; seri numarası PIN yerine geçmez.' },
      { title: 'Bozum öncesi kodu yüklemeyin', text: 'Cüzdana yüklenen tutar artık kullanılmamış PIN olarak değerlendirilemez.' },
      { title: 'Hata durumunu kaydedin', text: 'Bölge, kullanılan yöntem, hata ekranı ve satın alma kanıtını saklayın; PIN’i herkese açık paylaşmayın.' },
      { title: 'Oranı yazılı teyit edin', text: 'Güncel uygunluk ve oran netleşmeden tam PIN’i göndermeyin.' },
    ],
    faq: [
      { question: 'Razer Gold PIN nasıl yüklenir?', answer: 'Razer Gold hesabında Reload Now alanını açıp Razer Gold PIN yöntemini seçin, tam PIN’i girin ve istenirse iki aşamalı doğrulamayı tamamlayın.' },
      { question: 'TL ve USD Razer Gold arasındaki fark nedir?', answer: 'Para birimi ve cüzdan bölgesi farklıdır. Razer, PIN’in satın alındığı bölgeyle aynı cüzdanda kullanılmasını ve bölgeye uygun para birimi seçilmesini önerir.' },
      { question: 'Razer Gold PIN neden çalışmıyor?', answer: 'Tam PIN yerine seri numarası girilmiş, kod daha önce kullanılmış veya PIN ile cüzdan bölgesi eşleşmiyor olabilir. Bu üç kontrolü yapın.' },
      { question: 'Razer Gold cüzdan bölgesi sonradan değişir mi?', answer: 'Razer yardım bilgisinde cüzdan bölgesinin değiştirilemediği ve yanlış bölge seçildiyse doğru bölgede yeni cüzdan oluşturulması gerektiği belirtilir.' },
      { question: 'Razer Gold bakiyesi veya PIN’in süresi var mı?', answer: 'Razer Gold bakiyesinin süresi dolmaz; PIN’in geçerlilik süresi ise satın alma kanalının koşuluna göre ayrıca kontrol edilmelidir. Promosyon bonusları farklı süreye sahip olabilir.' },
      { question: 'Razer Gold PIN bozum için hesaba yüklenmeli mi?', answer: 'Hayır. Hesaba yüklenen bakiye PIN olmaktan çıkar; işlem öncesi kodu kullanmadan, bölge ve oranı yazılı teyit edin.' },
      { question: 'Razer Gold ürünleri stokta mı?', answer: stockNotice },
    ],
    related: ['pubg-mobile-uc', 'valorant-vp'],
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
