import type { Metadata } from 'next';
import React from 'react';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = {
  title: 'Company Profile | Techplus Engineering & Services Islamabad',
  description:
    'Techplus.pk company profile. 20+ years in electrical contracting, solar EPC since 2018, AC maintenance, CCTV and licensed engineering in Islamabad & Rawalpindi.',
  alternates: {
    canonical: 'https://techplus.pk/profile',
  },
  openGraph: {
    title: 'Company Profile | Techplus Engineering & Services Islamabad',
    description:
      'Learn about Techplus.pk — 20+ years electrical legacy, solar EPC since 2018, licensed technicians, and partner brands across Islamabad & Rawalpindi.',
    url: 'https://techplus.pk/profile',
    siteName: 'Techplus.pk',
    type: 'website',
    images: [
      {
        url: 'https://techplus.pk/images/techplus-og-share.png',
        width: 1200,
        height: 630,
        alt: 'Techplus Company Profile Islamabad',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Company Profile | Techplus Engineering & Services Islamabad',
    description:
      '20+ years electrical engineering and solar EPC since 2018 in Islamabad & Rawalpindi. Certified technicians & partner brands.',
    images: ['https://techplus.pk/images/techplus-og-share.png'],
  },
};

export default function ProfilePage() {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Techplus.pk',
    legalName: 'Techplus Engineering & Facility Solutions',
    url: 'https://techplus.pk/profile',
    logo: 'https://techplus.pk/images/logo.png',
    foundingDate: '2004',
    description:
      'Premier Pakistani electrical engineering, solar EPC installation since 2018, HVAC maintenance, and commercial surveillance facility provider in Islamabad and Rawalpindi.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shop 07-B Chinar Plaza, St-48, G-6/1-1',
      addressLocality: 'Islamabad',
      addressRegion: 'Federal',
      postalCode: '44000',
      addressCountry: 'PK',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+92-323-5538700',
        contactType: 'customer support',
        areaServed: ['PK', 'Islamabad', 'Rawalpindi'],
        availableLanguage: ['Urdu', 'English', 'Punjabi'],
      },
    ],
    sameAs: [
      'https://facebook.com/techpluspk',
      'https://instagram.com/techpluspk',
      'https://youtube.com/@techpluspk',
    ],
  };

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
        name: 'Company Profile',
        item: 'https://techplus.pk/profile',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProfileClient />
    </>
  );
}
