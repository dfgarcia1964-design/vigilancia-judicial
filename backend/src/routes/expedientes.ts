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
import { validate } from '../middleware/validate.js'
import {
  crearExpedienteSchema,
  actualizarExpedienteSchema,
  expedienteQuerySchema,
  buscarExpedienteSchema,
} from '../schemas/expediente.js'

const router = Router()

router.use(verifyToken)

router.post('/', validate(crearExpedienteSchema, 'body'), crearExpediente)
router.get('/', validate(expedienteQuerySchema, 'query'), obtenerExpedientes)
router.get('/buscar', validate(buscarExpedienteSchema, 'query'), buscarExpedientes)
router.get('/:id', obtenerExpediente)
router.put('/:id', validate(actualizarExpedienteSchema, 'body'), actualizarExpediente)
router.delete('/:id', eliminarExpediente)

export default router
