'use client'

import { useEffect, useState } from 'react'
import { getAllPromosAdmin, createPromo, togglePromoStatus } from '@/app/actions/admin'

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newPromo, setNewPromo] = useState({ code: '', discountPercentage: '', discountAmount: '', maxUses: '' })

  const fetchPromos = async () => {
    try {
      const data = await getAllPromosAdmin()
      setPromos(data)
    } catch (error) {
      console.error('Error fetching promos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPromos()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      await createPromo({
        code: newPromo.code,
        discountPercentage: newPromo.discountPercentage ? parseFloat(newPromo.discountPercentage) : undefined,
        discountAmount: newPromo.discountAmount ? parseFloat(newPromo.discountAmount) : undefined,
        maxUses: newPromo.maxUses ? parseInt(newPromo.maxUses) : undefined,
      })
      setNewPromo({ code: '', discountPercentage: '', discountAmount: '', maxUses: '' })
      await fetchPromos()
    } catch (error) {
      console.error(error)
      alert('Gagal membuat promo. Pastikan kode unik.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleToggleActive = async (promoId: number, currentStatus: boolean) => {
    if (confirm(currentStatus ? 'Nonaktifkan promo ini?' : 'Aktifkan promo ini?')) {
      await togglePromoStatus(promoId, !currentStatus)
      await fetchPromos()
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 font-sans">Manajemen Promo</h1>

      {/* Form Tambah Promo */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-bold mb-4 font-sans">Buat Kode Promo Baru</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Kode Unik</label>
            <input required value={newPromo.code} onChange={e => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})} placeholder="DISC20" className="w-full border rounded-lg px-3 py-2 text-sm uppercase" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Diskon (%)</label>
            <input type="number" min="0" max="100" value={newPromo.discountPercentage} onChange={e => setNewPromo({...newPromo, discountPercentage: e.target.value, discountAmount: ''})} placeholder="10" className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Diskon (Rp)</label>
            <input type="number" min="0" value={newPromo.discountAmount} onChange={e => setNewPromo({...newPromo, discountAmount: e.target.value, discountPercentage: ''})} placeholder="15000" className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Batas Kuota Pengguna</label>
            <input type="number" min="1" value={newPromo.maxUses} onChange={e => setNewPromo({...newPromo, maxUses: e.target.value})} placeholder="100" className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <button type="submit" disabled={isCreating} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors h-[38px] flex items-center justify-center">
            {isCreating ? 'Menyimpan...' : 'Buat Promo'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Kode</th>
              <th className="px-6 py-4 font-semibold">Diskon</th>
              <th className="px-6 py-4 font-semibold">Penggunaan</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-6 py-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center">Memuat promo...</td></tr>
            ) : promos.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center">Belum ada promo.</td></tr>
            ) : (
              promos.map((promo) => (
                <tr key={promo.id}>
                  <td className="px-6 py-4 font-bold text-gray-900 tracking-wider">{promo.code}</td>
                  <td className="px-6 py-4 font-medium text-primary">
                    {promo.discountPercentage ? `${promo.discountPercentage}%` : `Rp ${parseFloat(promo.discountAmount).toLocaleString('id-ID')}`}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-500">
                    {promo.currentUses} / {promo.maxUses || '∞'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${promo.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {promo.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleToggleActive(promo.id, promo.isActive)} className="text-xs font-bold text-gray-600 underline hover:text-gray-900">
                      {promo.isActive ? 'Matikan' : 'Hidupkan'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
