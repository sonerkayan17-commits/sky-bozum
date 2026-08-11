import { buildWhatsAppUrl } from '../lib/conversion';

export default function TrustQuickDock() {
  const whatsappUrl = buildWhatsAppUrl(
    'Merhaba, Güven Merkezi üzerinden resmî kanaldan işleme başlamak ve güncel uygunluğu öğrenmek istiyorum.',
  );

  return (
    <aside
      aria-label="Güven Merkezi hızlı işlemler"
      className="fixed inset-x-3 z-40 md:hidden"
      style={{ bottom: 'calc(12px + env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto grid max-w-lg grid-cols-[1.12fr_.88fr] gap-1.5 rounded-xl border border-[#9faab7]/20 bg-[#0a0d11]/97 p-1.5 shadow-[0_18px_44px_rgba(0,0,0,.48),inset_0_1px_0_rgba(255,255,255,.035)] backdrop-blur-xl">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[#b83a50]/55 bg-[linear-gradient(135deg,#4b111c_0%,#92243a_52%,#3a0e17_100%)] px-3 text-center text-[13px] font-black sm:px-4 sm:text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,.13),0_8px_24px_rgba(75,10,21,.22)] transition duration-200 motion-reduce:transition-none hover:border-[#d06a7c]/72 hover:shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_10px_26px_rgba(75,10,21,.20)] active:scale-[.99]"
        >
          WhatsApp’tan başla
        </a>
        <a
          href="#sorun-cozucu"
          className="focus-ring flex min-h-11 items-center justify-center rounded-lg border border-[#9faab7]/28 bg-[linear-gradient(135deg,rgba(174,184,196,.09),rgba(174,184,196,.035))] px-3 text-center text-[13px] font-black text-[#c5cdd6] sm:px-4 sm:text-sm shadow-[inset_0_1px_0_rgba(255,255,255,.035)] transition duration-200 motion-reduce:transition-none hover:border-[#b8c1cb]/40 hover:text-white active:scale-[.99]"
        >
          Şüpheli durum
        </a>
      </div>
    </aside>
  );
}
