import React from 'react';
import { getAllCategorySlugs } from '@/lib/db';
import CategoryShopClient from './CategoryShopClient';

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
  return <CategoryShopClient categorySlug={resolvedParams.category} />;
}
