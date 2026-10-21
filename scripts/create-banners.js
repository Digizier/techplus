const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const bannerDir = path.join(__dirname, '..', 'public', 'images', 'banners');
if (!fs.existsSync(bannerDir)) fs.mkdirSync(bannerDir, { recursive: true });

// Read local product image as base64 for embedding in banner
function getBase64Img(relPath) {
  const fullPath = path.join(__dirname, '..', 'public', relPath);
  if (fs.existsSync(fullPath)) {
    const ext = path.extname(fullPath).replace('.', '');
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
    return `data:${mime};base64,${fs.readFileSync(fullPath).toString('base64')}`;
  }
  return '';
}

const drillImg = getBase64Img('images/products/21v-bnktop.fit_2000_2C1500_ssl_1.png');
const converterImg = getBase64Img('images/products/Polish_20201014_203208731-removebg-preview.fit_500_2C500_ssl_1.png');
const acImg = getBase64Img('images/products/AC-services.fit_275_2C183_ssl_1.jpeg');
const logoImg = getBase64Img('images/logo.png');

// 1. BANNER 1: Power Tools & Cordless Drills
const banner1Svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 640" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0f1d" />
      <stop offset="50%" stop-color="#111827" />
      <stop offset="100%" stop-color="#030712" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#fbbf24" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="30" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1920" height="640" fill="url(#bgGrad1)" />
  
  <!-- Subtle Industrial Grid / Geometric Accents -->
  <circle cx="1600" cy="320" r="380" fill="#f59e0b" opacity="0.08" filter="url(#glow)" />
  <circle cx="200" cy="50" r="220" fill="#f59e0b" opacity="0.04" />
  <rect x="0" y="625" width="1920" height="15" fill="url(#goldGrad)" />

  <!-- Left Content (Visual typography inside image) -->
  <g transform="translate(100, 100)">
    <!-- Brand / Tag -->
    <rect x="0" y="0" width="340" height="42" rx="21" fill="#f59e0b" opacity="0.2" />
    <rect x="1" y="1" width="338" height="40" rx="20" stroke="#f59e0b" stroke-width="1.5" fill="none" />
    <text x="25" y="27" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="16" font-weight="900" letter-spacing="2">★ 100% PURE COPPER MOTORS</text>

    <!-- Main Headline -->
    <text x="0" y="125" fill="#ffffff" font-family="system-ui, sans-serif" font-size="64" font-weight="900" letter-spacing="-1">HEAVY DUTY POWER TOOLS</text>
    <text x="0" y="200" fill="url(#goldGrad)" font-family="system-ui, sans-serif" font-size="60" font-weight="900" letter-spacing="-1">&amp; CORDLESS DRILL KITS</text>

    <!-- Subtitle description -->
    <text x="0" y="265" fill="#9ca3af" font-family="system-ui, sans-serif" font-size="22" font-weight="500">21V Lithium-Ion Technology • High Torque Armature • Industrial Durability</text>
    <text x="0" y="305" fill="#d1d5db" font-family="system-ui, sans-serif" font-size="20" font-weight="700">⚡ FREE DELIVERY IN ISLAMABAD &amp; RAWALPINDI ON ORDERS ABOVE RS. 3,500</text>

    <!-- CTA Graphic Button inside the image -->
    <g transform="translate(0, 360)">
      <rect width="250" height="60" rx="16" fill="url(#goldGrad)" />
      <text x="125" y="38" fill="#090d16" font-family="system-ui, sans-serif" font-size="20" font-weight="900" text-anchor="middle">SHOP NOW →</text>
    </g>

    <!-- Trust Badges -->
    <g transform="translate(280, 375)">
      <text x="0" y="16" fill="#10b981" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">✓ 7-Day Replacement Warranty</text>
      <text x="0" y="38" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14">Cash on Delivery across Pakistan</text>
    </g>
  </g>

  <!-- Right Image / Tool Illustration -->
  <g transform="translate(1150, 40)">
    <circle cx="340" cy="280" r="260" fill="#ffffff" opacity="0.04" />
    <circle cx="340" cy="280" r="210" fill="#f59e0b" opacity="0.07" />
    ${drillImg ? `<image href="${drillImg}" x="40" y="20" width="600" height="520" preserveAspectRatio="xMidYMid meet" />` : ''}
  </g>
</svg>
`;

// 2. BANNER 2: Chainsaw & Saw Converters
const banner2Svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 640" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#180c05" />
      <stop offset="50%" stop-color="#1c1917" />
      <stop offset="100%" stop-color="#0c0a09" />
    </linearGradient>
    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f97316" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
  </defs>

  <rect width="1920" height="640" fill="url(#bgGrad2)" />
  <circle cx="1650" cy="300" r="350" fill="#f97316" opacity="0.1" />
  <rect x="0" y="625" width="1920" height="15" fill="url(#orangeGrad)" />

  <g transform="translate(100, 100)">
    <!-- Discount Pill -->
    <rect x="0" y="0" width="310" height="42" rx="21" fill="#dc2626" opacity="0.25" />
    <rect x="1" y="1" width="308" height="40" rx="20" stroke="#ef4444" stroke-width="1.5" fill="none" />
    <text x="25" y="27" fill="#f87171" font-family="system-ui, sans-serif" font-size="16" font-weight="900" letter-spacing="2">🔥 FLASH SALE: 30% OFF</text>

    <text x="0" y="125" fill="#ffffff" font-family="system-ui, sans-serif" font-size="64" font-weight="900" letter-spacing="-1">DRILL TO CHAINSAW</text>
    <text x="0" y="200" fill="url(#orangeGrad)" font-family="system-ui, sans-serif" font-size="60" font-weight="900" letter-spacing="-1">CONVERTER ADAPTERS</text>

    <text x="0" y="265" fill="#a8a29e" font-family="system-ui, sans-serif" font-size="22" font-weight="500">Transform any electric or cordless drill into a portable high-speed saw</text>
    
    <!-- Price Badge -->
    <g transform="translate(0, 290)">
      <text x="0" y="40" fill="#ef4444" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" text-decoration="line-through">Rs. 3,500</text>
      <text x="160" y="40" fill="#22c55e" font-family="system-ui, sans-serif" font-size="44" font-weight="900">Rs. 2,499 ONLY</text>
    </g>

    <g transform="translate(0, 365)">
      <rect width="250" height="60" rx="16" fill="url(#orangeGrad)" />
      <text x="125" y="38" fill="#0c0a09" font-family="system-ui, sans-serif" font-size="20" font-weight="900" text-anchor="middle">VIEW DEALS →</text>
    </g>

    <g transform="translate(280, 380)">
      <text x="0" y="16" fill="#f59e0b" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">✓ Multi-Material Cutting (Wood/PVC/Metal)</text>
      <text x="0" y="38" fill="#a8a29e" font-family="system-ui, sans-serif" font-size="14">Complete Kit with Chains &amp; Guide Bar Included</text>
    </g>
  </g>

  <g transform="translate(1150, 40)">
    <circle cx="340" cy="280" r="230" fill="#f97316" opacity="0.08" />
    ${converterImg ? `<image href="${converterImg}" x="50" y="30" width="580" height="500" preserveAspectRatio="xMidYMid meet" />` : ''}
  </g>
</svg>
`;

// 3. BANNER 3: AC Service & Solar Installation
const banner3Svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 640" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#022c22" />
      <stop offset="50%" stop-color="#064e3b" />
      <stop offset="100%" stop-color="#021f18" />
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>
  </defs>

  <rect width="1920" height="640" fill="url(#bgGrad3)" />
  <circle cx="1600" cy="300" r="320" fill="#10b981" opacity="0.12" />
  <rect x="0" y="625" width="1920" height="15" fill="url(#emeraldGrad)" />

  <g transform="translate(100, 100)">
    <rect x="0" y="0" width="370" height="42" rx="21" fill="#10b981" opacity="0.25" />
    <rect x="1" y="1" width="368" height="40" rx="20" stroke="#34d399" stroke-width="1.5" fill="none" />
    <text x="25" y="27" fill="#6ee7b7" font-family="system-ui, sans-serif" font-size="16" font-weight="900" letter-spacing="2">❄️ ISLAMABAD &amp; RAWALPINDI</text>

    <text x="0" y="125" fill="#ffffff" font-family="system-ui, sans-serif" font-size="64" font-weight="900" letter-spacing="-1">AC WATER-GUN SERVICE</text>
    <text x="0" y="200" fill="url(#emeraldGrad)" font-family="system-ui, sans-serif" font-size="60" font-weight="900" letter-spacing="-1">&amp; SOLAR INSTALLATION</text>

    <text x="0" y="265" fill="#a7f3d0" font-family="system-ui, sans-serif" font-size="22" font-weight="500">Certified GoodWe Solar Inverters &amp; Master AC Deep Pressure Cleaning</text>
    <text x="0" y="305" fill="#ecfdf5" font-family="system-ui, sans-serif" font-size="20" font-weight="700">📞 HELPLINE &amp; WHATSAPP APPOINTMENT: 0323-5538700</text>

    <g transform="translate(0, 360)">
      <rect width="260" height="60" rx="16" fill="url(#emeraldGrad)" />
      <text x="130" y="38" fill="#022c22" font-family="system-ui, sans-serif" font-size="20" font-weight="900" text-anchor="middle">BOOK SERVICE →</text>
    </g>

    <g transform="translate(290, 375)">
      <text x="0" y="16" fill="#6ee7b7" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">✓ Doorstep Technician Within 2 Hours</text>
      <text x="0" y="38" fill="#a7f3d0" font-family="system-ui, sans-serif" font-size="14">Shop 07-B Chinar Plaza, G-6/1-1, Islamabad</text>
    </g>
  </g>

  <g transform="translate(1200, 60)">
    <circle cx="280" cy="250" r="220" fill="#10b981" opacity="0.1" />
    ${acImg ? `<image href="${acImg}" x="30" y="20" width="520" height="460" preserveAspectRatio="xMidYMid meet" />` : ''}
  </g>
</svg>
`;

fs.writeFileSync(path.join(bannerDir, 'banner-1.svg'), banner1Svg.trim());
fs.writeFileSync(path.join(bannerDir, 'banner-2.svg'), banner2Svg.trim());
fs.writeFileSync(path.join(bannerDir, 'banner-3.svg'), banner3Svg.trim());
console.log('Created 3 SVG banners in public/images/banners/');

// Now insert these 3 banners into Supabase
async function insertBannersToDB() {
  const client = new Client({
    user: 'postgres.zmwkntfflkmumuwyhmjj',
    password: 'i9p4Vk?zU9.qYai',
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  const newBanners = [
    {
      desktop: '/images/banners/banner-1.svg',
      link: '/shop/power-tools',
      order: 1
    },
    {
      desktop: '/images/banners/banner-2.svg',
      link: '/shop/tool-converters',
      order: 2
    },
    {
      desktop: '/images/banners/banner-3.svg',
      link: '/services',
      order: 3
    }
  ];

  for (const b of newBanners) {
    await client.query(`
      INSERT INTO public.banners (desktop_image_url, mobile_image_url, link_url, display_order, is_active)
      VALUES ($1, $1, $2, $3, true);
    `, [b.desktop, b.link, b.order]);
  }

  console.log('Inserted 3 banners into Supabase banners table!');
  await client.end();
}

insertBannersToDB().catch(console.error);
