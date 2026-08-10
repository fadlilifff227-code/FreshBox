'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders, orderItems, products, promos } from '@/lib/db/schema'
import { eq, and, sql, isNull } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_to_prevent_crash')

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function validatePromoCode(code: string) {
  const promo = await db.select().from(promos).where(and(eq(promos.code, code.toUpperCase()), eq(promos.isActive, true))).limit(1)
  
  if (!promo.length) return { error: 'Kode promo tidak valid atau tidak aktif' }
  
  const p = promo[0]
  if (p.maxUses && p.currentUses >= p.maxUses) return { error: 'Kode promo sudah habis kuotanya' }
  
  return {
    success: true,
    discountPercentage: p.discountPercentage,
    discountAmount: p.discountAmount,
  }
}

export async function createOrder(data: {
  customerName: string
  customerEmail: string
  customerPhone: string
  totalPrice: string
  paymentMethod: 'stripe' | 'whatsapp' | 'qris'
  address?: string
  notes?: string
  items: Array<{
    productId: number
    quantity: number
    pricePerItem: string
  }>
  whatsappNumber?: string
}) {
  const userId = await getUserId()

  const combinedNotes = [
    data.address ? `Alamat: ${data.address}` : '',
    data.notes ? `Catatan: ${data.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  // Create order
  const newOrder = await db
    .insert(orders)
    .values({
      userId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      totalPrice: data.totalPrice,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'stripe' ? 'pending' : 'pending',
      orderStatus: 'pending',
      notes: combinedNotes || undefined,
      whatsappNumber: data.whatsappNumber,
    })
    .returning()

  const orderId = newOrder[0].id

  // Add items to order
  for (const item of data.items) {
    await db.insert(orderItems).values({
      orderId,
      productId: item.productId,
      quantity: item.quantity,
      pricePerItem: item.pricePerItem,
    })

    // Update stock
    await db
      .update(products)
      .set({
        stock: sql`${products.stock} - ${item.quantity}`,
      })
      .where(eq(products.id, item.productId))
  }

  revalidatePath('/orders')
  return newOrder[0]
}

export async function getOrders() {
  const userId = await getUserId()

  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
}

export async function getOrderWithItems(orderId: number) {
  const userId = await getUserId()

  const order = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
    .limit(1)

  if (!order[0]) throw new Error('Order not found')

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId))

  return { ...order[0], items }
}

export async function createStripeCheckout(data: {
  customerEmail: string
  customerName: string
  items: Array<{
    productId: number
    productName: string
    quantity: number
    price: string
  }>
  totalPrice: string
}) {
  const userId = await getUserId()

  const lineItems = data.items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.productName,
      },
      unit_amount: Math.round(parseFloat(item.price) * 100),
    },
    quantity: item.quantity,
  }))

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/checkout/cancel`,
    customer_email: data.customerEmail,
    metadata: {
      userId,
      customerName: data.customerName,
    },
  })

  return session
}

export async function verifyStripePayment(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  
  if (session.payment_status === 'paid') {
    const userId = session.metadata?.userId
    
    if (userId) {
      // Update order payment status
      await db
        .update(orders)
        .set({
          paymentStatus: 'completed',
          stripePaymentId: sessionId,
        })
        .where(and(eq(orders.userId, userId), isNull(orders.stripePaymentId)))
    }
  }

  return session
}
