# Sky Bozum V45.193 — UX Denetimi 7

Bu paket, tam Sky Bozum projesinin Windows uyumlu production çalışma sürümüdür.

## Bu sürümde

- Genel mobil hızlı dock artık kullanıcının bulunduğu ana bölümü görünür biçimde işaretler.
- Araçlar, Bilgi Merkezi ve S.S.S. alt rotalarında doğru dock öğesi aktif kalır.
- Aktif bağlantıya `aria-current="page"` eklenerek ekran okuyucu yönlendirmesi iyileştirildi.
- Dekoratif dock ikonları ekran okuyuculardan gizlendi; gereksiz seslendirme kaldırıldı.
- Güven Merkezi'nin özel dock davranışı ve mevcut WhatsApp akışı aynen korunmuştur.

## Kalite kapıları

```bash
npm run audit:mobile-dock-active-state
npm run audit:mobile-dock-ux
npm run audit:release
```

- Referanslar bölümüne canlı, sonsuz döngülü kayan onaylı yorum akışı eklendi.
