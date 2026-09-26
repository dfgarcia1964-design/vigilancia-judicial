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

const router = Router()

router.use(verifyToken)

router.post('/', crearProceso)
router.get('/', obtenerProcesos)
router.get('/buscar', buscarProcesos)
router.get('/:id', obtenerProceso)
router.put('/:id', actualizarProceso)
router.delete('/:id', eliminarProceso)

export default router
