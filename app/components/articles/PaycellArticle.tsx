"use client";

import Link from "next/link";

const purchaseSteps = [
  {
    number: "01",
    title: "Paycell kart bilgilerinizi kontrol edin",
    description:
      "Paycell uygulamasında kart numarası, son kullanma tarihi ve güvenlik kodunun kullanıma hazır olduğundan emin olun.",
  },
  {
    number: "02",
    title: "Razer Gold ürününü seçin",
    description:
      "Hepsiburada, Trendyol veya ByNoGame üzerinde ihtiyacınıza uygun Razer Gold ürününü bulun.",
  },
  {
    number: "03",
    title: "Ödemeyi Paycell kart ile tamamlayın",
    description:
      "Ödeme ekranında Paycell kart bilgilerinizi girin ve siparişi tamamlayın.",
  },
  {
    number: "04",
    title: "Kodu teslim alın",
    description:
      "Dijital teslimat tamamlandığında Razer Gold kodunuzu hesabınızdan veya sipariş detayından kontrol edin.",
  },
];

const marketplaces = [
  {
    name: "Hepsiburada",
    description:
      "Dijital ürün kategorisinde satışa sunulan uygun Razer Gold seçeneklerini inceleyebilirsiniz.",
  },
  {
    name: "Trendyol",
    description:
      "Satıcı puanı, ürün yorumları ve dijital teslimat bilgisini kontrol ederek uygun ürünü seçebilirsiniz.",
  },
  {
    name: "ByNoGame",
    description:
      "Dijital oyun ürünleri arasında yer alan Razer Gold seçeneklerini inceleyebilir ve kart ile ödeme adımına geçebilirsiniz.",
  },
];

const faqItems = [
  {
    question: "Paycell ile Razer Gold alınabilir mi?",
    answer:
      "Paycell kartınız internet alışverişine açık olduğunda, kart ile ödeme kabul eden Hepsiburada, Trendyol veya ByNoGame üzerindeki uygun Razer Gold ürünlerinde kullanılabilir.",
  },
  {
    question: "Razer Gold resmi sitesinden Paycell ile kod alınabilir mi?",
    answer:
      "Sky Bozum kullanıcı deneyimine göre Paycell kart ile doğrudan Razer Gold resmi sayfasından işlem yapılmaz. Bu nedenle Hepsiburada, Trendyol veya ByNoGame gibi desteklenen satış kanalları tercih edilir.",
  },
  {
    question: "Satın aldığım Razer Gold kodunu Sky Bozum&apos;a satabilir miyim?",
    answer:
      "Evet. Kullanmadığınız Razer Gold kodunu işlem öncesinde güncel oran alarak Sky Bozum&apos;a satabilirsiniz.",
  },
  {
    question: "Ödeme yapmadan önce nelere dikkat etmeliyim?",
    answer:
      "Satıcı puanını, ürün açıklamasını, kod bölgesini, dijital teslimat bilgisini ve sipariş koşullarını kontrol etmeniz gerekir.",
  },
  {
    question: "Oranlar sabit mi?",
    answer:
      "Hayır. Oranlar stok, ürün türü ve piyasa koşullarına göre değişebilir. İşlem öncesinde mutlaka güncel oran alınmalıdır.",
  },
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="m7 12 3 3 7-7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PaycellArticle() {
  return (
    <article className="bg-white">
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-3 lg:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <CheckIcon />
            </div>
            <h2 className="mt-5 text-lg font-black text-slate-950">
              Kart ile ödeme
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Paycell kart bilgilerinizi kullanarak desteklenen mağazalarda
              dijital ürün ödemesi yapabilirsiniz.
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              <CheckIcon />
            </div>
            <h2 className="mt-5 text-lg font-black text-slate-950">
              Dijital teslimat
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Satın aldığınız Razer Gold kodu, mağazanın teslimat sistemine göre
              sipariş ekranınıza veya hesabınıza iletilir.
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <CheckIcon />
            </div>
            <h2 className="mt-5 text-lg font-black text-slate-950">
              Sky Bozum desteği
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Kullanmadığınız Razer Gold kodunu güncel oran bilgisi alarak Sky
              Bozum üzerinden değerlendirebilirsiniz.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8 lg:py-24">
        <section>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">
            Paycell rehberi
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">
            Paycell nedir?
          </h2>

          <div className="mt-6 space-y-5 text-base leading-8 text-slate-700">
            <p>
              Paycell, mobil cihazlar üzerinden ödeme işlemlerinin yönetilmesini
              sağlayan dijital ödeme çözümlerinden biridir. Uygulama içerisinde
              sunulan kart bilgileri, desteklenen internet sitelerinde kart ile
              ödeme yapmak için kullanılabilir.
            </p>

            <p>
              Paycell kullanan kişiler, kartları internet alışverişine açık
              olduğu sürece uygun e-ticaret sitelerinde dijital ürün satın alma
              işlemi gerçekleştirebilir. Kullanılabilir özellikler hesap
              durumuna, kart ayarlarına ve güncel kullanım koşullarına göre
              değişebilir.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-black tracking-[-0.035em] text-slate-950">
            Paycell nasıl kullanılır?
          </h2>

          <div className="mt-6 space-y-5 text-base leading-8 text-slate-700">
            <p>
              Paycell kullanmak için öncelikle uygulamaya giriş yapılır. Kart
              bölümünden kart bilgileri görüntülenir ve internet alışverişi
              ayarları kontrol edilir. Ödeme sırasında kart numarası, son
              kullanma tarihi ve güvenlik kodu ilgili alanlara girilir.
            </p>

            <p>
              Kart ile işlem yapmadan önce kullanılabilir bakiye, işlem limiti
              ve internet alışverişi izni kontrol edilmelidir. İşlem
              tamamlanmıyorsa kart ayarları ve mağazanın ödeme koşulları yeniden
              incelenmelidir.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-black tracking-[-0.035em] text-slate-950">
            Paycell kart ile Razer Gold nasıl alınır?
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-700">
            Paycell kart ile Razer Gold satın almak için Razer Gold resmi
            sayfası yerine kart ile ödeme kabul eden Hepsiburada, Trendyol veya
            ByNoGame üzerindeki uygun ürünler tercih edilir.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {purchaseSteps.map((step) => (
              <div
                key={step.number}
                className="rounded-[26px] border border-slate-200 bg-slate-50 p-6"
              >
                <span className="text-sm font-black tracking-[0.16em] text-blue-700">
                  {step.number}
                </span>
                <h3 className="mt-3 text-lg font-black text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-black tracking-[-0.035em] text-slate-950">
            Hangi sitelerden Razer Gold alınabilir?
          </h2>

          <div className="mt-8 space-y-4">
            {marketplaces.map((marketplace) => (
              <div
                key={marketplace.name}
                className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.05)]"
              >
                <h3 className="text-xl font-black text-slate-950">
                  {marketplace.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {marketplace.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[30px] bg-slate-950 p-7 text-white sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-300">
            Razer Gold bozum
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.035em]">
            Satın aldığınız Razer Gold kodunu değerlendirin
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Hepsiburada, Trendyol veya ByNoGame üzerinden satın aldığınız ve
            kullanmadığınız Razer Gold kodunu Sky Bozum&apos;a satabilirsiniz.
            İşlemden önce stok durumuna göre güncel oran paylaşılır.
          </p>

          <Link
            href="/iletisim"
            className="mt-7 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-7 text-sm font-black text-slate-950 transition hover:-translate-y-1 hover:bg-blue-50"
          >
            Güncel oran alın
            <ArrowIcon />
          </Link>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-black tracking-[-0.035em] text-slate-950">
            İşlem öncesinde nelere dikkat edilmelidir?
          </h2>

          <div className="mt-6 space-y-4">
            {[
              "Ürünün Razer Gold TL veya ihtiyacınız olan doğru bölge kodu olduğundan emin olun.",
              "Satıcı puanını ve güncel kullanıcı yorumlarını inceleyin.",
              "Ürünün dijital teslimat koşullarını okuyun.",
              "Kod teslim edilmeden siparişi tamamlanmış kabul etmeyin.",
              "Sky Bozum&apos;a satış yapmadan önce mutlaka güncel oran alın.",
            ].map((item) => (
              <div key={item} className="flex gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <CheckIcon />
                </span>
                <p className="text-base leading-8 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-black tracking-[-0.035em] text-slate-950">
            Sık sorulan sorular
          </h2>

          <div className="mt-8 space-y-4">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-[24px] border border-slate-200 bg-white p-6"
              >
                <summary className="cursor-pointer list-none pr-8 text-lg font-black text-slate-950">
                  {item.question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-slate-200 pt-10">
          <p className="text-sm leading-7 text-slate-500">
            Not: Kart kullanım koşulları, mağaza ödeme seçenekleri ve ürün
            stokları zaman içinde değişebilir. İşlem öncesinde ilgili
            platformdaki güncel bilgileri kontrol edin.
          </p>
        </section>
      </div>
    </article>
  );
}
