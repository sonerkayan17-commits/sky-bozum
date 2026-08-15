'use client';

import usePublishedRates from '../personalization/usePublishedRates';

type PublishedRateLabelProps = {
  serviceSlug: string;
  fallback: string;
  className?: string;
};

/**
 * Keeps server-rendered service cards useful before hydration while letting
 * published admin rate overrides update the public label in real time.
 */
export default function PublishedRateLabel({ serviceSlug, fallback, className }: PublishedRateLabelProps) {
  const rates = usePublishedRates();
  const rate = rates.find((item) => item.serviceSlug === serviceSlug);

  return <span className={className}>{rate?.range ?? fallback}</span>;
}
