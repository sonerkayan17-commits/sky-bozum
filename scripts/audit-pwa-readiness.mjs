import { existsSync, readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const checks = [];
const manifest = read('app/manifest.ts');
const runtime = read('app/components/PwaRuntime.tsx');
const worker = read('public/sw.js');
const firebase = read('app/lib/firebase.ts');

checks.push(['Manifest uygulama modunu tanımlıyor', manifest.includes("display: 'standalone'") && manifest.includes("start_url: '/'")]);
checks.push(['PWA runtime service worker kaydediyor', runtime.includes("register('/sw.js'")]);
checks.push(['Çevrimdışı ekran mevcut', existsSync('app/offline/page.tsx') && worker.includes("'/offline'")]);
checks.push(['İşlem sayfaları önbelleğe alınmıyor', worker.includes("request.mode !== 'navigate'") && worker.includes('fetch(request).catch')]);
checks.push(['App Check anahtarı varsa istemcide başlatılıyor', firebase.includes('initializeFirebaseAppCheck') && firebase.includes('ReCaptchaV3Provider')]);

let failed = false;
for (const [label, ok] of checks) {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
  if (!ok) failed = true;
}
if (failed) process.exitCode = 1;
else console.log('PWA readiness audit passed.');
