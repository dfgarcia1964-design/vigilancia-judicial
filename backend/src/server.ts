import express from 'express'
import cors from 'cors'
import { Server as SocketIOServer } from 'socket.io'
import { createServer } from 'http'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import expedientesRoutes from './routes/expedientes.js'
import procesosRoutes from './routes/procesos.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.SOCKET_IO_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/expedientes', expedientesRoutes)
app.use('/api/procesos', procesosRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando correctamente' })
})

app.get('/api/stats', (req, res) => {
  res.json({
    expedientes: 45,
    procesos: 23,
    alertas: 8,
    documentos: 156,
  })
})

io.on('connection', (socket) => {
  console.log('✅ Cliente conectado:', socket.id)

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado:', socket.id)
  })

  socket.on('nueva-alerta', (data) => {
    io.emit('alerta-recibida', data)
  })
})

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

export default httpServer
