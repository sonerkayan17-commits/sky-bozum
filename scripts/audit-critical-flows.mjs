import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const account = read('app/components/AccountAccess.tsx');
const memberOps = read('app/components/member/MemberOperations.tsx');
const messages = read('app/components/member/MemberMessages.tsx');
const bank = read('app/components/member/MemberBankInfo.tsx');
const memberHub = read('app/components/member/MemberHub.tsx');
const admin = read('app/lib/admin.ts');
const adminConsole = read('app/yonetim/AdminConsole.tsx');
const productVideo = read('app/components/products/ProductCoverVideo.tsx');
const rules = read('firestore.rules');

const checks = [
  ['Login uses Firebase email sign-in', account.includes('signInWithEmailAndPassword')],
  ['Register creates verified email flow', account.includes('createUserWithEmailAndPassword') && account.includes('sendEmailVerification')],
  ['Password reset exists', account.includes('sendPasswordResetEmail')],
  ['Account events omit PII and track attempts', account.includes("trackConversion('account_login_attempted'") && account.includes("trackConversion('account_register_attempted'")],
  ['Member profile/bank path is private', bank.includes('memberPrivate') && rules.includes('match /memberPrivate/{memberId}')],
  ['Messages are owner-scoped', messages.includes('messages') && rules.includes('resource.data.senderId == request.auth.uid || resource.data.receiverId == request.auth.uid')],
  ['Request/operation create is guarded', memberOps.includes('operations') && rules.includes('request.resource.data.memberId == request.auth.uid')],
  ['Member approval is enforced in data rules', rules.includes('function approvedMember()') && rules.includes('&& approvedMember()')],
  ['Member approval persists in live account UI', memberHub.includes("label: 'Onaylı üye'") && memberHub.includes("onSnapshot(doc(db, 'members'"),],
  ['Timed bans and capability restrictions exist', admin.includes('bannedUntil') && admin.includes('setMemberRestrictions') && rules.includes('function capabilityAllowed(capability)')],
  ['Admin member view follows persisted member snapshot', adminConsole.includes('members.find((member) => member.id === current.id)')],
  ['Mobile product video selects touched card', productVideo.includes('handlePointerDown') && productVideo.includes('suppressNextClick') && productVideo.includes('centerDistance')],
  ['No raw password persistence', !/setDoc\([^)]*password/i.test(account)],
];

let failed = false;
for (const [label, ok] of checks) {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
  if (!ok) failed = true;
}
if (failed) process.exitCode = 1;
else console.log('Critical flow audit passed.');
