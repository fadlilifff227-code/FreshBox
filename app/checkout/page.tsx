'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { authClient } from '@/lib/auth-client'
import { createOrder, createStripeCheckout, validatePromoCode } from '@/app/actions/orders'
import { CreditCard, Phone, ArrowLeft, QrCode, MapPin, FileText, CheckCircle2, MessageSquare } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'
import { createWhatsAppOrderUrl, getAdminWhatsAppNumber, formatWhatsAppOrderMessage } from '@/lib/whatsapp'

export default function CheckoutPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [cart, setCart] = useState<any[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'whatsapp' | 'qris'>('whatsapp')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<any>(null)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    customerNotes: '',
    whatsappNumber: getAdminWhatsAppNumber(),
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await authClient.getSession()
        setSession(data.data)

        const savedCart = localStorage.getItem('cart')
        const cartData = savedCart ? JSON.parse(savedCart) : []
        setCart(cartData)

        if (cartData.length === 0) {
          router.push('/cart')
          return
        }

        if (data.data?.user) {
          const user = data.data.user
          setFormData((prev) => ({
            ...prev,
            customerEmail: user.email || '',
            customerName: user.name || '',
          }))
        }
      } catch (error) {
        console.error('Error loading checkout:', error)
        router.push('/cart')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar session={null} />
        <div className="text-center py-20">Sedang memuat data checkout...</div>
        <Footer />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar session={null} />
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4 font-sans">Silakan Login Terlebih Dahulu</h1>
          <p className="text-muted-foreground mb-6">
            Masuk ke akun Anda untuk menyelesaikan proses pemesanan dengan mudah.
          </p>
          <Link href="/sign-in" className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Masuk Sekarang
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  )

  let discount = 0
  if (appliedPromo) {
    if (appliedPromo.discountPercentage) {
      discount = subtotal * (parseFloat(appliedPromo.discountPercentage) / 100)
    } else if (appliedPromo.discountAmount) {
      discount = parseFloat(appliedPromo.discountAmount)
    }
  }

  const tax = (subtotal - discount) * 0.1
  const total = subtotal - discount + tax

  const handleApplyPromo = async () => {
    if (!promoCode) return
    setIsApplyingPromo(true)
    try {
      const res = await validatePromoCode(promoCode)
      if (res.error) {
        alert(res.error)
        setAppliedPromo(null)
      } else {
        setAppliedPromo(res)
        alert('Kode promo berhasil diterapkan!')
      }
    } catch (error) {
      alert('Gagal menerapkan promo')
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (paymentMethod === 'stripe') {
        const items = cart.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        }))

        const checkout = await createStripeCheckout({
          customerEmail: formData.customerEmail,
          customerName: formData.customerName,
          items,
          totalPrice: total.toString(),
        })

        if (checkout.url) {
          window.location.href = checkout.url
        }
      } else {
        // WhatsApp or QRIS payment method
        const items = cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          pricePerItem: item.price,
        }))

        const createdOrder = await createOrder({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          totalPrice: total.toString(),
          paymentMethod: paymentMethod,
          address: formData.customerAddress,
          notes: formData.customerNotes,
          items,
          whatsappNumber: formData.whatsappNumber || getAdminWhatsAppNumber(),
        })

        // Clear cart from local storage
        localStorage.removeItem('cart')

        // Build rich WhatsApp message
        const whatsappUrl = createWhatsAppOrderUrl(
          {
            orderId: createdOrder?.id,
            customerName: formData.customerName,
            customerPhone: formData.customerPhone,
            customerAddress: formData.customerAddress,
            customerNotes: formData.customerNotes,
            items: cart.map((c) => ({ name: c.name, quantity: c.quantity, price: c.price })),
            subtotal,
            discount,
            tax,
            total,
            status: paymentMethod === 'qris' ? 'Sudah Bayar QRIS (Menunggu Verifikasi)' : 'Menunggu Pembayaran',
            date: new Date(),
            paymentMethod,
          },
          formData.whatsappNumber || getAdminWhatsAppNumber()
        )

        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer')

        // Redirect customer to orders history
        router.push('/orders')
      }
    } catch (error) {
      console.error('Error processing order:', error)
      alert('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar session={session} />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-primary font-semibold mb-6 hover:gap-3 transition-all"
        >
          <ArrowLeft size={18} />
          Kembali ke Keranjang
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold font-sans">Checkout & Pembayaran</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Lengkapi data pengiriman dan pilih metode pembayaran favorit Anda.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold self-start sm:self-auto border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={15} />
            Format Pesanan WhatsApp Otomatis
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Info */}
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold mb-4 font-sans flex items-center gap-2 text-foreground">
                  <MapPin size={20} className="text-primary" />
                  Informasi Penerima & Pengiriman
                </h2>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Budi Santoso"
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({ ...formData, customerName: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Nomor WhatsApp / HP <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Contoh: 08123456789"
                        value={formData.customerPhone}
                        onChange={(e) =>
                          setFormData({ ...formData, customerPhone: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="budi@example.com"
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, customerEmail: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Alamat Lengkap Pengiriman <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Jl. Mawar No. 10, RT 02/05, Kebayoran Baru, Jakarta Selatan (Patokan: Depan Pos Satpam)"
                      value={formData.customerAddress}
                      onChange={(e) =>
                        setFormData({ ...formData, customerAddress: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center justify-between">
                      <span>Catatan Pesanan (Opsional)</span>
                      <span className="text-[11px] lowercase text-muted-foreground">e.g. tanpa es / sambal dipisah</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Jus jangan terlalu manis, saus sambal dipisah ya"
                      value={formData.customerNotes}
                      onChange={(e) =>
                        setFormData({ ...formData, customerNotes: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold mb-4 font-sans flex items-center gap-2 text-foreground">
                  <CreditCard size={20} className="text-primary" />
                  Metode Pembayaran
                </h2>

                <div className="space-y-3">
                  {/* WhatsApp Option (Recommended) */}
                  <label
                    className={`flex items-start p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                      paymentMethod === 'whatsapp'
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm'
                        : 'border-border hover:border-emerald-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="whatsapp"
                      checked={paymentMethod === 'whatsapp'}
                      onChange={() => setPaymentMethod('whatsapp')}
                      className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        <WhatsAppIcon size={18} className="text-[#25D366]" />
                        Pesan via WhatsApp (Click to Chat)
                        <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Paling Cepat & Populer
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pesan otomatis diformat dan dikirim langsung ke WhatsApp Admin FreshBox untuk konfirmasi cepat & pembayaran fleksibel (Transfer Bank / COD / E-wallet).
                      </p>
                    </div>
                  </label>

                  {/* QRIS Option */}
                  <label
                    className={`flex items-start p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                      paymentMethod === 'qris'
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm'
                        : 'border-border hover:border-emerald-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="qris"
                      checked={paymentMethod === 'qris'}
                      onChange={() => setPaymentMethod('qris')}
                      className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        <QrCode size={18} className="text-emerald-600" />
                        QRIS Standard Nasional (Scan & Pay)
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Scan QRIS langsung dengan aplikasi e-wallet (GoPay, OVO, DANA, ShopeePay) atau Mobile Banking (BCA, Mandiri, BRI, BNI).
                      </p>
                    </div>
                  </label>

                  {/* Stripe Option */}
                  <label
                    className={`flex items-start p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                      paymentMethod === 'stripe'
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm'
                        : 'border-border hover:border-emerald-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                      className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        <CreditCard size={18} className="text-emerald-600" />
                        Kartu Kredit / Debit Online (Stripe)
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pembayaran instan online via kartu Visa, Mastercard, atau JCB dengan enkripsi keamanan tingkat tinggi.
                      </p>
                    </div>
                  </label>

                  {/* QRIS Interactive Box */}
                  {paymentMethod === 'qris' && (
                    <div className="mt-4 p-5 border-2 border-emerald-500/30 rounded-2xl bg-emerald-50/30 dark:bg-emerald-950/10 text-center relative overflow-hidden transition-all">
                      <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full mb-3">
                        <QrCode size={14} />
                        QRIS Standard Pembayaran Nasional
                      </div>

                      <h3 className="font-bold text-lg mb-1 font-sans">JUS & NASI BOX FRESHBOX</h3>
                      <p className="text-muted-foreground text-xs mb-3">
                        Total Tagihan: <span className="font-extrabold text-primary text-sm">Rp {total.toLocaleString('id-ID')}</span>
                      </p>

                      <div className="w-full max-w-[260px] mx-auto bg-white p-3 rounded-2xl border border-gray-200 mb-4 shadow-sm">
                        <img
                          src="/qris.jpg"
                          alt="QRIS Pembayaran Jus & Nasi Box"
                          className="w-full h-auto rounded-xl object-contain mx-auto"
                        />
                        <p className="text-[11px] text-gray-500 mt-2 font-medium">Scan menggunakan aplikasi E-Wallet & Banking</p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-1 mb-4 text-[10px] text-gray-600 dark:text-gray-400 font-semibold">
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">GoPay</span>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">OVO</span>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">DANA</span>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">ShopeePay</span>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">BCA</span>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Mandiri</span>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">BRI/BNI</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg text-base flex items-center justify-center gap-2 ${
                    paymentMethod === 'whatsapp'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                      : 'bg-primary hover:bg-primary/90 text-white shadow-primary/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    'Sedang Memproses...'
                  ) : paymentMethod === 'whatsapp' ? (
                    <>
                      <WhatsAppIcon size={20} className="text-white" />
                      Pesan via WhatsApp Sekarang
                    </>
                  ) : paymentMethod === 'qris' ? (
                    <>
                      <QrCode size={20} />
                      Konfirmasi Pembayaran QRIS
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Bayar dengan Kartu Kredit
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  🔒 Data transaksi dan kontak Anda aman & terlindungi.
                </p>
              </div>
            </form>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border sticky top-4">
              <h2 className="text-lg font-bold mb-4 font-sans flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                Ringkasan Pesanan
              </h2>

              <div className="space-y-3 pb-4 border-b border-border max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs">
                    <span className="font-medium text-foreground">
                      {item.name} <span className="text-muted-foreground font-normal">x{item.quantity}</span>
                    </span>
                    <span className="font-semibold text-foreground">
                      Rp {(parseFloat(item.price) * item.quantity).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 py-4 border-b border-border text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">
                    Rp {subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Diskon Promo</span>
                    <span>- Rp {discount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pajak Resto (10%)</span>
                  <span className="font-semibold text-foreground">
                    Rp {tax.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="py-4 border-b border-border">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Kode Promo / Voucher
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: FRESHDISKON"
                    disabled={appliedPromo !== null}
                    className="flex-1 px-3 py-1.5 bg-background border border-border rounded-xl text-xs uppercase focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted"
                  />
                  {appliedPromo ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedPromo(null)
                        setPromoCode('')
                      }}
                      className="px-3 py-1.5 bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300 rounded-xl text-xs font-bold hover:bg-red-200 transition-colors"
                    >
                      Batal
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={isApplyingPromo || !promoCode}
                      className="px-3 py-1.5 bg-foreground text-background rounded-xl text-xs font-bold hover:opacity-90 transition-colors disabled:opacity-50"
                    >
                      Pakai
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-4 pb-2">
                <span className="font-bold text-sm text-foreground">Total Tagihan</span>
                <span className="text-2xl font-black text-primary font-sans">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>

              {/* WhatsApp Live Preview Box */}
              <div className="mt-4 p-3 bg-muted/40 rounded-xl border border-border/80 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                  <MessageSquare size={13} />
                  Format Pesan WhatsApp
                </div>
                <p className="line-clamp-3 italic">
                  &ldquo;🍱 PESANAN BARU FRESHBOX: {cart.length} menu items, Total: Rp {total.toLocaleString('id-ID')}...&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
