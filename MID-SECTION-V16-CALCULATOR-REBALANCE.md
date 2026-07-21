# Mid Section V16 — Calculator Rebalance

## Tespit edilen ana sorunlar

- Native select menüsü Windows/Chrome üzerinde büyük beyaz bir panel açarak koyu temayı bozuyordu.
- Hesap makinesi sağ kartla eşit yüksekliğe getirildiğinde içeriği yatay ve dikey olarak seyrek kalıyordu.
- Tahmini ödeme alanı gereksiz büyüyerek boşluk hissi oluşturuyordu.
- Tek kolonlu içerik, aynı genişlikteki Bilgi Merkezi karşısında optik olarak zayıf görünüyordu.
- Alt açıklama metni iki satıra düşerek alanı gereksiz uzatıyordu.

## Uygulanan çözüm

- Native `select` kaldırıldı ve koyu temalı, kontrollü özel dropdown eklendi.
- Sol dış kart korunarak içerisi iki kolona ayrıldı:
  - Hesaplama alanı
  - İşlem özeti
- Sonuç alanı küçültüldü ve hesaplama kolonuna dengeli biçimde yerleştirildi.
- İşlem özeti; seçilen hizmet, oran, tahmini süre ve üç adımlı akışla dolduruldu.
- WhatsApp butonu daha kısa ve daha kontrollü metinle kullanıldı.
- Alt oran uyarısı tek satırlık kompakt yapıya çevrildi.
- Dış ölçü, minimum yükseklik ve ana sayfadaki iki eşit kolon sistemi değiştirilmedi.
