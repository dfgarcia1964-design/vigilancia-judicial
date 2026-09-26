import { z } from 'zod'

export const registerSchema = z
  .object({
    email: z.string().email('Email inválido'),
    nombre: z.string().min(1, 'Nombre requerido').trim(),
    apellido: z.string().min(1, 'Apellido requerido').trim(),
    password: z.string().min(8, 'Contraseña debe tener al menos 8 caracteres'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirm'],
  })

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

export type Register = z.infer<typeof registerSchema>
export type Login = z.infer<typeof loginSchema>
