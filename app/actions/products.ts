'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { categories, products } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function getCategories() {
  return db.select().from(categories)
}

export async function getProducts() {
  return db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
}

export async function getProductById(id: number) {
  if (!id || isNaN(id)) return []
  return db
    .select()
    .from(products)
    .where(and(eq(products.id, id), eq(products.isActive, true)))
    .limit(1)
}

export async function getProductsByCategory(categoryId: number) {
  return db
    .select()
    .from(products)
    .where(and(eq(products.categoryId, categoryId), eq(products.isActive, true)))
}

// Admin actions
async function getAdminId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  // In a real app, you'd check if user is admin
  return session.user.id
}

export async function createProduct(data: {
  name: string
  description: string
  price: string
  categoryId: number
  imageUrl: string
  stock: number
}) {
  await getAdminId()
  
  return db.insert(products).values({
    name: data.name,
    description: data.description,
    price: data.price,
    categoryId: data.categoryId,
    imageUrl: data.imageUrl,
    stock: data.stock,
    isActive: true,
  }).returning()
}

export async function updateProduct(id: number, data: Partial<typeof products.$inferInsert>) {
  await getAdminId()
  
  return db
    .update(products)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))
    .returning()
}

export async function deleteProduct(id: number) {
  await getAdminId()
  
  return db
    .update(products)
    .set({ isActive: false })
    .where(eq(products.id, id))
}

export async function createCategory(data: { name: string; description: string; imageUrl: string }) {
  await getAdminId()
  
  return db.insert(categories).values({
    name: data.name,
    description: data.description,
    imageUrl: data.imageUrl,
  }).returning()
}
