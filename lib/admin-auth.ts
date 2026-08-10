import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session?.user) {
    redirect('/sign-in')
  }

  const dbUser = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)

  if (!dbUser.length || dbUser[0].role !== 'admin') {
    redirect('/')
  }

  return session.user
}

export async function isAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session?.user) {
    return false
  }

  const dbUser = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)

  return dbUser.length > 0 && dbUser[0].role === 'admin'
}
