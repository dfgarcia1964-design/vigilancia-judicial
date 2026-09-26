const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL']
const optionalEnvVars = {
  PORT: '5000',
  NODE_ENV: 'development',
  CORS_ORIGIN: 'http://localhost:3000',
  SOCKET_IO_ORIGIN: 'http://localhost:3000',
}

function validateEnv() {
  const missing = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  )

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please set these in your .env file`
    )
  }
}

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET!,
  DATABASE_URL: process.env.DATABASE_URL!,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  SOCKET_IO_ORIGIN: process.env.SOCKET_IO_ORIGIN || 'http://localhost:3000',
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isProduction: process.env.NODE_ENV === 'production',
}

validateEnv()

export default env
