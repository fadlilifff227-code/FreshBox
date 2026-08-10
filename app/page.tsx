'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Leaf, Package, TrendingUp, LogOut, LogIn } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import ProductGrid from '@/components/product-grid'
import Footer from '@/components/footer'

export default function HomePage() {
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      try {
        const data = await authClient.getSession()
        setSession(data.data)
      } catch (error) {
        console.error('Error fetching session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar session={session} />
      <Hero />
      <ProductGrid />
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 font-sans">
            Mengapa Pilih <span className="text-primary">FreshBox</span>?
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto text-lg">
            Kami menyediakan jus segar dan nasi box berkualitas tinggi dengan bahan-bahan premium pilihan
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf className="w-12 h-12 text-primary" />,
                title: 'Bahan Segar',
                desc: 'Menggunakan bahan-bahan segar berkualitas premium setiap hari',
              },
              {
                icon: <TrendingUp className="w-12 h-12 text-primary" />,
                title: 'Nutrisi Terjamin',
                desc: 'Setiap produk dirancang dengan ahli gizi untuk kesehatan optimal',
              },
              {
                icon: <Package className="w-12 h-12 text-primary" />,
                title: 'Pengiriman Cepat',
                desc: 'Layanan delivery tersedia untuk area tertentu dengan packaging rapi',
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-background rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 font-sans">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-extrabold text-white mb-4 font-sans drop-shadow-md">
            Siap Memesan Jus & Nasi Box Sekarang?
          </h2>
          <p className="text-white/95 mb-8 text-lg font-medium">
            Bergabunglah dengan ribuan pelanggan yang telah menikmati produk segar dan lezat dari FreshBox
          </p>
          {!session?.user ? (
            <Link
              href="/sign-up"
              className="inline-block bg-white text-emerald-900 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-all duration-200 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            >
              Daftar Gratis Sekarang
            </Link>
          ) : (
            <Link
              href="/shop"
              className="inline-block bg-white text-emerald-900 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-all duration-200 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            >
              Mulai Berbelanja
            </Link>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
