import Link from 'next/link';

export const metadata = {
  title: 'Bağlantı bekleniyor',
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-5 py-16">
      <section className="w-full rounded-[28px] border border-white/10 bg-[#10131b] p-7 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Bağlantı bekleniyor</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">İnternet bağlantınız şu an kullanılamıyor.</h1>
        <p className="mt-4 max-w-xl leading-7 text-slate-300">
          Kod, stok, bakiye ve işlem bilgileri çevrimdışında gösterilmez. Bağlantınız geldiğinde güncel veriler yeniden güvenle yüklenecek.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/offline" className="rounded-xl bg-white px-5 py-3 font-bold text-slate-950">Yeniden dene</Link>
          <Link href="/" className="rounded-xl border border-white/15 px-5 py-3 font-bold text-white">Ana sayfaya dön</Link>
        </div>
      </section>
    </main>
  );
}
