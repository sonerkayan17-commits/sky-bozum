'use client';

import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

const paths = [
  { id: 'first', label: 'İlk kez işlem yapıyorum', title: 'Önce kanalı, sonra teklifi doğrulayın.', steps: ['Görüşmeyi yalnız bozumcu.net üzerindeki WhatsApp bağlantısından başlatın.','Oran, kesinti ve hesabınıza geçecek net tutarı yazılı görün.','Ödeme hesabının işlem yapılan hattın veya hesabın sahibine ait olduğunu kontrol edin.'] },
  { id: 'rate', label: 'Çok yüksek oran gördüm', title: 'Yüzdeye değil, teklifin tamamına bakın.', steps: ['Piyasanın belirgin biçimde üzerindeki oranı tek başına avantaj kabul etmeyin.','Sonradan kesinti, farklı numara veya acele baskısı olup olmadığını kontrol edin.','Net ödeme yazılı değilse kod veya bakiye paylaşmayın.'] },
  { id: 'redirect', label: 'Başka numaraya yönlendirildim', title: 'İşlemi durdurun ve baştan doğrulayın.', steps: ['Yeni numaraya kod, bakiye, SMS kodu veya hesap bilgisi göndermeyin.','Mevcut konuşmayı kapatıp bozumcu.net üzerindeki resmî bağlantıdan yeniden başlayın.','Yönlendirme mesajını ve numarayı kayıt altına alın.'] },
  { id: 'unsure', label: 'Şüpheliyim', title: 'İşleme başlamadan önce üç noktayı yeniden kontrol edin.', steps: ['Alan adının bozumcu.net olduğunu ve görüşmenin sitedeki resmî bağlantıdan başladığını kontrol edin.','Net ödeme tutarını yazılı görün; yalnız yüksek yüzdeye göre karar vermeyin.','Şifre, SMS kodu, ekran paylaşımı veya acele baskısı varsa işlemi başlatmayın.'] },
] as const;

export default function TrustDecisionFlow() {
  const [activeId, setActiveId] = useState<(typeof paths)[number]['id']>('first');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = paths.findIndex((item) => item.id === activeId);
  const active = paths[activeIndex >= 0 ? activeIndex : 0];

  function selectAndFocus(index: number) {
    const normalized = (index + paths.length) % paths.length;
    setActiveId(paths[normalized].id);
    tabRefs.current[normalized]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      selectAndFocus(index + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      selectAndFocus(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      selectAndFocus(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      selectAndFocus(paths.length - 1);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4" role="tablist" aria-label="İşlem durumunuzu seçin">
        {paths.map((item, index) => {
          const selected = item.id === active.id;
          return (
            <button
              key={item.id}
              ref={(node) => { tabRefs.current[index] = node; }}
              id={`trust-decision-tab-${index}`}
              type="button"
              role="tab"
              tabIndex={selected ? 0 : -1}
              aria-selected={selected}
              aria-controls="trust-decision-panel"
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`focus-ring group relative min-h-[68px] overflow-hidden rounded-[6px] border px-4 py-2.5 text-left transition duration-200 motion-reduce:transition-none ${selected ? 'border-[#b83a50]/54 bg-[linear-gradient(145deg,rgba(63,15,24,.16),rgba(14,18,24,.94))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.04),inset_0_-1px_0_rgba(0,0,0,.45)]' : 'border-[#aeb8c4]/13 bg-[linear-gradient(145deg,rgba(18,23,30,.70),rgba(9,12,17,.88))] text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,.02)] hover:border-[#aeb8c4]/24 hover:bg-[linear-gradient(145deg,rgba(23,29,37,.74),rgba(11,14,19,.92))] hover:text-slate-200'}`}
            >
              <span className={`text-[10px] font-black tracking-[.18em] ${selected ? 'text-[#d06a7c]' : 'text-slate-600'}`}>0{index + 1}</span>
              <span className="mt-2 block text-sm font-black leading-5">{item.label}</span>
              <span aria-hidden="true" className={`absolute inset-x-4 bottom-0 h-px transition-opacity ${selected ? 'bg-[linear-gradient(90deg,transparent,#b83a50,transparent)] opacity-100' : 'bg-[linear-gradient(90deg,transparent,#9faab7,transparent)] opacity-0 group-hover:opacity-30'}`} />
            </button>
          );
        })}
      </div>
      <div id="trust-decision-panel" role="tabpanel" aria-live="polite" aria-labelledby={`trust-decision-tab-${activeIndex >= 0 ? activeIndex : 0}`} className="mt-3 grid gap-3 border-y border-[#aeb8c4]/12 bg-[linear-gradient(90deg,rgba(174,184,196,.022),rgba(184,58,80,.012)_58%,transparent)] px-1 py-4 sm:grid-cols-[.72fr_1.28fr] sm:items-start sm:px-2 sm:py-[18px]">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#b83a50]">Önerilen sonraki adım</p>
          <h3 className="mt-2 text-lg font-black tracking-tight sm:text-xl">{active.title}</h3>
        </div>
        <ol className="divide-y divide-white/8 border-y border-[#9faab7]/10">
          {active.steps.map((step, index) => <li key={step} className="grid grid-cols-[34px_1fr] gap-3 py-2.5 text-sm leading-6 text-slate-300"><span className="text-[10px] font-black tracking-[.16em] text-[#c75b6d]">0{index + 1}</span><span className="min-w-0 break-words">{step}</span></li>)}
        </ol>
      </div>
    </div>
  );
}
