import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const account = read('app/components/AccountAccess.tsx');
const memberOps = read('app/components/member/MemberOperations.tsx');
const messages = read('app/components/member/MemberMessages.tsx');
const bank = read('app/components/member/MemberBankInfo.tsx');
const rules = read('firestore.rules');

const checks = [
  ['Login uses Firebase email sign-in', account.includes('signInWithEmailAndPassword')],
  ['Register creates verified email flow', account.includes('createUserWithEmailAndPassword') && account.includes('sendEmailVerification')],
  ['Password reset exists', account.includes('sendPasswordResetEmail')],
  ['Account events omit PII and track attempts', account.includes("trackConversion('account_login_attempted'") && account.includes("trackConversion('account_register_attempted'")],
  ['Member profile/bank path is private', bank.includes('memberPrivate') && rules.includes('match /memberPrivate/{memberId}')],
  ['Messages are owner-scoped', messages.includes('messages') && rules.includes('resource.data.senderId == request.auth.uid || resource.data.receiverId == request.auth.uid')],
  ['Request/operation create is guarded', memberOps.includes('operations') && rules.includes('request.resource.data.memberId == request.auth.uid')],
  ['No raw password persistence', !/setDoc\([^)]*password/i.test(account)],
];

let failed = false;
for (const [label, ok] of checks) {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
  if (!ok) failed = true;
}
if (failed) process.exitCode = 1;
else console.log('Critical flow audit passed.');
