# Referanslar V37.9 — Hafif Etkileşim Cilası

Sayfa yerleşimi korunarak aşağıdaki küçük özellikler eklendi:

- Her yorum için tek tıklamalı **Faydalı** etkileşimi
- Aynı ziyaretçinin aynı yorumu tekrar beğenmesini engelleyen yerel ziyaretçi kimliği
- Yorumlara açılan, sayfayı büyütmeyen kompakt **Yanıtla** formu
- Yanıtların mevcut admin onay akışına gönderilmesi
- Onaylanan yanıtların ilgili yorum altında en fazla iki kısa satır olarak gösterilmesi
- Sayfa geneli için sağ üstte düşük kontrastlı görüntülenme sayısı
- Beğeni ve görüntülenme verileri için gerçek Firestore koleksiyonu
- Firestore kurallarına kontrollü, yalnızca oluşturma izni veren etkileşim doğrulaması
- Mevcut kart, arşiv, form, navbar ve footer düzeni korunmuştur

## Firebase

Yeni koleksiyon: `referenceEngagements`

Belgeler kullanıcı tarafından güncellenemez veya silinemez. Her beğeni/görüntülenme, ziyaretçi ve hedef birleşiminden üretilmiş tekil belge kimliğiyle kaydedilir.

Yorum ve yanıtlar yine `comments` koleksiyonuna `pending` durumuyla düşer ve admin onayı olmadan yayınlanmaz.
