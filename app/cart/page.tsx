'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem('cart')
      setCart(savedCart ? JSON.parse(savedCart) : [])
      setIsLoading(false)
    }

    loadCart()
  }, [])

  const updateQuantity = (id: number, newQuantity: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    )
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const removeItem = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  )
  const tax = subtotal * 0.1
  const total = subtotal + tax

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar session={session} />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Sedang memuat keranjang...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar session={session} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 font-sans">Keranjang Belanja</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border">
            <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2 font-sans">Keranjang Kosong</h2>
            <p className="text-muted-foreground mb-6">
              Yuk pilih jus buah segar atau paket nasi box favorit Anda!
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              Mulai Belanja Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-card rounded-2xl p-5 shadow-sm border border-border">
                    <div className="flex gap-4 sm:gap-6 items-center">
                      {/* Image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🥗
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg mb-1 font-sans text-foreground truncate">{item.name}</h3>
                        <p className="text-primary font-bold text-base">
                          Rp {parseFloat(item.price).toLocaleString('id-ID')}
                        </p>
                      </div>

                      {/* Quantity and Remove */}
                      <div className="flex flex-col items-end gap-3">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-red-500 transition-colors"
                          title="Hapus menu"
                        >
                          <Trash2 size={18} />
                        </button>

                        <div className="flex items-center gap-1.5 border border-border rounded-lg p-1 bg-background">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-muted rounded text-muted-foreground"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-muted rounded text-muted-foreground"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="mt-3 pt-3 border-t border-border flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Total Menu Ini:</span>
                      <span className="font-bold text-primary font-sans text-sm">
                        Rp {(parseFloat(item.price) * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border sticky top-4">
                <h2 className="text-lg font-bold mb-4 font-sans">Ringkasan Pesanan</h2>

                <div className="space-y-2.5 pb-4 border-b border-border text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({cart.length} menu)</span>
                    <span className="font-semibold text-foreground">
                      Rp {subtotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pajak (10%)</span>
                    <span className="font-semibold text-foreground">
                      Rp {tax.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline py-4">
                  <span className="font-bold text-sm text-foreground">Total Perkiraan</span>
                  <span className="text-2xl font-black text-primary font-sans">
                    Rp {total.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all text-sm shadow-md"
                  >
                    Lanjut ke Checkout
                    <ArrowRight size={16} />
                  </Link>

                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-0.5">
                      <WhatsAppIcon size={14} className="text-[#25D366]" />
                      Bisa Pesan Langsung via WhatsApp
                    </div>
                    <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">
                      Format nama, alamat & rincian pesanan otomatis terisi di WhatsApp CS.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
