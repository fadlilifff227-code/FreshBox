'use client'

import { useEffect, useState, use } from 'react'
import Image from 'next/image'
import { ShoppingCart, Minus, Plus, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getProductById } from '@/app/actions/products'

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [product, setProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(parseInt(resolvedParams.id))
        if (data.length > 0) {
          setProduct(data[0])
        } else {
          router.push('/shop')
        }
      } catch (error) {
        console.error('Error loading product:', error)
        router.push('/shop')
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [resolvedParams.id, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar session={null} />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Sedang memuat produk...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar session={null} />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Produk tidak ditemukan</p>
        </div>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: any) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.imageUrl,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Produk ditambahkan ke keranjang!')
    router.push('/cart')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar session={null} />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative h-96 md:h-[500px] bg-muted rounded-xl overflow-hidden">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                🥗
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-4 font-sans">{product.name}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            <div className="mb-8 p-6 bg-muted rounded-lg">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-primary font-sans">
                  Rp {parseFloat(product.price).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {product.stock > 0 ? (
                  <p className="text-green-600 font-semibold">
                    ✓ Stok tersedia ({product.stock} unit)
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">✗ Stok habis</p>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-3">Jumlah</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <Minus size={20} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center border border-border rounded-lg py-2 px-3"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                <ShoppingCart size={24} />
                Tambah ke Keranjang
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  isFavorite
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-border text-muted-foreground hover:border-red-500'
                }`}
              >
                <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t border-border pt-8 space-y-4">
              <h3 className="font-bold text-lg font-sans">Informasi Produk</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex justify-between">
                  <span>Kategori:</span>
                  <span className="font-semibold text-foreground">
                    {product.categoryId === 1 ? 'Jus Segar' : 'Nasi Box'}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Ketersediaan:</span>
                  <span className="font-semibold text-foreground">
                    {product.stock} unit
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
