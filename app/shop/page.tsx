'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Filter } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getCategories, getProducts } from '@/app/actions/products'

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ])
        setProducts(productsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.categoryId === selectedCategory)
    : products

  return (
    <div className="min-h-screen bg-background">
      <Navbar session={session} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 font-sans">Belanja Produk</h1>
          <p className="text-muted-foreground text-lg">
            Pilih dari koleksi lengkap jus segar dan nasi box berkualitas kami
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter size={20} className="text-primary" />
            <h3 className="font-bold text-lg font-sans">Kategori Produk</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm ${
                selectedCategory === null
                  ? 'bg-slate-900 text-white shadow-slate-900/20'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              ✨ Semua Produk
            </button>
            {categories.map((category) => {
              const isJuiceCat = category.name?.toLowerCase().includes('jus')
              const isSelected = selectedCategory === category.id
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                    isSelected
                      ? isJuiceCat
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                        : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/30 ring-2 ring-amber-400/50'
                      : isJuiceCat
                        ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300'
                  }`}
                >
                  {isJuiceCat ? '🥤 ' : '🍱 '}
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Sedang memuat produk...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Tidak ada produk ditemukan</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
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
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
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
        )}
      </div>

      <Footer />
    </div>
  )
}
