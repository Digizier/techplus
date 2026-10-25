import type { Metadata } from 'next';
import React from 'react';
import { getAllCategorySlugs, getCategoryBySlug } from '@/lib/db';
import { resolveImageUrl } from '@/lib/image-utils';
import CategoryShopClient from './CategoryShopClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await getCategoryBySlug(resolvedParams.category);

  const formattedName = category
    ? category.name
    : resolvedParams.category
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

  const title = `${formattedName} in Pakistan | Heavy Duty - Techplus.pk`;
  const description =
    category?.description && category.description.trim() !== ''
      ? category.description
      : `Explore authentic ${formattedName} with 100% pure copper motor, official warranty, and fast cash on delivery across Islamabad, Rawalpindi & Pakistan.`;
  const pageUrl = `https://techplus.pk/shop/${resolvedParams.category}`;
  const imageUrl = category?.image_url
    ? resolveImageUrl(category.image_url, { absolute: true })
    : 'https://techplus.pk/images/techplus-og-share.png';

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Techplus.pk',
      type: 'website',
      images: [
        {
          url: imageUrl,
          alt: formattedName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

// Build-time static export parameters
export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  if (slugs.length === 0) {
    return [
      { category: 'power-tools' },
      { category: 'tool-converters' },
      { category: 'hand-tools' },
      { category: 'electrical' },
      { category: 'cordless-power-tools' },
      { category: 'used-branded-tools' },
    ];
  }
  return slugs.map((slug) => ({
    category: slug,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  const category = await getCategoryBySlug(resolvedParams.category);
  const catName = category
    ? category.name
    : resolvedParams.category
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

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
      {
        '@type': 'ListItem',
        position: 3,
        name: catName,
        item: `https://techplus.pk/shop/${resolvedParams.category}`,
      },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${catName} - Techplus.pk`,
    url: `https://techplus.pk/shop/${resolvedParams.category}`,
    description: `Shop authentic ${catName} at Techplus.pk with cash on delivery across Pakistan.`,
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
      <CategoryShopClient categorySlug={resolvedParams.category} />
    </>
  );
}
