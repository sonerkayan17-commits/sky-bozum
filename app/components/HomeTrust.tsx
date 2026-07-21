import Link from 'next/link';

const items = [
  { title: '7/24 destek', text: 'İşlem öncesi sorularınız ve devam eden talepleriniz için iletişim kanallarına ulaşın.', icon: 'chat' },
  { title: 'Hızlı ödeme', text: 'Kontrol ve onay tamamlandıktan sonra ödeme aşamasına gecikmeden geçilir.', icon: 'bolt' },
  { title: 'Güvenli işlem', text: 'Şifre, kart şifresi veya doğrulama kodu talep edilmeden kontrollü süreç yürütülür.', icon: 'shield' },
  { title: 'Şeffaf süreç', text: 'Oran, tahmini ödeme ve işlem yöntemi başlamadan önce yazılı olarak paylaşılır.', icon: 'document' },
  { title: 'Önceden net bilgi', text: 'Kullanıcı onayı alınmadan kod, bakiye veya işlem adımı talep edilmez.', icon: 'check' },
] as const;

function Icon({ type }: { type: string }) {
  const paths: Record<string, string> = {
    chat: 'M4 5h16v11H9l-5 4V5Z',
    bolt: 'm13 2-8 12h6l-1 8 9-13h-6V2Z',
    shield: 'M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Zm-3 9 2 2 4-4',
    document: 'M7 3h7l4 4v14H7V3Zm7 0v5h5M10 13h6M10 17h6',
    check: 'M4 12.5 9 17l11-11',
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d={paths[type]} strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function HomeTrust() {
  return (
    <section className="home-trust" aria-labelledby="home-trust-title">
      <div className="content-wide">
        <div className="home-trust__head">
          <div>
            <p className="eyebrow">Güvenli bozum deneyimi</p>
            <h2 id="home-trust-title">İşleme başlamadan önce her adım net.</h2>
            <p>Sky Bozum’da süreç hız kadar açıklık ve güven üzerine kurulur. Ne paylaşacağınızı, hangi oranla ilerleyeceğinizi ve ödemenin nasıl yapılacağını önceden bilirsiniz.</p>
          </div>
          <Link href="/iletisim" className="home-trust__link focus-ring">İletişim merkezini açın <span>→</span></Link>
        </div>
        <div className="home-trust__grid">
          {items.map((item) => (
            <article key={item.title} className="home-trust__card">
              <span className="home-trust__icon"><Icon type={item.icon} /></span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className="home-trust__notice"><strong>Güvenlik hatırlatması:</strong> Sky Bozum sizden hesap şifresi, kart şifresi veya SMS doğrulama kodu istemez.</div>
      </div>
    </section>
  );
}
