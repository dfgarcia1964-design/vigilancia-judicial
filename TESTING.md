# 🧪 Testing Strategy - Vigilancia Judicial

## Overview

Comprehensive testing setup for both backend and frontend with unit and integration tests.

## Backend Testing (Jest)

### Setup
```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

### Test Structure

**Unit Tests:**
- Schemas validation (`src/schemas/*.test.ts`)
- Middleware (`src/middleware/*.test.ts`)
- Utilities and helpers

**Integration Tests:**
- Route handlers (`src/routes/*.integration.test.ts`)
- Database operations
- Authentication flow
- CRUD operations

### Example Backend Test

```typescript
describe('Auth Routes Integration', () => {
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
  })
})
```

### Tools
- **Jest**: Test runner
- **Supertest**: HTTP assertions
- **ts-jest**: TypeScript support

### Coverage Thresholds
- Statements: 70%
- Branches: 65%
- Functions: 70%
- Lines: 70%

---

## Frontend Testing (Vitest)

### Setup
```bash
npm test              # Run all tests
npm run test:ui       # Interactive UI
npm run test:coverage # Coverage report
```

### Test Structure

**Hook Tests:**
- `src/hooks/useExpedientes.test.ts`
- `src/hooks/useProcesos.test.ts`
- State management and data fetching

**Component Tests:**
- User interactions
- Conditional rendering
- Props validation

**Mocking:**
- API client mocked in setup
- React Query mocked QueryClient
- Local storage mocked

### Example Frontend Test

```typescript
describe('useExpedientes Hook', () => {
  it('should fetch expedientes successfully', async () => {
    const mockExpedientes = [
      {
        id: '1',
        numero: 'EXP-001',
        // ... other fields
      },
    ]

    vi.mocked(api.get).mockResolvedValue({
      data: { expedientes: mockExpedientes },
    } as any)

    const { result } = renderHook(() => useExpedientes(), { wrapper })

    result.current.obtenerExpedientes()

    await waitFor(() => {
      expect(result.current.expedientes).toHaveLength(1)
    })
  })
})
```

### Tools
- **Vitest**: Test runner (Vite-native)
- **React Testing Library**: Component testing
- **jsdom**: DOM environment

---

## Test Execution

### Run All Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

### Watch Mode (Development)

```bash
# Backend watches for changes
npm run test:watch

# Frontend watches for changes
npm run test:ui
```

### Coverage Reports

```bash
# Backend coverage
npm run test:coverage

# Frontend coverage
npm run test:coverage

# Open HTML coverage report
open coverage/index.html
```

---

## Testing Best Practices

### Backend
1. **Isolation**: Each test is independent
2. **Cleanup**: Database cleaned before/after tests
3. **Realistic**: Integration tests use real HTTP requests
4. **Fast**: Unit tests run quickly; integration tests slower but comprehensive

### Frontend
1. **User-Centric**: Test user behavior, not implementation
2. **Mocking**: Mock external API calls
3. **Async Handling**: Wait for async operations with `waitFor`
4. **Cleanup**: Automatic cleanup between tests

### General
- One assertion per test (when possible)
- Descriptive test names
- Test behavior, not implementation details
- Avoid testing third-party libraries

---

## CI/CD Integration

### Recommended CI Pipeline

```yaml
test:
  - npm run test:coverage
  - Upload coverage to CodeCov
  - Fail if coverage below threshold
```

### Pre-commit Hook

```bash
npm run test -- --onlyChanged
```

---

## Coverage Goals

- **Critical Path**: 100% (auth, CRUD operations)
- **Business Logic**: 80%+ (schemas, validation)
- **Overall**: 70%+ minimum

---

## Debugging Tests

### Backend Debug
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Frontend Debug
```bash
npm run test:ui  # Visually debug with UI
```

### Log in Tests
```typescript
console.log('Debug:', variable)
```

---

## Future Improvements

- [ ] End-to-end tests (Cypress/Playwright)
- [ ] Performance benchmarks
- [ ] Visual regression testing
- [ ] Load testing
- [ ] Security scanning in tests
