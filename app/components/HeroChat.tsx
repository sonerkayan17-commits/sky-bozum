const codes = ['7K9M2P4Q8ZX', '4T6N8R2W5YQ', '9C3V7B5L2PK', '6H8J4D2S9MF'];

function Time({ children, checks = false }: { children: string; checks?: boolean }) {
  return <time dateTime={`2026-07-17T${children}:00+03:00`} className="ml-2 whitespace-nowrap text-[9px] text-slate-400">{children}{checks && <b className="ml-1 text-cyan-300" aria-label="okundu">✓✓</b>}</time>;
}

export default function HeroChat() {
  return (
    <section aria-label="Örnek WhatsApp işlem konuşması" className="w-full max-w-[330px] overflow-hidden rounded-[22px] border border-white/15 bg-[#0b1014]/95 shadow-[0_24px_70px_rgba(0,0,0,.55)] backdrop-blur-xl">
      <header className="flex items-center gap-3 border-b border-white/10 bg-[#111820] px-4 py-3"><span className="grid size-9 place-items-center rounded-full bg-emerald-500 text-lg" aria-hidden="true">◔</span><div><h2 className="text-sm font-black text-white">Sky Bozum Destek</h2><p className="text-[10px] text-emerald-400">çevrimiçi</p></div><span className="ml-auto rounded-full border border-white/10 px-2 py-1 text-[8px] font-bold text-slate-400">ÖRNEK</span></header>
      <div className="space-y-2 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,.055),transparent_35%)] p-3 text-[11px] leading-4">
        <div className="max-w-[88%] rounded-xl rounded-tl-sm bg-[#20262c] px-3 py-2 text-slate-100"><span className="sr-only">Müşteri: </span>Merhaba, 20.000 TL Razer Gold bozdurabilir miyim?<Time>22:41</Time></div>
        <div className="ml-auto max-w-[88%] rounded-xl rounded-tr-sm bg-emerald-900 px-3 py-2 text-emerald-50"><span className="sr-only">Sky Bozum: </span>Merhaba, uygundur. 4 adet kodu iletebilirsiniz.<Time checks>22:41</Time></div>
        <div className="max-w-[72%] rounded-xl rounded-tl-sm bg-[#20262c] px-3 py-2 font-mono text-[10px] leading-[1.35] text-slate-100"><span className="sr-only">Müşteri dört örnek kod gönderdi: </span>{codes.map((code) => <span key={code} className="block whitespace-nowrap">{code}</span>)}<Time>22:42</Time></div>
        <div className="ml-auto max-w-[88%] rounded-xl rounded-tr-sm bg-emerald-900 px-3 py-2 text-emerald-50"><span className="sr-only">Sky Bozum: </span>Kontrol tamamlandı. IBAN ve ad soyad iletir misiniz?<Time checks>22:43</Time></div>
        <div className="max-w-[74%] rounded-xl rounded-tl-sm bg-[#20262c] px-3 py-2 text-slate-100"><span className="sr-only">Müşteri maskelenmiş ödeme bilgisini gönderdi: </span>TR•• •••• •••• •••• •••• ••<br/>A••• K•••<Time>22:43</Time></div>
        <div className="max-w-[82%] rounded-xl rounded-tl-sm bg-[#20262c] px-3 py-2 text-slate-100"><span className="sr-only">Müşteri: </span>Ödeme geldi, teşekkür ederim.<Time>22:44</Time></div>
      </div>
    </section>
  );
}
