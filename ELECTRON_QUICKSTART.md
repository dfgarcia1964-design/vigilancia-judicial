# 🚀 Guía Rápida - Compilar a .exe

## ✅ Lo que ya está configurado:

- ✅ Electron instalado
- ✅ electron-builder configurado
- ✅ Proceso principal de Electron (electron/main.ts)
- ✅ Scripts de compilación
- ✅ Configuración para Windows, macOS y Linux

## 📋 Pasos para compilar

### 1️⃣ Preparar los iconos (RECOMENDADO)

**Opción A: Usar iconos existentes**
```bash
cd assets
# Coloca tus archivos:
# - icon.png (512x512) para Linux
# - icon.ico (256x256) para Windows  
# - icon.icns (512x512) para macOS (opcional)
cd ..
```

**Opción B: Generar SVG de ejemplo**
```bash
node scripts/generate-icons.js
```
Luego convierte en: https://icoconvert.com/

### 2️⃣ Compilar la aplicación

**Para Windows (.exe - RECOMENDADO)**
```bash
npm run electron:build:win
```

**Para todas las plataformas**
```bash
npm run electron:build
```

**Para Linux o macOS**
```bash
npm run electron:build:linux
npm run electron:build:mac
```

### 3️⃣ Encontrar el instalador

Los archivos compilados estarán en la carpeta `out/`:
- **Windows**: 
  - `out/Vigilancia Judicial 0.1.0.exe` (Instalador)
  - `out/Vigilancia Judicial 0.1.0 Portable.exe` (Portátil)
- **Linux**:
  - `out/Vigilancia Judicial-0.1.0.AppImage`
  - `out/vigilancia-judicial_0.1.0_amd64.deb`
- **macOS**:
  - `out/Vigilancia Judicial-0.1.0.dmg`

## 🎯 Prueba durante desarrollo

```bash
npm run electron:dev
```

Esto inicia:
- ✅ Servidor Vite en http://localhost:5173
- ✅ Aplicación Electron con DevTools abierto

## 📊 Tamaño esperado

- Windows Installer NSIS: ~150-200 MB
- Windows Portable: ~120-150 MB  
- Linux AppImage: ~150-200 MB
- macOS DMG: ~150-200 MB

*Los tamaños incluyen Node.js, React compilado y todas las dependencias*

## ⚙️ Personalización

### Cambiar nombre de la app
En `package.json`:
```json
{
  "name": "mi-app",
  "build": {
    "productName": "Mi Aplicación"
  }
}
```

### Cambiar versión
En `package.json`:
```json
{
  "version": "1.0.0"
}
```

### Cambiar información de autor
En `package.json`:
```json
{
  "author": "Tu Nombre <tu@email.com>"
}
```

## 🔗 Conectar al backend

### Opción 1: Servidor remoto (Recomendado)
La app ya se conecta a `https://web-production-86f7c.up.railway.app` 
*(Actualiza en frontend/.env.production)*

### Opción 2: Servidor local (Desarrollo)
Para iniciar el backend automáticamente:

1. Edita `electron/main.ts`
2. Descomentar la sección "Auto-start Backend"
3. Recompilar con `npm run electron:build:win`

## 🐛 Troubleshooting

**"Error: Icon not found"**
```bash
# Asegúrate de que existan los iconos:
ls assets/
# Debería mostrar: icon.png, icon.ico (mínimo)
```

**"Electron no inicia en desarrollo"**
```bash
# Mata procesos anteriores
npm run electron:dev
# En otra terminal
npm run dev:frontend
```

**"Módulos faltantes"**
```bash
npm install
npm run electron:build:win
```

## 📦 Distribución

### Por internet
- Sube el `.exe` a un servidor de descargas
- O en un repositorio GitHub (Releases)

### Por USB/Email
- Comparte `Vigilancia Judicial 0.1.0.exe` (Instalador)
- O `Vigilancia Judicial 0.1.0 Portable.exe` (sin instalación)

## ✨ Bonus: Auto-update

Para agregar actualizaciones automáticas (requiere backend):
1. Instala `electron-updater`
2. Configura en `main.ts`
3. Sube actualizaciones a un servidor

*Pregunta si necesitas help con esto*

---

¿Preguntas? Ver `ELECTRON_SETUP.md` para detalles técnicos.
