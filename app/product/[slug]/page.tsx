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
  let cleanSnippet = product.short_description
    ? product.short_description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    : '';

  if (!cleanSnippet || cleanSnippet.toLowerCase() === 'description' || cleanSnippet.length < 20) {
    cleanSnippet = `${product.title} with pure copper build. Available with nationwide Cash on Delivery and open parcel inspection.`;
  }

  // Format: What it is + key spec + price (Audit Fix #9)
  const pageDescription = `Buy ${product.title} at ${formattedPrice}. ${cleanSnippet}`.slice(0, 158);
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
      { slug: 'pure-copper-winding-710w-electric-drill-machine-13mm-hammer-impact-drill-machine-two-way-rotation-screw-driver-drill-machine-screwdriver-drill' },
      { slug: 'professional-quality-26mm-rotary-hammer-hilti-drill-3-function-960w-pure-copper-winding' },
      { slug: 'electric-polisher-machine-with-reverse-function-slow-fast-speed-electric-screw-driver-function-copper' },
      { slug: '6-inch-electric-drill-to-electric-chain-saw-adapter-home-portable-chainsaw-wood-plastic-metal-cutting-woodworking-trimming-tool' },
      { slug: 'drill-to-saw-adapter-anti-slip-portable-light-auxiliary-handle-easy-assembly-saw-conversion-head-for-woodwork' },
      { slug: 'electric-drill-modified-to-reciprocating-saw-adapter-screwdriver-conversion-head-for-wood-metal-cutting-tool-with-saw-blade' },
      { slug: '10mm-electric-drill-conversion-angle-grinder-connecting-rod-for-cutting-disc-polishing-wheel-installation-adapter-accessories' },
      { slug: 'multi-function-plier' },
      { slug: 'universal-wire-cutter-diagonal-pliers-crimping-pliers-needle-nose-pliers-multifunctional-hardware-hand-tools-electrician' },
      { slug: 'angle-shear-45-degree-to-135-degree-miter-cutter-hand-shear-multifunctional-pvc-pe-plastic-pipe-scissors-with-replace-blades' },
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
  const product = await getProductBySlug(resolvedParams.slug);

  const productSchema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        image: [getProductShareImageUrl(product)],
        description:
          product.short_description &&
          product.short_description.trim() !== 'Description' &&
          product.short_description.trim() !== ''
            ? product.short_description.replace(/<[^>]*>/g, '').trim()
            : `${product.title} - Authentic industrial grade tool with 100% pure copper motor available at Techplus.pk.`,
        sku: product.sku || product.slug,
        brand: {
          '@type': 'Brand',
          name: 'Techplus',
        },
        offers: {
          '@type': 'Offer',
          url: `https://techplus.pk/product/${product.slug}`,
          priceCurrency: 'PKR',
          price: product.price,
          priceValidUntil: '2028-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability:
            product.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'Techplus.pk',
          },
        },
      }
    : null;

  const breadcrumbSchema = product
    ? {
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
            name: product.title,
            item: `https://techplus.pk/product/${product.slug}`,
          },
        ],
      }
    : null;

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <ProductDetailClient slug={resolvedParams.slug} initialProduct={product} />
    </>
  );
}
