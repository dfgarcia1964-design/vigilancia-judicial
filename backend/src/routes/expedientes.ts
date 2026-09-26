import { Router } from 'express'
import {
  crearExpediente,
  obtenerExpedientes,
  obtenerExpediente,
  actualizarExpediente,
  eliminarExpediente,
  buscarExpedientes,
} from '../controllers/expedienteController.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

router.use(verifyToken)

router.post('/', crearExpediente)
router.get('/', obtenerExpedientes)
router.get('/buscar', buscarExpedientes)
router.get('/:id', obtenerExpediente)
router.put('/:id', actualizarExpediente)
router.delete('/:id', eliminarExpediente)

export default router
