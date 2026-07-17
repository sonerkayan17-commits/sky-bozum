import Link from "next/link";
import { siteConfig } from "../lib/site";

const groups = [
  ["Hizmetler", [["Tüm Hizmetler", "/hizmetler"], ["Oran Hesapla", "/oran-hesapla"], ["Razer Gold", "/hizmetler/razer-gold-tl"], ["Paycell", "/hizmetler/paycell"]]],
  ["Bilgi Merkezi", [["Makaleler", "/bilgi-merkezi"], ["Referanslar", "/referanslar"], ["Sık Sorulan Sorular", "/sss"]]],
  ["Kurumsal", [["Hakkımızda", "/hakkimizda"], ["İletişim", "/iletisim"], ["Gizlilik Politikası", "/gizlilik-politikasi"], ["Kullanım Şartları", "/kullanim-sartlari"]]],
] as const;

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#07110f] px-5 pb-8 pt-16 text-white lg:px-8 lg:pt-20">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[52rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-14 grid gap-8 rounded-[34px] border border-white/10 bg-white/[.04] p-7 shadow-2xl shadow-black/20 backdrop-blur sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-emerald-300">İşleme hazır mısınız?</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-.04em] sm:text-4xl">
              Güncel oranınızı öğrenin, işleminizi güvenle başlatın.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              Ürün türünü ve tutarı paylaşın. Uygunluk kontrolünden sonra net oran bilgisi alın.
            </p>
          </div>
          <a
            href={siteConfig.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-emerald-400 px-7 text-sm font-black text-emerald-950 transition hover:-translate-y-0.5 hover:bg-emerald-300"
          >
            WhatsApp&apos;tan oran al
          </a>
        </div>

        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-emerald-300/20 bg-emerald-400 text-lg font-black text-emerald-950 shadow-lg shadow-emerald-950/30">
                S
              </span>
              <span>
                <b className="block text-xl">Sky Bozum</b>
                <span className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">bozumcu.net</span>
              </span>
            </Link>
            <p className="mt-6 text-sm leading-7 text-slate-400">
              Mobil ödeme, dijital kod ve kart işlemleri için şeffaf bilgi, hesaplama ve destek platformu.
            </p>
            <div className="mt-6 space-y-2 text-sm text-slate-400">
              <a className="block transition hover:text-white" href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>{siteConfig.phone}</a>
              <a className="block transition hover:text-white" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </div>
          </div>

          <div className="grid gap-9 sm:grid-cols-3">
            {groups.map(([title, links]) => (
              <div key={title}>
                <h3 className="text-xs font-black uppercase tracking-[.18em] text-slate-300">{title}</h3>
                <ul className="mt-5 space-y-3.5">
                  {links.map(([label, href]) => (
                    <li key={href}>
                      <Link href={href} className="text-sm text-slate-500 transition hover:translate-x-1 hover:text-emerald-300">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-6 text-slate-600">
            © {new Date().getFullYear()} Sky Bozum. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap gap-2">
            {['SSL korumalı bağlantı', 'Şeffaf işlem bilgisi', '7/24 destek'].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[.03] px-3 py-1.5 text-[11px] font-bold text-slate-500">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
