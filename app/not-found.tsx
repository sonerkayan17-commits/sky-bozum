import Link from "next/link";

export const metadata = {
  title: "Sayfa Bulunamadı",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">404</p>
      <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Aradığınız sayfa bulunamadı</h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-white/65">Bağlantı değişmiş veya sayfa kaldırılmış olabilir. Hizmetlere, araçlara ya da Bilgi Merkezi’ne dönerek devam edebilirsiniz.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/hizmetler" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white/90">Hizmetlere git</Link>
        <Link href="/bilgi-merkezi" className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5">Bilgi Merkezi</Link>
      </div>
    </main>
  );
}
