import type { Metadata } from 'next';
import React from 'react';
import { getAllProductSlugs, getProductBySlug } from '@/lib/db';
import { getProductShareImageUrl } from '@/lib/image-utils';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    return {
      title: 'Product Not Found | Techplus.pk',
      description: 'Find heavy duty power tools, drill converters, and genuine spare parts at Techplus.pk',
    };
  }

  const shareImageUrl = getProductShareImageUrl(product);
  const formattedPrice = `Rs. ${product.price.toLocaleString()}`;
  const cleanSnippet =
    product.short_description &&
    product.short_description.trim() !== 'Description' &&
    product.short_description.trim() !== ''
      ? product.short_description.replace(/<[^>]*>/g, '').trim()
      : 'Shop genuine copper winding power tools, chainsaw converters & spare parts with nationwide cash on delivery across Pakistan.';
  const pageDescription = `${formattedPrice} - ${cleanSnippet}`;
  const pageUrl = `https://techplus.pk/product/${product.slug}`;

  return {
    title: `${product.title} | Techplus.pk`,
    description: pageDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${product.title} | Techplus.pk`,
      description: pageDescription,
      url: pageUrl,
      siteName: 'Techplus.pk',
      type: 'website',
      images: [
        {
          url: shareImageUrl,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | Techplus.pk`,
      description: pageDescription,
      images: [shareImageUrl],
    },
  };
}

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
