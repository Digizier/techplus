import type { Metadata } from 'next';
import React from 'react';
import ShopClient from './ShopClient';

export const metadata: Metadata = {
  title: 'Shop Power Tools, Chainsaw Converters & Accessories | Techplus.pk',
  description:
    'Browse Pakistan’s premier selection of authentic 100% copper power tools, electric drill to chainsaw converters, cordless drill sets, and heavy-duty machinery. Cash on delivery nationwide.',
  alternates: {
    canonical: 'https://techplus.pk/shop',
  },
  openGraph: {
    title: 'Shop Power Tools, Chainsaw Converters & Accessories | Techplus.pk',
    description:
      'Browse Pakistan’s premier selection of authentic 100% copper power tools, electric drill to chainsaw converters, cordless drill sets, and heavy-duty machinery. Cash on delivery nationwide.',
    url: 'https://techplus.pk/shop',
    siteName: 'Techplus.pk',
    type: 'website',
    images: [
      {
        url: 'https://techplus.pk/images/techplus-og-share.png',
        width: 1200,
        height: 630,
        alt: 'Techplus.pk Tools Catalog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Power Tools, Chainsaw Converters & Accessories | Techplus.pk',
    description:
      'Browse Pakistan’s premier selection of authentic 100% copper power tools, electric drill to chainsaw converters, cordless drill sets, and heavy-duty machinery.',
    images: ['https://techplus.pk/images/techplus-og-share.png'],
  },
};

export default function ShopPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://techplus.pk',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: 'https://techplus.pk/shop',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ShopClient />
    </>
  );
}
