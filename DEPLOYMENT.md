# 🚀 DEPLOYMENT GUIDE - Vigilancia Judicial

## Platform: Railway

Railway es la forma más simple de desplegar esta aplicación. Es gratuito para empezar y muy fácil de usar.

---

## 📋 Requisitos

- Cuenta en GitHub (para conectar el repositorio)
- Cuenta en Railway (gratuita en https://railway.app)
- Variables de entorno configuradas

---

## 🔧 Paso 1: Preparar el Repositorio

### 1.1 Verificar que todo esté en GitHub

```bash
git status
git push origin master
```

Asegúrate de que todos los cambios estén en GitHub.

### 1.2 Archivos necesarios (ya incluidos)

✅ `railway.json` - Configuración de Railway
✅ `backend/Dockerfile` - Docker image para backend
✅ `backend/.dockerignore` - Archivos a ignorar
✅ `backend/.env.example` - Variables de ejemplo

---

## 🚀 Paso 2: Desplegar en Railway

### 2.1 Crear Proyecto en Railway

1. Ir a https://railway.app
2. Click en "New Project"
3. Seleccionar "Deploy from GitHub"
4. Autorizar Railway con tu GitHub
5. Seleccionar el repositorio `vigilancia-judicial`

### 2.2 Configurar Variables de Entorno

En el panel de Railway, ir a "Variables":

```
DATABASE_URL = postgresql://user:pass@host:5432/dbname
JWT_SECRET = (generar una clave segura)
NODE_ENV = production
CORS_ORIGIN = https://tu-frontend.vercel.app
SOCKET_IO_ORIGIN = https://tu-frontend.vercel.app
```

### 2.3 Esperar a que se Despliegue

Railway construirá automáticamente la imagen Docker y desplegará la aplicación.

Puedes ver el progreso en el dashboard de Railway.

---

## 🌐 Paso 3: Desplegar Frontend (Vercel)

### 3.1 Crear Proyecto en Vercel

1. Ir a https://vercel.com
2. Click en "New Project"
3. Importar repositorio `vigilancia-judicial`
4. Framework: "Vite"
5. Root directory: `frontend`

### 3.2 Configurar Variables de Entorno

En Vercel, ir a "Settings" > "Environment Variables":

```
VITE_API_URL = https://tu-backend-railway.up.railway.app/api
```

### 3.3 Desplegar

Vercel desplegará automáticamente cuando hagas push a GitHub.

---

## 📊 Variables de Entorno en Producción

### Backend (Railway)

```env
# Base de datos (usar PostgreSQL en producción)
DATABASE_URL="postgresql://username:password@host:port/dbname"

# JWT Secret (generar uno seguro)
JWT_SECRET="(generar con: openssl rand -base64 32)"

# Server
PORT=5000
NODE_ENV="production"

# CORS (URL del frontend Vercel)
CORS_ORIGIN="https://tu-app.vercel.app"
SOCKET_IO_ORIGIN="https://tu-app.vercel.app"
```

### Frontend (Vercel)

```env
VITE_API_URL="https://tu-backend-railway.up.railway.app/api"
```

---

## 🔐 Generar JWT_SECRET Seguro

```bash
# En Linux/Mac
openssl rand -base64 32

# En Windows (PowerShell)
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).Guid + (New-Guid).Guid))
```

O usar un generador en línea: https://www.uuidgenerator.net/

---

## 📱 URLs Finales Después del Deployment

- **Frontend**: https://tu-app.vercel.app
- **Backend API**: https://tu-backend-railway.up.railway.app
- **API Docs**: https://tu-backend-railway.up.railway.app/api

---

## ✅ Checklist de Deployment

### Antes de Desplegar

- [ ] Todos los cambios en GitHub
- [ ] Archivos Dockerfile y railway.json presentes
- [ ] Variables de entorno documentadas

### Después de Desplegar

- [ ] Backend responde en Railway
- [ ] Frontend carga en Vercel
- [ ] Login funciona
- [ ] API conecta correctamente
- [ ] Logs sin errores

---

## 🐛 Troubleshooting

### Backend no inicia en Railway

```
Error: Cannot find module
```

**Solución**: Verifica que `npm install` funciona localmente y que todas las dependencias están en `package.json`.

### Frontend no conecta con Backend

**Solución**: Verifica que `VITE_API_URL` está correcto y que el CORS_ORIGIN en backend coincide con la URL de Vercel.

### Base de datos no se inicializa

**Solución**: Ejecuta en Railway:
```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## 📞 Soporte

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Issues**: Abre un issue en tu repositorio

---

## 💡 Tips

1. **Usa Railway para ambos** (frontend + backend): Más simple que Vercel + Railway
2. **Configura dominio personalizado**: Ambas plataformas lo permiten
3. **Monitorea logs**: Ambas tienen dashboards de logs en tiempo real
4. **Usa PostgreSQL**: SQLite no es recomendado en producción

---

**¡Tu aplicación estará en vivo en minutos!** 🎉
