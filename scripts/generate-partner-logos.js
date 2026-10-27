const fs = require('fs');
const path = require('path');

const partnersDir = path.join(__dirname, '..', 'public', 'images', 'partners');

const logos = {
  'huawei.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" fill="none">
    <g transform="translate(15, 6)">
      <!-- Huawei Petals Icon -->
      <path d="M22 28 C22 18, 16 12, 16 12 C16 12, 10 18, 10 28 Z" fill="#cf0a2c" />
      <path d="M22 28 C26 20, 24 14, 24 14 C24 14, 18 17, 16 26 Z" fill="#cf0a2c" opacity="0.9" />
      <path d="M10 28 C6 20, 8 14, 8 14 C8 14, 14 17, 16 26 Z" fill="#cf0a2c" opacity="0.9" />
      <path d="M22 28 C28 24, 29 18, 29 18 C29 18, 22 18, 18 26 Z" fill="#cf0a2c" opacity="0.8" />
      <path d="M10 28 C4 24, 3 18, 3 18 C3 18, 10 18, 14 26 Z" fill="#cf0a2c" opacity="0.8" />
    </g>
    <text x="55" y="36" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="20" fill="#cf0a2c" letter-spacing="3">HUAWEI</text>
  </svg>`,

  'lg.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60" fill="none">
    <circle cx="32" cy="30" r="20" fill="#a50034" />
    <path d="M25 20 v20 h14" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="26" cy="27" r="2.5" fill="#ffffff" />
    <text x="64" y="38" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="26" fill="#a50034" letter-spacing="1">LG</text>
  </svg>`,

  'hikvision.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" fill="none">
    <text x="10" y="38" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="22" fill="#d9241b" letter-spacing="1">HIK<tspan fill="#333333">VISION</tspan></text>
  </svg>`,

  'knox.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 60" fill="none">
    <rect x="10" y="14" width="32" height="32" rx="8" fill="#f59e0b" />
    <path d="M20 20 L32 40 M32 20 L20 40" stroke="#0f172a" stroke-width="4" stroke-linecap="round" />
    <text x="52" y="38" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="22" fill="#0f172a" letter-spacing="2">KNOX</text>
  </svg>`,

  'panasonic.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" fill="none">
    <text x="10" y="37" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="21" fill="#004098" letter-spacing="1">Panasonic</text>
  </svg>`,

  'dahua.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 60" fill="none">
    <text x="10" y="36" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="24" fill="#e30613" letter-spacing="1">alhua</text>
    <text x="10" y="47" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="8" fill="#555555" letter-spacing="2">TECHNOLOGY</text>
  </svg>`,

  'saj.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60" fill="none">
    <circle cx="28" cy="30" r="16" fill="#0284c7" />
    <path d="M22 25 L34 35 M22 35 L34 25" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" />
    <text x="54" y="38" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="24" fill="#0284c7" letter-spacing="2">SAJ</text>
  </svg>`,

  'tplink.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 60" fill="none">
    <g transform="translate(10, 16)">
      <circle cx="14" cy="14" r="12" stroke="#4acbd6" stroke-width="4" fill="none" stroke-dasharray="18 10" />
      <circle cx="14" cy="14" r="5" fill="#4acbd6" />
    </g>
    <text x="48" y="37" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="20" fill="#333333" letter-spacing="0.5">tp-link</text>
  </svg>`,

  'goodwe.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 60" fill="none">
    <circle cx="26" cy="30" r="14" fill="#d9232a" />
    <path d="M20 30 L25 35 L33 24" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <text x="48" y="37" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="21" fill="#d9232a" letter-spacing="1">GOODWE</text>
  </svg>`,

  'jinkosolar.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" fill="none">
    <g transform="translate(10, 15)">
      <path d="M6 24 C6 12 18 6 24 6 C24 18 18 24 6 24 Z" fill="#22c55e" />
      <circle cx="18" cy="10" r="3" fill="#ef4444" />
    </g>
    <text x="44" y="36" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="18" fill="#1e293b" letter-spacing="1">Jinko<tspan fill="#22c55e">Solar</tspan></text>
  </svg>`,
};

for (const [file, content] of Object.entries(logos)) {
  fs.writeFileSync(path.join(partnersDir, file), content.trim());
}

console.log('✅ Generated 10 partner logos in public/images/partners/');
