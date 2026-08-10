import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('⚠️ Warning: DATABASE_URL environment variable is not defined!')
}

// Global connection pool caching for Next.js hot reloading in development
declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined
}

export const pool =
  global._pgPool ||
  new Pool({
    connectionString,
    ssl:
      connectionString?.includes('neon.tech') || connectionString?.includes('sslmode=require')
        ? { rejectUnauthorized: false }
        : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })

if (process.env.NODE_ENV !== 'production') {
  global._pgPool = pool
}

export const db = drizzle(pool, { schema })
