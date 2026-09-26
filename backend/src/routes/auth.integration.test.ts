import request from 'supertest'
import httpServer from '../server'
import prisma from '../lib/prisma'

describe('Auth Routes Integration', () => {
  beforeAll(async () => {
    await prisma.usuario.deleteMany({})
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(httpServer)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          nombre: 'Test',
          apellido: 'User',
          password: 'SecurePassword123',
          passwordConfirm: 'SecurePassword123',
        })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('token')
      expect(response.body.usuario).toEqual(
        expect.objectContaining({
          email: 'newuser@example.com',
          nombre: 'Test',
          apellido: 'User',
        })
      )
    })

    it('should fail with invalid email', async () => {
      const response = await request(httpServer)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          nombre: 'Test',
          apellido: 'User',
          password: 'SecurePassword123',
          passwordConfirm: 'SecurePassword123',
        })

      expect(response.status).toBe(400)
    })

    it('should fail with duplicate email', async () => {
      const email = 'duplicate@example.com'

      await request(httpServer)
        .post('/api/auth/register')
        .send({
          email,
          nombre: 'Test',
          apellido: 'User',
          password: 'SecurePassword123',
          passwordConfirm: 'SecurePassword123',
        })

      const response = await request(httpServer)
        .post('/api/auth/register')
        .send({
          email,
          nombre: 'Test',
          apellido: 'User',
          password: 'SecurePassword123',
          passwordConfirm: 'SecurePassword123',
        })

      expect(response.status).toBe(400)
      expect(response.body.error).toContain('registrado')
    })

    it('should fail with mismatched passwords', async () => {
      const response = await request(httpServer)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          nombre: 'Test',
          apellido: 'User',
          password: 'SecurePassword123',
          passwordConfirm: 'DifferentPassword123',
        })

      expect(response.status).toBe(400)
    })
  })

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const email = 'login@example.com'
      const password = 'SecurePassword123'

      await request(httpServer)
        .post('/api/auth/register')
        .send({
          email,
          nombre: 'Test',
          apellido: 'User',
          password,
          passwordConfirm: password,
        })

      const response = await request(httpServer)
        .post('/api/auth/login')
        .send({ email, password })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
      expect(response.body.usuario.email).toBe(email)
    })

    it('should fail with wrong password', async () => {
      const email = 'wrongpass@example.com'
      const password = 'SecurePassword123'

      await request(httpServer)
        .post('/api/auth/register')
        .send({
          email,
          nombre: 'Test',
          apellido: 'User',
          password,
          passwordConfirm: password,
        })

      const response = await request(httpServer)
        .post('/api/auth/login')
        .send({ email, password: 'WrongPassword123' })

      expect(response.status).toBe(401)
    })

    it('should fail with non-existent user', async () => {
      const response = await request(httpServer)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SomePassword123',
        })

      expect(response.status).toBe(401)
    })
  })

  describe('GET /api/auth/me', () => {
    it('should return user info with valid token', async () => {
      const email = 'metest@example.com'
      const password = 'SecurePassword123'

      const registerRes = await request(httpServer)
        .post('/api/auth/register')
        .send({
          email,
          nombre: 'Test',
          apellido: 'User',
          password,
          passwordConfirm: password,
        })

      const token = registerRes.body.token

      const response = await request(httpServer)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.email).toBe(email)
    })

    it('should fail without token', async () => {
      const response = await request(httpServer).get('/api/auth/me')

      expect(response.status).toBe(401)
    })

    it('should fail with invalid token', async () => {
      const response = await request(httpServer)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')

      expect(response.status).toBe(401)
    })
  })
})
