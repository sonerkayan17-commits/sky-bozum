import { readFileSync } from 'node:fs';

const checks = [];
const read = (path) => readFileSync(path, 'utf8');
const rules = read('firestore.rules');
const env = read('.env.example');
const conversion = read('app/lib/conversion.ts');
const firebase = read('app/lib/firebase.ts');
const releaseReadiness = read('app/yonetim/ReleaseReadinessPanel.tsx');

checks.push(['Firestore denies unmatched documents', /match \/\{document=\*\*\}[\s\S]*allow read, write: if false;/.test(rules)]);
checks.push(['Admin writes require admin claim', rules.includes('request.auth.token.admin == true') && rules.includes('allow create, update: if isAdmin()')]);
checks.push(['Member writes require verified email', rules.includes('function verifiedMember()') && rules.includes('request.auth.token.email_verified == true')]);
checks.push(['Fresh create timestamp guard exists', rules.includes('function freshCreateTimestamp') && (rules.match(/freshCreateTimestamp/g) ?? []).length >= 5]);
checks.push(['Messages have sender ownership and body limit', rules.includes('request.resource.data.senderId == request.auth.uid') && rules.includes('request.resource.data.body.size() <= 600')]);
checks.push(['Operations cap amount and owner-created requests', rules.includes('request.resource.data["amount"] <= 1000000') && rules.includes('request.resource.data.memberId == request.auth.uid')]);
checks.push(['App Check env placeholder documented', env.includes('NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_KEY=')]);
checks.push(['App Check provider is initialized safely', firebase.includes('ReCaptchaV3Provider') && firebase.includes('isTokenAutoRefreshEnabled: true')]);
checks.push(['App Check configuration is visible in release readiness', releaseReadiness.includes('isFirebaseAppCheckConfigured') && releaseReadiness.includes('Firebase App Check istemci yapılandırması')]);
checks.push(['Telemetry endpoint is optional and consent gated', env.includes('NEXT_PUBLIC_SKY_TELEMETRY_ENDPOINT=') && conversion.includes('skybozum-consent-v1') && conversion.includes('safeDetail')]);

let failed = false;
for (const [label, ok] of checks) {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
  if (!ok) failed = true;
}
if (failed) process.exitCode = 1;
else console.log('Security readiness audit passed.');
