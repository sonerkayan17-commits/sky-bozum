import Link from "next/link";

export const metadata = {
  title: "Sayfa Bulunamadı",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="experience-state">
      <section className="experience-state__card"><span className="experience-state__mark" aria-hidden="true">404</span><div className="experience-state__eyebrow">SAYFA BULUNAMADI</div><h1>Aradığınız sayfaya ulaşamadık.</h1><p>Bağlantı değişmiş veya sayfa kaldırılmış olabilir. Hizmetlere, araçlara ya da Bilgi Merkezi’ne dönerek güvenle devam edebilirsiniz.</p><div className="experience-state__actions"><Link href="/hizmetler">Hizmetleri incele</Link><Link href="/bilgi-merkezi">Bilgi Merkezi</Link><Link href="/">Ana sayfa</Link></div></section>
    </main>
  );
}
