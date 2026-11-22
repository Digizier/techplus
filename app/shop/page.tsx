import type { Metadata } from 'next';
import React from 'react';
import { getProducts, getCategories } from '@/lib/db';
import ShopClient from './ShopClient';

export const metadata: Metadata = {
  title: 'Shop Power Tools, Chainsaw Converters & Equipment | Techplus.pk',
  description:
    'Buy 100% pure copper power tools, cordless drills, chainsaw converters, and hardware in Pakistan. Cash on delivery with parcel inspection. Call 0323 5538700.',
  alternates: {
    canonical: 'https://techplus.pk/shop',
  },
  openGraph: {
    title: 'Shop Power Tools, Chainsaw Converters & Equipment | Techplus.pk',
    description:
      'Buy 100% pure copper power tools, cordless drills, chainsaw converters, and hardware in Pakistan. Cash on delivery with parcel inspection.',
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
    title: 'Shop Power Tools, Chainsaw Converters & Equipment | Techplus.pk',
    description:
      'Buy 100% pure copper power tools, cordless drills, chainsaw converters, and hardware in Pakistan. Cash on delivery with parcel inspection.',
    images: ['https://techplus.pk/images/techplus-og-share.png'],
  },
};

export default async function ShopPage() {
  // Pre-render initial products and categories so Google crawlers see them directly in raw HTML
  const [productsRes, categories] = await Promise.all([
    getProducts({ page: 1, limit: 8, sortBy: 'newest' }),
    getCategories(),
  ]);

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

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Power Tools & Machinery Catalog - Techplus.pk',
    url: 'https://techplus.pk/shop',
    description:
      'Explore Pakistan’s verified catalog of pure copper armature drills, cordless tools, and chainsaw adapters.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <ShopClient
        initialProducts={productsRes.products}
        initialTotalCount={productsRes.totalCount}
        initialCategories={categories}
      />
    </>
  );
}
