import { useStore } from "@/lib/store";

export function WhatsappFab() {
  const { state } = useStore();
  const msg = encodeURIComponent("Hi Paint Shield, I want to inquire about PPF for my car.");
  const href = `https://wa.me/${state.studio.whatsapp}?text=${msg}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-luxe hover:scale-105 transition-transform">
        <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden>
          <path d="M19.11 17.27c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27 0 1.34.97 2.63 1.11 2.81.14.18 1.92 2.93 4.66 4.11.65.28 1.16.45 1.56.58.65.21 1.25.18 1.72.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.16.16-1.28-.07-.12-.25-.18-.52-.32zM16.04 6c-5.55 0-10.05 4.5-10.05 10.04 0 1.77.46 3.5 1.34 5.02L6 26l5.06-1.32a10.04 10.04 0 0 0 4.98 1.27h.01c5.55 0 10.05-4.5 10.05-10.04 0-2.68-1.04-5.21-2.94-7.11A10 10 0 0 0 16.04 6zm0 18.36h-.01a8.34 8.34 0 0 1-4.25-1.16l-.3-.18-3 .79.8-2.93-.2-.31a8.34 8.34 0 0 1-1.28-4.43c0-4.6 3.74-8.34 8.35-8.34 2.23 0 4.32.87 5.9 2.45a8.29 8.29 0 0 1 2.44 5.9c0 4.6-3.75 8.34-8.35 8.34z" />
        </svg>
      </span>
    </a>
  );
}
