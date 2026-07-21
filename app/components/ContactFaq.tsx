'use client';

import { useState } from 'react';

const items = [
  ['Sky Bozum ile hangi platformlardan iletişim kurabilirim?', 'Sky Bozum ile resmi WhatsApp hattı, telefon ve e-posta üzerinden iletişim kurabilirsiniz. En hızlı oran ve işlem desteği için iletişim sayfasındaki doğrulanmış WhatsApp bağlantısını kullanın.'],
  ['Sky Bozum taklidi yapan sahte siteleri nasıl ayırt ederim?', 'Alan adının bozumcu.net olduğunu, telefon numarasının sitedeki resmi numarayla eşleştiğini ve bağlantının iletişim sayfasından açıldığını kontrol edin. Sosyal medya yorumlarındaki veya size özel mesajla gönderilen bilinmeyen bağlantılardan işlem başlatmayın.'],
  ['Konuşurken iletişim koparsa ne yapmalıyım?', 'Aynı resmi kanal üzerinden yeniden yazın ve önceki mesajınızdaki işlem türünü, tutarı ve varsa işlem saatini belirtin. Yeni bir hesaba veya farklı numaraya yönlendirilirseniz devam etmeden önce resmi iletişim sayfasından doğrulama yapın.'],
  ['İletişime geçtikten sonra bilgilerim güvende mi?', 'Yalnız işlemin yürütülmesi için gerekli bilgiler talep edilir. Şifre, kart şifresi, hesap parolası veya tek kullanımlık doğrulama kodu istenmez. Hassas bilgileri ekran görüntüsü içinde de paylaşmayın.'],
  ['İşlemi hızlandırmak için mesajda neleri belirtmeliyim?', 'İşlem türünü, ürün veya hizmet adını, toplam tutarı ve ödemenin yapılacağı IBAN sahibinin ad-soyad bilgisini yazın. Kodu veya hassas veriyi oran ve uygunluk onayı almadan göndermeyin.'],
  ['WhatsApp üzerinden hangi bilgiler istenir?', 'İşlem türü, tutar, ürünün para birimi veya bölgesi ve ödeme için IBAN bilgisi istenebilir. İşleme göre kullanılmamış dijital kod yalnız uygunluk ve oran onayından sonra talep edilir.'],
  ['Hangi bilgileri kesinlikle paylaşmamalıyım?', 'Banka veya uygulama şifrenizi, kart PIN’inizi, internet bankacılığı parolanızı, SMS doğrulama kodunu ve hesabınıza giriş sağlayan bilgileri kesinlikle paylaşmayın.'],
  ['Destek hattına ne zaman ulaşabilirim?', 'Destek talepleri 7/24 alınır. Yoğunluk, ürün kontrolü veya ödeme altyapısına bağlı olarak dönüş süresi değişebilir; mevcut konuşma üzerinden tekrar yazarak talebinizi güncelleyebilirsiniz.'],
  ['Oran bilgisini nasıl öğrenebilirim?', 'İletişim sayfasındaki resmi WhatsApp butonuna tıklayın; ürün türünü, tutarı ve para birimini yazın. Güncel koşullar kontrol edilerek işleme başlamadan önce size oran bilgisi iletilir.'],
  ['İşlem sonrası destek alabilir miyim?', 'Evet. Ödeme, işlem kaydı veya süreçle ilgili bir sorunuz olduğunda aynı resmi iletişim kanalı üzerinden işlem saati ve temel bilgileri paylaşarak destek talebi oluşturabilirsiniz.'],
];

export default function ContactFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section aria-labelledby="contact-faq-title" className="mt-10 rounded-[28px] border border-white/10 bg-[#0e1118] p-6 shadow-2xl shadow-black/20 sm:p-9">
      <div className="max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">İletişim SSS</p>
        <h2 id="contact-faq-title" className="mt-3 text-3xl font-black sm:text-4xl">Bize yazmadan önce merak edilenler</h2>
        <p className="mt-4 leading-7 text-slate-400">Resmi kanallar, güvenlik ve işlem desteği hakkında en sık sorulan soruların açık yanıtları.</p>
      </div>
      <div className="mt-8 grid gap-3 lg:grid-cols-2">
        {items.map(([question, answer], index) => {
          const isOpen = openIndex === index;
          return (
            <article key={question} className="self-start overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition hover:border-amber-300/25">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left font-extrabold"
              >
                <span>{question}</span>
                <span aria-hidden="true" className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-amber-300 transition ${isOpen ? 'rotate-45 bg-amber-400/10' : 'bg-white/[0.03]'}`}>+</span>
              </button>
              {isOpen && <p className="border-t border-white/8 px-5 py-5 text-sm leading-7 text-slate-400">{answer}</p>}
            </article>
          );
        })}
      </div>
    </section>
  );
}
