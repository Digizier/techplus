import type { Metadata } from 'next';
import React from 'react';
import { getAllCategorySlugs, getCategoryBySlug, getProducts, getCategories } from '@/lib/db';
import { resolveImageUrl } from '@/lib/image-utils';
import { getCategoryGuide } from '@/lib/category-content';
import CategoryShopClient from './CategoryShopClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const guide = getCategoryGuide(resolvedParams.category);
  const category = await getCategoryBySlug(resolvedParams.category);

  const title = guide.metaTitle;
  const description = guide.metaDescription;
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
          alt: guide.heroHeading,
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
      { category: 'drill-machines' },
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
  const guide = getCategoryGuide(resolvedParams.category);

  // Pre-render initial products & categories on the server for Google Crawlers
  const [category, productsRes, allCategories, fallbackProductsRes] = await Promise.all([
    getCategoryBySlug(resolvedParams.category),
    getProducts({
      page: 1,
      limit: 8,
      categorySlug: resolvedParams.category,
      sortBy: 'newest',
    }),
    getCategories(),
    getProducts({ page: 1, limit: 4, sortBy: 'newest' }),
  ]);

  const catName = category?.name || guide.heroHeading;

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
    description: guide.metaDescription,
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
      <CategoryShopClient
        categorySlug={resolvedParams.category}
        initialCategory={category}
        initialProducts={productsRes.products}
        initialTotalCount={productsRes.totalCount}
        initialCategories={allCategories}
        fallbackProducts={fallbackProductsRes.products}
      />
    </>
  );
}
