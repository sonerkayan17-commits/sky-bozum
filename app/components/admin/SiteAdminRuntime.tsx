"use client";

import dynamic from 'next/dynamic';
import { useSiteEditor } from './SiteEditorProvider';

const SiteAdminDock = dynamic(() => import('./SiteAdminDock'));
const SitePageEditor = dynamic(() => import('./SiteInlineEditorAdmin').then((module) => module.SitePageEditor));

export default function SiteAdminRuntime() {
  const { isAdmin } = useSiteEditor();

  if (!isAdmin) return null;

  return (
    <>
      <SiteAdminDock />
      <SitePageEditor />
    </>
  );
}
