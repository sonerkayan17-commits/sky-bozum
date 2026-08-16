import NextLink from 'next/link';
import type { ComponentProps } from 'react';

type DeferredLinkProps = ComponentProps<typeof NextLink>;

/** Keeps the current page light; the target route is fetched only after navigation. */
export default function DeferredLink(props: DeferredLinkProps) {
  return <NextLink {...props} prefetch={false} />;
}
