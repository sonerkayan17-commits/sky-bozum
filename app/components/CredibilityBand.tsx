import Link from 'next/link';

const proofPoints = [
  ['10 yıl', 'kurucu deneyimi'],
  ['10.000+', 'tamamlanan işlem'],
  ['67', 'özgün rehber makalesi'],
  ['100+', 'yanıtlanmış SSS'],
] as const;

export default function CredibilityBand({ compact = false }: { compact?: boolean }) {
  return <section className={`credibility-band ${compact ? 'is-compact' : ''}`} aria-label="Sky Bozum deneyim ve içerik göstergeleri">
    <div className="credibility-band__inner">
      <div className="credibility-band__intro"><p>GÜVENİ KANITLAYAN VERİLER</p><h2>Deneyim, işlem ve bilgi<br /><span>aynı yerde.</span></h2><Link href="/guven-merkezi">Güven standardını incele →</Link></div>
      <div className="credibility-band__stats">{proofPoints.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
    </div>
  </section>;
}
