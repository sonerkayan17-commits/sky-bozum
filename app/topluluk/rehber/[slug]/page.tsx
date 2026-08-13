import { notFound } from 'next/navigation';

// Eski editör rehberleri korunur fakat yeni public forum mimarisinin parçası
// değildir. Doğrudan eski adresler indexlenmez ve public içerik göstermez.
export const metadata = { robots: { index: false, follow: false } };
export function generateStaticParams() { return []; }
export default function ArchivedCommunityGuide() { notFound(); }
