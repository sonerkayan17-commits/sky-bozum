export type TroubleshootingGuide = {
  slug: string;
  title: string;
  product: string;
  category: 'Mobil Ödeme' | 'Dijital Cüzdan' | 'Dijital Kod' | 'Hediye Kartı';
  summary: string;
  symptoms: string[];
  causes: string[];
  checks: { title: string; text: string }[];
  warnings: string[];
  keywords: string[];
  serviceSlug?: string;
  articleSlugs?: string[];
};

export const troubleshootingGuides: TroubleshootingGuide[] = [
  {
    slug: 'vodafone-mobil-odeme-acilmiyor', title: 'Vodafone Mobil Ödeme Açılmıyor: Kontrol Listesi', product: 'Vodafone Mobil Ödeme', category: 'Mobil Ödeme',
    summary: 'Mobil ödeme seçeneği görünmüyor, işlem reddediliyor veya servis kapalı uyarısı alıyorsanız temel kontrolleri sırayla uygulayın.',
    symptoms: ['Mobil ödeme seçeneğinin görünmemesi', 'İşlemin anında reddedilmesi', 'Servis kapalı veya kullanılamıyor uyarısı'],
    causes: ['Hat üzerinde mobil ödemenin kapalı olması', 'Kullanılabilir limitin yetersiz olması', 'Hat türü veya hesap durumunun işleme uygun olmaması', 'Geçici operatör ya da mağaza kesintisi'],
    checks: [
      { title: 'Hat ve servis durumunu kontrol edin', text: 'Mobil ödeme özelliğinin hat üzerinde açık olup olmadığını operatör uygulaması veya resmî destek kanalından doğrulayın.' },
      { title: 'Limit ve fatura durumunu inceleyin', text: 'Kullanılabilir limit, ödenmemiş fatura veya hat kısıtı işlem sonucunu etkileyebilir.' },
      { title: 'İşlemi tekrar denemeden önce bekleyin', text: 'Arka arkaya çok sayıda deneme güvenlik engeline yol açabilir. Bir süre sonra yeniden deneyin.' },
      { title: 'Mağaza tarafını doğrulayın', text: 'Sorun yalnızca tek bir mağazada yaşanıyorsa ödeme sağlayıcısı veya mağaza tarafında geçici hata olabilir.' },
    ],
    warnings: ['Doğrulama kodunu ve kişisel hesap bilgilerini üçüncü kişilerle paylaşmayın.', 'Kesin limit ve servis durumu yalnızca operatör tarafından doğrulanabilir.'],
    keywords: ['vodafone mobil ödeme açılmıyor', 'vodafone mobil ödeme çalışmıyor', 'mobil ödeme kapalı'], serviceSlug: 'vodafone-mobil-odeme',
  },
  {
    slug: 'turkcell-mobil-odeme-hata-veriyor', title: 'Turkcell Mobil Ödeme Hata Veriyor: Nedenleri ve Çözümleri', product: 'Turkcell Mobil Ödeme', category: 'Mobil Ödeme',
    summary: 'Turkcell mobil ödeme işleminde hata, ret veya limit uyarısı alındığında uygulanabilecek güvenli kontrol adımları.',
    symptoms: ['Ödeme başarısız uyarısı', 'Limit yetersiz mesajı', 'SMS doğrulamasının gelmemesi'],
    causes: ['Mobil ödeme servisinin kapalı olması', 'Aylık veya işlem bazlı limitin dolması', 'Hat üzerinde güvenlik kısıtı', 'Geçici sistem yoğunluğu'],
    checks: [
      { title: 'Mobil ödeme ayarını doğrulayın', text: 'Hat üzerindeki mobil ödeme yetkisinin açık olduğunu resmî kanaldan kontrol edin.' },
      { title: 'Kullanılabilir limiti kontrol edin', text: 'Toplam limit ile kullanılabilir limit aynı olmayabilir; bekleyen işlemler de limiti düşürebilir.' },
      { title: 'SMS ve şebeke durumuna bakın', text: 'Doğrulama SMS’i gelmiyorsa cihazın şebeke bağlantısını ve mesaj engelleme ayarlarını kontrol edin.' },
      { title: 'Resmî destekten işlem kaydı isteyin', text: 'Hata devam ederse operatörün işlem kaydını incelemesi gerekir.' },
    ],
    warnings: ['SMS doğrulama kodunu paylaşmayın.', 'Tekrarlanan başarısız denemeler geçici güvenlik blokesi oluşturabilir.'],
    keywords: ['turkcell mobil ödeme hata', 'turkcell mobil ödeme çalışmıyor', 'mobil ödeme sms gelmiyor'], serviceSlug: 'turkcell-mobil-odeme',
  },
  {
    slug: 'turk-telekom-mobil-odeme-calismiyor', title: 'Türk Telekom Mobil Ödeme Çalışmıyor: Adım Adım Kontrol', product: 'Türk Telekom Mobil Ödeme', category: 'Mobil Ödeme',
    summary: 'Türk Telekom mobil ödeme işlemi tamamlanmıyorsa hat, limit, SMS ve mağaza kontrollerini bu sırayla uygulayın.',
    symptoms: ['Ödeme ekranının ilerlememesi', 'Servis kullanılamıyor uyarısı', 'Doğrulama mesajının gelmemesi'],
    causes: ['Servisin hat üzerinde kapalı olması', 'Limitin dolmuş veya kullanılamaz durumda olması', 'Hat sahipliği veya hesap doğrulama sorunu', 'Mağaza ya da operatör tarafında geçici kesinti'],
    checks: [
      { title: 'Servis uygunluğunu doğrulayın', text: 'Mobil ödeme özelliğinin hattınızda kullanılabilir olduğunu resmî operatör kanallarından kontrol edin.' },
      { title: 'Limit ve bekleyen işlemleri inceleyin', text: 'Bekleyen işlemler kullanılabilir limiti geçici olarak azaltabilir.' },
      { title: 'Telefonu ve bağlantıyı yenileyin', text: 'Şebeke bağlantısını yenileyip cihazı yeniden başlatmak SMS teslim sorunlarında yardımcı olabilir.' },
      { title: 'Aynı işlemi sürekli tekrarlamayın', text: 'Kısa sürede çok fazla deneme güvenlik kontrolünü tetikleyebilir.' },
    ],
    warnings: ['Resmî olmayan kişilerden limit açma veya servis aktifleştirme hizmeti almayın.', 'İşlem ayrıntılarını yalnızca resmî destek kanalıyla paylaşın.'],
    keywords: ['türk telekom mobil ödeme çalışmıyor', 'mobil ödeme hata', 'mobil ödeme sms'], serviceSlug: 'turk-telekom-mobil-odeme',
  },
  {
    slug: 'paycell-kart-calismiyor', title: 'Paycell Kart Çalışmıyor: İnternet Alışverişi ve Limit Kontrolü', product: 'Paycell', category: 'Dijital Cüzdan',
    summary: 'Paycell kartla ödeme reddediliyorsa kart ayarı, bakiye, limit ve mağaza uyumluluğunu kontrol edin.',
    symptoms: ['Kartın reddedilmesi', 'İnternet alışverişinin tamamlanmaması', 'Bakiye olduğu hâlde ödeme yapılamaması'],
    causes: ['İnternet alışverişi ayarının kapalı olması', 'Kullanılabilir bakiyenin yetersiz olması', 'Kart veya hesap üzerinde geçici güvenlik kısıtı', 'Mağazanın kart türünü desteklememesi'],
    checks: [
      { title: 'Kart ayarlarını kontrol edin', text: 'Uygulamadaki kart ayarlarından internet alışverişi iznini ve kart durumunu inceleyin.' },
      { title: 'Bakiye ile kullanılabilir tutarı karşılaştırın', text: 'Bekleyen işlemler veya provizyonlar kullanılabilir bakiyeyi azaltabilir.' },
      { title: 'Mağaza ve ürün uyumluluğunu doğrulayın', text: 'Bazı dijital ürünler veya satıcılar belirli kart türlerini kabul etmeyebilir.' },
      { title: 'Uygulamayı güncelleyin', text: 'Eski uygulama sürümü kart bilgilerinin veya güvenlik adımlarının doğru çalışmasını engelleyebilir.' },
    ],
    warnings: ['Kart numarası, CVV ve doğrulama kodunu üçüncü kişilerle paylaşmayın.', 'Kart durumunu yalnızca uygulama ve resmî destek üzerinden kontrol edin.'],
    keywords: ['paycell kart çalışmıyor', 'paycell ödeme reddedildi', 'paycell internet alışverişi'], serviceSlug: 'paycell',
  },
  {
    slug: 'pokus-kart-hata-veriyor', title: 'Pokus Kart Hata Veriyor: Ödeme Sorunları Kontrol Rehberi', product: 'Pokus', category: 'Dijital Cüzdan',
    summary: 'Pokus kartla ödeme sırasında hata alıyorsanız kart durumu, bakiye, güvenlik ayarı ve mağaza uygunluğunu kontrol edin.',
    symptoms: ['Kart reddedildi mesajı', 'Ödeme ekranında hata', 'Bakiye olmasına rağmen işlemin tamamlanmaması'],
    causes: ['Kartın çevrim içi ödemeye kapalı olması', 'Yetersiz kullanılabilir bakiye', 'Geçici güvenlik kısıtı', 'Satıcı veya ödeme altyapısı uyumsuzluğu'],
    checks: [
      { title: 'Kart durumuna bakın', text: 'Pokus uygulamasında kartın aktif ve çevrim içi alışverişe açık olduğunu kontrol edin.' },
      { title: 'Provizyonları inceleyin', text: 'Bekleyen provizyonlar görünür bakiyeden farklı bir kullanılabilir tutar oluşturabilir.' },
      { title: 'Satıcı bilgilerini kontrol edin', text: 'Dijital ürünlerde satıcı, bölge ve teslimat koşulları ödeme sonucunu etkileyebilir.' },
      { title: 'Resmî destek kaydı oluşturun', text: 'Sorun birden fazla mağazada sürüyorsa uygulama içi veya resmî destek kanalına başvurun.' },
    ],
    warnings: ['Kart bilgilerinizi ekran görüntüsü olarak paylaşmayın.', 'Hesabınıza uzaktan erişim isteyen kişilere izin vermeyin.'],
    keywords: ['pokus kart hata', 'pokus çalışmıyor', 'pokus ödeme reddedildi'], serviceSlug: 'pokus',
  },
  {
    slug: 'razer-gold-kodu-gecersiz', title: 'Razer Gold Kodu Geçersiz Görünüyor: Ne Yapılmalı?', product: 'Razer Gold', category: 'Dijital Kod',
    summary: 'Razer Gold kodu geçersiz, kullanılmış veya bölge uyumsuz görünüyorsa kodu yeniden paylaşmadan önce bu kontrolleri yapın.',
    symptoms: ['Kod geçersiz uyarısı', 'Kod daha önce kullanılmış mesajı', 'Bölge veya para birimi uyuşmazlığı'],
    causes: ['Kodun yanlış girilmesi', 'Kodun başka hesapta kullanılmış olması', 'Kod bölgesinin hesap bölgesiyle uyuşmaması', 'Satıcı kaynaklı teslimat sorunu'],
    checks: [
      { title: 'Karakterleri dikkatle kontrol edin', text: 'Benzer görünen harf ve rakamları, boşlukları ve tireleri kontrol ederek kodu tekrar girin.' },
      { title: 'Bölge ve para birimini doğrulayın', text: 'Kodun ülke ve para birimi, kullanılacağı hesapla uyumlu olmalıdır.' },
      { title: 'Satın alma kaydını saklayın', text: 'Sipariş numarası, teslim saati ve satıcı bilgisi destek talebinde gerekli olabilir.' },
      { title: 'Kodu herkese açık paylaşmayın', text: 'Sorunu çözmek için kodun tamamını forum veya sosyal medyada yayımlamayın.' },
    ],
    warnings: ['Kodun tamamını ekran görüntüsüyle paylaşmak kodun çalınmasına yol açabilir.', 'Kullanılmış kodlar tekrar aktif hâle getirilemez; satıcı ve resmî destek incelemesi gerekir.'],
    keywords: ['razer gold kodu geçersiz', 'razer kod çalışmıyor', 'razer gold kod kullanılmış'], serviceSlug: 'razer-gold-tl',
  },
  {
    slug: 'steam-cuzdan-kodu-kullanilmiyor', title: 'Steam Cüzdan Kodu Kullanılmıyor: Bölge ve Kod Kontrolü', product: 'Steam', category: 'Dijital Kod',
    summary: 'Steam cüzdan kodu kabul edilmiyorsa kod yazımı, hesap bölgesi, para birimi ve satın alma kaydını kontrol edin.',
    symptoms: ['Kod kabul edilmiyor', 'Bölge hatası', 'Kod daha önce kullanılmış uyarısı'],
    causes: ['Yanlış veya eksik kod girişi', 'Hesap ve kod bölgesinin uyuşmaması', 'Kodun daha önce kullanılmış olması', 'Satıcı teslimat hatası'],
    checks: [
      { title: 'Kodu yeniden okuyun', text: 'Karakterleri tek tek kontrol edin; özellikle 0/O ve 1/I gibi benzer karakterlere dikkat edin.' },
      { title: 'Hesap bölgesini kontrol edin', text: 'Kodun para birimi ve bölgesinin Steam hesabınızla uyumlu olması gerekir.' },
      { title: 'Satın alma belgesini hazırlayın', text: 'Satıcı desteğine başvururken sipariş ve teslim bilgilerini hazır bulundurun.' },
      { title: 'Resmî destek yolunu kullanın', text: 'Kodun kullanılmış görünmesi durumunda yalnızca satıcı ve Steam desteği işlem geçmişini inceleyebilir.' },
    ],
    warnings: ['Kodun tamamını paylaşmayın.', 'Bölge değiştirme veya hesap devri gibi riskli yöntemlere başvurmayın.'],
    keywords: ['steam kodu çalışmıyor', 'steam cüzdan kodu geçersiz', 'steam kod bölge hatası'], serviceSlug: 'steam',
  },
  {
    slug: 'apple-gift-card-etkinlestirilemiyor', title: 'Apple Gift Card Etkinleştirilemiyor: Bölge ve Hesap Kontrolü', product: 'Apple Gift Card', category: 'Hediye Kartı',
    summary: 'Apple Gift Card kodu kullanılamıyor veya etkinleştirilemiyor uyarısı veriyorsa hesap bölgesi ve satın alma durumunu kontrol edin.',
    symptoms: ['Kod kullanılamıyor uyarısı', 'Kart etkinleştirilmemiş mesajı', 'Ülke veya bölge uyuşmazlığı'],
    causes: ['Kartın satış noktasında etkinleştirilmemiş olması', 'Apple hesabı bölgesiyle kod bölgesinin farklı olması', 'Kodun yanlış girilmesi', 'Kodun daha önce kullanılmış olması'],
    checks: [
      { title: 'Hesap ülkesini kontrol edin', text: 'Apple hesabınızın ülke veya bölgesi, hediye kartının bölgesiyle eşleşmelidir.' },
      { title: 'Fiş ve satın alma kanıtını saklayın', text: 'Etkinleştirme sorunu için satış fişi veya sipariş kaydı gerekebilir.' },
      { title: 'Kodu güvenli biçimde yeniden girin', text: 'Kod karakterlerini kontrol edin ve yalnızca resmî Apple ekranında kullanın.' },
      { title: 'Satıcı veya Apple desteğine başvurun', text: 'Etkinleştirilmemiş kartlarda satış noktası kaydı incelenmelidir.' },
    ],
    warnings: ['Apple hesabı parolanızı veya doğrulama kodunu paylaşmayın.', 'Hediye kartı kodunu doğrulama bahanesiyle üçüncü kişilere göndermeyin.'],
    keywords: ['apple gift card etkinleştirilemiyor', 'itunes kodu çalışmıyor', 'apple gift card bölge hatası'], serviceSlug: 'itunes-apple',
  },
  {
    slug: 'mobil-odeme-sms-gelmiyor', title: 'Mobil Ödeme SMS’i Gelmiyor: Telefon ve Hat Kontrolleri', product: 'Mobil Ödeme SMS', category: 'Mobil Ödeme',
    summary: 'Ödeme doğrulama SMS’i gelmiyorsa şebeke, mesaj engelleme, hat durumu ve tekrar deneme aralığını kontrol edin.',
    symptoms: ['Doğrulama SMS’inin gelmemesi', 'SMS’in geç gelmesi', 'Kod süresinin dolması'],
    causes: ['Şebeke veya mesaj teslim gecikmesi', 'Kısa numara mesajlarının engellenmesi', 'Hat üzerinde servis kısıtı', 'Çok sık doğrulama talebi'],
    checks: [
      { title: 'Şebeke bağlantısını yenileyin', text: 'Uçak modunu kısa süre açıp kapatın veya cihazı yeniden başlatın.' },
      { title: 'Mesaj engelleme ayarlarını kontrol edin', text: 'Kısa numaralardan gelen mesajların engellenmediğinden emin olun.' },
      { title: 'Bir süre bekleyin', text: 'Art arda kod istemek gecikmeyi veya geçici blokeyi artırabilir.' },
      { title: 'Operatör desteğine başvurun', text: 'Sorun farklı işlemlerde de devam ediyorsa hat üzerindeki mesaj ve mobil ödeme servisleri kontrol edilmelidir.' },
    ],
    warnings: ['Gelen doğrulama kodunu kimseyle paylaşmayın.', 'Aynı anda birden fazla ödeme ekranını açık bırakmayın.'],
    keywords: ['mobil ödeme sms gelmiyor', 'doğrulama kodu gelmiyor', 'mobil ödeme mesajı'],
  },
  {
    slug: 'mobil-odeme-limit-sifir-gorunuyor', title: 'Mobil Ödeme Limiti Sıfır Görünüyor: Olası Nedenler', product: 'Mobil Ödeme Limiti', category: 'Mobil Ödeme',
    summary: 'Mobil ödeme limitiniz sıfır veya beklenenden düşük görünüyorsa fatura, bekleyen işlem, hat yaşı ve operatör değerlendirmesini kontrol edin.',
    symptoms: ['Kullanılabilir limitin sıfır görünmesi', 'Limitin aniden düşmesi', 'Toplam limit ile kullanılabilir limitin farklı olması'],
    causes: ['Bekleyen veya tamamlanmamış işlemler', 'Fatura veya ödeme durumu', 'Operatörün risk ve kullanım değerlendirmesi', 'Yeni hat ya da hat değişikliği'],
    checks: [
      { title: 'Bekleyen işlemleri kontrol edin', text: 'Provizyon veya bekleyen mobil ödeme işlemleri kullanılabilir limiti geçici olarak azaltabilir.' },
      { title: 'Fatura durumunu inceleyin', text: 'Gecikmiş veya henüz sisteme yansımamış ödeme limit kullanımını etkileyebilir.' },
      { title: 'Limit türünü ayırt edin', text: 'Toplam limit, işlem limiti ve kullanılabilir limit aynı değer olmayabilir.' },
      { title: 'Resmî açıklama isteyin', text: 'Limit kararı operatöre aittir; kesin neden için resmî destek kanalına başvurun.' },
    ],
    warnings: ['Limit artırma vaadiyle ödeme isteyen kişilere güvenmeyin.', 'Operatör limitleri önceden haber verilmeden değişebilir.'],
    keywords: ['mobil ödeme limiti sıfır', 'mobil ödeme limit neden düştü', 'kullanılabilir limit'],
  },
  {
    slug: 'dijital-kod-teslim-edilmedi', title: 'Dijital Kod Teslim Edilmedi: Sipariş Sonrası Ne Yapılmalı?', product: 'Dijital Kod Teslimatı', category: 'Dijital Kod',
    summary: 'Ödeme tamamlandığı hâlde dijital kod gelmediyse sipariş durumu, e-posta, spam klasörü ve satıcı teslim süresini kontrol edin.',
    symptoms: ['Sipariş tamamlandı fakat kod yok', 'E-posta teslimi gelmedi', 'Sipariş beklemede görünüyor'],
    causes: ['Otomatik teslimat gecikmesi', 'Ödeme provizyonunun tamamlanmaması', 'E-postanın spam klasörüne düşmesi', 'Satıcının manuel doğrulama yapması'],
    checks: [
      { title: 'Sipariş durumunu inceleyin', text: 'Siparişin tamamlandı, hazırlanıyor veya incelemede olup olmadığını kontrol edin.' },
      { title: 'E-posta klasörlerini kontrol edin', text: 'Spam, gereksiz ve tanıtım klasörlerine bakın.' },
      { title: 'Teslim süresini okuyun', text: 'Bazı satıcılar anlık değil belirli süre içinde dijital teslimat yapar.' },
      { title: 'Satıcı desteğine sipariş numarasıyla yazın', text: 'Kod gelmeden aynı ürünü yeniden satın almak yerine ilk siparişin durumunu netleştirin.' },
    ],
    warnings: ['Teslim edilmeyen kod için şüpheli üçüncü taraflara hesap erişimi vermeyin.', 'Aynı siparişi tekrar oluşturmadan önce ilk ödemenin durumunu doğrulayın.'],
    keywords: ['dijital kod teslim edilmedi', 'hediye kartı kodu gelmedi', 'sipariş beklemede'],
  },
  {
    slug: 'odeme-beklemede-kaldi', title: 'Ödeme Beklemede Kaldı: Provizyon ve İşlem Durumu Rehberi', product: 'Bekleyen Ödeme', category: 'Dijital Cüzdan',
    summary: 'Kart veya mobil ödeme işlemi beklemede kaldıysa yeni işlem yapmadan önce provizyon ve sipariş durumunu ayrı ayrı kontrol edin.',
    symptoms: ['Tutar düşmüş fakat sipariş oluşmamış', 'İşlem beklemede görünüyor', 'Aynı ödeme iki kez denenmiş'],
    causes: ['Provizyonun henüz kesinleşmemesi', 'Mağaza ile ödeme altyapısı arasındaki gecikme', 'İşlem sırasında bağlantının kesilmesi', 'Tekrarlanan ödeme denemeleri'],
    checks: [
      { title: 'Banka veya cüzdan hareketini kontrol edin', text: 'İşlemin kesinleşmiş mi yoksa bekleyen provizyon mu olduğunu ayırt edin.' },
      { title: 'Sipariş kaydını inceleyin', text: 'Mağaza hesabında sipariş oluşup oluşmadığını kontrol edin.' },
      { title: 'Yeni ödeme yapmadan bekleyin', text: 'İşlem sonucu netleşmeden tekrar ödeme yapmak çift çekim riskini artırabilir.' },
      { title: 'Her iki taraftan kayıt isteyin', text: 'Gerekirse mağaza ve ödeme sağlayıcısına işlem tarihi ve tutarıyla başvurun.' },
    ],
    warnings: ['Bekleyen işlem kesinleşmeden aynı tutarı tekrar ödemeyin.', 'İşlem ekranı veya dekont paylaşırken kişisel bilgileri maskeleyin.'],
    keywords: ['ödeme beklemede kaldı', 'provizyon bekliyor', 'sipariş oluşmadı ödeme çekildi'],
  },
];

export function getTroubleshootingGuide(slug: string) {
  return troubleshootingGuides.find((guide) => guide.slug === slug);
}
