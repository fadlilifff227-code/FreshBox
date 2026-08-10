'use client'

import { useEffect, useState } from 'react'
import { getAllProductsAdmin, toggleProductStatus } from '@/app/actions/admin'
import Image from 'next/image'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProductsAdmin()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleToggleActive = async (productId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus
    const confirmMessage = newStatus 
      ? 'Aktifkan kembali produk ini agar muncul di toko?' 
      : 'Nonaktifkan produk ini? (Akan disembunyikan dari pelanggan)'
      
    if (confirm(confirmMessage)) {
      await toggleProductStatus(productId, newStatus)
      const data = await getAllProductsAdmin()
      setProducts(data)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-sans">Manajemen Produk</h1>
        {/* Fitur Tambah Produk bisa dikembangkan selanjutnya di sini */}
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors opacity-50 cursor-not-allowed" title="Fitur Tambah Produk dalam pengembangan">
          + Tambah Produk
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Produk</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">Harga (Rp)</th>
                <th className="px-6 py-4 font-semibold">Stok</th>
                <th className="px-6 py-4 font-semibold text-center">Status (Tampil)</th>
                <th className="px-6 py-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Memuat produk...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Belum ada produk.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">🥗</div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-semibold">
                        {product.categoryId === 1 ? 'Jus Segar' : 'Nasi Box'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {parseFloat(product.price).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${product.stock <= 5 ? 'text-red-500' : 'text-gray-700'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        product.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {product.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleToggleActive(product.id, product.isActive)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                          product.isActive 
                            ? 'text-red-600 border-red-200 hover:bg-red-50'
                            : 'text-green-600 border-green-200 hover:bg-green-50'
                        }`}
                      >
                        {product.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
