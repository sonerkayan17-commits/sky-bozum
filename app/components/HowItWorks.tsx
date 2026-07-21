const steps = [
  ['Kod Alındı', 'Kod bize ulaştı.', 'document'],
  ['Kontrol Edildi', 'Güvenle doğrulandı.', 'search'],
  ['Onaylandı', 'İşlem onaylandı.', 'shield'],
  ['Ödeme Gönderildi', 'Hesabınıza iletildi.', 'card'],
] as const;

function Icon({ name, className = 'h-5 w-5' }: { name: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    document: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h4" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 4 4" /></>,
    shield: <><path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>,
    card: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18M7 14h4" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;
}

export default function HowItWorks({ embedded = false }: { embedded?: boolean }) {
  return (
    <section className={embedded ? 'h-full text-white' : 'bg-[#05090f] py-20 text-white'} aria-labelledby="process-experience-title">
      <div className={embedded ? 'h-full' : 'content-wide'}>
        <div className="relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-[22px] border border-white/[0.11] bg-[radial-gradient(circle_at_18%_3%,rgba(245,190,54,.07),transparent_25%),radial-gradient(circle_at_82%_65%,rgba(16,185,129,.05),transparent_32%),linear-gradient(180deg,#09131d,#06101a)] p-5 shadow-[0_24px_64px_rgba(0,0,0,.30),inset_0_1px_0_rgba(255,255,255,.045)]">
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.016)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.016)_1px,transparent_1px)] [background-size:44px_44px]" />

          <header className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#f3bf31]">Bozum İşlem Süreci</p>
              <h2 id="process-experience-title" className="mt-1 text-[27px] font-black leading-[1.02] tracking-[-.045em]">Koddan Ödemeye <span className="text-[#f4bf33]">Güvenli Yolculuk</span></h2>
            </div>
            <div className="hidden shrink-0 items-center gap-2 rounded-[13px] border border-white/[0.10] bg-white/[0.028] px-3 py-2 sm:flex">
              <span className="text-[#f4bf2d]"><Icon name="shield" className="h-5 w-5" /></span>
              <div><p className="text-[10px] font-black">Güvenli İşlem</p><p className="text-[9px] text-white/45">7/24 destek</p></div>
            </div>
          </header>

          <div className="relative mt-4 grid flex-1 gap-4 md:grid-cols-[0.8fr_1.2fr]">
            <div className="relative overflow-hidden rounded-[17px] border border-white/[0.08] bg-black/20 p-3.5">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f3bf31]/35 to-transparent" />
              <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-black text-[8px] font-black text-[#f3bf31]">SKY</div>
                <div><p className="text-[11px] font-bold">Sky Bozum</p><p className="text-[8px] text-emerald-400">Çevrimiçi</p></div>
              </div>
              <div className="mt-3 space-y-2 text-[9px] leading-[1.35]">
                <div className="mr-7 rounded-[10px] rounded-tl-[3px] bg-[#17212b] px-2.5 py-2 text-white/86">5000 TL Razer Gold kodum var.</div>
                <div className="ml-7 rounded-[10px] rounded-tr-[3px] bg-[#ccefae] px-2.5 py-2 text-[#122018]">Kodunuzu iletebilirsiniz.</div>
                <div className="mr-7 rounded-[10px] rounded-tl-[3px] bg-[#17212b] px-2.5 py-2 text-white/86">P9EGH-BKASJ-GTCE</div>
                <div className="ml-7 rounded-[10px] rounded-tr-[3px] bg-[#ccefae] px-2.5 py-2 text-[#122018]">Kod geçerli. Ödeme hazırlanıyor.</div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex h-7 items-center rounded-full bg-[#131d27] px-2.5 text-[7px] text-white/34">Mesaj yazın...<span className="ml-auto grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white">✓</span></div>
            </div>

            <div className="relative flex flex-col justify-center">
              <div className="absolute bottom-6 left-[18px] top-6 w-px bg-gradient-to-b from-[#f2bd2f] via-[#f2bd2f]/75 to-emerald-400" />
              <div className="space-y-1">
                {steps.map(([title, text, icon], index) => {
                  const final = index === steps.length - 1;
                  return <div key={title} className="relative grid grid-cols-[38px_1fr] items-center gap-3 py-2">
                    <div className={`relative z-10 grid h-[38px] w-[38px] place-items-center rounded-full border bg-[#08111a] ${final ? 'border-emerald-400 text-emerald-400' : 'border-[#f2bd2f] text-[#f2bd2f]'}`}><Icon name={icon} className="h-[18px] w-[18px]" /></div>
                    <div><h3 className="text-[12px] font-black">{title}</h3><p className="mt-0.5 text-[9px] text-white/48">{text}</p></div>
                  </div>;
                })}
              </div>
            </div>
          </div>

          <div className="relative mt-3 grid grid-cols-3 divide-x divide-white/[0.07] rounded-[14px] border border-white/[0.09] bg-white/[0.025] px-2 py-2.5">
            {['7/24 Destek', 'Hızlı İşlem', 'Şeffaf Oran'].map((item) => <div key={item} className="flex items-center justify-center gap-1.5 text-[9px] font-bold text-white/68"><span className="text-emerald-400">✓</span>{item}</div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
