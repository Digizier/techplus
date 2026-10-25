import type { Metadata } from 'next';
import React from 'react';
import AboutUsClient from './AboutUsClient';

export const metadata: Metadata = {
  title: 'About Techplus.pk | Heavy Duty Power Tools & Spares Pakistan',
  description:
    'Learn about Techplus.pk — Pakistan’s authentic source for 100% pure copper motor tools, inventive drill converter adapters, and residential AC repair services.',
  alternates: {
    canonical: 'https://techplus.pk/about-us',
  },
  openGraph: {
    title: 'About Techplus.pk | Heavy Duty Power Tools & Spares Pakistan',
    description:
      'Learn about Techplus.pk — Pakistan’s authentic source for 100% pure copper motor tools, inventive drill converter adapters, and residential AC repair services.',
    url: 'https://techplus.pk/about-us',
    siteName: 'Techplus.pk',
    type: 'website',
  },
};

export default function AboutUsPage() {
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
        name: 'About Us',
        item: 'https://techplus.pk/about-us',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutUsClient />
    </>
  );
}
