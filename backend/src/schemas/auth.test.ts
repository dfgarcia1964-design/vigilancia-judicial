import { registerSchema, loginSchema } from './auth'

describe('Auth Schemas', () => {
  describe('registerSchema', () => {
    it('should validate correct register data', () => {
      const data = {
        email: 'user@example.com',
        nombre: 'John',
        apellido: 'Doe',
        password: 'SecurePass123',
        passwordConfirm: 'SecurePass123',
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should fail with invalid email', () => {
      const data = {
        email: 'invalid-email',
        nombre: 'John',
        apellido: 'Doe',
        password: 'SecurePass123',
        passwordConfirm: 'SecurePass123',
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should fail with short password', () => {
      const data = {
        email: 'user@example.com',
        nombre: 'John',
        apellido: 'Doe',
        password: 'Short1',
        passwordConfirm: 'Short1',
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should fail with mismatched passwords', () => {
      const data = {
        email: 'user@example.com',
        nombre: 'John',
        apellido: 'Doe',
        password: 'SecurePass123',
        passwordConfirm: 'DifferentPass123',
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should fail with missing required fields', () => {
      const data = {
        email: 'user@example.com',
      }

      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const data = {
        email: 'user@example.com',
        password: 'SecurePass123',
      }

      const result = loginSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should fail with invalid email', () => {
      const data = {
        email: 'invalid-email',
        password: 'SecurePass123',
      }

      const result = loginSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should fail with empty password', () => {
      const data = {
        email: 'user@example.com',
        password: '',
      }

      const result = loginSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should fail with missing fields', () => {
      const data = {
        email: 'user@example.com',
      }

      const result = loginSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })
})
