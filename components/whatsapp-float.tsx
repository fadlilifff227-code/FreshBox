'use client'

import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'
import { getAdminWhatsAppNumber, formatOrderDate, createWhatsAppChatUrl } from '@/lib/whatsapp'
import { authClient } from '@/lib/auth-client'

export default function WhatsAppFloat() {
  const { data: session } = authClient.useSession()

  const handleDirectWhatsApp = () => {
    const adminPhone = getAdminWhatsAppNumber()
    const dateFormatted = formatOrderDate(new Date())

    // Try reading active cart from localStorage
    let cartItems: any[] = []
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        cartItems = JSON.parse(savedCart)
      }
    } catch (e) {
      console.error('Error reading cart', e)
    }

    const userName = session?.user?.name || '[Isi Nama Lengkap]'

    let message = ''

    if (cartItems.length > 0) {
      const subtotal = cartItems.reduce(
        (sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity,
        0
      )
      const tax = subtotal * 0.1
      const total = subtotal + tax

      let productList = ''
      cartItems.forEach((item) => {
        const itemPrice = parseFloat(item.price) || 0
        productList += `- ${item.name} x${item.quantity} (Rp ${(itemPrice * item.quantity).toLocaleString('id-ID')})\n`
      })

      message = `PESANAN FRESHBOX

ID Order : #FB-NEW
Nama     : ${userName}
No HP    : [Isi No WhatsApp]
Alamat   : [Isi Alamat Lengkap Pengiriman]

Daftar Produk:
${productList}
Total    : Rp ${total.toLocaleString('id-ID')}
Status   : Menunggu Pembayaran
Tanggal  : ${dateFormatted}

Mohon untuk segera diproses. Terima kasih.`
    } else {
      message = `PESANAN FRESHBOX

ID Order : #FB-NEW
Nama     : ${userName}
No HP    : [Isi No WhatsApp]
Alamat   : [Isi Alamat Lengkap Pengiriman]

Daftar Produk:
- 
- 

Total    : Rp -
Status   : Menunggu Konfirmasi
Tanggal  : ${dateFormatted}

Mohon untuk segera diproses. Terima kasih.`
    }

    const whatsappUrl = createWhatsAppChatUrl(adminPhone, message)
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center">
      {/* Tooltip badge on hover/idle */}
      <button
        onClick={handleDirectWhatsApp}
        className="hidden sm:flex items-center gap-2 mr-3 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs font-semibold px-3.5 py-2 rounded-full shadow-lg border border-border whitespace-nowrap hover:scale-105 transition-all cursor-pointer"
        aria-label="Pesan via WhatsApp Admin"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
        <span>Chat & Pesan via WhatsApp Admin</span>
      </button>

      {/* Direct WhatsApp Trigger Button */}
      <button
        onClick={handleDirectWhatsApp}
        className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl shadow-green-600/50 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer group"
        aria-label="Buka WhatsApp Admin Langsung"
        title="Klik untuk langsung chat & pesan ke WhatsApp Admin"
      >
        {/* Authentic High-Resolution WhatsApp Icon */}
        <WhatsAppIcon size={34} className="text-white drop-shadow-md group-hover:scale-105 transition-transform" />
        <span className="absolute top-0 right-0 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#25D366] border-2 border-white"></span>
        </span>
      </button>
    </div>
  )
}
