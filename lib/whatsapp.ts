/**
 * WhatsApp Helper Utilities for FreshBox
 * Supports clean, neat formatting without emoji artifacts.
 */

export interface OrderItemPayload {
  name: string
  quantity: number
  price: number | string
}

export interface WhatsAppOrderDetails {
  orderId?: string | number
  customerName: string
  customerPhone: string
  customerAddress?: string
  customerNotes?: string
  items: OrderItemPayload[]
  subtotal?: number
  discount?: number
  tax?: number
  total: number | string
  status?: string
  paymentStatus?: string
  date?: string | Date
  paymentMethod?: string
}

/**
 * Format phone number to international WhatsApp format (e.g. 6281234567890)
 */
export function formatWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '')
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1)
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned
  }
  return cleaned
}

/**
 * Get default admin WhatsApp number
 */
export function getAdminWhatsAppNumber(): string {
  const envNumber =
    process.env.NEXT_PUBLIC_ADMIN_PHONE ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    process.env.WHATSAPP_NUMBER ||
    '6289517799841'

  return formatWhatsAppNumber(envNumber)
}

/**
 * Format Date in clean Indonesian format (e.g. 10 Agu 2026, 08:32 WIB)
 */
export function formatOrderDate(date?: string | Date): string {
  const d = date ? new Date(date) : new Date()
  return (
    d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB'
  )
}

/**
 * Build neat, clean, aligned formatted order message for WhatsApp
 */
export function formatWhatsAppOrderMessage(data: WhatsAppOrderDetails): string {
  const orderIdFormatted = data.orderId
    ? `#FB-${String(data.orderId).padStart(4, '0')}`
    : '#FB-NEW'
  const dateFormatted = formatOrderDate(data.date)
  const totalNumber =
    typeof data.total === 'string' ? parseFloat(data.total) || 0 : data.total
  const statusFormatted =
    data.status || data.paymentStatus || 'Menunggu Pembayaran'

  let msg = `PESANAN FRESHBOX\n\n`
  msg += `ID Order : ${orderIdFormatted}\n`
  msg += `Nama     : ${data.customerName || '-'}\n`
  msg += `No HP    : ${data.customerPhone || '-'}\n`
  msg += `Alamat   : ${data.customerAddress || '-'}\n\n`

  msg += `Daftar Produk:\n`
  if (data.items && data.items.length > 0) {
    data.items.forEach((item) => {
      const priceNum =
        typeof item.price === 'string' ? parseFloat(item.price) || 0 : item.price
      const itemTotal = priceNum * item.quantity
      msg += `- ${item.name} x${item.quantity} (Rp ${itemTotal.toLocaleString('id-ID')})\n`
    })
  } else {
    msg += `- (Tidak ada item)\n`
  }

  msg += `\nTotal    : Rp ${totalNumber.toLocaleString('id-ID')}\n`
  msg += `Status   : ${statusFormatted}\n`
  msg += `Tanggal  : ${dateFormatted}\n`

  if (data.customerNotes && data.customerNotes.trim() !== '') {
    msg += `Catatan  : ${data.customerNotes.trim()}\n`
  }

  if (data.paymentMethod) {
    const methodLabel =
      data.paymentMethod === 'qris'
        ? 'QRIS'
        : data.paymentMethod === 'stripe'
        ? 'Kartu Kredit / Debit'
        : 'Transfer Manual / WhatsApp'
    msg += `Metode   : ${methodLabel}\n`
  }

  msg += `\nMohon untuk segera diproses. Terima kasih.`

  return msg
}

/**
 * Create WhatsApp Click to Chat URL
 */
export function createWhatsAppChatUrl(phone?: string, message?: string): string {
  const targetPhone = phone ? formatWhatsAppNumber(phone) : getAdminWhatsAppNumber()
  const defaultMsg = 'Halo FreshBox, saya ingin bertanya mengenai pemesanan.'
  const text = encodeURIComponent(message || defaultMsg)
  return `https://wa.me/${targetPhone}?text=${text}`
}

/**
 * Create WhatsApp Order Link
 */
export function createWhatsAppOrderUrl(
  data: WhatsAppOrderDetails,
  phone?: string
): string {
  const message = formatWhatsAppOrderMessage(data)
  return createWhatsAppChatUrl(phone, message)
}

/**
 * Create WhatsApp Order Status Confirmation Link
 */
export function createWhatsAppStatusInquiryUrl(params: {
  orderId: number | string
  customerName: string
  customerPhone?: string
  customerAddress?: string
  total?: number | string
  status?: string
  date?: string | Date
  phone?: string
}): string {
  const orderIdFormatted = `#FB-${String(params.orderId).padStart(4, '0')}`
  const dateFormatted = formatOrderDate(params.date)
  const statusFormatted = params.status || 'Sedang Diproses'

  let text = `Halo Admin FreshBox,\nSaya ingin menanyakan update pesanan saya:\n\n`
  text += `ID Order : ${orderIdFormatted}\n`
  text += `Nama     : ${params.customerName}\n`
  if (params.customerPhone) text += `No HP    : ${params.customerPhone}\n`
  if (params.customerAddress) text += `Alamat   : ${params.customerAddress}\n`
  if (params.total) {
    const totalNum =
      typeof params.total === 'string'
        ? parseFloat(params.total) || 0
        : params.total
    text += `Total    : Rp ${totalNum.toLocaleString('id-ID')}\n`
  }
  text += `Status   : ${statusFormatted}\n`
  text += `Tanggal  : ${dateFormatted}\n\n`
  text += `Mohon informasinya. Terima kasih.`

  return createWhatsAppChatUrl(params.phone, text)
}

/**
 * Meta WhatsApp Business Cloud API Client (Optional Server Side Notification)
 */
export async function sendMetaCloudWhatsAppMessage({
  to,
  message,
}: {
  to: string
  message: string
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const token = process.env.WHATSAPP_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!token || !phoneNumberId) {
    return {
      success: false,
      error:
        'WhatsApp Business Cloud API tokens not configured in environment variables.',
    }
  }

  try {
    const formattedRecipient = formatWhatsAppNumber(to)
    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedRecipient,
        type: 'text',
        text: {
          preview_url: false,
          body: message,
        },
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      return {
        success: false,
        error: data?.error?.message || 'Failed to send WhatsApp message',
      }
    }

    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' }
  }
}
