#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const isWindows = process.platform === 'win32'
const platform = process.argv[2] || 'all'

console.log('🔨 Compilando Electron...\n')

try {
  // 1. Build frontend
  console.log('📦 Compilando frontend...')
  execSync('npm run build:frontend', { stdio: 'inherit' })

  // 2. Compile Electron main process
  console.log('\n⚡ Compilando proceso principal de Electron...')
  const tscCmd = isWindows
    ? 'npx tsc electron/main.ts --outDir dist --module commonjs --target es2020'
    : 'npx tsc electron/main.ts --outDir dist --module commonjs --target es2020'

  execSync(tscCmd, { stdio: 'inherit' })

  // 3. Run electron-builder
  console.log('\n🏗️  Empaquetando con electron-builder...')

  let builderCmd = 'electron-builder'
  if (platform === 'win') {
    builderCmd += ' --win'
  } else if (platform === 'mac') {
    builderCmd += ' --mac'
  } else if (platform === 'linux') {
    builderCmd += ' --linux'
  }

  execSync(`npx ${builderCmd}`, { stdio: 'inherit' })

  console.log('\n✅ Compilación completada exitosamente!')
  console.log('\n📂 Los archivos están en:')
  console.log('   - dist/ (código compilado)')
  console.log('   - out/ (instaladores y paquetes)')
} catch (error) {
  console.error('\n❌ Error durante la compilación:', error.message)
  process.exit(1)
}
