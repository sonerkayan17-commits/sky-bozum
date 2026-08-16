import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const AccountAccess = dynamic(() => import('../components/AccountAccess'));

export const metadata: Metadata = { title: 'Kayıt Ol', robots: { index: false, follow: false } };
export default function RegisterPage() { return <AccountAccess mode="register" />; }
