import type { Metadata } from 'next';
import React from 'react';
import TermsOfServiceClient from './TermsOfServiceClient';

export const metadata: Metadata = {
  title: 'Terms of Service | Techplus.pk',
  description:
    'Terms of service, warranty conditions, orders, and payment terms for purchasing from Techplus.pk.',
  alternates: {
    canonical: 'https://techplus.pk/terms-of-service',
  },
};

export default function TermsOfServicePage() {
  return <TermsOfServiceClient />;
}
