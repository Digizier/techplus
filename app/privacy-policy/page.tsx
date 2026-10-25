import type { Metadata } from 'next';
import React from 'react';
import PrivacyPolicyClient from './PrivacyPolicyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy | Techplus.pk',
  description:
    'Learn how Techplus.pk protects customer data, contact records, and delivery information across Pakistan.',
  alternates: {
    canonical: 'https://techplus.pk/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
