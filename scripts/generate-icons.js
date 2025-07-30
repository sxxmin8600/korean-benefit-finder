const fs = require('fs');
const path = require('path');

// 간단한 SVG를 PNG로 변환하는 함수 (placeholder)
function generateIcon(size) {
  // 실제로는 canvas나 sharp 라이브러리를 사용해야 하지만,
  // 일단 placeholder로 SVG 아이콘을 생성
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="192" height="192" rx="24" fill="url(#gradient0_linear_20_20)"/>
<defs>
<linearGradient id="gradient0_linear_20_20" x1="0" y1="0" x2="192" y2="192" gradientUnits="userSpaceOnUse">
<stop stop-color="#3B82F6"/>
<stop offset="1" stop-color="#1976D2"/>
</linearGradient>
</defs>
<circle cx="72" cy="72" r="28" stroke="white" stroke-width="8" fill="none"/>
<line x1="94" y1="94" x2="116" y2="116" stroke="white" stroke-width="8" stroke-linecap="round"/>
<rect x="108" y="52" width="40" height="40" rx="4" fill="#F59515"/>
<rect x="116" y="52" width="24" height="6" fill="#EA4335"/>
<rect x="126" y="46" width="4" height="18" fill="#EA4335"/>
<circle cx="128" cy="76" r="3" fill="#FBCF24"/>
<circle cx="120" cy="68" r="2" fill="#FBCF24"/>
<circle cx="136" cy="84" r="2" fill="#FBCF24"/>
</svg>`;

  return svg;
}

// 아이콘 생성
const publicDir = path.join(__dirname, '..', 'public');

// 기본 아이콘들을 SVG로 생성
fs.writeFileSync(path.join(publicDir, 'icon-192x192.svg'), generateIcon(192));
fs.writeFileSync(path.join(publicDir, 'icon-512x512.svg'), generateIcon(512));

console.log('SVG 아이콘들이 생성되었습니다.');
console.log('실제 PNG 파일은 온라인 SVG to PNG 변환기를 사용하거나');
console.log('generate-icons.html을 브라우저에서 열어서 다운로드 받으세요.');