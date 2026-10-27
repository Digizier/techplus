const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, '..', 'public', 'images', 'services');

const serviceGraphics = {
  'solar-installation.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none">
    <defs>
      <linearGradient id="sol-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
      <linearGradient id="sol-panel" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0284c7"/>
        <stop offset="100%" stop-color="#0369a1"/>
      </linearGradient>
      <linearGradient id="sol-sun" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" rx="24" fill="url(#sol-bg)"/>
    <!-- Sun -->
    <circle cx="480" cy="100" r="50" fill="url(#sol-sun)" opacity="0.9"/>
    <circle cx="480" cy="100" r="68" stroke="#f59e0b" stroke-width="2" stroke-dasharray="8 6" opacity="0.4"/>
    <!-- Roof outline -->
    <path d="M60 280 L300 170 L540 280" stroke="#475569" stroke-width="8" stroke-linecap="round"/>
    <path d="M60 280 L60 360 L540 360 L540 280 Z" fill="#1e293b" opacity="0.7"/>
    <!-- Solar Panels Array -->
    <g transform="translate(130, 200) skewY(-8) scale(0.9)">
      <!-- Panel 1 -->
      <polygon points="0,40 100,0 130,70 30,110" fill="url(#sol-panel)" stroke="#38bdf8" stroke-width="2"/>
      <line x1="50" y1="20" x2="80" y2="90" stroke="#bae6fd" stroke-width="1.5"/>
      <line x1="15" y1="75" x2="115" y2="35" stroke="#bae6fd" stroke-width="1.5"/>
      <!-- Panel 2 -->
      <polygon points="110,0 210,-40 240,30 140,70" fill="url(#sol-panel)" stroke="#38bdf8" stroke-width="2"/>
      <line x1="160" y1="-20" x2="190" y2="50" stroke="#bae6fd" stroke-width="1.5"/>
      <line x1="125" y1="35" x2="225" y2="-5" stroke="#bae6fd" stroke-width="1.5"/>
      <!-- Panel 3 -->
      <polygon points="220,-40 320,-80 350,-10 250,30" fill="url(#sol-panel)" stroke="#38bdf8" stroke-width="2"/>
      <line x1="270" y1="-60" x2="300" y2="10" stroke="#bae6fd" stroke-width="1.5"/>
      <line x1="235" y1="-5" x2="335" y2="-45" stroke="#bae6fd" stroke-width="1.5"/>
    </g>
    <!-- Inverter box -->
    <rect x="100" y="270" width="70" height="70" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="110" y="280" width="50" height="25" rx="4" fill="#0f172a"/>
    <text x="116" y="297" font-family="monospace" font-size="11" fill="#22c55e" font-weight="bold">5.2 kW</text>
    <circle cx="125" cy="322" r="4" fill="#22c55e"/>
    <circle cx="145" cy="322" r="4" fill="#f59e0b"/>
    <!-- Badge -->
    <rect x="360" y="310" width="180" height="38" rx="19" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="380" y="334" font-family="sans-serif" font-size="12" fill="#fbbf24" font-weight="bold">Since 2018 EPC Net-Metering</text>
  </svg>`,

  'electrical-services.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none">
    <defs>
      <linearGradient id="elec-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090d16"/>
        <stop offset="100%" stop-color="#1e1e2d"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" rx="24" fill="url(#elec-bg)"/>
    <!-- DB Panel box -->
    <rect x="70" y="70" width="260" height="260" rx="16" fill="#1e293b" stroke="#334155" stroke-width="4"/>
    <rect x="85" y="85" width="230" height="230" rx="10" fill="#0f172a"/>
    <!-- DIN Rail Breakers -->
    <rect x="100" y="110" width="200" height="50" rx="6" fill="#334155"/>
    <rect x="105" y="115" width="26" height="40" rx="4" fill="#f1f5f9"/>
    <line x1="118" y1="120" x2="118" y2="135" stroke="#ef4444" stroke-width="4"/>
    <rect x="135" y="115" width="26" height="40" rx="4" fill="#f1f5f9"/>
    <line x1="148" y1="120" x2="148" y2="135" stroke="#ef4444" stroke-width="4"/>
    <rect x="165" y="115" width="26" height="40" rx="4" fill="#f1f5f9"/>
    <line x1="178" y1="130" x2="178" y2="145" stroke="#22c55e" stroke-width="4"/>
    <rect x="195" y="115" width="26" height="40" rx="4" fill="#f1f5f9"/>
    <line x1="208" y1="130" x2="208" y2="145" stroke="#22c55e" stroke-width="4"/>
    <rect x="225" y="115" width="26" height="40" rx="4" fill="#f1f5f9"/>
    <line x1="238" y1="130" x2="238" y2="145" stroke="#22c55e" stroke-width="4"/>
    <rect x="255" y="115" width="35" height="40" rx="4" fill="#d97706"/>
    <!-- Copper wires -->
    <path d="M118 160 C118 200, 160 220, 200 240" stroke="#ef4444" stroke-width="3" fill="none"/>
    <path d="M148 160 C148 190, 190 220, 230 240" stroke="#f59e0b" stroke-width="3" fill="none"/>
    <path d="M178 160 C178 180, 220 220, 260 240" stroke="#3b82f6" stroke-width="3" fill="none"/>
    <!-- Digital Multimeter -->
    <g transform="translate(370, 90)">
      <rect x="0" y="0" width="160" height="230" rx="18" fill="#f59e0b" stroke="#d97706" stroke-width="3"/>
      <rect x="14" y="20" width="132" height="60" rx="8" fill="#0f172a"/>
      <text x="32" y="58" font-family="monospace" font-size="28" fill="#4ade80" font-weight="900">232.4 V</text>
      <!-- Dial -->
      <circle cx="80" cy="130" r="32" fill="#1e293b"/>
      <line x1="80" y1="130" x2="96" y2="114" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
      <!-- Probes -->
      <path d="M40 230 C40 280, 0 300, -20 270" stroke="#ef4444" stroke-width="5" fill="none"/>
      <path d="M120 230 C120 280, 160 300, 180 270" stroke="#0f172a" stroke-width="5" fill="none"/>
    </g>
    <!-- 20+ Years Stamp -->
    <circle cx="480" cy="330" r="36" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
    <text x="458" y="328" font-family="sans-serif" font-size="16" fill="#f59e0b" font-weight="900">20+</text>
    <text x="455" y="344" font-family="sans-serif" font-size="9" fill="#e2e8f0" font-weight="bold">YEARS EXP</text>
  </svg>`,

  'air-conditioning.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none">
    <defs>
      <linearGradient id="ac-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#082f49"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" rx="24" fill="url(#ac-bg)"/>
    <!-- Indoor Split AC Unit -->
    <g transform="translate(60, 70)">
      <rect x="0" y="0" width="340" height="110" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
      <!-- Air Louver Vents -->
      <rect x="15" y="78" width="310" height="18" rx="6" fill="#f1f5f9"/>
      <!-- Digital display -->
      <circle cx="280" cy="45" r="16" fill="#0f172a"/>
      <text x="272" y="50" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="900">18°</text>
      <!-- Cold Airflow waves -->
      <path d="M40 110 Q60 160, 40 210" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 4" opacity="0.8"/>
      <path d="M120 110 Q150 160, 130 210" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 4" opacity="0.8"/>
      <path d="M200 110 Q230 160, 210 210" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 4" opacity="0.8"/>
      <path d="M280 110 Q300 160, 290 210" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 4" opacity="0.8"/>
    </g>
    <!-- Outdoor Compressor Unit -->
    <g transform="translate(360, 190)">
      <rect x="0" y="0" width="180" height="150" rx="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="3"/>
      <!-- Fan grill -->
      <circle cx="90" cy="75" r="48" fill="#e2e8f0" stroke="#64748b" stroke-width="3"/>
      <line x1="90" y1="27" x2="90" y2="123" stroke="#64748b" stroke-width="2"/>
      <line x1="42" y1="75" x2="138" y2="75" stroke="#64748b" stroke-width="2"/>
      <circle cx="90" cy="75" r="14" fill="#0f172a"/>
      <!-- Brand badge on outdoor -->
      <rect x="15" y="15" width="45" height="14" rx="3" fill="#0284c7"/>
      <text x="20" y="25" font-family="sans-serif" font-size="8" fill="#ffffff" font-weight="bold">INVERTER</text>
    </g>
    <!-- High-Pressure Chemical Wash Gun & Gauge -->
    <g transform="translate(90, 240)">
      <rect x="0" y="0" width="170" height="75" rx="12" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="14" y="28" font-family="sans-serif" font-size="11" fill="#f59e0b" font-weight="bold">Master Chemical Wash</text>
      <text x="14" y="48" font-family="sans-serif" font-size="10" fill="#94a3b8">• High Pressure Gun</text>
      <text x="14" y="63" font-family="sans-serif" font-size="10" fill="#94a3b8">• R410A / R32 Gas Refill</text>
    </g>
  </svg>`,

  'plumbing-core-cutting.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none">
    <defs>
      <linearGradient id="plumb-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" rx="24" fill="url(#plumb-bg)"/>
    <!-- Concrete Wall representation for Core Cutting -->
    <rect x="60" y="60" width="200" height="280" rx="12" fill="#334155" stroke="#475569" stroke-width="3"/>
    <!-- Diamond Core Hole -->
    <circle cx="160" cy="180" r="55" fill="#0f172a" stroke="#f59e0b" stroke-width="4" stroke-dasharray="10 5"/>
    <text x="122" y="185" font-family="sans-serif" font-size="12" fill="#f59e0b" font-weight="900">CORE CUT 4"</text>
    <text x="110" y="200" font-family="sans-serif" font-size="9" fill="#94a3b8">Zero Structural Crack</text>
    <!-- Diamond Core Cutting Rig Drill -->
    <g transform="translate(300, 70)">
      <!-- Drill stand column -->
      <rect x="80" y="10" width="16" height="240" fill="#f59e0b"/>
      <!-- Motor housing -->
      <rect x="30" y="70" width="70" height="90" rx="8" fill="#1e293b" stroke="#cbd5e1" stroke-width="2"/>
      <rect x="40" y="80" width="50" height="30" rx="4" fill="#0284c7"/>
      <!-- Diamond Core Bit cylinder -->
      <rect x="-40" y="100" width="80" height="35" rx="3" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/>
      <line x1="-40" y1="100" x2="-40" y2="135" stroke="#f59e0b" stroke-width="4"/>
      <!-- Heavy Base plate -->
      <rect x="20" y="240" width="140" height="20" rx="4" fill="#475569"/>
    </g>
    <!-- PPRC / Sanitary Pipes -->
    <g transform="translate(340, 280)">
      <rect x="0" y="10" width="180" height="24" rx="4" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
      <circle cx="90" cy="22" r="14" fill="#ef4444"/>
      <text x="12" y="55" font-family="sans-serif" font-size="11" fill="#e2e8f0" font-weight="bold">PPRC & CPVC Sanitary Piping</text>
    </g>
  </svg>`,

  'cctv-biometric.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none">
    <defs>
      <linearGradient id="cctv-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#020617"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" rx="24" fill="url(#cctv-bg)"/>
    <!-- Hikvision/Dahua Bullet Camera -->
    <g transform="translate(80, 80)">
      <!-- Mount bracket -->
      <rect x="10" y="12" width="20" height="60" rx="4" fill="#475569"/>
      <path d="M30 42 L70 42" stroke="#475569" stroke-width="12" stroke-linecap="round"/>
      <!-- Camera Cylinder Body -->
      <rect x="70" y="15" width="140" height="60" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <!-- Sunshield -->
      <path d="M60 12 L220 12 L200 24 L60 24 Z" fill="#334155"/>
      <!-- Lens -->
      <circle cx="210" cy="45" r="24" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
      <circle cx="210" cy="45" r="10" fill="#1e293b"/>
      <circle cx="210" cy="45" r="3" fill="#ef4444"/>
      <!-- IR LEDs ring -->
      <circle cx="210" cy="45" r="18" stroke="#ef4444" stroke-width="1" stroke-dasharray="3 3"/>
      <!-- Field of view cone -->
      <polygon points="230,45 360,0 360,110" fill="#38bdf8" opacity="0.12"/>
    </g>
    <!-- Biometric Time Attendance Machine -->
    <g transform="translate(350, 90)">
      <rect x="0" y="0" width="180" height="230" rx="16" fill="#1e293b" stroke="#334155" stroke-width="3"/>
      <!-- Screen -->
      <rect x="20" y="20" width="140" height="80" rx="8" fill="#0f172a"/>
      <circle cx="50" cy="55" r="18" fill="#334155"/>
      <text x="80" y="50" font-family="sans-serif" font-size="11" fill="#4ade80" font-weight="bold">Verified ID</text>
      <text x="80" y="68" font-family="sans-serif" font-size="10" fill="#94a3b8">09:00:15 AM</text>
      <!-- Fingerprint optical scanner -->
      <rect x="55" y="125" width="70" height="70" rx="10" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
      <!-- Fingerprint pattern -->
      <path d="M75 160 C75 145, 105 145, 105 160 C105 175, 80 180, 90 190" stroke="#bae6fd" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M83 160 C83 150, 97 150, 97 160" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>
    <!-- Mobile App Streaming Icon -->
    <g transform="translate(80, 230)">
      <rect x="0" y="0" width="220" height="80" rx="12" fill="#1e293b" stroke="#0284c7" stroke-width="1.5"/>
      <text x="18" y="32" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="bold">HD 24/7 Remote Live View</text>
      <text x="18" y="52" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Mobile App Access anywhere</text>
      <text x="18" y="68" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Face & Fingerprint Attendance Sync</text>
    </g>
  </svg>`,

  'pabx-networking.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none">
    <defs>
      <linearGradient id="net-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090d16"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" rx="24" fill="url(#net-bg)"/>
    <!-- Server Rack Cabinet -->
    <g transform="translate(70, 60)">
      <rect x="0" y="0" width="220" height="280" rx="14" fill="#0f172a" stroke="#475569" stroke-width="3"/>
      <!-- Rack Rails -->
      <line x1="20" y1="15" x2="20" y2="265" stroke="#334155" stroke-width="2" stroke-dasharray="6 4"/>
      <line x1="200" y1="15" x2="200" y2="265" stroke="#334155" stroke-width="2" stroke-dasharray="6 4"/>
      <!-- 1U Patch Panel -->
      <rect x="25" y="25" width="170" height="30" rx="4" fill="#1e293b" stroke="#334155"/>
      <circle cx="45" cy="40" r="3" fill="#22c55e"/>
      <circle cx="65" cy="40" r="3" fill="#22c55e"/>
      <circle cx="85" cy="40" r="3" fill="#22c55e"/>
      <circle cx="105" cy="40" r="3" fill="#22c55e"/>
      <circle cx="125" cy="40" r="3" fill="#f59e0b"/>
      <circle cx="145" cy="40" r="3" fill="#22c55e"/>
      <!-- 24-Port Switch -->
      <rect x="25" y="65" width="170" height="35" rx="4" fill="#1e293b" stroke="#0284c7"/>
      <!-- Gigabit blinking LEDs -->
      <line x1="35" y1="78" x2="185" y2="78" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 4"/>
      <line x1="35" y1="88" x2="185" y2="88" stroke="#4ade80" stroke-width="2" stroke-dasharray="4 4"/>
      <!-- Cable Management D-Rings with Cat6 colored cables -->
      <path d="M45 110 C45 170, 90 190, 110 220" stroke="#3b82f6" stroke-width="3" fill="none"/>
      <path d="M65 110 C65 160, 110 180, 130 220" stroke="#eab308" stroke-width="3" fill="none"/>
      <path d="M85 110 C85 150, 130 170, 150 220" stroke="#10b981" stroke-width="3" fill="none"/>
      <!-- PABX Unit in rack -->
      <rect x="25" y="225" width="170" height="40" rx="4" fill="#334155"/>
      <text x="35" y="250" font-family="sans-serif" font-size="11" fill="#f8fafc" font-weight="bold">PABX INTERCOM 32-EXT</text>
    </g>
    <!-- Office Intercom Desk Phone -->
    <g transform="translate(340, 90)">
      <polygon points="20,180 180,180 160,50 40,50" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <!-- Handset -->
      <rect x="15" y="30" width="35" height="150" rx="12" fill="#0f172a" stroke="#64748b" stroke-width="1.5"/>
      <!-- Display -->
      <rect x="65" y="65" width="85" height="40" rx="4" fill="#0284c7"/>
      <text x="75" y="88" font-family="monospace" font-size="12" fill="#ffffff" font-weight="bold">EXT 101</text>
      <!-- Keypad -->
      <circle cx="80" cy="125" r="6" fill="#475569"/>
      <circle cx="105" cy="125" r="6" fill="#475569"/>
      <circle cx="130" cy="125" r="6" fill="#475569"/>
      <circle cx="80" cy="145" r="6" fill="#475569"/>
      <circle cx="105" cy="145" r="6" fill="#475569"/>
      <circle cx="130" cy="145" r="6" fill="#475569"/>
    </g>
    <!-- Feature badge -->
    <g transform="translate(330, 275)">
      <rect x="0" y="0" width="210" height="65" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="15" y="25" font-family="sans-serif" font-size="11" fill="#f59e0b" font-weight="bold">Enterprise Cabling & PABX</text>
      <text x="15" y="42" font-family="sans-serif" font-size="10" fill="#cbd5e1">• 100% Tested Cat6 Runs</text>
      <text x="15" y="56" font-family="sans-serif" font-size="10" fill="#cbd5e1">• TP-Link Seamless Wi-Fi Roaming</text>
    </g>
  </svg>`,

  'fire-alarm-system.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" fill="none">
    <defs>
      <linearGradient id="fire-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1c0707"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" rx="24" fill="url(#fire-bg)"/>
    <!-- Smoke Detector Disc (Ceiling mount) -->
    <g transform="translate(80, 70)">
      <circle cx="120" cy="60" r="55" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>
      <circle cx="120" cy="60" r="35" fill="#e2e8f0"/>
      <!-- Optical Smoke chamber vent slats -->
      <circle cx="120" cy="60" r="22" fill="#1e293b"/>
      <circle cx="120" cy="60" r="4" fill="#ef4444"/>
      <!-- Flashing beacon ring -->
      <circle cx="120" cy="60" r="48" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 4"/>
    </g>
    <!-- Fire Alarm Control Panel Box -->
    <g transform="translate(330, 60)">
      <rect x="0" y="0" width="200" height="260" rx="14" fill="#dc2626" stroke="#b91c1c" stroke-width="3"/>
      <!-- LCD screen -->
      <rect x="25" y="25" width="150" height="65" rx="6" fill="#0f172a"/>
      <text x="40" y="52" font-family="monospace" font-size="12" fill="#22c55e" font-weight="bold">SYSTEM NORMAL</text>
      <text x="40" y="70" font-family="monospace" font-size="10" fill="#94a3b8">LOOP 01 : OK</text>
      <!-- Status LEDs -->
      <circle cx="45" cy="115" r="6" fill="#22c55e"/>
      <text x="60" y="119" font-family="sans-serif" font-size="9" fill="#ffffff" font-weight="bold">POWER</text>
      <circle cx="45" cy="135" r="6" fill="#f59e0b"/>
      <text x="60" y="139" font-family="sans-serif" font-size="9" fill="#ffffff" font-weight="bold">SILENCE</text>
      <circle cx="45" cy="155" r="6" fill="#ffffff" opacity="0.6"/>
      <text x="60" y="159" font-family="sans-serif" font-size="9" fill="#ffffff" font-weight="bold">FIRE ALARM</text>
      <!-- Key lock -->
      <circle cx="150" cy="135" r="10" fill="#0f172a"/>
    </g>
    <!-- Manual Call Point Break Glass -->
    <g transform="translate(100, 210)">
      <rect x="0" y="0" width="100" height="100" rx="10" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
      <rect x="20" y="20" width="60" height="60" rx="4" fill="#ffffff"/>
      <!-- Glass crack simulation -->
      <text x="25" y="48" font-family="sans-serif" font-size="9" fill="#0f172a" font-weight="900">BREAK</text>
      <text x="26" y="60" font-family="sans-serif" font-size="9" fill="#0f172a" font-weight="900">GLASS</text>
      <circle cx="50" cy="50" r="18" stroke="#000000" stroke-width="1.5" stroke-dasharray="3 2" fill="none"/>
    </g>
    <!-- Strobe Siren Horn -->
    <g transform="translate(225, 215)">
      <polygon points="10,40 50,20 50,70" fill="#ef4444"/>
      <rect x="50" y="28" width="20" height="34" fill="#f59e0b"/>
      <path d="M0 45 C-10 35, -10 55, 0 45" stroke="#ef4444" stroke-width="3"/>
    </g>
  </svg>`,
};

for (const [file, content] of Object.entries(serviceGraphics)) {
  fs.writeFileSync(path.join(servicesDir, file), content.trim());
}

console.log('✅ Generated 7 rich service illustrations in public/images/services/');
