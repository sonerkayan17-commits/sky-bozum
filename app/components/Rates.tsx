const rates = [
  {
    name: "Razer Gold",
    description: "TL ve USD kodları",
    rate: "%60",
    icon: "⚡",
  },
  {
    name: "iTunes / App Store",
    description: "Apple Gift Card",
    rate: "%45",
    icon: "🍎",
  },
  {
    name: "SMS Bozumu",
    description: "Turkcell, Vodafone ve Türk Telekom",
    rate: "%40 - %50",
    icon: "💬",
  },
  {
    name: "Paycell",
    description: "Hızlı ve güvenli işlem",
    rate: "%60",
    icon: "P",
  },
  {
    name: "Pokus",
    description: "Güncel bozum oranı",
    rate: "%60",
    icon: "P",
  },
  {
    name: "Tüm Sanal Kartlar",
    description: "Kredi kartı ve sanal kart",
    rate: "%60 - %70",
    icon: "💳",
  },
];

const whatsappUrl =
  "https://wa.me/905392080166?text=Merhaba%2C%20güncel%20bozum%20oranı%20hakkında%20bilgi%20almak%20istiyorum.";

export default function Rates() {
  return (
    <section
      id="oranlar"
      className="relative overflow-hidden bg-slate-950 px-5 py-24 text-white lg:px-8"
    >
      <div className="pointer-events-none absolute left-1/4 top-0 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-300">
            Güncel Bozum Oranları
          </span>

          <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
            Size uygun oranı seçin
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Oranlar işlem türüne ve tutara göre değişebilir. Kesin oran bilgisi
            için WhatsApp üzerinden bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rates.map((item) => (
            <article
              key={item.name}
              className="group rounded-[28px] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-blue-400/40 hover:bg-white/[0.1]"
            >
              <div className="flex items-start justify-between gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-black shadow-lg shadow-blue-900/40">
                  {item.icon}
                </div>

                <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs font-bold text-green-300">
                  Aktif
                </span>
              </div>

              <h3 className="mt-6 text-xl font-black">{item.name}</h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">
                {item.description}
              </p>

              <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Güncel Oran
                  </p>

                  <p className="mt-1 text-3xl font-black text-green-300">
                    {item.rate}
                  </p>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition group-hover:bg-blue-500 group-hover:text-white"
                >
                  Bilgi Al
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[28px] border border-blue-400/20 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 p-6 text-center backdrop-blur-xl md:p-8">
          <h3 className="text-2xl font-black">
            Yüksek tutarlı işlemlerde özel oran
          </h3>

          <p className="mt-3 text-slate-300">
            İşlem tutarınızı paylaşın, size özel güncel oranı iletelim.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-2xl bg-green-500 px-7 py-4 font-black text-white shadow-xl shadow-green-950/30 transition hover:-translate-y-1 hover:bg-green-600"
          >
            WhatsApp’tan Oran Al
          </a>
        </div>
      </div>
    </section>
  );
}