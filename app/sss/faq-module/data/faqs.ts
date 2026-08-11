import type { FaqItem } from "../types/faq";

export const skyFaqItems: FaqItem[] = [
  {
    "id": "en-cok-sorulanlar-1",
    "category": "En Çok Sorulanlar",
    "question": "İşleme başlamadan net ödeme tutarını öğrenebilir miyim?",
    "shortAnswer": "Evet. Ürün türü, tutar, bölge ve güncel oran kontrol edildikten sonra tahmini net ödeme işlem başlamadan yazılı olarak paylaşılır.",
    "answer": "Oran değişebileceği için onay verdiğiniz anda bildirilen net tutarı esas alın; eski ekran görüntülerine göre işlem başlatmayın.",
    "order": 1
  },
  {
    "id": "en-cok-sorulanlar-2",
    "category": "En Çok Sorulanlar",
    "question": "Kodumu ne zaman paylaşmalıyım?",
    "shortAnswer": "Tam kodu, ürün uygunluğu ve net ödeme teyit edildikten sonra yalnızca resmî iletişim kanalında paylaşın.",
    "answer": "Ön değerlendirme tamamlanmadan tam kod göndermek gereksiz risk oluşturur. Banka, uygulama veya e-posta şifrenizi hiçbir aşamada paylaşmayın.",
    "order": 2
  },
  {
    "id": "en-cok-sorulanlar-3",
    "category": "En Çok Sorulanlar",
    "question": "Ödeme genellikle ne zaman yapılır?",
    "shortAnswer": "Ödeme süresi ürün kontrolü, işlem yoğunluğu ve banka altyapısına göre değişebilir.",
    "answer": "Kesin süre verilmesi doğru değildir. İşlem başlamadan önce güncel yoğunluk bilgisi sorulabilir ve tamamlanan ödeme için dekont talep edilebilir.",
    "order": 3
  },
  {
    "id": "en-cok-sorulanlar-4",
    "category": "En Çok Sorulanlar",
    "question": "Hangi bilgileri kesinlikle paylaşmamalıyım?",
    "shortAnswer": "Banka şifresi, kart şifresi, uygulama parolası, e-posta şifresi ve ilgisiz SMS doğrulama kodları paylaşılmamalıdır.",
    "answer": "Yalnızca işlemin doğrulanması için gerekli sınırlı bilgiler kullanılmalıdır. Şüpheli bir talep alırsanız işlemi durdurup resmî kanaldan yeniden doğrulama yapın.",
    "order": 4
  },
  {
    "id": "i-sleme-baslamadan-once-1",
    "category": "İşleme Başlamadan Önce",
    "question": "İşleme başlamadan önce hangi bilgileri hazırlamalıyım?",
    "shortAnswer": "İşleme başlamadan önce ürün türü, tutar, bölge ve ödeme alacağınız IBAN bilgisini hazırlayın.",
    "answer": "Tam kod veya hassas bilgi paylaşmadan önce resmî iletişim kanalını, güncel oranı ve tahmini net ödemeyi doğrulayın.",
    "order": 5
  },
  {
    "id": "i-sleme-baslamadan-once-2",
    "category": "İşleme Başlamadan Önce",
    "question": "İlk kez işlem yaparken hangi sırayı izlemeliyim?",
    "shortAnswer": "Önce işlem hazırlığı uygunluğunu sorun, ardından oran ve net tutarı teyit edin.",
    "answer": "Onay vermeden kod göndermeyin; işlem tamamlandığında banka hareketinizi ve varsa dekontu kontrol edin.",
    "order": 6
  },
  {
    "id": "i-sleme-baslamadan-once-4",
    "category": "İşleme Başlamadan Önce",
    "question": "Hangi durumda işlemi ertelemeliyim?",
    "shortAnswer": "Resmî numaradan emin değilseniz veya koşullar açık değilse işlemi erteleyin.",
    "answer": "Acele baskısı, şifre talebi ya da tutarsız oran bilgisi varsa yeniden doğrulama yapmadan ilerlemeyin.",
    "order": 7
  },
  {
    "id": "i-sleme-baslamadan-once-5",
    "category": "İşleme Başlamadan Önce",
    "question": "Onay vermeden önce neyi son kez kontrol etmeliyim?",
    "shortAnswer": "Ürün adı, tutar, bölge, oran, net ödeme ve IBAN bilgisini birlikte kontrol edin.",
    "answer": "Yazılı onayda eksik veya farklı bilgi varsa düzeltilmeden işlem başlatmayın.",
    "order": 8
  },
  {
    "id": "mobil-odeme-bozum-1",
    "category": "Mobil Ödeme Bozum",
    "question": "Mobil ödeme bozum işlemi nasıl işler?",
    "shortAnswer": "Önce hat veya uygulama uygunluğu ve kullanılabilir limit kontrol edilir.",
    "answer": "Güncel oran ile tahmini net ödeme teyit edildikten sonra işlem adımları resmî iletişim kanalında paylaşılır.",
    "order": 9
  },
  {
    "id": "mobil-odeme-bozum-2",
    "category": "Mobil Ödeme Bozum",
    "question": "Mobil ödeme bozum neden reddedilebilir?",
    "shortAnswer": "Limit yetersizliği, hat kısıtı, operatör güvenlik kontrolü veya geçici sistem sorunu redde neden olabilir.",
    "answer": "Aynı işlemi art arda denemek yerine operatör uygulamasındaki durum ve hata mesajı kontrol edilmelidir.",
    "order": 10
  },
  {
    "id": "mobil-odeme-bozum-3",
    "category": "Mobil Ödeme Bozum",
    "question": "Kullanılan tutar faturaya yansır mı?",
    "shortAnswer": "Faturalı hatlarda mobil ödeme tutarı ve operatör ücretleri faturaya yansıyabilir.",
    "answer": "Faturasız hatlarda ise mevcut bakiyeden düşüm olabilir; kesin koşullar operatör ve ürün akışına bağlıdır.",
    "order": 11
  },
  {
    "id": "mobil-odeme-bozum-5",
    "category": "Mobil Ödeme Bozum",
    "question": "Mobil ödeme neden kapalı olabilir?",
    "shortAnswer": "Yeni hat, gecikmiş fatura, güvenlik kısıtı veya operatör politikası nedeniyle kapalı olabilir.",
    "answer": "Durum operatör uygulaması veya müşteri hizmetlerinden kontrol edilmeden işlem başlatılmamalıdır.",
    "order": 12
  },
  {
    "id": "bozum-oranlari-1",
    "category": "Bozum Oranları",
    "question": "Bozum oranı nasıl belirlenir?",
    "shortAnswer": "Oran; ürün türü, para birimi, bölge, tutar, kullanılabilirlik ve güncel piyasa koşullarına göre belirlenir.",
    "answer": "İşlem öncesinde güncel oran ve tahmini net ödeme birlikte teyit edilmelidir.",
    "order": 13
  },
  {
    "id": "bozum-oranlari-2",
    "category": "Bozum Oranları",
    "question": "Oranlar neden değişir?",
    "shortAnswer": "Tedarik koşulları, ürün talebi, kur hareketleri ve işlem riski oranı etkileyebilir.",
    "answer": "Bu nedenle geçmişte paylaşılan bir oran yeni işlem için otomatik olarak geçerli sayılmaz.",
    "order": 14
  },
  {
    "id": "bozum-oranlari-3",
    "category": "Bozum Oranları",
    "question": "Eski oran ekran görüntüsü geçerli midir?",
    "shortAnswer": "Hayır. Eski ekran görüntüsü yalnızca geçmiş bir bilgilendirmeyi gösterir.",
    "answer": "Yeni işlemde güncel oran yeniden sorulmalı ve net ödeme yazılı olarak teyit edilmelidir.",
    "order": 15
  },
  {
    "id": "bozum-oranlari-5",
    "category": "Bozum Oranları",
    "question": "Bölge ve para birimi oranı etkiler mi?",
    "shortAnswer": "Evet. Aynı markanın TL, USD veya farklı bölge kodları farklı koşullarda değerlendirilebilir.",
    "answer": "Kodun para birimini ve bölgesini doğrulamadan oran karşılaştırması yapmayın.",
    "order": 16
  },
  {
    "id": "komisyon-ve-net-odeme-1",
    "category": "Komisyon ve Net Ödeme",
    "question": "Komisyon ayrıca kesilir mi?",
    "shortAnswer": "Kesinti yapısı hizmete göre değişebilir; önemli olan işlem öncesinde bildirilen net ödeme tutarıdır.",
    "answer": "Oran, komisyon ve net ödeme aynı mesaj içinde açıkça teyit edilmelidir.",
    "order": 17
  },
  {
    "id": "komisyon-ve-net-odeme-2",
    "category": "Komisyon ve Net Ödeme",
    "question": "Net ödeme tutarını önceden öğrenebilir miyim?",
    "shortAnswer": "Evet. Tutar ve güncel oran kontrol edildikten sonra tahmini net ödeme paylaşılabilir.",
    "answer": "İşlem onayından önce bu tutarı yazılı olarak kontrol edin.",
    "order": 18
  },
  {
    "id": "komisyon-ve-net-odeme-3",
    "category": "Komisyon ve Net Ödeme",
    "question": "Hesap makinesi sonucu kesin midir?",
    "shortAnswer": "Hayır. Hesap makinesi bilgilendirme amaçlı yaklaşık sonuç üretir.",
    "answer": "Nihai tutar güncel oran, ürün uygunluğu ve işlem koşulları doğrulandıktan sonra belirlenir.",
    "order": 19
  },
  {
    "id": "komisyon-ve-net-odeme-5",
    "category": "Komisyon ve Net Ödeme",
    "question": "Ödeme tutarı neden beklediğimden farklı çıktı?",
    "shortAnswer": "Genellikle eski oran, yanlış ürün türü, bölge farkı veya ek hizmet koşulu nedeniyle fark oluşur.",
    "answer": "Onay mesajındaki oran ve net ödeme ile banka hareketini karşılaştırın; uyuşmazlığı yazılı olarak bildirin.",
    "order": 20
  },
  {
    "id": "odeme-sureleri-1",
    "category": "Ödeme Süreleri",
    "question": "Ödeme hangi aşamada yapılır?",
    "shortAnswer": "Ürün veya işlem kontrolü tamamlandıktan sonra ödeme aşamasına geçilir.",
    "answer": "Süre bankaya, yoğunluğa ve kontrol adımlarına göre değişebilir; kesin süre vaadi verilmemelidir.",
    "order": 21
  },
  {
    "id": "odeme-sureleri-2",
    "category": "Ödeme Süreleri",
    "question": "FAST ile ödeme yapılır mı?",
    "shortAnswer": "Uygun banka, tutar ve işlem saatlerinde FAST yöntemi kullanılabilir.",
    "answer": "Banka limitleri, bakım çalışmaları veya alıcı hesap durumu nedeniyle farklı bir yöntem gerekebilir.",
    "order": 22
  },
  {
    "id": "odeme-sureleri-3",
    "category": "Ödeme Süreleri",
    "question": "Banka kaynaklı gecikme olabilir mi?",
    "shortAnswer": "Evet. FAST/EFT altyapısı, banka bakımı veya hesap kontrolleri gecikmeye yol açabilir.",
    "answer": "Dekont ile gerçek hesap hareketini birlikte kontrol edin; yalnızca bildirim mesajına güvenmeyin.",
    "order": 23
  },
  {
    "id": "odeme-sureleri-4",
    "category": "Ödeme Süreleri",
    "question": "Ödeme gecikirse ne yapmalıyım?",
    "shortAnswer": "Önce işlem durumunu resmî destek kanalından sorun ve banka hesabınızı kontrol edin.",
    "answer": "Aynı işlem için farklı kişilere tekrar kod veya ödeme bilgisi göndermeyin.",
    "order": 24
  },
  {
    "id": "guvenlik-1",
    "category": "Güvenlik",
    "question": "Kodumu ilk mesajda göndermeli miyim?",
    "shortAnswer": "Hayır. Önce ürün türü, bölge, tutar ve güncel oran teyit edilmelidir.",
    "answer": "Tam kod yalnızca ön değerlendirme tamamlandıktan sonra resmî iletişim kanalında paylaşılmalıdır.",
    "order": 25
  },
  {
    "id": "guvenlik-3",
    "category": "Güvenlik",
    "question": "Sky Bozum banka şifresi ister mi?",
    "shortAnswer": "Hayır. Banka şifresi veya mobil bankacılık parolası işlem için gerekli değildir.",
    "answer": "Bu tür bir talep alırsanız görüşmeyi sonlandırın ve resmî iletişim kanalından durumu doğrulayın.",
    "order": 26
  },
  {
    "id": "guvenlik-4",
    "category": "Güvenlik",
    "question": "SMS doğrulama kodu istenir mi?",
    "shortAnswer": "Yalnızca işlemin kendi akışına ait ve amacı açıkça belirtilen doğrulamalar değerlendirilmelidir.",
    "answer": "Banka giriş kodu, kart doğrulama kodu veya başka hesabı açmaya yarayan kodlar paylaşılmamalıdır.",
    "order": 27
  },
  {
    "id": "guvenlik-5",
    "category": "Güvenlik",
    "question": "Yazışmaları ve ödeme kayıtlarını saklamalı mıyım?",
    "shortAnswer": "Evet. İşlem özeti, oran onayı, dekont ve ilgili yazışmaları makul bir süre saklamak faydalıdır.",
    "answer": "Bu kayıtlar olası bir uyuşmazlıkta işlem akışını anlamayı kolaylaştırır; ancak şifre veya hassas kodları arşivlemeyin.",
    "order": 28
  },
  {
    "id": "dolandiriciliktan-korunma-1",
    "category": "Dolandırıcılıktan Korunma",
    "question": "Sahte Sky Bozum hesabını nasıl anlarım?",
    "shortAnswer": "Profil adı ve logo tek başına güvenilirlik kanıtı değildir.",
    "answer": "Numarayı resmî kanaldan doğrulayın; acele ettiren, şifre isteyen veya piyasanın çok üzerinde oran vaat eden hesaplardan uzak durun.",
    "order": 29
  },
  {
    "id": "dolandiriciliktan-korunma-2",
    "category": "Dolandırıcılıktan Korunma",
    "question": "Çok yüksek oran vaat eden sitelere güvenilir mi?",
    "shortAnswer": "Piyasa koşullarından belirgin biçimde kopuk oranlar risk işareti olabilir.",
    "answer": "Net ödeme, işlem koşulları ve iletişim bilgileri yazılı olarak teyit edilmeden kod veya ödeme bilgisi paylaşmayın.",
    "order": 30
  },
  {
    "id": "dolandiriciliktan-korunma-3",
    "category": "Dolandırıcılıktan Korunma",
    "question": "İşlem sırasında numara değişirse ne yapmalıyım?",
    "shortAnswer": "İşlemi durdurun ve yeni numarayı bağımsız bir resmî kanaldan doğrulayın.",
    "answer": "Eski görüşmedeki kişinin yönlendirmesi tek başına yeterli değildir; aynı işlem için tekrar teyit alın.",
    "order": 31
  },
  {
    "id": "dolandiriciliktan-korunma-5",
    "category": "Dolandırıcılıktan Korunma",
    "question": "Uzaktan erişim uygulaması kurmam istenirse ne yapmalıyım?",
    "shortAnswer": "Uygulamayı kurmayın ve hiçbir şekilde cihazınıza uzaktan erişim vermeyin.",
    "answer": "Meşru bir bozum işlemi için telefonunuzun veya bankacılık uygulamanızın uzaktan kontrol edilmesi gerekmez.",
    "order": 32
  },
  {
    "id": "resm-i-letisim-kanallari-1",
    "category": "Resmî İletişim Kanalları",
    "question": "Resmî iletişim için hangi kanalı kullanmalıyım?",
    "shortAnswer": "Yalnızca Sky Bozum tarafından resmî olarak yayımlanan iletişim kanallarını kullanın.",
    "answer": "Benzer isimli hesaplardan gelen özel mesajları bağımsız bir kaynaktan doğrulamadan işlem yapmayın.",
    "order": 33
  },
  {
    "id": "resm-i-letisim-kanallari-2",
    "category": "Resmî İletişim Kanalları",
    "question": "Destek isterken hangi bilgileri vermeliyim?",
    "shortAnswer": "Soru başlığı, hizmet adı, tutar ve alınan hata mesajı genellikle yeterlidir.",
    "answer": "Şifre, tam kart bilgisi veya ilgisiz doğrulama kodu göndermeyin.",
    "order": 34
  },
  {
    "id": "resm-i-letisim-kanallari-3",
    "category": "Resmî İletişim Kanalları",
    "question": "Cevap alamazsam ne yapmalıyım?",
    "shortAnswer": "Yoğunluk varsa aynı kanalda kısa bir işlem özetiyle tekrar yazın.",
    "answer": "Farklı numaralara aynı anda hassas bilgi göndermek yerine resmî kanal doğrulamasını koruyun.",
    "order": 35
  },
  {
    "id": "resm-i-letisim-kanallari-4",
    "category": "Resmî İletişim Kanalları",
    "question": "Destek görüşmesini nasıl hızlandırabilirim?",
    "shortAnswer": "Hizmet adı, tutar, bölge ve sorunu tek mesajda açıkça yazın.",
    "answer": "Ekran görüntüsü gerekiyorsa kişisel ve hassas alanları kapatarak gönderin.",
    "order": 36
  },
  {
    "id": "i-slem-i-ptali-1",
    "category": "İşlem İptali",
    "question": "İşlem iptali mümkün müdür?",
    "shortAnswer": "İşlemin hangi aşamada olduğuna ve ürünün kullanılıp kullanılmadığına bağlıdır.",
    "answer": "Kod kullanıldıysa veya ödeme süreci tamamlandıysa iptal mümkün olmayabilir.",
    "order": 37
  },
  {
    "id": "i-slem-i-ptali-2",
    "category": "İşlem İptali",
    "question": "İptal talebini ne zaman iletmeliyim?",
    "shortAnswer": "Mümkün olan en erken aşamada, ürün kontrolü tamamlanmadan önce iletin.",
    "answer": "İptal talebini işlem tamamlanmadan mümkün olan en kısa sürede iletin; tamamlanmış işlemler sonradan iptal edilemeyebilir.",
    "order": 38
  },
  {
    "id": "i-slem-i-ptali-3",
    "category": "İşlem İptali",
    "question": "İptal için hangi bilgi gerekir?",
    "shortAnswer": "Hizmet adı, tutar, işlem saati ve görüşme kaydı yeterli olabilir.",
    "answer": "Tam kodu tekrar paylaşmadan önce hangi bilginin gerektiğini sorun.",
    "order": 39
  },
  {
    "id": "i-slem-i-ptali-4",
    "category": "İşlem İptali",
    "question": "İptal edilen işlemde ödeme yapılır mı?",
    "shortAnswer": "Ürün kullanılmadıysa ve işlem tamamlanmadıysa durum ayrıca değerlendirilir.",
    "answer": "Her işlem için aynı sonuç garanti edilemez; işlem durumu yazılı olarak teyit edilmelidir.",
    "order": 40
  },
  {
    "id": "vodafone-mobil-odeme-1",
    "category": "Vodafone Mobil Ödeme",
    "question": "Vodafone mobil ödeme limitimi nasıl öğrenebilirim?",
    "shortAnswer": "Operatör uygulamasındaki mobil ödeme veya limit bölümünü kontrol edin.",
    "answer": "Görünen toplam limitin tamamı kullanılabilir olmayabilir; güncel kullanılabilir tutarı işlem öncesinde ayrıca teyit edin. Vodafone Yanımda uygulamasındaki güncel kayıtları esas alın.",
    "searchTerms": [
      "Vodafone"
    ],
    "order": 41
  },
  {
    "id": "vodafone-mobil-odeme-2",
    "category": "Vodafone Mobil Ödeme",
    "question": "Vodafone mobil ödeme neden reddedilir?",
    "shortAnswer": "Limit, hat yaşı, fatura durumu, güvenlik kısıtı veya servis uygunluğu redde neden olabilir.",
    "answer": "Hata mesajını not edin ve art arda denemek yerine operatör kanalından durumu kontrol edin. Vodafone Yanımda uygulamasındaki güncel kayıtları esas alın.",
    "searchTerms": [
      "Vodafone"
    ],
    "order": 42
  },
  {
    "id": "vodafone-mobil-odeme-3",
    "category": "Vodafone Mobil Ödeme",
    "question": "Vodafone mobil ödeme faturada nasıl görünür?",
    "shortAnswer": "İşlem, operatörün fatura açıklamasına göre servis veya mobil ödeme kalemi olarak görünebilir.",
    "answer": "Kesin açıklama kullanılan ürüne ve operatör kayıt formatına bağlıdır. Vodafone Yanımda uygulamasındaki güncel kayıtları esas alın.",
    "searchTerms": [
      "Vodafone"
    ],
    "order": 43
  },
  {
    "id": "vodafone-mobil-odeme-5",
    "category": "Vodafone Mobil Ödeme",
    "question": "Hat sahibi ile IBAN sahibi aynı olmalı mı?",
    "shortAnswer": "Farklı kişiler adına kayıtlı hat ve IBAN için ek doğrulama gerekebilir.",
    "answer": "Kabul koşulları işlem politikalarına bağlıdır; başkasına ait hesap bilgisi kullanmadan önce yazılı teyit alın. Vodafone Yanımda uygulamasındaki güncel kayıtları esas alın.",
    "searchTerms": [
      "Vodafone"
    ],
    "order": 44
  },
  {
    "id": "vodafone-pay-1",
    "category": "Vodafone Pay",
    "question": "Vodafone Pay bakiyemi veya limitimi nereden görebilirim?",
    "shortAnswer": "Vodafone Pay uygulamasındaki bakiye, kart veya limit ekranını kontrol edin.",
    "answer": "Kullanılabilir tutar ile toplam limit aynı olmayabilir; işlem öncesinde güncel değeri teyit edin. Vodafone Pay uygulamasındaki işlem ekranını kontrol edin.",
    "searchTerms": [
      "Vodafone"
    ],
    "order": 45
  },
  {
    "id": "vodafone-pay-2",
    "category": "Vodafone Pay",
    "question": "Vodafone Pay işlemi neden başarısız olabilir?",
    "shortAnswer": "Yetersiz bakiye, kart kısıtı, doğrulama sorunu veya geçici bakım nedeniyle başarısız olabilir.",
    "answer": "Hata kodunu not edin ve aynı işlemi art arda tekrarlamadan uygulama durumunu kontrol edin. Vodafone Pay uygulamasındaki işlem ekranını kontrol edin.",
    "searchTerms": [
      "Vodafone"
    ],
    "order": 46
  },
  {
    "id": "vodafone-pay-3",
    "category": "Vodafone Pay",
    "question": "Vodafone Pay ile mobil ödeme aynı şey mi?",
    "shortAnswer": "Hayır. Uygulama bakiyesi, sanal kart ve operatör mobil ödeme limiti farklı ürünler olabilir.",
    "answer": "Hangi kaynağın kullanılacağı işlem başlamadan önce açıkça belirlenmelidir. Vodafone Pay uygulamasındaki işlem ekranını kontrol edin.",
    "searchTerms": [
      "Vodafone"
    ],
    "order": 47
  },
  {
    "id": "vodafone-pay-4",
    "category": "Vodafone Pay",
    "question": "Vodafone Pay kart bilgilerimi paylaşmalı mıyım?",
    "shortAnswer": "Tam kart numarası, son kullanma tarihi ve güvenlik kodu gereksiz yere paylaşılmamalıdır.",
    "answer": "İşlem için hangi bilginin neden istendiğini anlamadan hiçbir hassas kart verisi göndermeyin. Vodafone Pay uygulamasındaki işlem ekranını kontrol edin.",
    "searchTerms": [
      "Vodafone"
    ],
    "order": 48
  },
  {
    "id": "turkcell-mobil-odeme-1",
    "category": "Turkcell Mobil Ödeme",
    "question": "Turkcell mobil ödeme limitimi nasıl öğrenebilirim?",
    "shortAnswer": "Operatör uygulamasındaki mobil ödeme veya limit bölümünü kontrol edin.",
    "answer": "Görünen toplam limitin tamamı kullanılabilir olmayabilir; güncel kullanılabilir tutarı işlem öncesinde ayrıca teyit edin. Turkcell uygulamasındaki güncel kayıtları esas alın.",
    "searchTerms": [
      "Turkcell"
    ],
    "order": 49
  },
  {
    "id": "turkcell-mobil-odeme-2",
    "category": "Turkcell Mobil Ödeme",
    "question": "Turkcell mobil ödeme neden reddedilir?",
    "shortAnswer": "Limit, hat yaşı, fatura durumu, güvenlik kısıtı veya servis uygunluğu redde neden olabilir.",
    "answer": "Hata mesajını not edin ve art arda denemek yerine operatör kanalından durumu kontrol edin. Turkcell uygulamasındaki güncel kayıtları esas alın.",
    "searchTerms": [
      "Turkcell"
    ],
    "order": 50
  },
  {
    "id": "turkcell-mobil-odeme-3",
    "category": "Turkcell Mobil Ödeme",
    "question": "Turkcell mobil ödeme faturada nasıl görünür?",
    "shortAnswer": "İşlem, operatörün fatura açıklamasına göre servis veya mobil ödeme kalemi olarak görünebilir.",
    "answer": "Kesin açıklama kullanılan ürüne ve operatör kayıt formatına bağlıdır. Turkcell uygulamasındaki güncel kayıtları esas alın.",
    "searchTerms": [
      "Turkcell"
    ],
    "order": 51
  },
  {
    "id": "turkcell-mobil-odeme-5",
    "category": "Turkcell Mobil Ödeme",
    "question": "Turkcell mobil ödemede hat sahibi ile IBAN sahibi aynı olmalı mı?",
    "shortAnswer": "Farklı kişiler adına kayıtlı hat ve IBAN için ek doğrulama gerekebilir.",
    "answer": "Kabul koşulları işlem politikalarına bağlıdır; başkasına ait hesap bilgisi kullanmadan önce yazılı teyit alın. Turkcell uygulamasındaki güncel kayıtları esas alın.",
    "searchTerms": [
      "Turkcell"
    ],
    "order": 52
  },
  {
    "id": "paycell-1",
    "category": "Paycell",
    "question": "Paycell bakiyemi veya limitimi nereden görebilirim?",
    "shortAnswer": "Paycell uygulamasındaki bakiye, kart veya limit ekranını kontrol edin.",
    "answer": "Kullanılabilir tutar ile toplam limit aynı olmayabilir; işlem öncesinde güncel değeri teyit edin. Paycell uygulamasındaki işlem ekranını kontrol edin.",
    "searchTerms": [
      "Turkcell"
    ],
    "order": 53
  },
  {
    "id": "paycell-2",
    "category": "Paycell",
    "question": "Paycell işlemi neden başarısız olabilir?",
    "shortAnswer": "Yetersiz bakiye, kart kısıtı, doğrulama sorunu veya geçici bakım nedeniyle başarısız olabilir.",
    "answer": "Hata kodunu not edin ve aynı işlemi art arda tekrarlamadan uygulama durumunu kontrol edin. Paycell uygulamasındaki işlem ekranını kontrol edin.",
    "searchTerms": [
      "Turkcell"
    ],
    "order": 54
  },
  {
    "id": "paycell-3",
    "category": "Paycell",
    "question": "Paycell ile mobil ödeme aynı şey mi?",
    "shortAnswer": "Hayır. Uygulama bakiyesi, sanal kart ve operatör mobil ödeme limiti farklı ürünler olabilir.",
    "answer": "Hangi kaynağın kullanılacağı işlem başlamadan önce açıkça belirlenmelidir. Paycell uygulamasındaki işlem ekranını kontrol edin.",
    "searchTerms": [
      "Turkcell"
    ],
    "order": 55
  },
  {
    "id": "paycell-4",
    "category": "Paycell",
    "question": "Paycell kart bilgilerimi paylaşmalı mıyım?",
    "shortAnswer": "Tam kart numarası, son kullanma tarihi ve güvenlik kodu gereksiz yere paylaşılmamalıdır.",
    "answer": "İşlem için hangi bilginin neden istendiğini anlamadan hiçbir hassas kart verisi göndermeyin. Paycell uygulamasındaki işlem ekranını kontrol edin.",
    "searchTerms": [
      "Turkcell"
    ],
    "order": 56
  },
  {
    "id": "turk-telekom-mobil-odeme-1",
    "category": "Türk Telekom Mobil Ödeme",
    "question": "Türk Telekom mobil ödeme limitimi nasıl öğrenebilirim?",
    "shortAnswer": "Operatör uygulamasındaki mobil ödeme veya limit bölümünü kontrol edin.",
    "answer": "Görünen toplam limitin tamamı kullanılabilir olmayabilir; güncel kullanılabilir tutarı işlem öncesinde ayrıca teyit edin. Türk Telekom uygulamasındaki güncel kayıtları esas alın.",
    "searchTerms": [
      "Türk Telekom"
    ],
    "order": 57
  },
  {
    "id": "turk-telekom-mobil-odeme-2",
    "category": "Türk Telekom Mobil Ödeme",
    "question": "Türk Telekom mobil ödeme neden reddedilir?",
    "shortAnswer": "Limit, hat yaşı, fatura durumu, güvenlik kısıtı veya servis uygunluğu redde neden olabilir.",
    "answer": "Hata mesajını not edin ve art arda denemek yerine operatör kanalından durumu kontrol edin. Türk Telekom uygulamasındaki güncel kayıtları esas alın.",
    "searchTerms": [
      "Türk Telekom"
    ],
    "order": 58
  },
  {
    "id": "turk-telekom-mobil-odeme-3",
    "category": "Türk Telekom Mobil Ödeme",
    "question": "Türk Telekom mobil ödeme faturada nasıl görünür?",
    "shortAnswer": "İşlem, operatörün fatura açıklamasına göre servis veya mobil ödeme kalemi olarak görünebilir.",
    "answer": "Kesin açıklama kullanılan ürüne ve operatör kayıt formatına bağlıdır. Türk Telekom uygulamasındaki güncel kayıtları esas alın.",
    "searchTerms": [
      "Türk Telekom"
    ],
    "order": 59
  },
  {
    "id": "turk-telekom-mobil-odeme-5",
    "category": "Türk Telekom Mobil Ödeme",
    "question": "Türk Telekom mobil ödemede hat sahibi ile IBAN sahibi aynı olmalı mı?",
    "shortAnswer": "Farklı kişiler adına kayıtlı hat ve IBAN için ek doğrulama gerekebilir.",
    "answer": "Kabul koşulları işlem politikalarına bağlıdır; başkasına ait hesap bilgisi kullanmadan önce yazılı teyit alın. Türk Telekom uygulamasındaki güncel kayıtları esas alın.",
    "searchTerms": [
      "Türk Telekom"
    ],
    "order": 60
  },
  {
    "id": "pokus-1",
    "category": "Pokus",
    "question": "Pokus bakiyemi veya limitimi nereden görebilirim?",
    "shortAnswer": "Pokus uygulamasındaki bakiye, kart veya limit ekranını kontrol edin.",
    "answer": "Kullanılabilir tutar ile toplam limit aynı olmayabilir; işlem öncesinde güncel değeri teyit edin. Pokus uygulamasındaki işlem ekranını kontrol edin.",
    "searchTerms": [
      "Türk Telekom"
    ],
    "order": 61
  },
  {
    "id": "pokus-2",
    "category": "Pokus",
    "question": "Pokus işlemi neden başarısız olabilir?",
    "shortAnswer": "Yetersiz bakiye, kart kısıtı, doğrulama sorunu veya geçici bakım nedeniyle başarısız olabilir.",
    "answer": "Hata kodunu not edin ve aynı işlemi art arda tekrarlamadan uygulama durumunu kontrol edin. Pokus uygulamasındaki işlem ekranını kontrol edin.",
    "searchTerms": [
      "Türk Telekom"
    ],
    "order": 62
  },
  {
    "id": "pokus-3",
    "category": "Pokus",
    "question": "Pokus ile mobil ödeme aynı şey mi?",
    "shortAnswer": "Hayır. Uygulama bakiyesi, sanal kart ve operatör mobil ödeme limiti farklı ürünler olabilir.",
    "answer": "Hangi kaynağın kullanılacağı işlem başlamadan önce açıkça belirlenmelidir. Pokus uygulamasındaki işlem ekranını kontrol edin.",
    "searchTerms": [
      "Türk Telekom"
    ],
    "order": 63
  },
  {
    "id": "pokus-4",
    "category": "Pokus",
    "question": "Pokus kart bilgilerimi paylaşmalı mıyım?",
    "shortAnswer": "Tam kart numarası, son kullanma tarihi ve güvenlik kodu gereksiz yere paylaşılmamalıdır.",
    "answer": "İşlem için hangi bilginin neden istendiğini anlamadan hiçbir hassas kart verisi göndermeyin. Pokus uygulamasındaki işlem ekranını kontrol edin.",
    "searchTerms": [
      "Türk Telekom"
    ],
    "order": 64
  },
  {
    "id": "razer-gold-tl-1",
    "category": "Razer Gold TL",
    "question": "Razer Gold TL kodunun bölgesi neden önemlidir?",
    "shortAnswer": "Bölge ve para birimi kodun hangi mağaza veya hesapta kullanılabileceğini belirler.",
    "answer": "Yanlış bölge, kodun değerlendirilememesine veya farklı oran uygulanmasına yol açabilir. TL kodunun bölge ve para birimi bilgisini ayrıca doğrulayın.",
    "searchTerms": [
      "Razer Gold"
    ],
    "order": 65
  },
  {
    "id": "razer-gold-tl-2",
    "category": "Razer Gold TL",
    "question": "Kullanılmış Razer Gold TL kodu bozdurulabilir mi?",
    "shortAnswer": "Hayır. Kullanılmış veya bakiyesi tüketilmiş kod yeniden değerlendirilemez.",
    "answer": "Kod durumu kontrol sırasında anlaşılır; satın alma belgesini ve teslim kaydını saklayın. TL kodunun bölge ve para birimi bilgisini ayrıca doğrulayın.",
    "searchTerms": [
      "Razer Gold"
    ],
    "order": 66
  },
  {
    "id": "razer-gold-tl-3",
    "category": "Razer Gold TL",
    "question": "Razer Gold TL kodunu ne zaman paylaşmalıyım?",
    "shortAnswer": "Ürün, bölge, tutar ve net ödeme teyit edildikten sonra paylaşın.",
    "answer": "Tam kodu ilk mesajda veya resmî olmayan hesaplara göndermeyin. TL kodunun bölge ve para birimi bilgisini ayrıca doğrulayın.",
    "searchTerms": [
      "Razer Gold"
    ],
    "order": 67
  },
  {
    "id": "razer-gold-tl-4",
    "category": "Razer Gold TL",
    "question": "Razer Gold TL için satın alma belgesi gerekir mi?",
    "shortAnswer": "Her işlemde zorunlu olmayabilir ancak uyuşmazlık durumunda faydalı olabilir.",
    "answer": "Belgede ödeme bilgilerini paylaşırken kişisel ve hassas alanları gizleyin. TL kodunun bölge ve para birimi bilgisini ayrıca doğrulayın.",
    "searchTerms": [
      "Razer Gold"
    ],
    "order": 68
  },
  {
    "id": "razer-gold-usd-1",
    "category": "Razer Gold USD",
    "question": "Razer Gold USD kodunun bölgesi neden önemlidir?",
    "shortAnswer": "Bölge ve para birimi kodun hangi mağaza veya hesapta kullanılabileceğini belirler.",
    "answer": "Yanlış bölge, kodun değerlendirilememesine veya farklı oran uygulanmasına yol açabilir. USD kodunun bölge ve para birimi bilgisini ayrıca doğrulayın.",
    "searchTerms": [
      "Razer Gold"
    ],
    "order": 69
  },
  {
    "id": "razer-gold-usd-2",
    "category": "Razer Gold USD",
    "question": "Kullanılmış Razer Gold USD kodu bozdurulabilir mi?",
    "shortAnswer": "Hayır. Kullanılmış veya bakiyesi tüketilmiş kod yeniden değerlendirilemez.",
    "answer": "Kod durumu kontrol sırasında anlaşılır; satın alma belgesini ve teslim kaydını saklayın. USD kodunun bölge ve para birimi bilgisini ayrıca doğrulayın.",
    "searchTerms": [
      "Razer Gold"
    ],
    "order": 70
  },
  {
    "id": "razer-gold-usd-3",
    "category": "Razer Gold USD",
    "question": "Razer Gold USD kodunu ne zaman paylaşmalıyım?",
    "shortAnswer": "Ürün, bölge, tutar ve net ödeme teyit edildikten sonra paylaşın.",
    "answer": "Tam kodu ilk mesajda veya resmî olmayan hesaplara göndermeyin. USD kodunun bölge ve para birimi bilgisini ayrıca doğrulayın.",
    "searchTerms": [
      "Razer Gold"
    ],
    "order": 71
  },
  {
    "id": "razer-gold-usd-4",
    "category": "Razer Gold USD",
    "question": "Razer Gold USD için satın alma belgesi gerekir mi?",
    "shortAnswer": "Her işlemde zorunlu olmayabilir ancak uyuşmazlık durumunda faydalı olabilir.",
    "answer": "Belgede ödeme bilgilerini paylaşırken kişisel ve hassas alanları gizleyin. USD kodunun bölge ve para birimi bilgisini ayrıca doğrulayın.",
    "searchTerms": [
      "Razer Gold"
    ],
    "order": 72
  },
  {
    "id": "apple-gift-card-1",
    "category": "Apple Gift Card",
    "question": "Apple Gift Card kodunun bölgesi neden önemlidir?",
    "shortAnswer": "Bölge ve para birimi kodun hangi mağaza veya hesapta kullanılabileceğini belirler.",
    "answer": "Yanlış bölge, kodun değerlendirilememesine veya farklı oran uygulanmasına yol açabilir. Apple hesabının mağaza bölgesiyle kod bölgesini karşılaştırın.",
    "order": 73
  },
  {
    "id": "apple-gift-card-2",
    "category": "Apple Gift Card",
    "question": "Kullanılmış Apple Gift Card kodu bozdurulabilir mi?",
    "shortAnswer": "Hayır. Kullanılmış veya bakiyesi tüketilmiş kod yeniden değerlendirilemez.",
    "answer": "Kod durumu kontrol sırasında anlaşılır; satın alma belgesini ve teslim kaydını saklayın. Apple hesabının mağaza bölgesiyle kod bölgesini karşılaştırın.",
    "order": 74
  },
  {
    "id": "apple-gift-card-3",
    "category": "Apple Gift Card",
    "question": "Apple Gift Card kodunu ne zaman paylaşmalıyım?",
    "shortAnswer": "Ürün, bölge, tutar ve net ödeme teyit edildikten sonra paylaşın.",
    "answer": "Tam kodu ilk mesajda veya resmî olmayan hesaplara göndermeyin. Apple hesabının mağaza bölgesiyle kod bölgesini karşılaştırın.",
    "order": 75
  },
  {
    "id": "apple-gift-card-4",
    "category": "Apple Gift Card",
    "question": "Apple Gift Card için satın alma belgesi gerekir mi?",
    "shortAnswer": "Her işlemde zorunlu olmayabilir ancak uyuşmazlık durumunda faydalı olabilir.",
    "answer": "Belgede ödeme bilgilerini paylaşırken kişisel ve hassas alanları gizleyin. Apple hesabının mağaza bölgesiyle kod bölgesini karşılaştırın.",
    "order": 76
  },
  {
    "id": "steam-1",
    "category": "Steam",
    "question": "Steam cüzdan kodunun bölgesi neden önemlidir?",
    "shortAnswer": "Kodun para birimi ve bölgesi, hangi Steam hesabında kullanılabileceğini belirler.",
    "answer": "Yanlış bölge veya para birimine ait kod değerlendirilemeyebilir. Kodun mağaza bölgesini satın alma ekranından kontrol edin.",
    "order": 77
  },
  {
    "id": "steam-2",
    "category": "Steam",
    "question": "Kullanılmış Steam cüzdan kodu bozdurulabilir mi?",
    "shortAnswer": "Hayır. Daha önce kullanılmış veya bakiyesi tüketilmiş Steam kodu yeniden değerlendirilemez.",
    "answer": "Kod kontrolünde kullanım durumu görülür. Uyuşmazlık yaşarsanız satın alma belgesi ve teslim kaydını hazır bulundurun.",
    "order": 78
  },
  {
    "id": "steam-3",
    "category": "Steam",
    "question": "Steam kodunu ne zaman paylaşmalıyım?",
    "shortAnswer": "Kod türü, bölgesi, tutarı ve net ödeme teyit edildikten sonra paylaşın.",
    "answer": "Tam kodu ilk mesajda veya resmî olmayan hesaplarda paylaşmayın. Önce işlem koşullarını yazılı olarak onaylayın.",
    "order": 79
  },
  {
    "id": "steam-4",
    "category": "Steam",
    "question": "Steam kodu için satın alma belgesi gerekir mi?",
    "shortAnswer": "Her işlemde zorunlu olmayabilir; ancak kodla ilgili uyuşmazlıkta satın alma belgesi istenebilir.",
    "answer": "Belge gönderirken kart numarası, adres ve diğer hassas kişisel alanları gizleyin; yalnızca gerekli bölümü paylaşın.",
    "order": 80
  },
  {
    "id": "sms-bozum-1",
    "category": "SMS Bozum",
    "question": "SMS bozum işlemi nasıl yapılır?",
    "shortAnswer": "Önce hattın mobil ödemeye açık olup olmadığı ve kullanılabilir limit kontrol edilir.",
    "answer": "Uygunluk doğrulandıktan sonra güncel oran, tahmini net ödeme ve izlenecek adımlar resmî iletişim kanalında paylaşılır.",
    "order": 81
  },
  {
    "id": "sms-bozum-2",
    "category": "SMS Bozum",
    "question": "SMS bozum işlemi neden reddedilebilir?",
    "shortAnswer": "Yetersiz limit, hat kısıtı, gecikmiş fatura, operatör güvenlik kontrolü veya geçici sistem sorunu redde neden olabilir.",
    "answer": "Aynı işlemi art arda denemek yerine operatör uygulamasındaki limit ve hata mesajını kontrol edin.",
    "order": 82
  },
  {
    "id": "sms-bozum-3",
    "category": "SMS Bozum",
    "question": "SMS bozum tutarı faturama yansır mı?",
    "shortAnswer": "Faturalı hatlarda kullanılan mobil ödeme tutarı ve varsa operatör ücretleri faturaya yansıyabilir.",
    "answer": "Faturasız hatlarda tutar mevcut bakiyeden düşebilir. Kesin yansıma biçimini operatörünüzün işlem kaydından kontrol edin.",
    "order": 83
  },
  {
    "id": "sms-bozum-4",
    "category": "SMS Bozum",
    "question": "Mobil ödeme limitim doğrudan nakit bakiye midir?",
    "shortAnswer": "Hayır. Mobil ödeme limiti, operatörün izin verdiği ürün ve hizmetlerde kullanılabilen bir harcama sınırıdır.",
    "answer": "Limitin tamamının işleme uygun olması garanti değildir; ürün, hat durumu ve operatör kısıtları ayrıca değerlendirilir.",
    "order": 84
  },
  {
    "id": "hat-ve-fatura-limitleri-1",
    "category": "Hat ve Fatura Limitleri",
    "question": "Hat ve fatura limiti nereden öğrenilir?",
    "shortAnswer": "Operatör veya ilgili uygulamadaki limit ekranından kontrol edilebilir.",
    "answer": "Toplam limit ile o anda kullanılabilir limit farklı olabilir; işlem öncesinde güncel değeri teyit edin.",
    "order": 85
  },
  {
    "id": "hat-ve-fatura-limitleri-2",
    "category": "Hat ve Fatura Limitleri",
    "question": "Hat ve fatura limiti neden düşebilir?",
    "shortAnswer": "Fatura durumu, geçmiş kullanım, güvenlik politikası veya operatör değerlendirmesi limiti etkileyebilir.",
    "answer": "Limit değişiklikleri için kesin sebebi yalnızca ilgili operatör açıklayabilir.",
    "order": 86
  },
  {
    "id": "hat-ve-fatura-limitleri-3",
    "category": "Hat ve Fatura Limitleri",
    "question": "Limitin tamamı tek işlemde kullanılabilir mi?",
    "shortAnswer": "Her zaman değil. Tek işlem, günlük veya ürün bazlı alt limitler uygulanabilir.",
    "answer": "Yüksek tutarlı işlemden önce parça sınırlarını ve ek ücretleri kontrol edin.",
    "order": 87
  },
  {
    "id": "hat-ve-fatura-limitleri-4",
    "category": "Hat ve Fatura Limitleri",
    "question": "Limit aşılırsa ne olur?",
    "shortAnswer": "İşlem reddedilebilir veya daha düşük tutar girmeniz istenebilir.",
    "answer": "Art arda başarısız deneme yerine güncel kullanılabilir limiti kontrol edin.",
    "order": 88
  },
  {
    "id": "kod-kontrolu-1",
    "category": "Kod Kontrolü",
    "question": "Kod kontrolü sırasında neye bakılır?",
    "shortAnswer": "Kodun biçimi, bölgesi, para birimi, kullanım durumu ve ürün eşleşmesi kontrol edilir.",
    "answer": "Kontrol tamamlanmadan kodun geçerli veya ödenebilir olduğu varsayılmamalıdır.",
    "order": 89
  },
  {
    "id": "kod-kontrolu-2",
    "category": "Kod Kontrolü",
    "question": "Kod kontrolü ne kadar sürer?",
    "shortAnswer": "Süre ürün, yoğunluk ve doğrulama adımlarına göre değişir.",
    "answer": "Kesin süre vermek yerine güncel durum işlem öncesinde paylaşılmalıdır.",
    "order": 90
  },
  {
    "id": "kod-kontrolu-3",
    "category": "Kod Kontrolü",
    "question": "Kullanılmış kod gönderirsem ne olur?",
    "shortAnswer": "Kullanılmış kod için ödeme yapılamaz ve işlem durdurulur.",
    "answer": "Kodun daha önce nerede paylaşıldığını ve satın alma belgesini kontrol edin.",
    "order": 91
  },
  {
    "id": "kod-kontrolu-4",
    "category": "Kod Kontrolü",
    "question": "Kod karakterlerini yanlış yazarsam ne olur?",
    "shortAnswer": "Kod yanlış yazılırsa kontrol başarısız olabilir veya geçersiz sonuç dönebilir.",
    "answer": "Benzer karakterleri, boşlukları ve tireleri kaynağındaki biçimle yeniden karşılaştırın.",
    "order": 92
  },
  {
    "id": "iban-ve-hesap-sahibi-1",
    "category": "IBAN ve Hesap Sahibi",
    "question": "Ödeme için kendi adıma kayıtlı IBAN mı vermeliyim?",
    "shortAnswer": "Mümkünse ödeme alacak IBAN işlem sahibine ait olmalıdır; farklı sahiplik durumunda ek doğrulama gerekebilir.",
    "answer": "Hat, kart, kod veya IBAN sahibinin farklı olduğunu işlem başlamadan önce açıkça belirtin.",
    "order": 93
  },
  {
    "id": "iban-ve-hesap-sahibi-2",
    "category": "IBAN ve Hesap Sahibi",
    "question": "IBAN sahibinin adı neden kontrol edilir?",
    "shortAnswer": "Yanlış kişiye ödeme yapılmasını ve yetkisiz işlem riskini azaltmak için hesap sahipliği kontrol edilebilir.",
    "answer": "Kontrol için yalnızca gerekli bilgiler istenmelidir; banka şifresi veya mobil bankacılık erişimi hiçbir zaman paylaşılmamalıdır.",
    "order": 94
  },
  {
    "id": "iban-ve-hesap-sahibi-3",
    "category": "IBAN ve Hesap Sahibi",
    "question": "Başkasının IBAN’ına ödeme alabilir miyim?",
    "shortAnswer": "Bu durum işlem politikasına ve doğrulama sonucuna bağlıdır; her işlemde kabul edilmeyebilir.",
    "answer": "Kabul edilirse alıcının adı ve IBAN’ı ödeme öncesinde yazılı olarak teyit edilmelidir.",
    "order": 95
  },
  {
    "id": "iban-ve-hesap-sahibi-4",
    "category": "IBAN ve Hesap Sahibi",
    "question": "Hat sahibi ile ödeme alacak kişi farklıysa ne yapmalıyım?",
    "shortAnswer": "Farklı sahiplik durumunu işlemin başında bildirin ve ek doğrulama gerekip gerekmediğini sorun.",
    "answer": "Eksik veya yanlış bilgi verilmesi işlemin durmasına, reddedilmesine ya da gecikmesine neden olabilir.",
    "order": 96
  },
  {
    "id": "gece-ve-hafta-sonu-i-slemleri-1",
    "category": "Gece ve Hafta Sonu İşlemleri",
    "question": "Gece veya hafta sonu işlem yapılabilir mi?",
    "shortAnswer": "Müsaitlik, ürün kontrolü ve güncel yoğunluğa bağlı olarak gece veya hafta sonu işlem alınabilir.",
    "answer": "İşleme başlamadan önce destek hattından güncel çalışma durumunu ve tahmini ödeme süresini teyit edin.",
    "order": 97
  },
  {
    "id": "gece-ve-hafta-sonu-i-slemleri-2",
    "category": "Gece ve Hafta Sonu İşlemleri",
    "question": "Gece ve hafta sonu ödemeleri FAST ile gelir mi?",
    "shortAnswer": "Uygun banka ve tutarlarda FAST kullanılabilir; banka veya hesap kısıtı varsa farklı yöntem gerekebilir.",
    "answer": "Ödeme yöntemini ve tahmini süreyi işlem onayından önce sorun.",
    "order": 98
  },
  {
    "id": "gece-ve-hafta-sonu-i-slemleri-3",
    "category": "Gece ve Hafta Sonu İşlemleri",
    "question": "Hafta sonu banka kaynaklı gecikme olabilir mi?",
    "shortAnswer": "Evet. Banka bakımı, FAST altyapısı, işlem limiti veya alıcı hesap kontrolü gecikmeye neden olabilir.",
    "answer": "Dekont paylaşılsa bile ödemenin hesabınıza geçtiğini banka hareketlerinden kontrol edin.",
    "order": 99
  },
  {
    "id": "gece-ve-hafta-sonu-i-slemleri-4",
    "category": "Gece ve Hafta Sonu İşlemleri",
    "question": "Gece veya hafta sonu ödeme gecikirse ne yapmalıyım?",
    "shortAnswer": "Önce banka hesabınızı kontrol edin, ardından işlem durumunu aynı resmî destek görüşmesi üzerinden sorun.",
    "answer": "Aynı işlem için farklı kişilere yeniden kod, kart veya ödeme bilgisi göndermeyin.",
    "order": 100
  }
];
