import type { Metadata } from 'next';
import React from 'react';
import ReturnExchangeClient from './ReturnExchangeClient';

export const metadata: Metadata = {
  title: 'Return and Exchange Policy | Techplus.pk',
  description:
    'Our transparent checking warranty, exchange guidelines, and return procedures for tools and parcels across Pakistan.',
  alternates: {
    canonical: 'https://techplus.pk/return-and-exchange-policy',
  },
};

export default function ReturnExchangePolicyPage() {
  return <ReturnExchangeClient />;
}
