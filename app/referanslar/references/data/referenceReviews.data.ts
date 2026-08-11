import type { PublicComment } from '../../../lib/comments';

/**
 * Static publishing previews used only until the moderated site-review backend is enabled.
 * These records must always remain visibly labelled as examples in the UI.
 */
export const exampleSiteReviews: PublicComment[] = [
  { id: 'example-vodafone-1', parentId: null, author: 'Mert K', service: 'Vodafone Mobil Ödeme', message: 'İlk kez işlem yaptım. Başta biraz tereddüt ettim ama hangi adımı neden yaptığımı anlattılar. İşlem tamamlanınca bilgi de verdiler.', rating: 5, createdAt: null },
  { id: 'example-razer-1', parentId: null, author: 'Ahmet D', service: 'Razer Gold', message: 'Kod kontrolü beklediğimden kısa sürdü. Yoğunluk nedeniyle birkaç dakika bekledim ama süreç boyunca dönüş aldım.', rating: 4, createdAt: null },
  { id: 'example-paycell-1', parentId: null, author: 'Sinem A', service: 'Paycell', message: 'Paycell bakiyem için yazdım. Ne kadar süreceğini baştan söylediler ve söylenen süre içinde sonuçlandı.', rating: 5, createdAt: null },
  { id: 'example-itunes-1', parentId: null, author: 'Burak Y', service: 'Apple / iTunes', message: 'iTunes kodu konusunda daha önce sorun yaşamıştım. Burada kontrol aşaması açık anlatıldı, o yüzden işlem daha güvenli hissettirdi.', rating: 5, createdAt: null },
  { id: 'example-turkcell-1', parentId: null, author: 'Ece T', service: 'Turkcell Mobil Ödeme', message: 'İlk mesajıma hızlı dönüş yapıldı. İşlem sırasında acele ettirmediler, adımları sırayla ilerlettik.', rating: 5, createdAt: null },
  { id: 'example-telekom-1', parentId: null, author: 'Kaan S', service: 'Türk Telekom Mobil Ödeme', message: 'İşlem sorunsuz bitti. Sadece yoğun saatte olduğum için biraz bekledim, onun dışında iletişim iyiydi.', rating: 4, createdAt: null },
  { id: 'example-pokus-1', parentId: null, author: 'Dilara Ç', service: 'Pokus', message: 'Pokus bakiyesi için ilk defa denedim. Gereken bilgileri kısa ve anlaşılır şekilde anlattılar.', rating: 5, createdAt: null },
  { id: 'example-steam-1', parentId: null, author: 'Emre B', service: 'Steam', message: 'Steam kodunu göndermeden önce süreci sordum. Net cevap verdiler, sonrasında da işlem beklediğim gibi tamamlandı.', rating: 5, createdAt: null },
  { id: 'example-vodafonepay-1', parentId: null, author: 'Zeynep N', service: 'Vodafone Pay', message: 'Ödeme hesabının hat sahibine ait olması gerektiğini özellikle belirtmeleri güven verdi. İşlemde bir sorun yaşamadım.', rating: 5, createdAt: null },
  { id: 'example-mobile-1', parentId: null, author: 'Onur G', service: 'Mobil Ödeme', message: 'Daha önce bu tür bir işlem yapmamıştım. Baştan sona ne yapacağımı söylediler, karmaşık gelmedi.', rating: 5, createdAt: null },
  { id: 'example-razer-2', parentId: null, author: 'Serkan P', service: 'Razer Gold', message: 'Fiyat ve süreç baştan netti. Sonradan farklı bir bilgi çıkmadı, benim için en önemli tarafı buydu.', rating: 5, createdAt: null },
  { id: 'example-paycell-2', parentId: null, author: 'Buse E', service: 'Paycell', message: 'Destek ekibi ilgiliydi. Bir noktada tekrar bilgi istedim, aynı şeyi sabırla yeniden anlattılar.', rating: 4, createdAt: null },
  { id: 'example-itunes-2', parentId: null, author: 'Melis U', service: 'Apple / iTunes', message: 'Kodu göndermeden önce oranı ve süreci sordum. Cevap netti, işlem sırasında da farklı bir durum çıkmadı.', rating: 5, createdAt: null },
  { id: 'example-turkcell-2', parentId: null, author: 'Berk A', service: 'Turkcell Mobil Ödeme', message: 'İşlem tamamlandı. İlk başta hattımla ilgili bir kontrol gerektiği için biraz uzadı ama neden beklediğimi söylediler.', rating: 4, createdAt: null },
  { id: 'example-telekom-2', parentId: null, author: 'Yusuf H', service: 'Türk Telekom Mobil Ödeme', message: 'Kısa ve sorunsuz bir işlem oldu. Gereksiz bilgi istemeden sadece gereken adımları anlattılar.', rating: 5, createdAt: null },
  { id: 'example-pokus-2', parentId: null, author: 'Ceren O', service: 'Pokus', message: 'Daha önce Pokus bakiyesi çevirmemiştim. Birkaç soru sordum, cevap aldıktan sonra devam ettim. Memnun kaldım.', rating: 5, createdAt: null },
  { id: 'example-steam-2', parentId: null, author: 'Arda T', service: 'Steam', message: 'Steam kodu kontrol edildi ve işlem bitti. Yoğunluk vardı ama bekleme süresi baştan söylendi.', rating: 4, createdAt: null },
  { id: 'example-vodafone-2', parentId: null, author: 'Nisa R', service: 'Vodafone Mobil Ödeme', message: 'İkinci işlemimdi. İlkinde olduğu gibi bu sefer de adımları karıştırmadan hızlıca tamamladık.', rating: 5, createdAt: null },
  { id: 'example-mobile-2', parentId: null, author: 'Hakan L', service: 'Mobil Ödeme', message: 'Ne yapacağımı bilmiyordum, mesajla tarif ettiler. İşlem bittikten sonra ödeme bilgisini de ilettiler.', rating: 5, createdAt: null },
  { id: 'example-razer-3', parentId: null, author: 'Gizem V', service: 'Razer Gold', message: 'Kodla ilgili kontrol biraz sürdü. Destek cevap vermeye devam ettiği için beklerken sorun yaşamadım.', rating: 4, createdAt: null },
];
