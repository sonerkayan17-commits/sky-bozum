import type { SkyReference } from './skyReferences.types';

export const WM_ARACI_TOPIC_URL =
  'https://wmaraci.com/forum/bakiye-islemleri/itunes-sms-4560-razer-gold-tl-usd-6075-tum-bozum-islemleri-5080-7-24-aktif-guvenli-bozum-664885.html';

const wmPage = (page: number) =>
  page === 1
    ? WM_ARACI_TOPIC_URL
    : `https://wmaraci.com/forum/bakiye-islemleri/itunes-sms-4560-razer-gold-tl-usd-6075-tum-bozum-islemleri-5080-7-24-aktif-guvenli-bozum-664885-${page}.html`;

const approved = (maskedFields: string[] = ['authorLabel']) => ({
  status: 'approved' as const,
  maskedFields,
});

export const skyReferences: SkyReference[] = [
  {
    id: 'wm-political-2021-02-04', source: 'wmaraci', service: 'mobil-odeme',
    authorLabel: 'political', title: 'Ödeme başarıyla tamamlandı',
    excerpt: '200 lira için gönderim yapıldı, ödeme alındı.', publishedAt: '2021-02-04',
    sourceUrl: wmPage(1), sourcePostLabel: '#5', verified: true, featured: true,
    tags: ['ödeme', 'tamamlandı', 'mobil ödeme'], tradeScore: '38 işlem · %100',
    verificationNote: 'Kullanıcı adı, tarih ve mesaj numarası herkese açık forum konusu üzerinden kontrol edilebilir.',
    privacyReview: approved([]),
  },
  {
    id: 'wm-ilkanavsar01-2021-02-13', source: 'wmaraci', service: 'mobil-odeme',
    authorLabel: 'ilkanavsar01', title: 'Dakikalar içinde sonuçlanan işlem',
    excerpt: '5 dakikada halloldu. Teşekkür ediyorum, gerçekten güvenilir.', publishedAt: '2021-02-13',
    sourceUrl: wmPage(1), sourcePostLabel: '#8', verified: true,
    tags: ['hız', 'güven', 'ödeme'], tradeScore: '1 işlem · %100',
    verificationNote: 'Yorum, kullanıcı adı ve tarih bilgisiyle herkese açık forum sayfasında yer alır.',
    privacyReview: approved([]),
  },
  {
    id: 'wm-mdeniz87-2021-02-27', source: 'wmaraci', service: 'genel',
    authorLabel: 'Mdeniz87', title: 'Söz verildiği gibi tamamlandı',
    excerpt: 'Sorunsuz işlem. Ne diyorsa o, anında işlem.', publishedAt: '2021-02-27',
    sourceUrl: wmPage(1), sourcePostLabel: '#10', verified: true,
    tags: ['sorunsuz', 'anında', 'güven'],
    verificationNote: 'Yorumun özü korunmuş, yalnızca okunabilirlik için düzenlenmiştir.',
    privacyReview: approved([]),
  },
  {
    id: 'wm-blue1907-2021-03-10', source: 'wmaraci', service: 'mobil-odeme',
    authorLabel: 'Blue1907', title: 'Üç dakikada tamamlanan bozum',
    excerpt: 'Az önce mobil ödeme bozuldu; işlem 3 dakikada tamamlandı. Teşekkürler.', publishedAt: '2021-03-10',
    sourceUrl: wmPage(2), sourcePostLabel: '#12', verified: true,
    tags: ['3 dakika', 'mobil ödeme', 'tamamlandı'], tradeScore: '1 işlem · %100',
    verificationNote: 'Mesaj, ikinci forum sayfasındaki #12 numaralı gönderide açıkça görülebilir.',
    privacyReview: approved([]),
  },
  {
    id: 'wm-erkan20-2021-03-27', source: 'wmaraci', service: 'mobil-odeme',
    authorLabel: 'erkan20', title: 'IBAN sonrası hızlı ödeme',
    excerpt: 'Mobil ödeme bozduruldu; IBAN gönderdikten sonra ödeme anında yapıldı. Teşekkürler.', publishedAt: '2021-03-27',
    sourceUrl: wmPage(2), sourcePostLabel: '#13', verified: true,
    tags: ['iban', 'anında ödeme', 'mobil ödeme'],
    verificationNote: 'Kullanıcı adı, tarih ve mesaj metni forum sayfasında herkese açık durumdadır.',
    privacyReview: approved([]),
  },
  {
    id: 'wm-ve1969-2021-04-19', source: 'wmaraci', service: 'genel',
    authorLabel: 've1969', title: 'Beş dakikadan kısa süren işlem',
    excerpt: 'Sıkıntısız bozum, tavsiye ederim; 5 dakika sürmedi.', publishedAt: '2021-04-19',
    sourceUrl: wmPage(2), sourcePostLabel: '#14', verified: true,
    tags: ['tavsiye', 'hız', 'sorunsuz'], tradeScore: '1 işlem · %100',
    verificationNote: 'Forum mesajındaki ifade yalnızca noktalama açısından düzenlenmiştir.',
    privacyReview: approved([]),
  },
  {
    id: 'wm-aydmr7171-2021-07-01', source: 'wmaraci', service: 'genel',
    authorLabel: 'aydmr7171', title: 'Rahatlıkla tavsiye edilen süreç',
    excerpt: 'Sorunsuz işlem yapıldı; güvenilir, rahatlıkla işlem sağlayabilirsiniz.', publishedAt: '2021-07-01',
    sourceUrl: wmPage(3), sourcePostLabel: '#21', verified: true,
    tags: ['güvenilir', 'sorunsuz', 'tavsiye'],
    verificationNote: 'Mesaj, üçüncü forum sayfasındaki #21 numaralı gönderiden aktarılmıştır.',
    privacyReview: approved([]),
  },
  {
    id: 'wm-silence-2021-07-02', source: 'wmaraci', service: 'genel',
    authorLabel: 'Silence', title: 'Tekrarlanan işlemlerde de aynı hız',
    excerpt: 'İki gündür işlem yapıyoruz; gayet hızlı ve güvenilir.', publishedAt: '2021-07-02',
    sourceUrl: wmPage(3), sourcePostLabel: '#22', verified: true, featured: true,
    tags: ['tekrar işlem', 'hız', 'güven'], tradeScore: '2 işlem · %100',
    verificationNote: 'Tek seferlik değil, iki günlük işlem deneyimini belirten herkese açık yorumdur.',
    privacyReview: approved([]),
  },
  {
    id: 'wm-casper082-2021-07-21', source: 'wmaraci', service: 'genel',
    authorLabel: 'casper082', title: 'Hızlı ve güvenilir işlem deneyimi',
    excerpt: 'Hızlı ve güvenilir işlem için doğru adres.', publishedAt: '2021-07-21',
    sourceUrl: wmPage(3), sourcePostLabel: '#26', verified: true,
    tags: ['hız', 'güven', 'tavsiye'], tradeScore: '8 işlem · %100',
    verificationNote: 'Kullanıcının forum ticaret özeti ve yorumu aynı açık sayfada görülebilir.',
    privacyReview: approved([]),
  },
  {
    id: 'wm-rogerfederer-2021-07-23', source: 'wmaraci', service: 'genel',
    authorLabel: 'rogerfederer', title: 'Hızlı şekilde tamamlanan işlem',
    excerpt: 'Hızlı bir şekilde işlem yaptık, teşekkürler.', publishedAt: '2021-07-23',
    sourceUrl: wmPage(3), sourcePostLabel: '#27', verified: true,
    tags: ['hız', 'tamamlandı', 'teşekkür'],
    verificationNote: 'Mesaj üçüncü forum sayfasında kullanıcı adı ve tarihiyle birlikte bulunur.',
    privacyReview: approved([]),
  },
  {
    id: 'wm-dexter39-2021-07-31', source: 'wmaraci', service: 'genel',
    authorLabel: 'dexter39', title: 'İki farklı numarada sorunsuz teslimat',
    excerpt: 'İki farklı numaradan işlem yapıldı; hızlı ve sorunsuz teslimat. Tekrar teşekkür ederim.', publishedAt: '2021-07-31',
    sourceUrl: wmPage(3), sourcePostLabel: '#29', verified: true,
    tags: ['iki numara', 'sorunsuz', 'hızlı teslimat'], tradeScore: '1 işlem · %100',
    verificationNote: 'Birden fazla işlem noktasını belirten, forumda doğrulanabilir yorumdur.',
    privacyReview: approved([]),
  },
];
