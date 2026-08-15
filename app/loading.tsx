export default function Loading() {
  return (
    <main className="site-loading" aria-busy="true" aria-label="Sayfa yükleniyor">
      <div className="site-loading__shell content-shell">
        <div className="site-loading__brand"><span aria-hidden="true" /> SKY BOZUM</div>
        <div className="site-loading__title"><i /><i /></div>
        <div className="site-loading__summary"><i /><i /></div>
        <div className="site-loading__grid" aria-hidden="true">
          {[0, 1, 2].map((item) => <div key={item}><span /><i /><i /></div>)}
        </div>
      </div>
      <span className="sr-only">İçerik yükleniyor</span>
    </main>
  );
}
