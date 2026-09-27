# 🖥️ Configuración de Electron para Vigilancia Judicial

## Estructura de Archivos

```
vigilancia-judicial/
├── electron/
│   ├── main.ts          # Proceso principal de Electron
│   ├── preload.cjs      # Script de preload para seguridad
│   └── tsconfig.json    # Configuración TypeScript
├── assets/              # Iconos y recursos
│   ├── icon.png         # Para Linux (512x512)
│   ├── icon.ico         # Para Windows (256x256)
│   └── icon.icns        # Para macOS (512x512)
├── frontend/            # Aplicación React
├── backend/             # Servidor Node.js
└── package.json         # Configuración con scripts de Electron
```

## 🚀 Comandos Disponibles

### Desarrollo
```bash
npm run electron:dev
```
Inicia el servidor de desarrollo Vite y abre Electron en modo desarrollo.

### Compilación

#### Para Windows (.exe)
```bash
npm run electron:build:win
```
Genera instalador NSIS y versión portable para Windows.

#### Para macOS
```bash
npm run electron:build:mac
```
Genera DMG y ZIP para macOS.

#### Para Linux
```bash
npm run electron:build:linux
```
Genera AppImage y DEB para Linux.

#### Todas las plataformas
```bash
npm run electron:build
```

## 📦 Lo que incluye la compilación

- ✅ Aplicación React integrada
- ✅ Servidor Express backend incluido
- ✅ Todas las dependencias de Node.js
- ✅ Icono nativo del sistema
- ✅ Accesos directos en el escritorio (Windows)
- ✅ Entrada en el menú de aplicaciones

## 🎨 Personalización

### Iconos
Reemplaza los iconos en la carpeta `assets/`:
- **Windows**: `icon.ico` (256x256 píxeles, formato ICO)
- **macOS**: `icon.icns` (512x512 píxeles, formato ICNS)
- **Linux**: `icon.png` (512x512 píxeles, PNG)

Puedes generar estos desde un PNG usando herramientas online o locales.

### Información de la Aplicación
En `package.json`:
```json
"name": "vigilancia-judicial",
"version": "0.1.0",
"description": "Plataforma de vigilancia judicial y administrativa para Colombia"
```

### Menú de Aplicación
Edita `electron/main.ts` en la sección "Create menu" para personalizar el menú.

## 🔧 Troubleshooting

### "Icon not found"
Asegúrate de que los archivos de iconos existan en la carpeta `assets/`:
```bash
ls -la assets/
```

### Electron no inicia en desarrollo
Verifica que Vite esté corriendo:
```bash
npm run dev:frontend
```

### Error de módulos faltantes
Asegúrate de instalar todas las dependencias:
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
```

## 📝 Proceso de Construcción

1. **Build Frontend**: Compila React con Vite
2. **Compile Electron**: Compila TypeScript del proceso principal
3. **Package**: electron-builder empaca todo en un instalador

El resultado final incluye:
- La aplicación React compilada
- El servidor Express (solo como código, no se ejecuta automáticamente)
- Todas las dependencias necesarias

## 🌐 Notas sobre el Backend

El servidor Express se inicia como un proceso de Node.js separado. Para que funcione en la app de escritorio:

1. El servidor no se inicia automáticamente (sin cambios en el código)
2. Debes actualizar `electron/main.ts` para iniciar el backend si necesitas un servidor local
3. Alternativamente, la app puede conectarse al servidor en Railway (recomendado para producción)

Para auto-iniciar el backend en desarrollo, ver sección "Bonus: Auto-start Backend" en main.ts.
