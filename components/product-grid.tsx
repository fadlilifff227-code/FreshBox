'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, ChevronRight } from 'lucide-react'
import { getProducts } from '@/app/actions/products'

export default function ProductGrid() {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data.slice(0, 6)) // Show first 6 products
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 font-sans">Produk Unggulan</h2>
          <p className="text-muted-foreground mb-12 text-lg">
            Sedang memuat produk...
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-4xl font-bold mb-2 font-sans">Produk Unggulan</h2>
            <p className="text-muted-foreground text-lg">
              Koleksi terbaik kami untuk Anda
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 text-primary font-semibold hover:gap-4 transition-all"
          >
            Lihat Semua
            <ChevronRight size={20} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {products.map((product, index) => {
            const isJuice = product.name?.toLowerCase().includes('jus') || product.category?.name?.toLowerCase().includes('jus')
            
            return (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className={`group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border ${
                  isJuice
                    ? 'bg-gradient-to-b from-emerald-50/80 to-white dark:from-emerald-950/20 dark:to-card border-emerald-200/60 dark:border-emerald-900/40'
                    : 'bg-gradient-to-b from-amber-50/80 to-white dark:from-amber-950/20 dark:to-card border-amber-200/60 dark:border-amber-900/40'
                }`}
              >
                <div className="relative h-64 bg-muted overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      priority={index < 2}
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-4xl">
                      {isJuice ? '🥤' : '🍱'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  
                  {/* Category Badge overlay */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md backdrop-blur-md border ${
                        isJuice
                          ? 'bg-emerald-600/90 text-white border-emerald-400/50'
                          : 'bg-amber-600/90 text-white border-amber-400/50'
                      }`}
                    >
                      {isJuice ? '🥤 Jus Segar' : '🍱 Nasi Box'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 font-sans">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span
                      className={`text-2xl font-extrabold font-sans ${
                        isJuice ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      Rp {parseFloat(product.price).toLocaleString('id-ID')}
                    </span>
                    <button
                      className={`p-2.5 text-white rounded-xl transition-all shadow-md group-hover:scale-105 transform ${
                        isJuice
                          ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                          : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                      }`}
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>

                  {product.stock <= 5 && product.stock > 0 && (
                    <p className="text-xs text-orange-600 mt-2 font-semibold">
                      Hanya {product.stock} tersisa
                    </p>
                  )}
                  {product.stock === 0 && (
                    <p className="text-xs text-red-600 mt-2 font-semibold">
                      Stok Habis
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Lihat Semua Produk
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}
