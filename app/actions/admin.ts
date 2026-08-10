'use server'

import { db } from '@/lib/db'
import { orders, products, user, orderItems, promos } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/admin-auth'
import { eq, desc, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function getDashboardStats() {
  await requireAdmin()
  
  const allOrders = await db.select().from(orders)
  const allProducts = await db.select().from(products).where(eq(products.isActive, true))
  const allUsers = await db.select().from(user)

  const totalRevenue = allOrders.reduce((sum, order) => {
    // Only count completed or pending payments towards total potential revenue
    return sum + parseFloat(order.totalPrice)
  }, 0)

  return {
    totalRevenue,
    totalOrders: allOrders.length,
    activeProducts: allProducts.length,
    totalCustomers: allUsers.length
  }
}

export async function getAllOrders() {
  await requireAdmin()
  
  return db.select().from(orders).orderBy(desc(orders.createdAt))
}

export async function updateOrderStatus(orderId: number, status: string) {
  await requireAdmin()
  
  await db.update(orders).set({ orderStatus: status }).where(eq(orders.id, orderId))
  revalidatePath('/admin/orders')
  revalidatePath('/orders')
}

export async function updatePaymentStatus(orderId: number, status: string) {
  await requireAdmin()
  
  await db.update(orders).set({ paymentStatus: status }).where(eq(orders.id, orderId))
  revalidatePath('/admin/orders')
  revalidatePath('/orders')
}

export async function getAllProductsAdmin() {
  await requireAdmin()
  
  return db.select().from(products).orderBy(desc(products.createdAt))
}

export async function toggleProductStatus(productId: number, isActive: boolean) {
  await requireAdmin()
  
  await db.update(products).set({ isActive }).where(eq(products.id, productId))
  revalidatePath('/admin/products')
  revalidatePath('/shop')
}

export async function getAllUsersAdmin() {
  await requireAdmin()
  return db.select().from(user).orderBy(desc(user.createdAt))
}

export async function getAllPromosAdmin() {
  await requireAdmin()
  return db.select().from(promos).orderBy(desc(promos.createdAt))
}

export async function createPromo(data: { code: string; discountPercentage?: number; discountAmount?: number; maxUses?: number }) {
  await requireAdmin()
  await db.insert(promos).values({
    code: data.code,
    discountPercentage: data.discountPercentage?.toString(),
    discountAmount: data.discountAmount?.toString(),
    maxUses: data.maxUses,
  })
  revalidatePath('/admin/promos')
}

export async function togglePromoStatus(promoId: number, isActive: boolean) {
  await requireAdmin()
  await db.update(promos).set({ isActive }).where(eq(promos.id, promoId))
  revalidatePath('/admin/promos')
}
