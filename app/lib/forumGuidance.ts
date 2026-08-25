export type ForumGuidance = {
  title: string;
  summary: string;
  checks: string[];
  links: { label: string; href: string }[];
};

type GuidanceSeed = Omit<ForumGuidance, 'title'>;

const links = {
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
};

const mobile: GuidanceSeed = {
  summary: 'İşleme geçmeden önce ödeme yöntemini, hat durumunu ve hangi bilgilerin asla paylaşılmaması gerektiğini birlikte kontrol edin.',
  checks: ['İşlemin hangi uygulama veya mağazada yapılacağını netleştirin.', 'Güncel limit ve varsa bekleyen tahsilatları resmî hesabınızdan kontrol edin.', 'Şifre, SMS doğrulama kodu ve uzaktan erişim talebini kabul etmeyin.'],
  links: [links.mobile, links.safe, links.trust],
};
const code: GuidanceSeed = {
  summary: 'Dijital kodlarda para birimi, bölge ve kullanılmamış olma koşulu birlikte değerlendirilmelidir.',
  checks: ['Kodun ürün adı, para birimi ve bölgesini teslim etmeden önce karşılaştırın.', 'Kodu üçüncü kişilerle paylaşmadan önce koşulları yazılı olarak netleştirin.', 'Hata varsa satın alma kaydı ve hata ekranını saklayın.'],
  links: [links.gift, links.trust, links.fraud],
};
const wallet: GuidanceSeed = {
  summary: 'Dijital cüzdan ve mobil ödeme aynı işlem değildir; ödeme kaynağını ve uygulamadaki koşulları ayrı ayrı kontrol edin.',
  checks: ['Ödemenin cüzdan bakiyesinden mi, telefon hattından mı çekileceğini kontrol edin.', 'Limit ve bekleyen işlem bilgisi için yalnızca uygulamanın resmî ekranını kullanın.', 'Destek adıyla istenen şifre veya tek kullanımlık kodu paylaşmayın.'],
  links: [links.mobile, links.safe, links.trust],
};
const rates: GuidanceSeed = {
  summary: 'Oranı tek başına değil, net sonuç, olası kesinti ve işlemin güncel koşullarıyla birlikte değerlendirin.',
  checks: ['Brüt değer yerine size yazılı olarak bildirilen net sonucu sorun.', 'Süre, kesinti ve doğrulama koşullarını aynı teyitte görün.', 'Olağan dışı yüksek tekliflerde resmî iletişim bilgisini çapraz kontrol edin.'],
  links: [links.rates, links.trust, links.fraud],
};
const safety: GuidanceSeed = {
  summary: 'Güvenlik kontrolü; alan adı, resmî iletişim kanalı ve istenen bilgi türünü birlikte doğrulamayı gerektirir.',
  checks: ['Mesajdaki bağlantı yerine site adresini kendiniz yazarak kontrol edin.', 'Parola, SMS kodu, kart güvenlik kodu ve banka girişi paylaşmayın.', 'Şüpheli mesaj ve hata ekranlarının kaydını saklayın.'],
  links: [links.trust, links.safe, links.fraud],
};
const community: GuidanceSeed = {
  summary: 'Konuyu doğru bölümde, kişisel bilgi ve kullanılabilir kod paylaşmadan açmak daha hızlı ve sağlıklı bir yanıt alınmasını sağlar.',
  checks: ['Başlıkta hizmeti ve yaşadığınız durumu kısa biçimde belirtin.', 'Tarih, hata metni ve işlem numarasının güvenli kısmı gibi doğrulanabilir bilgiler ekleyin.', 'Şifre, doğrulama kodu, tam kod veya başka kişilere ait verileri paylaşmayın.'],
  links: [links.mobile, links.trust, links.fraud],
};

const byTopic: Record<string, GuidanceSeed> = {
  'mobil-odeme-bozum-islemi-nasil-ilerler': mobile,
  'turkcell-mobil-odeme-kullanirken-nelere-dikkat-edilmeli': { ...mobile, links: [links.turkcell, links.paycell, links.safe] },
  'vodafone-ile-dijital-urun-satin-alma-rehberi': { ...mobile, links: [links.vodafone, links.razer, links.apple] },
  'turk-telekom-mobil-odeme-hakkinda-temel-bilgiler': { ...mobile, links: [links.telekom, links.pokus, links.safe] },
  'mobil-odeme-islemi-neden-reddedilebilir': mobile,
  'razer-gold-tl-bozum-islemi-nasil-yapilir': { ...code, links: [links.razer, links.razerInfo, links.trust] },
  'razer-gold-usd-ile-tl-kodlari-arasindaki-farklar': { ...code, links: [links.razerInfo, links.razer, links.gift] },
  'apple-hediye-karti-bozum-oncesi-kontrol-listesi': { ...code, links: [links.apple, links.gift, links.trust] },
  'steam-kodlarinda-bolge-ve-para-birimi-neden-onemlidir': code,
  'gecersiz-veya-daha-once-kullanilmis-kod-durumunda-ne-yapilmali': { ...code, links: [links.gift, links.fraud, links.trust] },
  'paycell-ile-dijital-urun-satin-alma-rehberi': { ...wallet, links: [links.paycell, links.turkcell, links.safe] },
  'pokus-bakiyesi-nasil-degerlendirilir': { ...wallet, links: [links.pokus, links.telekom, links.razer] },
  'vodafone-pay-ile-mobil-odeme-arasindaki-fark-nedir': { ...wallet, links: [links.vodafone, links.mobile, links.safe] },
  'dijital-cuzdanlarda-gunluk-ve-aylik-limit-mantigi': wallet,
  'dijital-cuzdan-islemi-beklemede-kaldiginda-ne-kontrol-edilmeli': { ...wallet, links: [links.paycell, links.pokus, links.safe] },
  'bozum-oranlari-neden-degisebilir': rates,
  '1000-tl-bakiyeden-elime-ne-kadar-gecer': rates,
  'bozum-orani-ile-komisyon-arasindaki-fark-nedir': rates,
  'bozum-sonrasi-odeme-ne-kadar-surede-gelir': rates,
  'gercekci-olmayan-yuksek-oran-tekliflerine-neden-dikkat-edilmeli': { ...rates, links: [links.trust, links.fraud, links.rates] },
  'bozum-isleminde-hangi-bilgiler-paylasilabilir': safety,
  'sms-kodu-ve-hesap-sifresi-neden-paylasilmamali': safety,
  'sahte-bozum-sitelerini-anlamanin-temel-yollari': safety,
  'dogru-sky-bozum-whatsapp-hesabi-nasil-kontrol-edilir': safety,
  'supheli-bir-teklif-veya-mesaj-aldiginizda-ne-yapmalisiniz': safety,
  'sky-bozum-topluluk-alani-kullanim-rehberi': community,
  'ilk-kez-bozum-yapacaklar-icin-baslangic-rehberi': community,
  'yeni-musterilerden-en-sik-gelen-10-soru': community,
  'sky-bozumda-gormek-istediginiz-ozellikleri-paylasin': community,
  'mobil-odeme-ve-dijital-bakiye-dunyasi-hakkinda-genel-sohbet': community,
};

export function getForumGuidance(topicSlug: string, topicTitle: string): ForumGuidance {
  const guidance = byTopic[topicSlug] ?? community;
  return { title: `${topicTitle} için hızlı kontrol`, ...guidance };
}

export const forumGuidanceTopicSlugs = Object.keys(byTopic);
