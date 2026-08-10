import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { XCircle, ShoppingCart, Home } from 'lucide-react'

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar session={null} />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <XCircle size={80} className="text-red-600" />
          </div>

          <h1 className="text-4xl font-bold mb-4 font-sans">Pembayaran Dibatalkan</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Pembayaran Anda telah dibatalkan. Jangan khawatir, item masih ada di keranjang Anda.
          </p>

          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-8 mb-8">
            <p className="text-muted-foreground mb-2">Status Pembayaran:</p>
            <p className="text-2xl font-bold text-orange-600">✗ Dibatalkan</p>
            <p className="text-muted-foreground text-sm mt-4">
              Anda dapat mengulangi pembayaran kapan saja
            </p>
          </div>

          <p className="text-muted-foreground mb-8">
            Jika Anda mengalami masalah atau memiliki pertanyaan, hubungi layanan pelanggan kami.
          </p>

          <div className="space-y-4">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
            >
              <ShoppingCart size={20} />
              Kembali ke Keranjang
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-lg font-bold hover:bg-primary/5 transition-colors"
            >
              <Home size={20} />
              Lanjut Belanja
            </Link>
          </div>

          <div className="mt-12 p-6 bg-card rounded-lg">
            <h3 className="font-bold text-lg mb-3 font-sans">Butuh Bantuan?</h3>
            <p className="text-muted-foreground mb-4">
              Hubungi tim support kami untuk bantuan lebih lanjut
            </p>
            <p className="text-primary font-semibold">
              📞 (+62) 895 1779 9841<br />
              📧 aliffadli703@gmail.com
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
