import { Router } from 'express'
import { register, login, me, logout } from '../controllers/authController.js'
import { verifyToken } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { registerSchema, loginSchema } from '../schemas/auth.js'

const router = Router()

router.post('/register', validate(registerSchema, 'body'), register)
router.post('/login', validate(loginSchema, 'body'), login)
router.get('/me', verifyToken, me)
router.post('/logout', verifyToken, logout)

export default router
