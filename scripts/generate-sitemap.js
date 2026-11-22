const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://techplus.pk';

function getFileDate(relPath, fallbackDate) {
  try {
    const full = path.join(__dirname, '..', relPath);
    if (fs.existsSync(full)) {
      return fs.statSync(full).mtime.toISOString().split('T')[0];
    }
  } catch (e) {}
  return fallbackDate || '2026-11-18';
}

async function generateSitemap() {
  console.log('🔄 Generating dynamic sitemap.xml with real timestamps and full catalogue...');

  let products = [];
  let categories = [];

  try {
    // 1. Read Supabase credentials from .env.local
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      let url = '';
      let key = '';
      for (const line of lines) {
        if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
        if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
      }

      if (url && key) {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(url, key);

        const [prodRes, catRes] = await Promise.all([
          supabase.from('products').select('slug, created_at').eq('is_active', true),
          supabase.from('categories').select('slug, created_at').eq('is_active', true),
        ]);

        if (prodRes.data && prodRes.data.length > 0) products = prodRes.data;
        if (catRes.data && catRes.data.length > 0) categories = catRes.data;
      }
    }
  } catch (err) {
    console.warn('⚠️ Note: Supabase fetch skipped in sitemap generator (using defaults):', err.message);
  }

  // Fallbacks if DB was empty/unreachable
  if (products.length === 0) {
    products = [
      { slug: '1078', updated_at: '2026-11-15' },
      { slug: 'cordless-drill-18v-bnktop-russian-brand-10mm', updated_at: '2026-11-20' },
      { slug: 'electric-drill-machine-drilling-machine-with-reverse-function-slow-fast-speed-electric-screw-driver-function-copper-copy', updated_at: '2026-11-18' },
      { slug: '6-inch-electric-drill-to-electric-chain-saw-adapter-home-portable-chainsaw-wood-plastic-metal-cutting-woodworking-trimming-tool', updated_at: '2026-11-17' },
      { slug: 'multi-function-plier', updated_at: '2026-11-16' },
      { slug: 'pure-copper-winding-710w-electric-drill-machine-13mm-hammer-impact-drill-machine-two-way-rotation-screw-driver-drill-machine-screwdriver-drill', updated_at: '2026-11-19' },
      { slug: 'professional-quality-26mm-rotary-hammer-hilti-drill-3-function-960w-pure-copper-winding', updated_at: '2026-11-19' },
    ];
  }

  if (categories.length === 0) {
    categories = [
      { slug: 'power-tools', updated_at: '2026-11-15' },
      { slug: 'drill-machines', updated_at: '2026-11-20' },
      { slug: 'tool-converters', updated_at: '2026-11-15' },
      { slug: 'cordless-power-tools', updated_at: '2026-11-20' },
      { slug: 'hand-tools', updated_at: '2026-11-16' },
      { slug: 'electrical', updated_at: '2026-11-14' },
      { slug: 'used-branded-tools', updated_at: '2026-11-14' },
    ];
  }

  // Ensure drill-machines is included
  if (!categories.find(c => c.slug === 'drill-machines')) {
    categories.push({ slug: 'drill-machines', updated_at: '2026-11-20' });
  }

  const currentDate = new Date().toISOString().split('T')[0];

  // Core Static Pages with real file modification dates
  const staticPages = [
    { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily', lastmod: getFileDate('app/page.tsx', currentDate) },
    { loc: `${BASE_URL}/shop`, priority: '0.9', changefreq: 'daily', lastmod: getFileDate('app/shop/page.tsx', currentDate) },
    { loc: `${BASE_URL}/services`, priority: '0.9', changefreq: 'weekly', lastmod: getFileDate('app/services/page.tsx', currentDate) },
    { loc: `${BASE_URL}/profile`, priority: '0.8', changefreq: 'monthly', lastmod: getFileDate('app/profile/page.tsx', '2026-10-27') },
    { loc: `${BASE_URL}/about-us`, priority: '0.6', changefreq: 'monthly', lastmod: getFileDate('app/about-us/page.tsx', '2026-10-25') },
    { loc: `${BASE_URL}/contact-us`, priority: '0.6', changefreq: 'monthly', lastmod: getFileDate('app/contact-us/page.tsx', '2026-10-25') },
    { loc: `${BASE_URL}/warranty-policy`, priority: '0.5', changefreq: 'monthly', lastmod: getFileDate('app/warranty-policy/page.tsx', '2026-10-25') },
    { loc: `${BASE_URL}/return-and-exchange-policy`, priority: '0.5', changefreq: 'monthly', lastmod: getFileDate('app/return-and-exchange-policy/page.tsx', '2026-10-25') },
    { loc: `${BASE_URL}/terms-of-service`, priority: '0.4', changefreq: 'monthly', lastmod: getFileDate('app/terms-of-service/page.tsx', '2026-10-25') },
    { loc: `${BASE_URL}/privacy-policy`, priority: '0.4', changefreq: 'monthly', lastmod: getFileDate('app/privacy-policy/page.tsx', '2026-10-25') },
  ];

  // Category URLs with real dates
  const categoryUrls = categories.map((c) => {
    const rawDate = c.updated_at || c.created_at || '2026-11-15';
    return {
      loc: `${BASE_URL}/shop/${c.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: rawDate.split('T')[0],
    };
  });

  // Product URLs with real dates
  const productUrls = products.map((p) => {
    const rawDate = p.updated_at || p.created_at || '2026-11-15';
    return {
      loc: `${BASE_URL}/product/${p.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: rawDate.split('T')[0],
    };
  });

  const allUrls = [...staticPages, ...categoryUrls, ...productUrls];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const publicSitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(publicSitemapPath, sitemapXml, 'utf8');
  console.log(`✅ Generated public/sitemap.xml with ${allUrls.length} total URLs (${products.length} products, ${categories.length} categories)`);
}

generateSitemap();
