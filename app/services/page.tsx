import type { Metadata } from 'next';
import React from 'react';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'OUR SERVICES | Solar, Electrical & AC Services | Techplus.pk',
  description:
    'Doorstep engineering in Islamabad & Rawalpindi. Solar installation since 2018, 20+ yrs electrical, AC cleaning, CCTV, plumbing & appliance repair. 0323 5538700.',
  alternates: {
    canonical: 'https://techplus.pk/services',
  },
  openGraph: {
    title: 'OUR SERVICES | Solar, Electrical & AC Services | Techplus.pk',
    description:
      'Professional solar installation since 2018, 20+ years electrical services, AC repair, CCTV, and appliance maintenance across Islamabad & Rawalpindi.',
    url: 'https://techplus.pk/services',
    siteName: 'Techplus.pk',
    type: 'website',
    images: [
      {
        url: 'https://techplus.pk/images/techplus-og-share.png',
        width: 1200,
        height: 630,
        alt: 'Techplus Engineering and Appliance Services Islamabad',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OUR SERVICES | Solar, Electrical & AC Services | Techplus.pk',
    description:
      'Solar installation since 2018, 20+ yrs electrical services, AC jet wash, and appliance repair in Islamabad & Rawalpindi.',
    images: ['https://techplus.pk/images/techplus-og-share.png'],
  },
};

export default function ServicesPage() {
  const serviceListSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Techplus Engineering & Facility Services',
    image: 'https://techplus.pk/images/logo.png',
    telephone: '+92-323-5538700',
    url: 'https://techplus.pk/services',
    priceRange: 'PKR 1,500 - 500,000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shop 07-B Chinar Plaza, St-48, G-6/1-1',
      addressLocality: 'Islamabad',
      addressRegion: 'Federal',
      addressCountry: 'PK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '33.7294',
      longitude: '73.0931',
    },
    areaServed: [
      { '@type': 'City', name: 'Islamabad' },
      { '@type': 'City', name: 'Rawalpindi' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Techplus Engineering & Repair Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Solar System Installation & Net Metering',
            description:
              'Offering turnkey residential and commercial solar system installations since 2018 with IESCO net-metering approval.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Electrical Services',
            description:
              'Over 20 years wide experience in full house rewiring, DB load balancing, and emergency electrical troubleshooting.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Air Conditioning Maintenance & Jet Wash',
            description:
              'High-pressure chemical jet cleaning, genuine R410A/R32 gas refills, and inverter PCB troubleshooting.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Plumbing Services & Diamond Core Cutting',
            description:
              'PPRC/CPVC sanitary pipe fitting, drain unclogging, and diamond core cutting with zero wall cracks.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'CCTV & Biometric Time Attendance',
            description:
              'Hikvision and Dahua HD IP cameras with mobile streaming and biometric face/fingerprint attendance clock-in.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'PABX & Structured Computer Networking',
            description:
              'Enterprise Cat6 cabling, server rack installations, TP-Link Wi-Fi access points, and office intercoms.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Fire Alarm System Installation',
            description:
              'Addressable and conventional optical smoke detectors, heat sensors, break-glass stations, and siren panels.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Home Appliance Repair Services',
            description:
              'Doorstep diagnostics and repair for AC, cloth iron, refrigerator, room cooler, fan, washing machine, dryer, microwave, geyser, and vacuum cleaner.',
          },
        },
      ],
    },
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
        name: 'Our Services',
        item: 'https://techplus.pk/services',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ServicesClient />
    </>
  );
}
