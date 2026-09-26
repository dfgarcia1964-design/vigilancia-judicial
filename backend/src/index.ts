import app from './server.js'
import dotenv from 'dotenv'
import env from './config/env.js'

dotenv.config()

app.listen(env.PORT, () => {
  console.log(`✅ Servidor ejecutándose en puerto ${env.PORT}`)
  console.log(`Entorno: ${env.NODE_ENV}`)
  console.log(`CORS Origin: ${env.CORS_ORIGIN}`)
})
