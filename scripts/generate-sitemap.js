const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://techplus.pk';

async function generateSitemap() {
  console.log('🔄 Generating dynamic sitemap.xml...');

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

        if (prodRes.data) products = prodRes.data;
        if (catRes.data) categories = catRes.data;
      }
    }
  } catch (err) {
    console.warn('⚠️ Note: Supabase fetch skipped in sitemap generator (using defaults):', err.message);
  }

  // Fallbacks if DB was empty/unreachable
  if (products.length === 0) {
    products = [
      { slug: '1078' },
      { slug: 'cordless-drill-18v-bnktop-russian-brand-10mm' },
      { slug: 'electric-drill-machine-drilling-machine-with-reverse-function-slow-fast-speed-electric-screw-driver-function-copper-copy' },
      { slug: '6-inch-electric-drill-to-electric-chain-saw-adapter-home-portable-chainsaw-wood-plastic-metal-cutting-woodworking-trimming-tool' },
      { slug: 'multi-function-plier' },
    ];
  }

  if (categories.length === 0) {
    categories = [
      { slug: 'power-tools' },
      { slug: 'tool-converters' },
      { slug: 'cordless-power-tools' },
      { slug: 'hand-tools' },
      { slug: 'electrical' },
      { slug: 'used-branded-tools' },
    ];
  }

  const currentDate = new Date().toISOString().split('T')[0];

  // Core Static Pages
  const staticPages = [
    { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${BASE_URL}/shop`, priority: '0.9', changefreq: 'daily' },
    { loc: `${BASE_URL}/services`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${BASE_URL}/about-us`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${BASE_URL}/contact-us`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${BASE_URL}/warranty-policy`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${BASE_URL}/return-and-exchange-policy`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${BASE_URL}/terms-of-service`, priority: '0.4', changefreq: 'monthly' },
    { loc: `${BASE_URL}/privacy-policy`, priority: '0.4', changefreq: 'monthly' },
  ];

  // Category URLs
  const categoryUrls = categories.map((c) => ({
    loc: `${BASE_URL}/shop/${c.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: c.created_at ? c.created_at.split('T')[0] : currentDate,
  }));

  // Product URLs
  const productUrls = products.map((p) => ({
    loc: `${BASE_URL}/product/${p.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: p.created_at ? p.created_at.split('T')[0] : currentDate,
  }));

  const allUrls = [...staticPages, ...categoryUrls, ...productUrls];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod || currentDate}</lastmod>
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

generateSitemap().catch(console.error);
