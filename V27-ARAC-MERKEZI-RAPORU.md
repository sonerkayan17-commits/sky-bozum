# Sky Bozum V27 — Etkileşimli Araç Merkezi

## Eklenen araçlar

1. Mobil ödeme sonucu hesaplayıcı
2. Hedef net ödeme için gereken bakiye
3. Tüm hizmetleri tek tabloda oran karşılaştırma
4. Çoklu dijital kod dağıtım hesaplayıcı
5. Gift card sonucu hesaplayıcı
6. SMS mobil ödeme hesaplayıcı
7. Faturaya ek cihaz maliyet simülatörü
8. Akıllı işlem sihirbazı

## Sistem geliştirmeleri

- Araçlar ana navigasyona eklendi.
- Araç Merkezi 8 araçlık premium kart yapısına dönüştürüldü.
- Hesaplamalar ortak `rates.ts` verisini kullanır; yinelenen oran kaynağı oluşturulmadı.
- Türkçe tutar girişi, üst sınır ve hatalı giriş kontrolleri uygulandı.
- Başlangıç ve üst oran sonuçları ayrı gösterildi.
- Oran karşılaştırma aracı iki seçenek yerine tüm hizmetleri yüksekten düşüğe sıralar.
- Kod hesaplayıcı birden fazla kupürle en az kodlu dağılım oluşturur.
- Cihaz simülatörü peşinat, vade ve aylık ek bedeli hesaba katar.
- İşlem sihirbazı kullanıcıyı ilgili araç ve rehberlere yönlendirir.
- Tüm araçlar site aramasına ve sitemap yapısına otomatik dahil edildi.

## Güvenlik ve şeffaflık

- Sonuçların kesin teklif olmadığı her kritik sayfada belirtilir.
- Kod satın almadan önce uygunluk ve oran teyidi uyarıları korunur.
- Cihaz hesaplayıcı resmî operatör teklifi veya finansman önerisi olarak sunulmaz.
