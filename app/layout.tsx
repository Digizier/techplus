import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { SettingsProvider } from '@/lib/settings-context';
import LayoutShell from '@/components/LayoutShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://techplus.pk'),
  title: 'Techplus.pk | Heavy Duty Power Tools, Chainsaw Converters & Repair Services',
  description:
    'Shop authentic copper winding power tools, electric drill to chainsaw converters, cordless kits, and expert AC / home appliance repair services in Islamabad & across Pakistan.',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Techplus.pk - Tools & Home Appliances Solutions',
    description:
      'Authorized sales & service center for heavy duty tools, converters, and appliance maintenance across Pakistan.',
    url: 'https://techplus.pk',
    siteName: 'Techplus.pk',
    images: [
      {
        url: '/images/hero-banner.png',
        width: 1200,
        height: 630,
        alt: 'Techplus.pk Power Tools & Converters',
      },
    ],
    locale: 'en_PK',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>
        <SettingsProvider>
          <CartProvider>
            <LayoutShell>{children}</LayoutShell>
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
