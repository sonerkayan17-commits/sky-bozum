import type { Metadata } from 'next';
import AccountAccess from '../components/AccountAccess';

export const metadata: Metadata = { title: 'Giriş', robots: { index: false, follow: false } };
export default function LoginPage() { return <AccountAccess mode="login" />; }
