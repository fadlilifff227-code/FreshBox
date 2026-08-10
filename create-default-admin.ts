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

async function createDefaultAdmin() {
  const email = 'admin@freshbox.com'
  const password = 'adminpassword'
  const name = 'Super Admin'

  console.log(`Registering account: ${email}...`)
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000',
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      if (!errorText.includes('USER_ALREADY_EXISTS')) {
        console.error('Failed to register:', errorText)
        return
      } else {
        console.log('Account already exists, proceeding to elevate role...')
      }
    } else {
      console.log('Account registered successfully!')
    }

    // Elevate to admin
    await db.update(schema.user).set({ role: 'admin' }).where(eq(schema.user.email, email))
    console.log(`Successfully elevated ${email} to admin role!`)
    
  } catch (error) {
    console.error('Error:', error)
  }
  process.exit(0)
}

createDefaultAdmin()
