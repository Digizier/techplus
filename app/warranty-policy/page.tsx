import type { Metadata } from 'next';
import React from 'react';
import WarrantyPolicyClient from './WarrantyPolicyClient';

export const metadata: Metadata = {
  title: 'Warranty & Repair Policy | Techplus.pk',
  description:
    'Read the official Techplus.pk warranty standards, pure copper winding guarantee, and repair checking policy for power tools and appliances in Pakistan.',
  alternates: {
    canonical: 'https://techplus.pk/warranty-policy',
  },
};

export default function WarrantyPolicyPage() {
  return <WarrantyPolicyClient />;
}
