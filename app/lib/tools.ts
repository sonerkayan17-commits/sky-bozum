import type { Metadata } from 'next';
import { createMetadata } from './seo';

export type ToolAction = {
  href: string;
  label: string;
};

export type ToolEditorialItem = {
  title: string;
  text: string;
};

export type ToolDefinition = {
  id: ToolId;
  title: string;
  shortTitle: string;
  description: string;
  seoDescription: string;
  href: string;
  keywords: readonly string[];
  eyebrow: string;
  pageTitle: string;
  intro: string;
  editorial: readonly ToolEditorialItem[];
  action?: ToolAction;
  related: readonly ToolId[];
};

export type ToolId =
  | 'mobil-odeme'
  | 'hedef-odeme'
  | 'oran-karsilastirma'
  | 'kod-adedi'
  | 'gift-card'
  | 'sms'
  | 'cihaz-maliyeti'
  | 'islem-sihirbazi';

const definitions: Record<ToolId, ToolDefinition> = {
  'mobil-odeme': {
    id: 'mobil-odeme',
    title: 'Mobil Ödeme Sonucu Hesaplama',
    shortTitle: 'Mobil Ödeme Hesaplayıcı',
    description: 'Operatör ve tutara göre tahmini net ödeme aralığını görün.',
    seoDescription: 'Vodafone, Turkcell ve Türk Telekom mobil ödeme tutarlarının tahmini net ödeme aralığını hesaplayın.',
    href: '/araclar/mobil-odeme-hesaplama',
    keywords: ['mobil ödeme hesaplama', 'vodafone hesaplama', 'turkcell hesaplama', 'türk telekom hesaplama'],
    eyebrow: 'Operatör hesaplama aracı',
    pageTitle: 'Mobil ödeme sonucunu hesaplayın',
    intro: 'Operatör ve tutarı seçerek bilgilendirme oranlarına göre tahmini ödeme aralığını görün.',
    editorial: [
      { title: 'Sonuç neden aralık olarak gösterilir?', text: 'Hat limiti, operatör koşulları, ürün türü ve güncel işlem uygunluğu oranı etkileyebilir. Bu nedenle araç tek bir kesin sonuç yerine tahmini aralık gösterir.' },
      { title: 'İşlem oluşturmadan önce teyit edin', text: 'Mobil ödeme limitiniz açık görünse bile güncel uygunluk değişebilir. Herhangi bir onay vermeden önce tutarı ve yöntemi yazılı olarak doğrulayın.' },
    ],
    action: { href: '/operatorler', label: 'Operatör rehberlerini aç' },
    related: ['sms', 'oran-karsilastirma', 'islem-sihirbazi'],
  },
  'hedef-odeme': {
    id: 'hedef-odeme',
    title: 'Hedef Ödeme İçin Gereken Bakiye Hesaplama',
    shortTitle: 'Hedef Ödeme Hesaplama',
    description: 'Almak istediğiniz net tutar için gereken yaklaşık bakiyeyi bulun.',
    seoDescription: 'Hedeflediğiniz net ödeme için Razer Gold, mobil ödeme, Paycell, Pokus, Apple ve Steam bakiyesinden yaklaşık ne kadar gerektiğini hesaplayın.',
    href: '/araclar/hedef-odeme-hesaplama',
    keywords: ['hedef ödeme', 'gereken bakiye', 'ters hesaplama'],
    eyebrow: 'Ters hesaplama aracı',
    pageTitle: 'Hedef ödeme için gereken bakiyeyi bulun',
    intro: 'Elinize geçmesini istediğiniz tahmini net tutarı yazın; seçtiğiniz hizmetin bilgilendirme oranlarına göre gerekli bakiye aralığını görün.',
    editorial: [
      { title: 'Hesaplama nasıl yapılır?', text: 'Hedef ödeme, seçilen oran yüzdesine bölünür. Örneğin yüzde 50 oranında 1.000 TL hedef için yaklaşık 2.000 TL bakiye gerekir.' },
      { title: 'Planlama sonucu olarak değerlendirin', text: 'Hizmet türü, ürün uygunluğu ve güncel koşullar oranı değiştirebilir. Sonucu bütçe planı için kullanın; satın alma öncesinde oranı yeniden teyit edin.' },
    ],
    action: { href: '/araclar#oran-hesapla', label: 'Ana oran hesaplayıcıya dön' },
    related: ['oran-karsilastirma', 'mobil-odeme', 'gift-card'],
  },
  'oran-karsilastirma': {
    id: 'oran-karsilastirma',
    title: 'Bozum Oranı Karşılaştırma Hesaplama',
    shortTitle: 'Oran Karşılaştırma',
    description: 'Aynı tutarın tüm hizmetlerdeki tahmini karşılığını sıralayın.',
    seoDescription: 'Razer Gold, Apple, Steam ve desteklenen diğer dijital kod başlangıç oranlarını aynı tutar üzerinden karşılaştırın.',
    href: '/araclar/oran-karsilastirma',
    keywords: ['oran karşılaştırma', 'bozum karşılaştır', 'komisyon hesaplama'],
    eyebrow: 'Hizmet karşılaştırma aracı',
    pageTitle: 'Bozum oranlarını aynı tutarda karşılaştırın',
    intro: 'Aynı bakiye tutarının farklı hizmetlerde oluşturabileceği tahmini alt ve üst karşılığı tek tabloda inceleyin.',
    editorial: [
      { title: 'Oran tek başına karar ölçütü değildir', text: 'En yüksek görünen sonuç, elinizdeki bakiye türünün o hizmete uygun olduğu anlamına gelmez. Ürün, bölge ve kullanılabilirlik koşullarını birlikte değerlendirin.' },
      { title: 'Tablo hangi veriyi kullanır?', text: 'Karşılaştırma, sitedeki ortak oran kaynağını kullanır. Güncel işlem oranı ancak ürün ve işlem koşulları kontrol edildiğinde kesinleşir.' },
    ],
    action: { href: '/araclar#oran-hesapla', label: 'Ana oran hesaplayıcıya dön' },
    related: ['hedef-odeme', 'mobil-odeme', 'gift-card'],
  },
  'kod-adedi': {
    id: 'kod-adedi',
    title: 'Dijital Kod Adedi Hesaplama',
    shortTitle: 'Kod Adedi Hesaplama',
    description: 'Toplam tutarı farklı kod değerlerine en verimli şekilde dağıtın.',
    seoDescription: 'Toplam bakiyenin 100 TL, 250 TL, 500 TL veya farklı tutarda kaç tam dijital koda ayrılacağını ve kalan tutarı hesaplayın.',
    href: '/araclar/kod-adedi-hesaplama',
    keywords: ['kod adedi', 'razer kod hesaplama', 'dijital kod'],
    eyebrow: 'Kod dağılım aracı',
    pageTitle: 'Dijital kod adedini hesaplayın',
    intro: 'Toplam bakiyeyi ve kullanabileceğiniz kod değerlerini girerek kaç tam kod oluşacağını ve artan tutarı görün.',
    editorial: [
      { title: 'Dağılım nasıl oluşturulur?', text: 'Araç en yüksek kod değerinden başlayarak toplam tutarı tam kodlara ayırır; hiçbir değere sığmayan bakiye kalan tutar olarak gösterilir.' },
      { title: 'Satın almadan önce ürün bilgisini doğrulayın', text: 'Kod değeri kadar bölge, para birimi ve ürün türü de önemlidir. Dağılımı hazırladıktan sonra hangi kodların kabul edildiğini ayrıca kontrol edin.' },
    ],
    action: { href: '/araclar#oran-hesapla', label: 'Ana oran hesaplayıcıya dön' },
    related: ['gift-card', 'hedef-odeme', 'oran-karsilastirma'],
  },
  'gift-card': {
    id: 'gift-card',
    title: 'Gift Card Hesaplama',
    shortTitle: 'Gift Card Hesaplayıcı',
    description: 'Apple, Steam ve Razer Gold bakiyelerinin tahmini karşılığını hesaplayın.',
    seoDescription: 'Apple, Steam ve Razer Gold dijital kodlarının tahmini ödeme aralığını hesaplayın.',
    href: '/araclar/gift-card-hesaplama',
    keywords: ['gift card hesaplama', 'apple gift card', 'steam kart', 'razer gold'],
    eyebrow: 'Dijital kod aracı',
    pageTitle: 'Gift card karşılığını hesaplayın',
    intro: 'Apple, Steam ve Razer Gold seçenekleri için tutarın tahmini alt ve üst karşılığını tek ekranda görün.',
    editorial: [
      { title: 'Bölge ve para birimini kontrol edin', text: 'Dijital kodlarda ülke, mağaza bölgesi ve para birimi sonucu doğrudan etkiler. Kod satın almadan önce ürünün tam adını ve bölgesini yazılı olarak doğrulayın.' },
      { title: 'Kodu denemeden önce karar verin', text: 'Daha önce kullanılmış, etkinleştirilmeye çalışılmış veya kaynağı belirsiz kodlar kabul edilmeyebilir. İşlem koşullarını kodu açmadan önce netleştirin.' },
    ],
    action: { href: '/araclar/kod-adedi-hesaplama', label: 'Kod adedini de hesapla' },
    related: ['kod-adedi', 'oran-karsilastirma', 'hedef-odeme'],
  },
  sms: {
    id: 'sms',
    title: 'SMS Mobil Ödeme Hesaplama',
    shortTitle: 'SMS Hesaplayıcı',
    description: 'SMS mobil ödeme tutarının tahmini net ödeme aralığını hesaplayın.',
    seoDescription: 'SMS mobil ödeme tutarının tahmini net ödeme aralığını hesaplayın; operatör, limit, onay mesajı ve güncel oran kontrollerini işlemden önce görün.',
    href: '/araclar/sms-hesaplama',
    keywords: ['sms hesaplama', 'sms bozum', 'mobil ödeme'],
    eyebrow: 'SMS ödeme aracı',
    pageTitle: 'SMS mobil ödeme sonucunu hesaplayın',
    intro: 'SMS mobil ödeme yöntemini ve tutarı seçerek yaklaşık ödeme aralığını hesaplayın; operatör koşullarını işlemden önce ayrıca kontrol edin.',
    editorial: [
      { title: 'Hat limitiniz kişiye özel olabilir', text: 'Operatör limiti, hat yaşı, ödeme geçmişi ve güncel kurallar kullanılabilir tutarı değiştirebilir. Araç yalnızca yazdığınız tutarın tahmini karşılığını hesaplar.' },
      { title: 'Onay mesajını dikkatle okuyun', text: 'SMS doğrulamasında hizmet adı ve tutar eşleşmiyorsa işlemi onaylamayın. Şifre veya doğrulama kodunu başka biriyle paylaşmayın.' },
    ],
    action: { href: '/araclar/islem-sihirbazi', label: 'İşlem sihirbazını aç' },
    related: ['mobil-odeme', 'islem-sihirbazi', 'oran-karsilastirma'],
  },
  'cihaz-maliyeti': {
    id: 'cihaz-maliyeti',
    title: 'Faturaya Ek Cihaz Maliyet Hesaplama',
    shortTitle: 'Cihaz Maliyet Simülatörü',
    description: 'Peşin fiyat, vade ve aylık hizmet bedeliyle toplam maliyeti simüle edin.',
    seoDescription: 'Cihaz peşin fiyatı, peşinat, vade ve aylık ek bedelle tahmini toplam maliyeti simüle edin.',
    href: '/araclar/faturaya-ek-cihaz-hesaplama',
    keywords: ['faturaya ek cihaz', 'telefon taksit hesaplama', 'vodafone flex', 'financell'],
    eyebrow: 'Maliyet simülatörü',
    pageTitle: 'Faturaya ek cihaz maliyetini simüle edin',
    intro: 'Kendi teklifinizdeki peşinat, vade ve aylık ek bedeli girerek yaklaşık toplam geri ödemeyi görün.',
    editorial: [
      { title: 'Resmî teklif yerine geçmez', text: 'Operatör kampanyaları, finansman bedelleri ve uygunluk koşulları değişebilir. Bu araç yalnızca sizin girdiğiniz varsayımlarla matematiksel simülasyon yapar.' },
      { title: 'Sözleşmede ayrıca kontrol edin', text: 'Erken kapama, gecikme, sigorta veya ek paket gibi kalemler toplam maliyete dahil olabilir. Karar vermeden önce ödeme planındaki tüm satırları inceleyin.' },
    ],
    action: { href: '/bilgi-merkezi', label: 'Cihaz rehberlerini ara' },
    related: ['islem-sihirbazi', 'mobil-odeme', 'hedef-odeme'],
  },
  'islem-sihirbazi': {
    id: 'islem-sihirbazi',
    title: 'Akıllı İşlem Sihirbazı',
    shortTitle: 'İşlem Sihirbazı',
    description: 'Elinizdeki bakiye veya ürün türüne göre doğru hizmeti ve rehberi bulun.',
    seoDescription: 'Elinizdeki bakiye, dijital kod veya ürün türüne göre doğru hesaplama aracını ve rehberi bulun.',
    href: '/araclar/islem-sihirbazi',
    keywords: ['işlem sihirbazı', 'hangi hizmet', 'bozum rehberi'],
    eyebrow: 'Akıllı yönlendirme',
    pageTitle: 'Doğru işlem yolunu bulun',
    intro: 'Elinizdeki ürün veya bakiye türünü seçin; sistem sizi uygun hesaplama aracına ve konuyla ilgili rehbere yönlendirsin.',
    editorial: [
      { title: 'Yönlendirme neden önce ürün türünü sorar?', text: 'Mobil ödeme, uygulama bakiyesi, dijital kod ve cihaz finansmanı birbirinden farklı kontroller gerektirir. Doğru kategori seçimi yanlış hesaplama ihtimalini azaltır.' },
    ],
    related: ['mobil-odeme', 'gift-card', 'cihaz-maliyeti'],
  },
};

export const toolPages = Object.values(definitions);

export function getToolDefinition(id: ToolId): ToolDefinition {
  return definitions[id];
}

export function getRelatedTools(id: ToolId): ToolDefinition[] {
  return definitions[id].related.map((relatedId) => definitions[relatedId]);
}

export function createToolMetadata(id: ToolId): Metadata {
  const tool = definitions[id];
  return createMetadata({
    title: tool.title,
    description: tool.seoDescription,
    path: tool.href,
    keywords: tool.keywords,
  });
}
