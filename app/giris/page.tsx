import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const AccountAccess = dynamic(() => import('../components/AccountAccess'));

export const metadata: Metadata = { title: 'Giriş', robots: { index: false, follow: false } };
export default function LoginPage() { return <AccountAccess mode="login" />; }
