import env from './config/env.js'
import app from './server.js'

app.listen(env.PORT, () => {
  console.log(`✅ Servidor ejecutándose en puerto ${env.PORT}`)
  console.log(`Entorno: ${env.NODE_ENV}`)
  console.log(`CORS Origin: ${env.CORS_ORIGIN}`)
})
