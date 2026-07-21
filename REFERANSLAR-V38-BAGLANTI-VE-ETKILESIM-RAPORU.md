# Sky Bozum V38 — Referanslar bağlantı ve etkileşim raporu

## Bağlanan işlevler

- WM Aracı kaynak bağlantıları yeni sekmede güvenli şekilde açılır.
- Her referans için Firebase tabanlı tekil “Faydalı” etkileşimi bağlandı.
- Referanslar sayfası için tekil görüntülenme kaydı bağlandı.
- Yorum ve yanıt gönderimleri `comments` koleksiyonuna `pending` olarak kaydedilir.
- Yalnızca `approved` durumundaki yorumlar ve yanıtlar ziyaretçilere gösterilir.
- WM Aracı yorumlarına verilen yanıtlar doğru hizmet etiketiyle kaydedilir.
- Onaylanmış kullanıcı yanıtları artık yanlış biçimde “Sky” yanıtı gibi gösterilmez; gerçek yazar adıyla gösterilir.
- Eksik operatör hizmet seçenekleri form ve Firestore kurallarıyla eşitlendi.
- Firebase CLI dağıtımı için `firebase.json` ve `firestore.indexes.json` eklendi.

## Firebase kurulumu

1. `.env.example` dosyasını `.env.local` adıyla kopyalayın.
2. Firebase Web App değerlerini doldurun.
3. Firestore Database oluşturun.
4. Firebase CLI ile kuralları yayınlayın:

```bash
firebase deploy --only firestore
```

## Güvenlik modeli

- Ziyaretçiler doğrudan onaylı içerik oluşturamaz.
- Yeni yorum ve yanıtlar yalnızca `pending` olarak yazılabilir.
- Onaylama/reddetme işlemleri Firebase Console veya yetkili admin sistemi üzerinden yapılır.
- Ziyaretçiler mevcut yorumları değiştiremez veya silemez.
- Beğeni ve görüntülenme dokümanları ziyaretçi kimliği + hedef birleşimiyle tekilleştirilir.

## Değiştirilmeyen alanlar

Navbar, footer, ana sayfa, diğer rotalar, logo sistemi ve hizmet sayfaları değiştirilmedi.
