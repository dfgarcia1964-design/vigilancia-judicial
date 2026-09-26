import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { validate } from './validate'
import { AppError } from './errorHandler'

describe('Validate Middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = { body: {} }
    res = {}
    next = jest.fn()
  })

  it('should pass validation with valid data', () => {
    const schema = z.object({
      email: z.string().email(),
      name: z.string().min(1),
    })

    req.body = {
      email: 'test@example.com',
      name: 'John',
    }

    const middleware = validate(schema, 'body')
    middleware(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
    expect(req.body).toEqual({
      email: 'test@example.com',
      name: 'John',
    })
  })

  it('should fail validation with invalid email', () => {
    const schema = z.object({
      email: z.string().email(),
    })

    req.body = {
      email: 'invalid-email',
    }

    const middleware = validate(schema, 'body')
    middleware(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(AppError))
    const error = (next as jest.Mock).mock.calls[0][0]
    expect(error.statusCode).toBe(400)
  })

  it('should validate query parameters', () => {
    const schema = z.object({
      page: z.string().transform(Number),
    })

    req.query = {
      page: '1',
    }

    const middleware = validate(schema, 'query')
    middleware(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
  })

  it('should trim whitespace from strings', () => {
    const schema = z.object({
      name: z.string().min(1).trim(),
    })

    req.body = {
      name: '  John  ',
    }

    const middleware = validate(schema, 'body')
    middleware(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
  })
})
