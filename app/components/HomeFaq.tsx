import Link from "next/link";

const faqs = [
  {
    question: "İşleme başlamadan önce ne yapmalıyım?",
    answer:
      "Ürün türünü ve tutarı WhatsApp üzerinden iletip güncel oran ve uygunluk onayı alın. Onay almadan kod satın almayın veya mevcut kodunuzu paylaşmayın.",
  },
  {
    question: "Oranlar neden değişiyor?",
    answer:
      "Oranlar ürün türü, stok durumu ve piyasa koşullarına göre güncellenebilir. Bu nedenle sayfadaki oranlar bilgilendirme amaçlıdır; kesin oran işlem öncesinde paylaşılır.",
  },
  {
    question: "İşlem ne kadar sürüyor?",
    answer:
      "Süre, kodun veya bakiyenin doğrulanmasına ve işlem yoğunluğuna göre değişir. Uygun işlemler kontrol tamamlandıktan sonra mümkün olan en kısa sürede sonuçlandırılır.",
  },
  {
    question: "Kodumu herkese açık şekilde paylaşmalı mıyım?",
    answer:
      "Hayır. Dijital kodlar nakit değer taşıyabilir. Kodunuzu yalnızca oran ve işlem onayı aldıktan sonra, destek ekibinin belirttiği güvenli kanal üzerinden iletin.",
  },
  {
    question: "Hangi hizmetler destekleniyor?",
    answer:
      "Razer Gold, Apple Gift Card, Steam, Paycell, Pokus ve operatör mobil ödeme işlemleri başta olmak üzere güncel hizmetler desteklenir. Kesin uygunluk için işlem öncesinde bilgi alın.",
  },
];

export default function HomeFaq() {
  return (
    <section className="relative overflow-hidden bg-[#f5f8f7] px-5 py-20 lg:px-8 lg:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <span className="inline-flex rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-emerald-700 shadow-sm">
            Merak edilenler
          </span>
          <h2 className="mt-6 max-w-xl text-4xl font-black tracking-[-.045em] text-slate-950 sm:text-5xl">
            İşlemden önce bilmeniz gereken her şey.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-8 text-slate-600">
            Süreci net, güvenli ve sürprizsiz ilerletmek için en çok sorulan soruları tek yerde topladık.
          </p>

          <div className="mt-8 rounded-[28px] border border-emerald-200/80 bg-emerald-950 p-6 text-white shadow-[0_24px_70px_-35px_rgba(6,78,59,.65)]">
            <p className="text-sm font-black uppercase tracking-[.16em] text-emerald-300">Hâlâ sorunuz mu var?</p>
            <p className="mt-3 text-sm leading-7 text-emerald-50/80">
              Ürün türünü ve tutarı yazın, size güncel uygunluk ve oran bilgisini iletelim.
            </p>
            <Link
              href="/iletisim"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-emerald-950 transition hover:-translate-y-0.5 hover:bg-emerald-50"
            >
              Destek ekibine ulaş
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((item, index) => (
            <details
              key={item.question}
              className="group rounded-[26px] border border-slate-200 bg-white px-6 py-2 shadow-[0_16px_50px_-38px_rgba(15,23,42,.55)] transition open:border-emerald-200 open:shadow-[0_20px_60px_-38px_rgba(5,150,105,.45)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5">
                <span className="flex items-center gap-4 text-left text-base font-black text-slate-950 sm:text-lg">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-black text-slate-500 transition group-open:bg-emerald-100 group-open:text-emerald-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.question}
                </span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200 text-xl text-slate-500 transition duration-300 group-open:rotate-45 group-open:border-emerald-200 group-open:bg-emerald-50 group-open:text-emerald-700">
                  +
                </span>
              </summary>
              <div className="border-t border-slate-100 pb-6 pl-0 pt-5 sm:pl-13">
                <p className="max-w-2xl text-sm leading-7 text-slate-600">{item.answer}</p>
              </div>
            </details>
          ))}

          <div className="pt-3 text-right">
            <Link href="/sss" className="text-sm font-black text-emerald-700 transition hover:text-emerald-900">
              Tüm soruları görüntüle →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
