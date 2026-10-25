import type { Metadata } from 'next';
import React from 'react';
import ContactUsClient from './ContactUsClient';

export const metadata: Metadata = {
  title: 'Contact Us | Techplus.pk Helpline & Support Islamabad',
  description:
    'Need help with an order or tool recommendation? Contact Techplus.pk customer support via WhatsApp, phone (0323 5538700), or email in Islamabad & Rawalpindi.',
  alternates: {
    canonical: 'https://techplus.pk/contact-us',
  },
  openGraph: {
    title: 'Contact Us | Techplus.pk Helpline & Support Islamabad',
    description:
      'Need help with an order or tool recommendation? Contact Techplus.pk customer support via WhatsApp, phone (0323 5538700), or email in Islamabad & Rawalpindi.',
    url: 'https://techplus.pk/contact-us',
    siteName: 'Techplus.pk',
    type: 'website',
  },
};

export default function ContactUsPage() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Techplus.pk',
    url: 'https://techplus.pk/contact-us',
    mainEntity: {
      '@type': 'HomeGoodsStore',
      name: 'Techplus.pk',
      telephone: '+92-323-5538700',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Islamabad',
        addressCountry: 'PK',
      },
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
        name: 'Contact Us',
        item: 'https://techplus.pk/contact-us',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ContactUsClient />
    </>
  );
}
