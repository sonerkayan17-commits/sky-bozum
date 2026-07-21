export const featuredArticles = [
  {
    slug: 'mobil-odeme-nasil-acilir',
    title: 'Mobil Ödeme Nasıl Açılır? Operatörlere Göre Güncel Detaylı Rehber',
    seoTitle: 'Mobil Ödeme Nasıl Açılır? Vodafone, Turkcell ve Türk Telekom Rehberi',
    metaDescription: 'Mobil ödeme nasıl açılır, Vodafone, Turkcell ve Türk Telekom mobil ödeme aktivasyonu nasıl yapılır, limit artırma ve kullanım detayları.',
    excerpt: 'Vodafone, Turkcell ve Türk Telekom hatlarında mobil ödeme özelliğini açma, limit kontrolü, güvenlik ve kullanım adımlarını tek rehberde öğrenin.',
    category: 'Mobil Ödeme',
    readTime: '14 dk',
    serviceSlug: 'sms-mobil-odeme',
    cover: '/blog-covers/mobil-odeme-nasil-acilir.svg',
    coverAlt: 'Telefon, operatör sinyali ve güvenli mobil ödeme akışını gösteren modern fintech illüstrasyonu',
    keywords: ['vodafone mobil ödeme', 'turkcell mobil ödeme', 'türk telekom mobil ödeme', 'mobil ödeme açma', 'paycell', 'pokus', 'limit artırma'],
    links: [
      { label: 'Vodafone mobil ödeme hizmeti', href: '/hizmetler/vodafone-mobil-odeme' },
      { label: 'Turkcell mobil ödeme hizmeti', href: '/hizmetler/turkcell-mobil-odeme' },
      { label: 'Türk Telekom mobil ödeme hizmeti', href: '/hizmetler/turk-telekom-mobil-odeme' },
    ],
    media: [
      { src: '/blog-covers/mobil-odeme-akisi.svg', alt: 'Mobil ödeme aktivasyon ve onay akışı diyagramı', caption: 'Mobil ödeme açma sürecinde temel kontrol ve onay adımları.' },
      { src: '/blog-covers/operator-kontrol.svg', alt: 'Üç operatör için hesap, limit ve güvenlik kontrol ekranı', caption: 'Operatörünüz ne olursa olsun limit, hat durumu ve onay mesajı birlikte kontrol edilmelidir.' },
    ],
    faq: [
      { question: 'Mobil ödeme özelliği açıldıktan sonra hemen kullanılabilir mi?', answer: 'Çoğu durumda aktivasyon kısa sürede tamamlanır; ancak yeni hat, yeni SIM kart, borç durumu, güvenlik kontrolü veya operatör politikaları nedeniyle bekleme ya da kısıtlama uygulanabilir. En doğru durum bilgisi operatörün resmi uygulamasında veya müşteri hizmetlerinde görülür.' },
      { question: 'Mobil ödeme açmak ücretli mi?', answer: 'Özelliği açmak çoğunlukla ayrı bir ücret gerektirmez. Buna karşılık yapılan işlemlerde hizmet bedeli, işlem ücreti veya faturaya yansıyan ek maliyet bulunabilir. Onay ekranında görünen toplam tutarı okumadan işlemi tamamlamayın.' },
      { question: 'Faturasız hatlarda mobil ödeme kullanılabilir mi?', answer: 'Desteklenen servislerde faturasız hat bakiyesi kullanılabilir; fakat ürün, hat yaşı, kimlik doğrulama ve operatör limitleri sonucu etkiler. Kullanılabilir seçenekleri resmi operatör kanalından kontrol edin.' },
      { question: 'Mobil ödeme limitim neden sıfır görünüyor?', answer: 'Yeni hat, yeni SIM, gecikmiş borç, kısa hat kullanım geçmişi, güvenlik kısıtı veya operatörün risk değerlendirmesi limitin sıfır görünmesine yol açabilir. Kesin neden için operatörünüzle görüşmeniz gerekir.' },
    ],
    sections: [
      {
        title: 'Mobil ödeme nedir?',
        paragraphs: [
          'Mobil ödeme, bir ürün veya dijital hizmetin bedelini banka kartı kullanmadan telefon hattı üzerinden karşılamaya yarayan ödeme yöntemidir. Faturalı hatlarda işlem tutarı çoğunlukla sonraki faturaya eklenir; faturasız hatlarda ise uygun işlemler mevcut TL bakiyesinden düşebilir. Sistem, operatörün ödeme altyapısı ile hizmet sağlayıcının satış ekranı arasında kurulan onay akışı sayesinde çalışır. Kullanıcının telefon numarası, işlem tutarı ve satın alınan hizmet açık biçimde gösterilir; ardından SMS, uygulama bildirimi veya güvenli doğrulama ekranı üzerinden onay istenir.',
          'Mobil ödeme, özellikle uygulama, oyun, dijital üyelik, içerik ve kod satın alımlarında pratik bir seçenek olabilir. Bununla birlikte her hat aynı limite sahip değildir ve her hizmet mobil ödemeyi kabul etmez. Hat yaşı, ödeme geçmişi, tarife türü, güncel borç durumu, SIM değişikliği ve operatörün risk politikası kullanılabilirliği etkileyebilir. Bu nedenle “özelliği açmak” ile “belirli bir tutarda işlem yapabilmek” aynı şey değildir. Aktivasyon başarılı olsa bile işlem başına veya aylık limit düşük olabilir.',
          'Kullanıcı açısından en önemli kural, onay ekranındaki hizmet adı ve toplam tutarı dikkatle okumaktır. Beklemediğiniz bir tutar, farklı bir firma adı veya açıklanmayan bir işlem görürseniz onay vermeyin. Mobil ödeme kolaylığı, yalnız işlem ayrıntıları şeffaf olduğunda güvenli ve kontrollü bir avantaja dönüşür.'
        ]
      },
      {
        title: 'Mobil ödeme sistemi nasıl çalışır?',
        paragraphs: [
          'Süreç genellikle dört aşamada ilerler. Önce mobil ödemeyi kabul eden bir mağaza veya dijital hizmette ürün seçilir. Ardından telefon numarası girilir ya da operatörünüz sistem tarafından tanınır. Operatör, hattın mobil ödemeye açık olup olmadığını ve kullanılabilir limitini kontrol eder. Son adımda telefonunuza gelen doğrulama mesajı veya uygulama içi onay tamamlanır. Onaydan sonra satın alma kaydı oluşturulur ve tutar faturanıza veya bakiyenize yansır.',
          'Arka planda iki farklı kontrol birlikte yürütülür: teknik doğrulama ve finansal uygunluk. Teknik doğrulama, telefon numarasının ve SIM kartın doğrulanmasını sağlar. Finansal uygunluk ise hattın borç durumunu, limitini, daha önceki ödeme davranışını ve işlem kategorisini değerlendirir. Bu nedenle aynı kullanıcı bir platformda işlem yapabilirken başka bir platformda kısıtla karşılaşabilir. Ayrıca bazı dijital ürünlerde mağaza tarafından ayrı günlük adet veya tutar sınırı uygulanabilir.',
          'İşlem tamamlandıktan sonra operatör uygulamasındaki harcama geçmişini ve gelen SMS’i saklamak faydalıdır. Ürün teslim edilmezse veya tutar yanlışsa, tarih, firma adı ve işlem referansı destek sürecini hızlandırır. Onay mesajını silmeden önce satın alınan ürünün doğru şekilde teslim edildiğini kontrol etmek iyi bir alışkanlıktır.'
        ],
        bullets: ['Onay ekranındaki firma adı ile kullandığınız site aynı olmalıdır.', 'İşlem tutarı ve varsa hizmet bedeli ayrı ayrı okunmalıdır.', 'Tek kullanımlık doğrulama kodu, yalnız ilgili ödeme ekranında kullanılmalıdır.', 'İşlem sonrası operatör uygulamasından harcama kaydı kontrol edilmelidir.']
      },
      {
        title: 'Vodafone mobil ödeme nasıl açılır?',
        paragraphs: [
          'Vodafone kullanıcıları mobil ödeme durumunu öncelikle Vodafone Yanımda uygulamasındaki ödeme, servisler veya mobil ödeme alanından kontrol edebilir. Menü adları uygulama sürümüne ve tarife tipine göre değişebildiği için uygulama içindeki arama alanına “mobil ödeme” yazmak en hızlı yöntemdir. Özellik kapalı görünüyorsa ilgili ekrandaki aktivasyon adımları tamamlanır. Uygulamada seçenek bulunmuyorsa Vodafone’un resmi müşteri hizmetleri veya dijital destek kanalı kullanılmalıdır.',
          'Aktivasyon sırasında hattın yasal sahibi, kimlik doğrulaması ve güvenlik kısıtları önemlidir. Yeni açılmış hatlarda, yakın zamanda SIM kart değişmişse veya numara taşıma işlemi yapılmışsa geçici bekleme süresi uygulanabilir. Gecikmiş fatura ya da tahsilat problemi de kullanımı etkileyebilir. Böyle bir durumda farklı sitelerde tekrar tekrar deneme yapmak yerine önce operatör uygulamasında mobil ödeme durumunu ve kullanılabilir limiti kontrol etmek daha doğrudur.',
          'Vodafone mobil ödeme ile dijital ürün almayı planlıyorsanız, satın alma öncesinde ürünün bölgesini, teslim biçimini ve toplam fiyatını kontrol edin. Bozum amacıyla işlem yapacaksanız, ürünü satın almadan önce Sky Bozum üzerinden uygunluk ve güncel oran teyidi alın. Böylece desteklenmeyen ürün, yanlış bölge veya beklenenden farklı ödeme tutarı riskini azaltabilirsiniz.'
        ],
        subsections: [
          { title: 'Vodafone için hızlı kontrol listesi', paragraphs: ['Vodafone Yanımda uygulamasında mobil ödeme durumunu kontrol edin. Kullanılabilir limit ile satın alacağınız ürünün toplam tutarını karşılaştırın. Onay SMS’inde hizmet adı ve tutarı doğrulayın. İşlem planınız Vodafone bakiyesi değerlendirmeye yönelikse, satın almadan önce ilgili Vodafone hizmet sayfasındaki güncel süreci inceleyin.'] }
        ]
      },
      {
        title: 'Turkcell mobil ödeme nasıl açılır?',
        paragraphs: [
          'Turkcell kullanıcıları mobil ödeme ve dijital ödeme seçeneklerini Turkcell uygulaması ile Paycell kanallarından kontrol edebilir. Mobil ödeme ayarları tarife, hat türü ve hesap durumuna göre farklı ekranlarda gösterilebilir. Turkcell uygulamasında ödeme servisleri bölümünü, Paycell kullanıyorsanız uygulamadaki kart ve ödeme ayarlarını inceleyin. Özellik kapalıysa ekrandaki doğrulama adımlarını tamamlayın; açıklama yetersizse yalnız resmi Turkcell veya Paycell destek kanallarına başvurun.',
          'Paycell, mobil ödeme ile aynı şey değildir; fakat Turkcell ekosisteminde kart, bakiye ve dijital alışveriş süreçlerinin yönetilmesini kolaylaştırabilir. Bazı işlemler doğrudan mobil ödeme limitini kullanırken bazıları Paycell kart veya uygulama bakiyesi üzerinden gerçekleşebilir. Satın alma ekranında hangi yöntemin seçildiğini net biçimde görmek gerekir. “Turkcell kullanıyorum” demek, her Paycell kart işleminin telefon faturasına yansıyacağı anlamına gelmez.',
          'Turkcell mobil ödeme ile dijital kod alırken mağazanın güvenilirliği, kodun TL veya yabancı para birimi olması ve teslimat süresi kontrol edilmelidir. Bozum işlemine konu olacak Razer Gold veya benzeri ürünlerde, satın alma yapılmadan önce hangi tutar ve bölgenin kabul edildiğini sorun. Güncel oran ve stok koşulları değişebildiği için önce teyit almak gereksiz harcamayı önler.'
        ],
        subsections: [
          { title: 'Paycell kullanıcıları için önemli ayrım', paragraphs: ['Paycell kart bakiyesi, Turkcell mobil ödeme limiti ve hat faturası birbirinden farklı kaynaklar olabilir. Ödeme ekranında kullanılan kaynağı kontrol edin. Kart bilgilerini, uygulama şifresini ve gelen doğrulama kodlarını üçüncü kişilerle paylaşmayın. İlgili hizmete geçmeden önce Turkcell mobil ödeme sayfasındaki işlem modelini okuyun.'] }
        ]
      },
      {
        title: 'Türk Telekom mobil ödeme nasıl açılır?',
        paragraphs: [
          'Türk Telekom hatlarında mobil ödeme durumunu Türk Telekom’un resmi uygulaması, online işlem merkezi veya müşteri hizmetleri üzerinden kontrol edebilirsiniz. Uygulamadaki servisler ve ödeme ayarları içinde mobil ödeme seçeneğini arayın. Aktivasyon için istenen onayı yalnız resmi ekran üzerinden verin. İnternette paylaşılan eski kısa kodlar veya güncelliği belirsiz yöntemler yerine operatörün güncel dijital kanalını kullanmak daha güvenlidir.',
          'Türk Telekom kullanıcıları Pokus ile de karşılaşabilir. Pokus, dijital cüzdan ve kart özellikleri sunabilen ayrı bir uygulamadır; mobil ödeme limitinin kendisiyle karıştırılmamalıdır. Ödeme yaparken kaynağın Pokus kart bakiyesi mi, telefon hattı mı yoksa başka bir kart mı olduğunu kontrol edin. Bu ayrım, işlemin faturaya nasıl yansıyacağını ve hangi limitin kullanılacağını anlamanızı sağlar.',
          'Hat yeni açıldıysa, numara taşıma veya SIM değişikliği yapıldıysa güvenlik nedeniyle geçici kısıt uygulanabilir. Ayrıca gecikmiş borç, düşük kullanılabilir limit veya belirli hizmet kategorilerinin kapalı olması işlemi engelleyebilir. Aynı işlemi art arda denemek yerine önce hesap durumunu doğrulayın ve gerekiyorsa resmi destekten kısıt nedenini öğrenin.'
        ],
        subsections: [
          { title: 'Pokus ile işlem yaparken', paragraphs: ['Pokus kartın internet alışverişine açık olduğundan, bakiyenin yeterli olduğundan ve ürünün dijital teslimat koşullarının uygun olduğundan emin olun. Bozum amacıyla dijital kod alınacaksa Türk Telekom hizmet sayfasındaki yönlendirmeyi ve güncel uygunluk koşullarını inceleyin.'] }
        ]
      },
      {
        title: 'Faturam gecikti mobil ödeme kullanabilir miyim?',
        paragraphs: [
          'Gecikmiş fatura, mobil ödeme kullanımını doğrudan etkileyebilir. Operatörler tahsilat durumuna göre mobil ödeme limitini azaltabilir, geçici olarak kapatabilir veya yeni işlemleri reddedebilir. Gecikme çok kısa olsa bile sistem risk kontrolü otomatik çalıştığından, ödeme özelliği anında eski seviyesine dönmeyebilir. Borcu ödedikten sonra uygulamadaki limit ekranını yeniden kontrol etmek ve gerekirse bir süre beklemek gerekir.',
          'Fatura borcunu kapatmış olmanız, mobil ödemenin kesin olarak açılacağı anlamına gelmez. Hat kullanım geçmişi, daha önceki gecikmeler, mevcut tarife ve operatör politikası birlikte değerlendirilir. Borç ödendikten sonra hâlâ limit görünmüyorsa müşteri hizmetlerinden mobil ödeme kısıtının ayrıca kaldırılması gerekip gerekmediğini sorun. Destek kaydı oluşturulmadan farklı platformlarda deneme yapmak ek hata mesajlarına yol açabilir.',
          'Finansal açıdan da dikkatli olmak gerekir. Mobil ödeme tutarı sonraki faturaya eklendiğinde toplam borç büyür. Fatura ödeme planınız zaten zorlanıyorsa, yalnız limit var diye yüksek tutarlı dijital ürün satın almak doğru olmayabilir. İşlemin toplam maliyetini ve geri ödeme tarihini önceden hesaplayın.'
        ]
      },
      {
        title: 'Mobil ödeme limitimi nasıl yükseltebilirim?',
        paragraphs: [
          'Mobil ödeme limiti çoğu zaman kullanıcı tarafından serbestçe belirlenen bir rakam değildir. Operatör; hat yaşı, tarife, düzenli ödeme geçmişi, mevcut borç, güvenlik durumu ve kullanım alışkanlıklarına göre bir üst sınır tanımlar. Uygulamada limit yönetimi sunuluyorsa, mevcut üst sınır içinde daha düşük bir kişisel limit seçebilirsiniz; fakat sistemin verdiği azami limiti artırmak için operatör değerlendirmesi gerekir.',
          'Düzenli fatura ödemek, hattı uzun süredir kullanmak ve kimlik bilgilerinin güncel olması olumlu etki yaratabilir. Buna rağmen artış garantisi yoktur. Yeni SIM kart veya numara taşıma sonrasında güvenlik süresi dolmadan limit yükseltilmeyebilir. Müşteri hizmetleri de her zaman manuel artış yapamaz; bazı kararlar otomatik risk sistemi tarafından verilir.',
          'Limit artırma vaadiyle ücret isteyen, hesap şifresi talep eden veya telefonunuza uzaktan erişmek isteyen kişilere güvenmeyin. Gerçek bir limit işlemi yalnız operatörün resmi uygulaması, mağazası veya müşteri hizmetleri üzerinden yürütülmelidir. Kullanım ihtiyacınız belirli bir alışverişe yönelikse, ürünün tamamını tek seferde almak yerine daha düşük tutarlı ve güvenli seçenekleri değerlendirmek daha sağlıklı olabilir.'
        ],
        bullets: ['Faturaları son ödeme tarihinden önce ödeyin.', 'Operatör hesabındaki kimlik ve iletişim bilgilerini güncel tutun.', 'Yeni SIM veya numara taşıma sonrası güvenlik süresini bekleyin.', 'Limit artırma için yalnız resmi operatör kanallarını kullanın.']
      },
      {
        title: 'Mobil ödeme güvenli mi?',
        paragraphs: [
          'Mobil ödeme, doğru ekranda ve bilinçli onayla kullanıldığında kontrollü bir yöntemdir. Güvenliği sağlayan temel unsurlar telefon numarası doğrulaması, operatör kontrolü ve işlem onayıdır. Ancak kullanıcı onay mesajını okumadan ilerlerse veya sahte bir bağlantıya bilgi girerse bu korumalar yeterli olmaz. Güvenliğin en önemli parçası, satın alınan ürün ile onaylanan tutarın birebir uyuşmasıdır.',
          'Tek kullanımlık SMS kodlarını, operatör uygulaması şifresini, e-Devlet bilgilerini veya kart güvenlik kodunu bozum hizmeti sunduğunu söyleyen kişilerle paylaşmayın. Bir dijital kodun kontrol edilmesi için telefonunuzun ekranına uzaktan erişim verilmesi gerekmez. Ayrıca gelen ödeme dekontu görüntüsüne güvenmek yerine banka hesabınızdaki gerçek hareketi kontrol edin.',
          'Şüpheli durumda işlemi durdurmak en doğru seçenektir. Operatör uygulamasından mobil ödeme geçmişini kontrol edin, gerekirse özelliği geçici olarak kapatın ve resmi destek kanalına bildirim yapın. Bir kez onaylanan dijital ürün işlemleri hızlı tamamlanabildiği için, sonradan iptal her zaman mümkün olmayabilir.'
        ]
      },
      {
        title: 'Mobil ödeme bozum işlemi nasıl yapılır?',
        paragraphs: [
          'Sky Bozum sürecinde ilk adım, kullanacağınız yöntem ve yaklaşık tutar için güncel uygunluk almaktır. Vodafone, Turkcell, Türk Telekom, Paycell veya Pokus üzerinden yapılabilecek işlem seçenekleri aynı olmayabilir. Bu nedenle satın alma yapmadan önce hangi dijital ürünün, hangi bölge ve tutarda kabul edildiğini WhatsApp üzerinden sorun. Paylaşılan oran başlangıç veya güncel teklif niteliğindedir; kesin tutar ürün kontrolünden sonra netleşir.',
          'İkinci adımda yalnız onaylanan mağaza ve ürün üzerinden işlem yapılır. Dijital kodun kullanılmamış, okunabilir ve belirtilen bölgeye uygun olması gerekir. Kod herkese açık yorum alanına yazılmamalı, sosyal medya mesajlarında farklı hesaplara gönderilmemelidir. İşlem konuşmasında hizmet adı, ürün tutarı, oran ve tahmini ödeme aynı yerde yazılı olarak bulunmalıdır.',
          'Son aşamada kod veya ürün kontrol edilir. Uygunluk doğrulandığında ödeme için IBAN ve hesap sahibi bilgisi alınır. Banka transferi tamamlandığında kullanıcı kendi hesabındaki hareketi kontrol eder. İşlem süresi yoğunluk, kod doğrulaması ve banka altyapısına göre değişebilir. Satın alma öncesi onay almak, süreci hem daha hızlı hem de daha öngörülebilir hale getirir.'
        ],
        bullets: ['Önce hizmet, tutar ve bölge bilgisini iletin.', 'Güncel uygunluk ve oran teyidi almadan ürün satın almayın.', 'Yalnız kullanılmamış dijital kod paylaşın.', 'Ödeme tamamlandığında banka hesabınızdaki gerçek hareketi kontrol edin.']
      },
      {
        title: 'Sık Sorulan Sorular',
        paragraphs: [
          'Mobil ödeme aktivasyonu, limitler ve operatör kuralları zaman içinde değişebilir. Bu nedenle uygulamada gördüğünüz güncel bilgi, internetteki eski anlatımlardan daha güvenilirdir. Aşağıdaki kısa yanıtlar genel yol haritası sunar; hattınıza özel kesin sonuç için operatörünüzün resmi kanalını kullanın.',
          'Mobil ödeme açık olduğu hâlde işlem reddediliyorsa ürün kategorisi, işlem başı limit, aylık limit veya mağaza kısıtı devrede olabilir. Farklı tutarda tekrar denemeden önce hata mesajını okuyun. Bozum amacıyla dijital ürün alacaksanız, desteklenen ürün ve bölgeyi Sky Bozum ile önceden teyit edin.'
        ]
      }
    ]
  },
  {
    slug: 'dijital-kod-hediye-karti-rehberi',
    title: 'Dijital Kod ve Hediye Kartları Kullanım Rehberi',
    seoTitle: 'Razer Gold, Apple Gift Card ve Steam Hediye Kartı Kullanım Rehberi',
    metaDescription: 'Razer Gold kodu nasıl alınır, Apple Gift Card nasıl gönderilir, Steam hediye kartları nasıl kullanılır?',
    excerpt: 'Razer Gold, Apple Gift Card, Steam ve diğer dijital kodları satın alma, gönderme, kullanma ve güvenli biçimde değerlendirme rehberi.',
    category: 'Dijital Kodlar',
    readTime: '15 dk',
    serviceSlug: 'razer-gold-tl',
    cover: '/blog-covers/dijital-kod-hediye-karti.svg',
    coverAlt: 'Dijital hediye kartları, oyun kodları ve güvenli teslimatı gösteren premium fintech illüstrasyonu',
    keywords: ['razer gold', 'apple gift card', 'itunes', 'steam', 'hediye kartı', 'dijital kod', 'oyun kodu'],
    links: [
      { label: 'Razer Gold hizmeti', href: '/hizmetler/razer-gold-tl' },
      { label: 'Apple Gift Card hizmeti', href: '/hizmetler/itunes-apple' },
      { label: 'Steam hizmeti', href: '/hizmetler/steam' },
    ],
    media: [
      { src: '/blog-covers/dijital-kod-guvenlik.svg', alt: 'Dijital kod güvenlik kontrol listesi ve kilit simgesi', caption: 'Kodun bölgesi, para birimi, satıcısı ve kullanılmamış olması birlikte kontrol edilmelidir.' },
      { src: '/blog-covers/hediye-karti-akisi.svg', alt: 'Hediye kartı satın alma, teslim alma ve değerlendirme akışı', caption: 'Satın almadan önce uygunluk teyidi almak yanlış ürün riskini azaltır.' },
    ],
    faq: [
      { question: 'Dijital kodun kullanılmış olup olmadığını nasıl anlarım?', answer: 'Kesin doğrulama çoğunlukla ilgili platformun kod kullanma ekranında yapılır; ancak kodu denemek bazı platformlarda bakiyeyi doğrudan hesaba yükleyebilir. Satış veya bozum planınız varsa kodu kendiniz kullanmaya çalışmadan önce uygunluk alın.' },
      { question: 'Farklı ülkeye ait hediye kartı kullanılabilir mi?', answer: 'Birçok platform ülke, hesap bölgesi ve para birimi eşleşmesi ister. Türkiye hesabında yabancı bölge kodu çalışmayabilir. Satın almadan önce ürün açıklamasını ve hesap bölgenizi kontrol edin.' },
      { question: 'Ekran görüntüsü olarak gelen kod güvenli midir?', answer: 'Ekran görüntüsü tek başına güven kanıtı değildir. Kod daha önce kopyalanmış veya kullanılmış olabilir. Güvenilir satıcı, sipariş kaydı ve teslim zamanı önemlidir.' },
      { question: 'Kullanmadığım hediye kartını değerlendirebilir miyim?', answer: 'Kod kullanılmamış, bölgesi ve tutarı destekleniyor ve doğrulanabiliyorsa değerlendirme mümkün olabilir. Ürünü göndermeden önce güncel uygunluk ve oran alın.' },
    ],
    sections: [
      {
        title: 'Dijital hediye kartı nedir?',
        paragraphs: [
          'Dijital hediye kartı, belirli bir mağaza, oyun platformu veya uygulama ekosisteminde bakiye yüklemek için kullanılan kod ya da elektronik kupondur. Fiziksel karttan farklı olarak teslimat çoğunlukla e-posta, SMS, sipariş paneli veya uygulama bildirimi üzerinden yapılır. Kod kullanıldığında hesaba belirli bir para birimi veya kredi yüklenir ve desteklenen ürünlerde harcanabilir.',
          'Hediye kartlarının en önemli özelliği platforma ve bölgeye bağlı olmalarıdır. Örneğin Türkiye için üretilen TL kodu, yalnız Türkiye mağaza bölgesinde çalışabilir. USD veya EUR kodları farklı hesap bölgesi isteyebilir. Ürün adında aynı marka yazsa bile para birimi, ülke ve kullanım koşulları değişebilir. Bu nedenle yalnız kartın tutarına bakarak satın alma yapmak yeterli değildir.',
          'Dijital kodlar nakit gibi hassastır. Kod karakterleri bir başkası tarafından görülür ve kullanılırsa çoğu platform geri alma imkânı sunmaz. Kodun ekran görüntüsünü herkese açık paylaşmamak, mesajı yanlış kişiye göndermemek ve güvenilir satıcıdan alışveriş yapmak temel güvenlik adımlarıdır.'
        ]
      },
      {
        title: 'Razer Gold kodu nasıl ve nereden alınır?',
        paragraphs: [
          'Razer Gold, oyun ve dijital içerik ekosisteminde kullanılan bir bakiye sistemidir. Kod satın alırken önce hangi para birimine ve bölgeye ihtiyacınız olduğunu belirleyin. Türkiye hesabı için TL kodu, yabancı bölge hesabı için ilgili ülke veya USD kodu gerekebilir. Ürün sayfasında “global” ifadesi yer alsa bile desteklenen ülkeler listesini okumadan ödeme yapmayın.',
          'Kodlar yetkili dijital mağazalar, büyük e-ticaret platformları ve oyun ürünleri satan bilinen siteler üzerinden alınabilir. Satıcı puanı, yorum sayısı, dijital teslimat süresi ve iade koşulları incelenmelidir. Pazar yeri içindeki her satıcı aynı güven düzeyinde değildir. Çok düşük fiyat, yeni açılmış mağaza ve yalnız mesajla teslimat gibi durumlarda daha dikkatli olun.',
          'Mobil ödeme, Paycell, Pokus veya sanal kartla satın alma yapıyorsanız ödeme kaynağının internet alışverişine açık ve bakiyesinin yeterli olduğundan emin olun. Toplam tutara hizmet bedeli eklenip eklenmediğini son ekranda kontrol edin. Bozum amacıyla Razer Gold alacaksanız, ürünü satın almadan önce Sky Bozum Razer Gold hizmetinden desteklenen tutar, bölge ve güncel oran bilgisini alın.'
        ],
        bullets: ['TL ve USD kodları birbirinden farklı ürünlerdir.', 'Kod bölgesi, kullanılacağı hesabın bölgesiyle eşleşmelidir.', 'Dijital teslimat yapan satıcının puanı ve yorumları kontrol edilmelidir.', 'Bozum planında satın alma öncesi güncel uygunluk alınmalıdır.']
      },
      {
        title: 'Razer Gold kodu teslim alındığında ne yapılmalı?',
        paragraphs: [
          'Sipariş tamamlandıktan sonra kod genellikle mağazanın sipariş ekranında veya e-posta içinde görünür. Önce sipariş numarasını, ürün adını, tutarı ve bölge bilgisini kaydedin. Kodun tamamını sosyal medya, forum veya yorum alanında paylaşmayın. Bir destek görevlisine iletmeniz gerekiyorsa yalnız resmi iletişim kanalını kullanın.',
          'Kodu kendi hesabınızda denemek, bazı sistemlerde bakiyeyi anında yükler ve kodu satışa uygun olmaktan çıkarır. Bu nedenle kodu kullanma niyetiniz yoksa doğrulama amacıyla rastgele denemeyin. Satıcıdan gelen teslimat belgesi ve sipariş kaydı, sorun yaşandığında başvuru yapabilmeniz için saklanmalıdır.',
          'Kod okunamıyorsa veya eksik karakter varsa ekran görüntüsünü düzenleyip tahmin yürütmek yerine satıcının destek kanalına başvurun. Yanlış denemelerin sayısı sınırlı olabilir ve hesap güvenlik kontrolü tetiklenebilir.'
        ]
      },
      {
        title: 'Apple Gift Card nasıl gönderilir?',
        paragraphs: [
          'Apple Gift Card göndermenin en güvenli yolu, alıcının kullandığı Apple mağaza bölgesine uygun kartı seçmektir. Türkiye hesabına gönderilecek kartın Türkiye bölgesinde kullanılabildiğini ürün açıklamasından doğrulayın. Bazı mağazalar kodu doğrudan alıcının e-posta adresine yollar; bazıları ise satın alan kişinin sipariş paneline teslim eder. E-posta adresini yazarken tek karakter hatası bile teslimat sorununa yol açabilir.',
          'Kod size teslim edildiyse alıcıya güvenli ve özel bir kanaldan gönderin. Kodun yer aldığı ekran görüntüsünü grup sohbetine veya herkese açık bir alana koymayın. Alıcı, kodu Apple hesabına eklemeden önce kartın bölgesini kontrol etmelidir. Hesap bölgesi ile kart bölgesi uyuşmazsa kod geçersiz uyarısı verebilir.',
          'Apple Gift Card bozum amacıyla alındıysa, kartı başka bir hesaba göndermeden veya kullanmadan önce Apple/iTunes hizmet sayfasından uygunluk alın. Kullanılmış, kazınmış fiziksel kart veya bölgesi belirsiz kodlar farklı değerlendirilir. Kesin teklif, kodun tutarı ve bölgesi teyit edildikten sonra paylaşılır.'
        ]
      },
      {
        title: 'Apple iTunes hediye kartımı satabilir miyim?',
        paragraphs: [
          'Kullanılmamış ve desteklenen bölgeye ait Apple Gift Card kodları, güncel stok ve talep koşullarına göre değerlendirilebilir. Kartın daha önce bir Apple hesabına yüklenmemiş olması gerekir. Hesaba eklenmiş bakiye ile kullanılmamış kod aynı şey değildir; hesaba tanımlanan bakiye çoğu durumda kod olarak geri çıkarılamaz.',
          'Satış öncesinde kart tutarı, para birimi, satın alındığı ülke ve teslim biçimi açıkça belirtilmelidir. Fiziksel kartlarda satın alma fişi veya aktivasyon belgesi istenebilir. Dijital kartlarda sipariş kaydı ve teslim e-postası faydalıdır. Kodun tamamını oran almadan göndermemek güvenlik açısından önemlidir.',
          'Apple ürünlerinde bölge kısıtı sık karşılaşılan bir konudur. ABD mağazasına ait USD kodu ile Türkiye mağazasına ait TL kodu farklı değerlendirilir. “Apple kodu” şeklinde genel bilgi vermek yerine kartın tam ürün adını ve para birimini paylaşın.'
        ]
      },
      {
        title: 'Steam hediye kartı nedir?',
        paragraphs: [
          'Steam hediye kartı veya Steam cüzdan kodu, Steam hesabına bakiye eklemek için kullanılan dijital üründür. Yüklenen bakiye oyun, indirilebilir içerik ve desteklenen diğer ürünlerde kullanılabilir. Kodlar farklı para birimleri ve bölgeler için üretilebilir. Hesap bölgesi, mağaza para birimi ve kod koşulları uyuşmadığında kullanım engellenebilir.',
          'Steam kodu satın alırken ürünün “cüzdan kodu” mu yoksa belirli bir oyunun aktivasyon anahtarı mı olduğuna dikkat edin. Oyun anahtarı yalnız belirli oyunu etkinleştirirken cüzdan kodu hesaba bakiye ekler. Bu iki ürün aynı şekilde değerlendirilmez. Ürün başlığını ve açıklamasını okumadan alışveriş yapmak yanlış ürün riskini artırır.',
          'Kullanmadığınız Steam cüzdan kodunu değerlendirmek istiyorsanız kodu hesabınıza eklemeden önce Steam hizmet sayfasından güncel uygunluk alın. Para birimi, bölge ve tutar net biçimde paylaşılmalıdır. Kodun daha önce denenmemiş ve kullanılmamış olması gerekir.'
        ]
      },
      {
        title: 'Başka platformların hediye kartları nasıl değerlendirilir?',
        paragraphs: [
          'Google Play, PlayStation, Xbox, Nintendo, alışveriş mağazaları ve çeşitli dijital servisler için farklı hediye kartları bulunur. Her kartın değerlendirme imkânı aynı değildir. Platformun popülerliği, kod bölgesi, stok talebi, tutar ve doğrulama yöntemi sonucu etkiler. Bir markanın kodu daha önce kabul edilmiş olsa bile güncel koşullarda işlem desteği değişebilir.',
          'Önce kartın tam adını, ülkesini, para birimini ve tutarını belirleyin. “Oyun kodu” veya “hediye kartı” gibi genel ifadeler yeterli değildir. Kodun dijital mi fiziksel mi olduğu, fiş veya sipariş belgesinin bulunup bulunmadığı da önemlidir. Ardından kodu göstermeden yalnız ürün bilgileriyle uygunluk sorun.',
          'Desteklenmeyen bir kartı yalnız yüksek indirim gördüğünüz için satın almak risklidir. Satın alma kararı, doğrulanmış kullanım ihtiyacına veya güncel bozum uygunluğuna dayanmalıdır. Dijital ürünlerde iade seçenekleri sınırlı olduğundan ön kontrol büyük önem taşır.'
        ]
      },
      {
        title: 'Dijital kod alırken dikkat edilmesi gerekenler',
        paragraphs: [
          'İlk kontrol satıcı güvenilirliğidir. Alan adı, iletişim bilgileri, kullanıcı yorumları, pazar yeri puanı ve dijital teslimat politikası incelenmelidir. Sosyal medya hesabından yalnız mesajla satış yapan, fatura veya sipariş kaydı sunmayan ve normal fiyatın çok altında teklif veren satıcılarda risk daha yüksektir. Ödeme yapmadan önce ürün sayfasının ekran görüntüsünü ve sipariş koşullarını kaydetmek faydalıdır.',
          'İkinci kontrol ürün uyumluluğudur. Bölge, para birimi, platform, kart türü ve teslim yöntemi doğru olmalıdır. “Global” etiketi her ülkede kesin çalışacağı anlamına gelmeyebilir. Hesap bölgenizi bilmiyorsanız ilgili platform ayarlarından kontrol edin. Hediye olarak gönderiyorsanız alıcının hesap bölgesini sorun.',
          'Üçüncü kontrol güvenli teslimattır. Kod geldiğinde e-posta hesabınızın ve mağaza hesabınızın şifresi güçlü olmalıdır. Kod ekranını ortak bilgisayarda açık bırakmayın. Destek konuşmalarında kodu yalnız gerekli aşamada paylaşın. Kullanılmamış kod, ödeme belgesi gibi geri döndürülemez bir değere sahiptir.'
        ],
        bullets: ['Satıcı ve alan adı doğrulaması yapın.', 'Bölge ve para birimini ürün başlığından değil ayrıntılı açıklamadan kontrol edin.', 'Teslimat e-postasını ve sipariş numarasını saklayın.', 'Kod karakterlerini herkese açık alanda paylaşmayın.', 'Bozum için alıyorsanız önce oran ve uygunluk teyidi alın.']
      },
      {
        title: 'Kullanılmayan dijital kartlar nasıl değerlendirilir?',
        paragraphs: [
          'Kullanılmayan bir dijital kartı değerlendirmeden önce kodun hâlâ geçerli ve kullanılmamış olduğundan emin olun. Geçerlilik tarihi bulunan kartlarda son kullanım tarihi kontrol edilmelidir. Kartın hesabınıza yüklenmiş olması, kodun kullanılmamış olduğu anlamına gelmez; çoğu platformda hesaba eklenen bakiye tekrar koda çevrilemez.',
          'Sky Bozum üzerinden işlem planlıyorsanız önce hizmet türünü, tutarı, para birimini ve bölgeyi WhatsApp üzerinden iletin. Güncel stok ve oran bilgisi alındıktan sonra yalnız onaylanan kod paylaşılır. Kod doğrulaması tamamlandığında ödeme için gerekli IBAN bilgisi istenir. Süreç boyunca aynı resmi iletişim kanalında kalmak, sahte hesap riskini azaltır.',
          'Değerlendirme oranı kartın nominal tutarından farklı olabilir. Bunun nedeni dijital ürünün talebi, bölgesi, doğrulama riski ve stok durumudur. İşleme başlamadan önce tahmini ödeme tutarını netleştirin ve kararınızı toplam maliyete göre verin.'
        ]
      },
      {
        title: 'Dijital kodlarda dolandırıcılık nasıl önlenir?',
        paragraphs: [
          'En yaygın yöntemlerden biri, kodun ödeme yapılmadan alınması veya sahte ödeme dekontu gönderilmesidir. Kod bir kez kullanıldığında geri alınamadığı için karşı tarafın resmi iletişim bilgilerini doğrulamak gerekir. Profil görseli ve marka logosu kolayca kopyalanabilir; iletişim numarasını doğrudan resmi web sitesindeki bağlantıdan açın.',
          'Başka bir risk, “kontrol etmek için” kodun tamamının istenmesidir. Uygunluk ve oran konuşulmadan kod göndermeyin. Ekran paylaşımı, uzaktan erişim uygulaması, e-posta şifresi veya platform hesabı parolası isteyen kişilerle işlemi kesin. Güvenilir bir kod işlemi için cihazınızın tamamına erişim verilmesi gerekmez.',
          'Ödeme tamamlandığı söylendiğinde yalnız dekont görseline bakmayın; banka hesabınızdaki kullanılabilir bakiye ve işlem hareketini kontrol edin. Tarih, saat, gönderen adı ve tutar uyuşmalıdır. Sorun yaşanırsa konuşma kayıtlarını, sipariş belgesini ve kod teslim zamanını saklayın.'
        ]
      },
      {
        title: 'Dijital kod satın aldıktan sonra kayıt ve takip',
        paragraphs: [
          'Dijital ürünlerde düzenli kayıt tutmak, hem kişisel bütçe yönetimini hem de olası destek başvurularını kolaylaştırır. Sipariş numarası, satın alma tarihi, satıcı adı, ürün bölgesi, para birimi ve nominal tutar tek bir notta saklanabilir. Kodun kendisini aynı not içinde açık biçimde tutmak yerine güvenli parola yöneticisi veya yalnız sizin erişebildiğiniz korumalı bir alan tercih edin. Böylece sipariş bilgileri kaybolmaz, fakat kodun yanlışlıkla paylaşılma riski azalır.',
          'Birden fazla kod aldıysanız hangi kodun hangi siparişe ait olduğunu karıştırmamak için kodları sıra numarasıyla eşleştirin. Kullanılan kodları ayrıca işaretleyin ve kullanılmamış kodlardan ayırın. Bu basit yöntem, aynı kodun ikinci kez gönderilmesini veya yanlış ürünün paylaşılmasını önler. Bozum işlemi sırasında da hangi kodun kontrol edildiği ve hangi ödemenin hangi ürüne ait olduğu daha kolay takip edilir.',
          'Destek başvurusu gerekirse yalnız gerekli bilgileri paylaşın. Mağaza desteği genellikle sipariş numarası, hesap e-postası, teslim zamanı ve hata ekranını ister. Hesap şifresi, e-posta parolası veya cihazınıza uzaktan erişim vermek hiçbir standart destek sürecinin parçası değildir. Belgeleri saklamak güvenliği azaltmamalı; kişisel bilgiler içeren ekran görüntülerini göndermeden önce gereksiz alanları kapatın.'
        ]
      },
      {
        title: 'Sık Sorulan Sorular',
        paragraphs: [
          'Dijital kodlarla ilgili soruların çoğu bölge, para birimi ve kullanım durumu etrafında toplanır. Kodun markası tek başına yeterli bilgi değildir. Satın alma veya bozum öncesinde tam ürün adı, tutar ve bölge birlikte değerlendirilmelidir.',
          'İade koşulları satıcıya ve platforma göre değişir. Dijital kod görüntülendikten sonra birçok mağaza iade kabul etmez. Bu nedenle ödeme öncesi kontrol, sonradan çözüm aramaktan daha etkilidir. Aşağıdaki FAQ yanıtları genel bilgilendirme sunar; ürününüze özel durum için ilgili hizmet sayfasını ve resmi platform desteğini kullanın.'
        ]
      }
    ]
  }
];
