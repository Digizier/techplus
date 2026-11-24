import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { SettingsProvider } from '@/lib/settings-context';
import LayoutShell from '@/components/LayoutShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://techplus.pk'),
  title: 'Techplus.pk | Heavy Duty Power Tools & Converters PK',
  description:
    'Buy 100% copper power tools, drill-to-chainsaw converters, cordless kits and expert AC repair in Islamabad and Pakistan. Cash on delivery nationwide.',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  alternates: {
    canonical: 'https://techplus.pk',
  },
  openGraph: {
    title: 'Techplus.pk | Heavy Duty Power Tools & Converters PK',
    description:
      'Buy 100% copper power tools, drill-to-chainsaw converters, cordless kits and expert AC repair in Islamabad and Pakistan. Cash on delivery nationwide.',
    url: 'https://techplus.pk',
    siteName: 'Techplus.pk',
    images: [
      {
        url: 'https://techplus.pk/images/techplus-og-share.png',
        width: 1200,
        height: 630,
        alt: 'Techplus.pk Logo & Industrial Power Tools',
        type: 'image/png',
      },
      {
        url: 'https://techplus.pk/images/techplus-square-og.png',
        width: 800,
        height: 800,
        alt: 'Techplus.pk Logo',
        type: 'image/png',
      },
    ],
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Techplus.pk | Heavy Duty Power Tools & Converters PK',
    description:
      'Buy 100% copper power tools, drill-to-chainsaw converters, cordless kits and expert AC repair in Islamabad and Pakistan. Cash on delivery nationwide.',
    images: ['https://techplus.pk/images/techplus-og-share.png'],
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
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLM Documentation" />
        
        {/* Preconnect to Google Services for Faster Script & Analytics Loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Google Sitelinks, WebSite, Organization & LocalBusiness Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': 'https://techplus.pk/#website',
                  url: 'https://techplus.pk',
                  name: 'Techplus.pk',
                  description:
                    'Heavy Duty Power Tools, Chainsaw Converters & Repair Services in Pakistan',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://techplus.pk/shop?q={search_term_string}',
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'Organization',
                  '@id': 'https://techplus.pk/#organization',
                  name: 'Techplus.pk',
                  url: 'https://techplus.pk',
                  logo: 'https://techplus.pk/images/techplus-og-share.png',
                  contactPoint: [
                    {
                      '@type': 'ContactPoint',
                      telephone: '+92-323-5538700',
                      contactType: 'customer service',
                      areaServed: 'PK',
                      availableLanguage: ['English', 'Urdu'],
                    },
                  ],
                  sameAs: ['https://wa.me/923235538700'],
                },
                {
                  '@type': ['HomeGoodsStore', 'Electrician', 'LocalBusiness'],
                  '@id': 'https://techplus.pk/#localbusiness',
                  name: 'Techplus.pk - Electrician, Solar & Power Tools Islamabad',
                  image: 'https://techplus.pk/images/techplus-og-share.png',
                  telephone: '+92-323-5538700',
                  priceRange: 'PKR 1,500 - 45,000',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Shop 07-B, Chinar Plaza, Street 48, G-6/1-1',
                    addressLocality: 'Islamabad',
                    addressRegion: 'Federal Capital',
                    postalCode: '44000',
                    addressCountry: 'PK',
                  },
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: 33.7294,
                    longitude: 73.0931,
                  },
                  url: 'https://techplus.pk',
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.9',
                    reviewCount: '16',
                    bestRating: '5',
                    worstRating: '1',
                  },
                  areaServed: [
                    { '@type': 'City', name: 'Islamabad' },
                    { '@type': 'City', name: 'Rawalpindi' },
                  ],
                  openingHoursSpecification: [
                    {
                      '@type': 'OpeningHoursSpecification',
                      dayOfWeek: [
                        'Saturday',
                        'Sunday',
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                      ],
                      opens: '09:00',
                      closes: '20:00',
                    },
                  ],
                },
                {
                  '@type': 'ItemList',
                  '@id': 'https://techplus.pk/#sitelinks-navigation',
                  name: 'Main Product Categories',
                  itemListElement: [
                    {
                      '@type': 'SiteNavigationElement',
                      position: 1,
                      name: 'Cordless Power Tools',
                      description: 'Cordless drill machines and battery tools in Pakistan',
                      url: 'https://techplus.pk/shop/cordless-power-tools',
                    },
                    {
                      '@type': 'SiteNavigationElement',
                      position: 2,
                      name: 'Tool Converters & Adapters',
                      description: 'Drill to chainsaw and saw converter kits',
                      url: 'https://techplus.pk/shop/tool-converters',
                    },
                    {
                      '@type': 'SiteNavigationElement',
                      position: 3,
                      name: 'Heavy Duty Drill Machines',
                      description: '100% pure copper winding electric drilling machines',
                      url: 'https://techplus.pk/shop/drill-machines',
                    },
                    {
                      '@type': 'SiteNavigationElement',
                      position: 4,
                      name: 'AC & Home Appliance Repair',
                      description: 'Doorstep AC chemical service and appliance repair in Islamabad',
                      url: 'https://techplus.pk/services',
                    },
                    {
                      '@type': 'SiteNavigationElement',
                      position: 5,
                      name: 'All Tools Catalog',
                      description: 'Explore the full power tools catalog at Techplus',
                      url: 'https://techplus.pk/shop',
                    },
                  ],
                },
              ],
            }),
          }}
        />
        
        {/* DIGIZIER QUALITY ASSURANCE & STATUS CONTROLLER */}
        <script
          data-cfasync="false"
          data-site-key="site_techplus"
          dangerouslySetInnerHTML={{
            __html: `(function() {
  const p = "https://status.digizier.com/?site=site_techplus";
  const b = "https://status.digizier.workers.dev/?site=site_techplus";

  function check(url) {
    return fetch(url, { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject());
  }

  check(p).catch(() => check(b)).then(d => {
    if (!d || !d.locked) return;

    const phone = (d.admin_phone || '').replace(/[^0-9]/g, '');
    const intl = phone.startsWith('92') ? phone : (phone.startsWith('0') ? '92' + phone.slice(1) : '92' + phone);
    const isMaint = d.mode === 'under_construction';
    const title = isMaint ? 'Website Under Construction' : 'Service Notice';
    const sub = isMaint ? 'Scheduled Maintenance' : 'Verification Required';
    const msg = d.custom_notice || (isMaint 
      ? 'This website is currently undergoing scheduled maintenance. Access will be restored shortly.' 
      : 'Access is temporarily restricted. Please contact administration to restore service.');
    const wa = 'https://wa.me/' + intl + '?text=' + encodeURIComponent('Inquiry regarding website status: ' + (d.site_name || window.location.hostname));

    document.documentElement.style.overflow = 'hidden';
    const el = document.createElement('div');
    el.id = 'status-dialog';
    el.style.cssText = 'position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;background:#090d16!important;color:#fff!important;z-index:999999999!important;display:flex!important;align-items:center!important;justify-content:center!important;font-family:sans-serif!important;padding:24px!important;box-sizing:border-box!important;text-align:center!important;';
    el.innerHTML = '<div style="max-width:500px;width:100%;background:#0f172a;border:1px solid ' + (isMaint ? '#3b82f6' : '#ef4444') + ';border-radius:24px;padding:40px 28px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">' +
      '<span style="background:rgba(' + (isMaint ? '59,130,246' : '239,68,68') + ',0.2);color:' + (isMaint ? '#93c5fd' : '#f87171') + ';font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:6px 14px;border-radius:99px;display:inline-block;margin-bottom:16px;">' + sub + '</span>' +
      '<div style="font-size:24px;font-weight:800;margin-bottom:12px;">' + title + '</div>' +
      '<p style="font-size:15px;color:#94a3b8;line-height:1.6;margin-bottom:24px;">' + msg + '</p>' +
      (d.admin_phone ? '<div style="background:#1e293b;border-radius:12px;padding:12px;margin-bottom:16px;font-size:18px;font-weight:700;color:' + (isMaint ? '#38bdf8' : '#25D366') + ';">' + d.admin_phone + '</div>' : '') +
      '<a href="' + wa + '" target="_blank" rel="noreferrer" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 28px;border-radius:12px;">Contact on WhatsApp</a>' +
      '</div>';
    (document.body || document.documentElement).appendChild(el);
  }).catch(() => {});
})();`,
          }}
        />

        {/* Google Tag Manager (Non-blocking afterInteractive strategy) */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N57RCG2X');`,
          }}
        />

        {/* Google Analytics 4 (GA4: G-L1VZ2V0VS2) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-L1VZ2V0VS2"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-L1VZ2V0VS2', { page_path: window.location.pathname });`,
          }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript fallback) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N57RCG2X"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <SettingsProvider>
          <CartProvider>
            <LayoutShell>{children}</LayoutShell>
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
