'use client';

import { useState } from 'react';
import { useVisitorExperience } from './VisitorExperienceProvider';

export default function PrivacyControls({ showReset = false }: { showReset?: boolean }) {
  const { consent, openPreferences, resetProfile } = useVisitorExperience();
  const [notice, setNotice] = useState('');
  const handleReset = () => {
    resetProfile();
    setNotice('Anonim profil sıfırlandı.');
  };
  return (
    <div><div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={() => { setNotice(''); openPreferences(); }} className="min-h-8 py-1 text-xs font-bold text-slate-400 transition hover:text-rose-300">Çerez tercihleri</button>
      {showReset && consent === 'accepted' && <button type="button" onClick={handleReset} className="min-h-8 py-1 text-xs font-bold text-slate-400 transition hover:text-rose-300">Anonim profili sıfırla</button>}
    </div>{showReset && <p className="mt-2 min-h-4 text-xs text-emerald-300" aria-live="polite">{notice}</p>}</div>
  );
}
