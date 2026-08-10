'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { CheckCircle, Home, Package } from 'lucide-react'
import { verifyStripePayment } from '@/app/actions/orders'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id')

      if (!sessionId) {
        router.push('/shop')
        return
      }

      try {
        await verifyStripePayment(sessionId)
        setIsVerified(true)
        localStorage.removeItem('cart')
      } catch (error) {
        console.error('Error verifying payment:', error)
      } finally {
        setIsLoading(false)
      }
    }

    verifyPayment()
  }, [searchParams, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar session={null} />
        <div className="text-center py-20">Memverifikasi pembayaran...</div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle size={80} className="text-green-600" />
      </div>

      <h1 className="text-4xl font-bold mb-4 font-sans">Pembayaran Berhasil!</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Terima kasih telah berbelanja di FreshBox. Pesanan Anda telah diterima dan akan
        segera diproses.
      </p>

      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 mb-8">
        <p className="text-muted-foreground mb-2">Status Pembayaran:</p>
        <p className="text-2xl font-bold text-green-600">✓ Terbayar</p>
        <p className="text-muted-foreground text-sm mt-4">
          Anda akan menerima email konfirmasi segera
        </p>
      </div>

      <div className="space-y-4">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
        >
          <Package size={20} />
          Lihat Pesanan Saya
        </Link>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-lg font-bold hover:bg-primary/5 transition-colors"
        >
          <Home size={20} />
          Lanjut Belanja
        </Link>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar session={null} />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <Suspense fallback={<div className="text-center py-20">Memverifikasi pembayaran...</div>}>
          <CheckoutSuccessContent />
        </Suspense>
      </div>

      <Footer />
    </div>
  )
}
