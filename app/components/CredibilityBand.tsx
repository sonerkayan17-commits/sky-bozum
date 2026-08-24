"use client";

import Link from './DeferredLink';
import { useSiteSettings } from './SiteSettingsProvider';

const proofPoints = [
  ['10+ yıl', 'yılı aşkın tecrübe'],
  ['10.000+', 'tamamlanan işlem'],
  ['67', 'özgün rehber makalesi'],
  ['100+', 'yanıtlanmış SSS'],
] as const;

export default function CredibilityBand({ compact = false }: { compact?: boolean }) {
  const settings = useSiteSettings();
  const experienceValue = /^10\s*yıl$/i.test(settings.proofExperience.trim()) ? '10+ yıl' : settings.proofExperience;
  const managedProofPoints = [[experienceValue, 'yılı aşkın tecrübe'], [settings.proofTransactions, 'tamamlanan işlem'], proofPoints[2], proofPoints[3]] as const;
  return <section className={`credibility-band ${compact ? 'is-compact' : ''}`} aria-label="Sky Bozum deneyim ve içerik göstergeleri">
    <div className="credibility-band__inner">
      <div className="credibility-band__intro">
        <p>HİZMET MODELİ + GÜVEN STANDARDI</p>
        <h2>Bağımsız rehber, <span>açık süreç.</span></h2>
        <div className="credibility-band__summary">
          Sky Bozum operatör veya dijital cüzdan bakiyesini doğrudan satın almaz. Turkcell, Vodafone, Türk Telekom, Paycell, Pokus ve Vodafone Pay sayfaları; dijital ürün/EPIN satın alma adımlarını açıklayan bağımsız rehberlerdir. Bu markalarla ortaklık ya da yetkili satıcılık ilişkimiz yoktur.
        </div>
        <div className="credibility-band__intro-links">
          <span>Uygun ve kullanılmamış kodu kendi hesabınızda kullanabilir veya değerlendirme için sunabilirsiniz.</span>
          <Link href="/iletisim#hizmet-modeli">Açıklamanın tamamı →</Link>
        </div>
      </div>
      <div className="credibility-band__stats">{managedProofPoints.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
      <aside className="credibility-band__security" aria-label="Önemli güvenlik uyarısı">
        <span aria-hidden="true">!</span>
        <p><strong>Önemli güvenlik uyarısı:</strong> Sky Bozum adını veya logomuzu taklit ederek kullanıcıları yanıltmaya çalışan sahte site ve hesaplara dikkat edin. Tek resmî web adresimiz <b>bozumcu.net</b>&apos;tir; farklı platformlardan gelen yönlendirmeleri doğrulamadan işlem yapmayın.</p>
        <Link href="/iletisim#guvenlik">Resmî bilgileri doğrula →</Link>
      </aside>
    </div>
  </section>;
}
