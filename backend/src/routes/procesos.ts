import { Router } from 'express'
import {
  crearProceso,
  obtenerProcesos,
  obtenerProceso,
  actualizarProceso,
  eliminarProceso,
  buscarProcesos,
} from '../controllers/procesoController.js'
import { verifyToken } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import {
  crearProcesoSchema,
  actualizarProcesoSchema,
  procesoQuerySchema,
  buscarProcesoSchema,
} from '../schemas/proceso.js'

const router = Router()

router.use(verifyToken)

router.post('/', validate(crearProcesoSchema, 'body'), crearProceso)
router.get('/', validate(procesoQuerySchema, 'query'), obtenerProcesos)
router.get('/buscar', validate(buscarProcesoSchema, 'query'), buscarProcesos)
router.get('/:id', obtenerProceso)
router.put('/:id', validate(actualizarProcesoSchema, 'body'), actualizarProceso)
router.delete('/:id', eliminarProceso)

export default router
