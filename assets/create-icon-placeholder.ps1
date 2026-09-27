# Script para crear iconos placeholder
# Necesitarás reemplazar estos con iconos reales

# Crear carpeta si no existe
if (-not (Test-Path "C:\Users\dfgar\vigilancia judicial\assets")) {
    New-Item -ItemType Directory -Path "C:\Users\dfgar\vigilancia judicial\assets"
}

Write-Host "📁 Carpeta de assets creada."
Write-Host "⚠️  Por favor, coloca tus iconos en la carpeta assets/"
Write-Host "   - icon.png (512x512) para Linux"
Write-Host "   - icon.ico (256x256) para Windows"
Write-Host "   - icon.icns (512x512) para macOS"
