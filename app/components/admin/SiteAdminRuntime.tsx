"use client";

import dynamic from 'next/dynamic';

const SiteAdminDock = dynamic(() => import('./SiteAdminDock'));
const SitePageEditor = dynamic(() => import('./SiteInlineEditor').then((module) => module.SitePageEditor));

export default function SiteAdminRuntime() {
  return (
    <>
      <SiteAdminDock />
      <SitePageEditor />
    </>
  );
}
