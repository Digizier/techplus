import type { Metadata } from 'next';
import React from 'react';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'AC Repair, High Pressure Wash & Appliance Maintenance in Islamabad | Techplus.pk',
  description:
    'Reliable doorstep AC repair, chemical high pressure master cleaning, gas refilling, inverter checkup, and solar system repair services in Islamabad & Rawalpindi. Call 0323 5538700.',
  alternates: {
    canonical: 'https://techplus.pk/services',
  },
  openGraph: {
    title: 'AC Repair, High Pressure Wash & Appliance Maintenance in Islamabad | Techplus.pk',
    description:
      'Reliable doorstep AC repair, chemical high pressure master cleaning, gas refilling, inverter checkup, and solar system repair services in Islamabad & Rawalpindi. Call 0323 5538700.',
    url: 'https://techplus.pk/services',
    siteName: 'Techplus.pk',
    type: 'website',
    images: [
      {
        url: 'https://techplus.pk/images/techplus-og-share.png',
        width: 1200,
        height: 630,
        alt: 'Techplus Services Islamabad & Rawalpindi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AC Repair, High Pressure Wash & Appliance Maintenance in Islamabad | Techplus.pk',
    description:
      'Reliable doorstep AC repair, chemical high pressure master cleaning, gas refilling, inverter checkup, and solar system repair in Islamabad & Rawalpindi.',
    images: ['https://techplus.pk/images/techplus-og-share.png'],
  },
};

export default function ServicesPage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'AC Repair & Home Appliance Maintenance',
    provider: {
      '@type': 'HomeGoodsStore',
      name: 'Techplus.pk',
      telephone: '+92-323-5538700',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Islamabad',
        addressRegion: 'Federal',
        addressCountry: 'PK',
      },
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Islamabad',
      },
      {
        '@type': 'City',
        name: 'Rawalpindi',
      },
    ],
    description:
      'Complete split AC repair, master chemical washing, gas charging, inverter diagnostics, and electrical appliance maintenance in twin cities.',
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
        name: 'Services',
        item: 'https://techplus.pk/services',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ServicesClient />
    </>
  );
}
