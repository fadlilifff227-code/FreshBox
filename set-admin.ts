import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './lib/db/schema'
import * as dotenv from 'dotenv'
import { eq } from 'drizzle-orm'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
const db = drizzle(pool, { schema })

async function makeAdmin() {
  const email = process.argv[2]
  
  if (!email) {
    console.error('Usage: npx tsx set-admin.ts <email>')
    process.exit(1)
  }

  const existingUser = await db.select().from(schema.user).where(eq(schema.user.email, email)).limit(1)

  if (existingUser.length === 0) {
    console.error(`User with email ${email} not found. Please sign up first via the web app.`)
    process.exit(1)
  }

  await db.update(schema.user).set({ role: 'admin' }).where(eq(schema.user.email, email))
  console.log(`Successfully updated ${email} to admin role!`)
  process.exit(0)
}

makeAdmin().catch(err => {
  console.error('Failed to update admin role:', err)
  process.exit(1)
})
