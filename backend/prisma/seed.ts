import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: 'test@example.com' },
    })

    if (usuarioExistente) {
      console.log('Usuario de prueba ya existe')
      return
    }

    const hashedPassword = await bcryptjs.hash('Test123!', 10)

    const usuario = await prisma.usuario.create({
      data: {
        email: 'test@example.com',
        nombre: 'Juan',
        apellido: 'Pérez',
        password: hashedPassword,
        rol: 'abogado',
      },
    })

    console.log('✅ Usuario de prueba creado:', usuario.email)
  } catch (error) {
    console.error('Error al crear usuario de prueba:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
