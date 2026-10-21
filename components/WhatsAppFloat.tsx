'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

export default function WhatsAppFloat() {
  const pathname = usePathname();
  const { settings } = useSettings();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const whatsappUrl = `https://wa.me/92${settings.whatsapp_number.replace(/^0/, '')}?text=${encodeURIComponent(
    'Assalam-o-Alaikum Techplus.pk, I have an inquiry about an order / service.'
  )}`;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-30 hidden sm:block">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-bold pr-1">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
