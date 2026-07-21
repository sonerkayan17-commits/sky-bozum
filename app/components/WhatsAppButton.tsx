import { siteConfig } from '../lib/site';

export default function WhatsAppButton() {
  return (
    <a
      href={siteConfig.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp üzerinden güncel oran alın"
      className="focus-ring group fixed bottom-4 left-4 z-40 grid size-12 place-items-center rounded-full border border-emerald-300/35 bg-emerald-500 text-white shadow-[0_12px_32px_rgba(16,185,129,.32)] transition hover:-translate-y-1 hover:bg-emerald-400 motion-reduce:transform-none sm:bottom-5 sm:left-5 sm:flex sm:h-13 sm:w-auto sm:gap-2.5 sm:px-4"
    >
      <svg className="size-6 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a9.7 9.7 0 0 0-8.4 14.55L2.3 21.3l4.87-1.28A9.7 9.7 0 1 0 12 2Zm0 17.64a7.9 7.9 0 0 1-4.03-1.1l-.29-.17-2.89.76.77-2.81-.19-.3A7.91 7.91 0 1 1 12 19.64Zm4.34-5.92c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12-.16.24-.61.77-.75.93-.14.16-.28.18-.52.06-1.4-.7-2.32-1.25-3.25-2.84-.25-.43.25-.4.71-1.32.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.73-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62 1.52.66 2.12.71 2.88.6.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28Z"/></svg>
      <span className="hidden text-sm font-extrabold sm:inline">WhatsApp</span>
    </a>
  );
}
