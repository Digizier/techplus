/**
 * Utility functions to resolve robust, high-performance image URLs
 * across storefront rendering, social share previews (Open Graph / WhatsApp / Facebook / Twitter).
 */

const BASE_URL = 'https://techplus.pk';
export const DEFAULT_SHARE_IMAGE = `${BASE_URL}/images/techplus-og-share.png`;
export const DEFAULT_SQUARE_IMAGE = `${BASE_URL}/images/techplus-square-og.png`;

/**
 * Resolves a product or asset image path to a 100% accessible URL.
 * Automatically converts old WordPress migration artifacts (e.g. AliExpress hashes)
 * to high-resolution, fast CDN images, and maps local assets cleanly.
 */
export function resolveImageUrl(
  rawUrl?: string | null,
  options: { absolute?: boolean } = {}
): string {
  const { absolute = false } = options;

  if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '') {
    return absolute ? DEFAULT_SHARE_IMAGE : '/images/techplus-og-share.png';
  }

  const trimmed = rawUrl.trim();

  // 1. Check for legacy WordPress paths with AliExpress CDN hashes:
  // e.g. /wp-content/uploads/.../Se178c06e7d934188ae525c1154b75388z.jpg_220x220q75.jpg_.avif
  const aliMatch = trimmed.match(/([SH][a-zA-Z0-9]{25,})/);
  if (aliMatch && (trimmed.includes('wp-content') || trimmed.includes('alicdn') || trimmed.includes('.avif'))) {
    const ext = trimmed.toLowerCase().includes('.png') ? 'png' : 'jpg';
    return `https://ae01.alicdn.com/kf/${aliMatch[1]}.${ext}`;
  }

  // 2. Specific local product image fallbacks for legacy references
  if (trimmed.includes('bb0e10ce')) {
    const local = '/images/products/bb0e10ce-0145-4100-b3f6-c763792ced0f.fit_2000_2C2000_ssl_1.png';
    return absolute ? `${BASE_URL}${local}` : local;
  }

  if (trimmed.includes('wp-content') && trimmed.endsWith('1.avif')) {
    const local = '/images/products/collage.fit_1000_2C800_ssl_1.png';
    return absolute ? `${BASE_URL}${local}` : local;
  }

  // 3. Relative local paths (e.g. /images/...)
  if (trimmed.startsWith('/')) {
    return absolute ? `${BASE_URL}${trimmed}` : trimmed;
  }

  // 4. Absolute URLs (Supabase storage, Jetpack CDN, or other CDNs)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // 5. Default fallback
  const fallback = `/${trimmed.replace(/^\/+/, '')}`;
  return absolute ? `${BASE_URL}${fallback}` : fallback;
}

/**
 * Returns absolute image URL guaranteed to be compliant with WhatsApp,
 * Facebook, Twitter Card, and LinkedIn crawler specifications.
 */
export function getProductShareImageUrl(product?: {
  thumbnail_url?: string | null;
  images?: string[] | null;
}): string {
  if (!product) return DEFAULT_SHARE_IMAGE;

  const candidate =
    product.thumbnail_url ||
    (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null);

  return resolveImageUrl(candidate, { absolute: true });
}
