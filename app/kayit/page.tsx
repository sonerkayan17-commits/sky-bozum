import type { Metadata } from 'next';
import AccountAccess from '../components/AccountAccess';

export const metadata: Metadata = { title: 'Kayıt Ol', robots: { index: false, follow: false } };
export default function RegisterPage() { return <AccountAccess mode="register" />; }
