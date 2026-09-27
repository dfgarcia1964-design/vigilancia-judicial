/**
 * Script para generar iconos de ejemplo
 * Ejecuta: node scripts/generate-icons.js
 *
 * Requiere: npm install canvas
 *
 * O usa online: https://icoconvert.com/ para convertir PNG a ICO
 */

import fs from 'fs'
import path from 'path'

// Crear directorio de assets si no existe
const assetsDir = path.join(process.cwd(), 'assets')
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true })
}

// Crear un SVG simple para usar como base
const svgIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Fondo -->
  <rect width="512" height="512" fill="url(#grad)"/>

  <!-- Escala de justicia simplificada -->
  <g transform="translate(256, 256)">
    <!-- Poste -->
    <rect x="-10" y="-80" width="20" height="160" fill="white" rx="5"/>

    <!-- Barra horizontal -->
    <ellipse cx="0" cy="-80" rx="80" ry="15" fill="white" opacity="0.9"/>
    <line x1="-70" y1="-80" x2="-70" y2="0" stroke="white" stroke-width="3"/>
    <line x1="70" y1="-80" x2="70" y2="0" stroke="white" stroke-width="3"/>

    <!-- Platillos -->
    <rect x="-95" y="5" width="50" height="30" fill="white" rx="3" opacity="0.9"/>
    <rect x="45" y="5" width="50" height="30" fill="white" rx="3" opacity="0.9"/>

    <!-- Símbolo de justicia (estrella pequeña) -->
    <polygon points="0,-40 10,-20 30,-20 15,0 20,25 0,10 -20,25 -15,0 -30,-20 -10,-20"
             fill="white" opacity="0.7"/>
  </g>
</svg>`

fs.writeFileSync(path.join(assetsDir, 'icon.svg'), svgIcon)
console.log('✅ Icono SVG creado: assets/icon.svg')

console.log(`
📦 Para completar la configuración de Electron, necesitas convertir el SVG a otros formatos:

1. Instala ImageMagick o usa una herramienta online:
   - https://icoconvert.com/ (gratis, rápido)
   - https://convertio.co/png-ico/

2. Pasos:
   a) Ve a https://icoconvert.com/
   b) Sube assets/icon.svg
   c) Descarga como PNG (512x512)
   d) Sube ese PNG nuevamente
   e) Descarga como ICO (para Windows)

3. Repite para macOS pero descarga como ICNS

4. Coloca los archivos en:
   - assets/icon.png (512x512) - Linux/genérico
   - assets/icon.ico (256x256) - Windows
   - assets/icon.icns - macOS (opcional, solo si compilas para Mac)

⚠️  Mientras tanto, electron-builder puede compilar sin iconos completos.
`)
