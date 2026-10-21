import React from 'react';
import { getAllProductSlugs, getProductBySlug } from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  if (slugs.length === 0) {
    return [
      { slug: '1078' },
      { slug: 'cordless-drill-18v-bnktop-russian-brand-10mm' },
      { slug: 'electric-drill-machine-drilling-machine-with-reverse-function-slow-fast-speed-electric-screw-driver-function-copper-copy' },
      { slug: '6-inch-electric-drill-to-electric-chain-saw-adapter-home-portable-chainsaw-wood-plastic-metal-cutting-woodworking-trimming-tool' },
      { slug: 'multi-function-plier' },
    ];
  }
  return slugs.map((slug) => ({ slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  return <ProductDetailClient slug={resolvedParams.slug} />;
}
