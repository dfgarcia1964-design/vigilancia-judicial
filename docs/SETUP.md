# Guía de Instalación y Configuración

## Requisitos Previos

- Node.js 18+ 
- npm o yarn
- PostgreSQL 15+
- Docker y Docker Compose (opcional, pero recomendado)

## 🚀 Instalación Rápida

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tuusuario/vigilancia-judicial.git
cd vigilancia-judicial
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Base de Datos

#### Opción A: Con Docker (Recomendado)

```bash
docker-compose up -d
```

Esto iniciará PostgreSQL en `localhost:5432` con:
- Usuario: `vigilancia_user`
- Contraseña: `vigilancia_password`
- BD: `vigilancia_db`

#### Opción B: PostgreSQL Local

Crea una base de datos manualmente:
```sql
CREATE DATABASE vigilancia_db;
```

### 4. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env` con tus configuraciones:

```
DATABASE_URL="postgresql://vigilancia_user:vigilancia_password@localhost:5432/vigilancia_db"
JWT_SECRET="tu-clave-super-secreta"
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

### 5. Inicializar Base de Datos

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
cd ..
```

### 6. Iniciar la Aplicación

En una terminal (Frontend):
```bash
cd frontend
npm run dev
```

En otra terminal (Backend):
```bash
cd backend
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- pgAdmin (si usas Docker): http://localhost:5050

## 📱 Estructura de Carpetas

```
vigilancia-judicial/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas principales
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── backend/                  # Servidor Node.js
│   ├── src/
│   │   ├── routes/          # Rutas de la API
│   │   ├── controllers/     # Controladores
│   │   ├── services/        # Lógica de negocio
│   │   ├── middleware/      # Middleware
│   │   ├── index.ts
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma    # Definición de BD
│   └── package.json
│
├── docs/                     # Documentación
├── docker-compose.yml        # Configuración Docker
└── README.md
```

## 🔑 Variábles de Entorno Disponibles

### Backend

| Variable | Descripción | Ejemplo |
|----------|------------|---------|
| `DATABASE_URL` | Conexión a PostgreSQL | `postgresql://user:pass@localhost/db` |
| `JWT_SECRET` | Clave para tokens JWT | `mi-clave-secreta` |
| `JWT_EXPIRATION` | Expiración del token | `7d` |
| `PORT` | Puerto del servidor | `5000` |
| `NODE_ENV` | Entorno (development/production) | `development` |
| `CORS_ORIGIN` | Origen CORS permitido | `http://localhost:3000` |
| `SOCKET_IO_ORIGIN` | Origen Socket.io | `http://localhost:3000` |

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run test

# Backend
cd backend
npm run test
```

## 📦 Build para Producción

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

## 🐛 Solución de Problemas

### Error de conexión a BD
- Verifica que PostgreSQL esté corriendo
- Revisa las credenciales en `.env`
- Con Docker: `docker-compose ps`

### Puerto en uso
- Frontend: Cambia el puerto en `frontend/vite.config.ts`
- Backend: Cambia `PORT` en `.env`

### Errores de Prisma
```bash
cd backend
npx prisma generate
npx prisma db push
```

## 📚 Recursos Útiles

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)

## 📞 Soporte

Para reportar problemas o sugerencias, abre un issue en GitHub.
