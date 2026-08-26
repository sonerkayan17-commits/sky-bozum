"use client";

import Link from './DeferredLink';
import { useSiteSettings } from './SiteSettingsProvider';
import { siteConfig } from '../lib/site-config';

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
          Sky Bozum operatör mobil ödeme limitini veya dijital cüzdan bakiyesini doğrudan nakde çevirmez. Bu sayfalar, ilgili ödeme yöntemiyle Razer Gold ve benzeri dijital kodların güvenli biçimde nasıl satın alınacağını açıklar. Satın aldığınız kullanılmamış kodu hesabınızda kullanabilir veya stok ve uygunluk onayından sonra Sky Bozum&apos;a satabilirsiniz. Adı geçen markalarla ortaklık ya da yetkili satıcılık ilişkimiz yoktur.
        </div>
        <div className="credibility-band__intro-links">
          <span>Uygun ve kullanılmamış kodu hesabınızda kullanabilir veya yazılı stok onayından sonra Sky Bozum&apos;a satabilirsiniz.</span>
          <Link href="/iletisim#hizmet-modeli">Açıklamanın tamamı →</Link>
        </div>
      </div>
      <div className="credibility-band__stats">{managedProofPoints.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
      <aside className="credibility-band__security" aria-label="Önemli güvenlik uyarısı">
        <span aria-hidden="true">!</span>
        <p><strong>Önemli güvenlik uyarısı:</strong> Sky Bozum adını veya logomuzu taklit ederek kullanıcıları yanıltmaya çalışan sahte site ve hesaplara dikkat edin. Tek resmî web adresimiz <b>{siteConfig.domain}</b>&apos;tir; farklı platformlardan gelen yönlendirmeleri doğrulamadan işlem yapmayın.</p>
        <Link href="/iletisim#guvenlik">Resmî bilgileri doğrula →</Link>
      </aside>
    </div>
  </section>;
}
