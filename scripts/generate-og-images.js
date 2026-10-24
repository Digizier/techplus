const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createOgImages() {
  const logoPath = path.join(__dirname, '..', 'public', 'images', 'logo.png');
  if (!fs.existsSync(logoPath)) {
    throw new Error('Logo file not found at ' + logoPath);
  }

  // 1. Generate 1200 x 630 Landscape Card (WhatsApp Large Preview, Facebook, Twitter, LinkedIn)
  const width = 1200;
  const height = 630;

  const logoBuffer = await sharp(logoPath)
    .resize(360, null, { fit: 'inside' })
    .toBuffer();

  const logoMeta = await sharp(logoBuffer).metadata();
  const logoX = Math.round((width - logoMeta.width) / 2);
  const logoY = 100;

  const landscapeSvg = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="100%" stop-color="#F8FAFC" />
        </linearGradient>
        <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#F59E0B" />
          <stop offset="100%" stop-color="#D97706" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)" />
      <rect x="0" y="0" width="${width}" height="10" fill="url(#brandGrad)" />

      <g transform="translate(${(width - 400) / 2}, 385)">
        <rect width="400" height="44" rx="22" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5" />
        <text x="200" y="28" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="bold" fill="#B45309" text-anchor="middle">
          ★ PAKISTAN'S POWER TOOLS &amp; SPARES
        </text>
      </g>

      <text x="${width / 2}" y="475" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="36" font-weight="800" fill="#0F172A" text-anchor="middle" letter-spacing="-0.5">
        Heavy Duty Tools, Converters &amp; Repair Services
      </text>

      <text x="${width / 2}" y="525" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="20" font-weight="500" fill="#64748B" text-anchor="middle">
        100% Copper Winding &#8226; Fast Delivery Nationwide &#8226; Official Warranty
      </text>

      <rect x="0" y="${height - 4}" width="${width}" height="4" fill="#E2E8F0" />
    </svg>
  `);

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([
    { input: landscapeSvg, top: 0, left: 0 },
    { input: logoBuffer, top: logoY, left: logoX }
  ])
  .png({ quality: 90, compressionLevel: 8 })
  .toFile(path.join(__dirname, '..', 'public', 'images', 'techplus-og-share.png'));

  console.log('✅ Generated public/images/techplus-og-share.png (1200x630)');

  // 2. Generate 800 x 800 Square Card (WhatsApp Square Thumbnail & Chat Card)
  const sqSize = 800;
  const sqLogoBuffer = await sharp(logoPath)
    .resize(440, null, { fit: 'inside' })
    .toBuffer();
  const sqLogoMeta = await sharp(sqLogoBuffer).metadata();
  const sqLogoX = Math.round((sqSize - sqLogoMeta.width) / 2);
  const sqLogoY = 160;

  const sqSvg = Buffer.from(`
    <svg width="${sqSize}" height="${sqSize}" viewBox="0 0 ${sqSize} ${sqSize}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${sqSize}" height="${sqSize}" fill="#FFFFFF" />
      <rect x="0" y="0" width="${sqSize}" height="10" fill="#F59E0B" />
      <g transform="translate(${(sqSize - 340) / 2}, 530)">
        <rect width="340" height="44" rx="22" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5" />
        <text x="170" y="28" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="bold" fill="#B45309" text-anchor="middle">
          POWER TOOLS &amp; SPARES
        </text>
      </g>
      <text x="${sqSize / 2}" y="625" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="28" font-weight="800" fill="#0F172A" text-anchor="middle">
        techplus.pk
      </text>
      <text x="${sqSize / 2}" y="670" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="18" font-weight="500" fill="#64748B" text-anchor="middle">
        Nationwide Delivery &#8226; 0323 5538700
      </text>
    </svg>
  `);

  await sharp({
    create: {
      width: sqSize,
      height: sqSize,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([
    { input: sqSvg, top: 0, left: 0 },
    { input: sqLogoBuffer, top: sqLogoY, left: sqLogoX }
  ])
  .png({ quality: 90, compressionLevel: 8 })
  .toFile(path.join(__dirname, '..', 'public', 'images', 'techplus-square-og.png'));

  console.log('✅ Generated public/images/techplus-square-og.png (800x800)');
}

createOgImages().catch(console.error);
