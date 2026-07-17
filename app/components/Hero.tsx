import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '../lib/site';

const brands = [
  { name: 'Vodafone', logo: '/brands/vodafone/vodafone.svg' },
  { name: 'Turkcell', logo: '/brands/turkcell/turkcell.svg' },
  { name: 'Türk Telekom', logo: '/brands/turktelekom/turktelekom.svg' },
  { name: 'Paycell', logo: '/brands/paycell/paycell.svg' },
  { name: 'Pokus', logo: '/brands/pokus/pokus.svg' },
  { name: 'Razer Gold', logo: '/brands/razer/razer.svg' },
] as const;

const rateCards = [
  { name: 'Vodafone Mobil Ödeme', logo: '/brands/vodafone/vodafone.svg', rate: '%45–60', status: 'Aktif' },
  { name: 'Paycell', logo: '/brands/paycell/paycell.svg', rate: '%60', status: 'Aktif' },
  { name: 'Razer Gold', logo: '/brands/razer/razer.svg', rate: '%60–70', status: 'Aktif' },
] as const;

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#03110e] text-white">
      <div className="hero-green-grid absolute inset-0 opacity-55" />
      <div className="absolute left-[-15rem] top-[-10rem] h-[38rem] w-[38rem] rounded-full bg-emerald-500/15 blur-[110px]" />
      <div className="absolute right-[-18rem] top-[-6rem] h-[42rem] w-[42rem] rounded-full bg-lime-400/10 blur-[120px]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#061a15] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-14 sm:px-6 lg:px-8 lg:pb-16 lg:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-300/20 bg-white/[.06] px-4 py-2 text-[11px] font-black uppercase tracking-[.18em] text-emerald-200 backdrop-blur-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              Sky Bozum şu anda aktif
            </div>

            <h1 className="mt-7 max-w-4xl text-[2.85rem] font-black leading-[.98] tracking-[-.06em] sm:text-6xl lg:text-[4.8rem]">
              Dijital bakiyenizi
              <span className="mt-1 block bg-gradient-to-r from-emerald-300 via-green-400 to-lime-300 bg-clip-text text-transparent">
                hızlı ve güvenli değerlendirin.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Mobil ödeme, Paycell, Pokus ve dijital kod işlemlerinde güncel oran bilgisi, açık işlem süreci ve kesintisiz destek tek noktada.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-7 py-4 font-black text-[#032018] shadow-[0_18px_45px_rgba(52,211,153,.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-300 motion-reduce:transform-none"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.52 0 .18 5.34.18 11.9c0 2.1.55 4.15 1.6 5.96L.08 24l6.28-1.65a11.9 11.9 0 0 0 5.71 1.45h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.23-6.17-3.46-8.42Zm-8.44 18.31h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.73.98 1-3.64-.24-.37a9.83 9.83 0 0 1-1.51-5.27c0-5.45 4.44-9.89 9.9-9.89a9.82 9.82 0 0 1 7 2.9 9.82 9.82 0 0 1 2.89 7c0 5.45-4.44 9.88-9.89 9.88Zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47a8.9 8.9 0 0 1-1.65-2.05c-.17-.3-.02-.46.13-.6.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
                </svg>
                Güncel Oran Al
                <span className="transition group-hover:translate-x-1 motion-reduce:transform-none">→</span>
              </Link>
              <Link
                href="/oran-hesapla"
                className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/15 bg-white/[.06] px-7 py-4 font-black text-white backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[.1] motion-reduce:transform-none"
              >
                Oran Hesapla
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-bold text-slate-300">
              <span className="flex items-center gap-2"><span className="text-emerald-400">✓</span> 10+ yıllık tecrübe</span>
              <span className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Şeffaf oran bilgisi</span>
              <span className="flex items-center gap-2"><span className="text-emerald-400">✓</span> 7/24 destek</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[570px] lg:mx-0 lg:ml-auto">
            <div className="absolute inset-12 rounded-full bg-emerald-400/20 blur-[90px]" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-[#071b16]/90 p-3 shadow-[0_35px_100px_rgba(0,0,0,.5)] backdrop-blur-2xl sm:p-4">
              <div className="rounded-[1.55rem] border border-white/10 bg-[#061511] p-5 sm:p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[.2em] text-emerald-400">Canlı oran merkezi</p>
                    <p className="mt-2 text-xl font-black tracking-tight text-white">İşlem öncesi net bilgi</p>
                  </div>
                  <div className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-300">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 19V9m5 10V5m5 14v-7m5 7V3" />
                    </svg>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {rateCards.map((item) => (
                    <div key={item.name} className="group flex items-center justify-between rounded-2xl border border-white/8 bg-white/[.045] p-3.5 transition hover:border-emerald-300/20 hover:bg-white/[.07]">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white p-2.5 shadow-lg shadow-black/10">
                          <Image src={item.logo} alt={`${item.name} logosu`} width={42} height={28} className="max-h-7 w-auto object-contain" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-white">{item.name}</p>
                          <p className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {item.status}
                          </p>
                        </div>
                      </div>
                      <div className="ml-3 text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Oran</p>
                        <p className="mt-1 text-base font-black text-emerald-300">{item.rate}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[.04] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Destek</p>
                    <p className="mt-2 text-lg font-black text-white">7/24 Aktif</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[.04] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Süreç</p>
                    <p className="mt-2 text-lg font-black text-white">Hızlı & Şeffaf</p>
                  </div>
                </div>

                <p className="mt-4 text-center text-[10px] leading-5 text-slate-500">
                  Oranlar stok ve hizmet durumuna göre değişebilir. İşlem öncesinde güncel oran alınız.
                </p>
              </div>
            </div>

            <div className="absolute -right-3 -top-4 hidden rounded-2xl border border-white/15 bg-white px-4 py-3 text-[#082019] shadow-2xl sm:block">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Güven</p>
              <p className="mt-1 text-sm font-black">10+ Yıl</p>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-7 lg:mt-18">
          <p className="mb-5 text-center text-[10px] font-black uppercase tracking-[.24em] text-slate-500">
            Desteklenen işlem türleri
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {brands.map((brand) => (
              <div key={brand.name} className="flex h-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[.045] px-3 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[.075]">
                <Image src={brand.logo} alt={`${brand.name} logosu`} width={90} height={34} className="max-h-7 w-auto max-w-full object-contain brightness-110" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
