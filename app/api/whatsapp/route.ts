import { NextRequest, NextResponse } from 'next/server'
import {
  formatWhatsAppNumber,
  getAdminWhatsAppNumber,
  sendMetaCloudWhatsAppMessage,
  formatOrderDate,
} from '@/lib/whatsapp'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const invoice =
    searchParams.get('invoice') ||
    searchParams.get('orderId') ||
    searchParams.get('id') ||
    'NEW'
  const name =
    searchParams.get('name') || searchParams.get('customerName') || '-'
  const phone =
    searchParams.get('phone') || searchParams.get('customerPhone') || '-'
  const address =
    searchParams.get('address') || searchParams.get('customerAddress') || '-'
  const product =
    searchParams.get('product') ||
    searchParams.get('products') ||
    searchParams.get('items') ||
    '-'
  const price = searchParams.get('price') || searchParams.get('total') || '-'
  const status = searchParams.get('status') || 'Menunggu Pembayaran'
  const dateParam = searchParams.get('date') || searchParams.get('tanggal')
  const notes = searchParams.get('notes') || ''
  const customMessage = searchParams.get('message')

  const targetPhone = formatWhatsAppNumber(
    searchParams.get('to') || getAdminWhatsAppNumber()
  )

  let text = customMessage

  if (!text) {
    const formattedOrderId = invoice.startsWith('#FB-')
      ? invoice
      : `#FB-${String(invoice).padStart(4, '0')}`
    const formattedDate = formatOrderDate(dateParam || undefined)
    const formattedTotal = price.startsWith('Rp') ? price : `Rp ${price}`

    text = `PESANAN FRESHBOX

ID Order : ${formattedOrderId}
Nama     : ${name}
No HP    : ${phone}
Alamat   : ${address}

Daftar Produk:
${product}

Total    : ${formattedTotal}
Status   : ${status}
Tanggal  : ${formattedDate}
${notes ? `Catatan  : ${notes}\n` : ''}
Mohon untuk segera diproses. Terima kasih.`
  }

  const encodedText = encodeURIComponent(text)
  const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedText}`

  return NextResponse.redirect(whatsappUrl)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      to,
      message,
      orderId,
      customerName,
      customerPhone,
      customerAddress,
      products,
      totalPrice,
      status,
      date,
    } = body

    const recipient = to || getAdminWhatsAppNumber()
    const orderIdFormatted = orderId
      ? `#FB-${String(orderId).padStart(4, '0')}`
      : '#FB-NEW'
    const dateFormatted = formatOrderDate(date)

    const msgToSend =
      message ||
      `PESANAN FRESHBOX\n\nID Order : ${orderIdFormatted}\nNama     : ${customerName || '-'}\nNo HP    : ${customerPhone || '-'}\nAlamat   : ${customerAddress || '-'}\n\nDaftar Produk:\n${products || '-'}\n\nTotal    : ${totalPrice || '-'}\nStatus   : ${status || 'Pending'}\nTanggal  : ${dateFormatted}\n\nMohon untuk segera diproses. Terima kasih.`

    const result = await sendMetaCloudWhatsAppMessage({
      to: recipient,
      message: msgToSend,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Invalid request' },
      { status: 400 }
    )
  }
}
