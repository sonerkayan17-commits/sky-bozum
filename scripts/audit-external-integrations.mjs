import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const env = read('.env.example');
const firebase = read('app/lib/firebase.ts');
const siteConfig = read('app/lib/site-config.ts');
const conversion = read('app/lib/conversion.ts');
const account = read('app/components/AccountAccess.tsx');
const rules = read('firestore.rules');

const firebaseEnvKeys = [
  'NEXT_PUBLIC_FIREBASE_API_KEY=',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID=',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=',
  'NEXT_PUBLIC_FIREBASE_APP_ID=',
  'NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_KEY=',
];

const checks = [
  ['Firebase public env placeholders exist without invented values', firebaseEnvKeys.every((key) => env.includes(key)) && !/NEXT_PUBLIC_FIREBASE_API_KEY=AIza/i.test(env)],
  ['Firebase client is env-only and safely disabled when incomplete', firebase.includes('process.env.NEXT_PUBLIC_FIREBASE_API_KEY') && firebase.includes('isFirebaseConfigured') && firebase.includes('return { auth: null, db: null }')],
  ['Firebase initialization failures do not crash public pages', firebase.includes('try') && firebase.includes('catch') && firebase.includes('getFirebaseClient')],
  ['Firestore admin-only settings constrain WhatsApp to wa.me', rules.includes('data.whatsapp.matches("^https://wa[.]me/[0-9]{8,15}([?].*)?$")')],
  ['Default WhatsApp URLs use HTTPS wa.me', /https:\/\/wa\.me\/90\d{10}/.test(siteConfig) && /https:\/\/wa\.me\/90\d{10}/.test(conversion)],
  ['Auth surfaces important Firebase errors', ['email-already-in-use', 'weak-password', 'invalid-credential', 'too-many-requests', 'network-request-failed'].every((code) => account.includes(code))],
  ['Auth does not store raw passwords', !/setDoc\([\s\S]{0,500}password/i.test(account)],
  ['Telemetry is consent gated and HTTPS only', conversion.includes("skybozum-consent-v1') === 'accepted'") && conversion.includes('/^https:\\/\\//i.test(endpoint)')],
  ['Telemetry filters common PII fields', /(email\|phone\|name\|iban\|password\|contact\|customer\|message\|body)/i.test(conversion)],
  ['Conversion coverage includes WhatsApp and account attempts', ['whatsapp_clicked', 'account_login_attempted', 'account_register_attempted', 'password_reset_requested', 'operation_request_started'].every((event) => conversion.includes(event))],
];

let failed = false;
for (const [label, ok] of checks) {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
  if (!ok) failed = true;
}

if (failed) process.exitCode = 1;
else console.log('External integrations audit passed.');
