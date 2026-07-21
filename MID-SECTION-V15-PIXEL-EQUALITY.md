# Mid Section V15 — Pixel Eşitliği Düzeltmesi

## Asıl hata
Kompakt hesap makinesi bileşeni `id="oran-teklifi"` taşımaya devam ediyordu. Global CSS içindeki:

```css
.home-page #oran-teklifi { padding-block: 76px; }
```

kuralı, hesap makinesinin grid hücresi içinde üstten ve alttan 76 px boşluk almasına neden oluyordu. Bu yüzden dış grid eşit olsa bile görünen hesap makinesi kartı sağdaki Bilgi Merkezi kartından küçük ve ortalanmış görünüyordu.

## Uygulanan çözüm
- `oran-teklifi` kimliği yalnızca bileşenin bağımsız/tam sayfa kullanımında korunuyor.
- Ana sayfadaki `compact` kullanımında bu kimlik kaldırıldı.
- Kompakt bileşene `w-full`, `h-full`, `self-stretch` ve `min-h-0` eklendi.
- Böylece global bölüm padding'i kompakt karta uygulanmıyor.
- Sol ve sağ dış kart artık aynı grid satırını piksel olarak tamamen dolduruyor.
- Üst başlangıç, alt bitiş, genişlik ve yükseklik eşitleniyor.

## Değiştirilen dosya
- `app/components/QuickCalculator.tsx`
