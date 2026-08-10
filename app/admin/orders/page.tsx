'use client'

import { useEffect, useState } from 'react'
import { getAllOrders, updateOrderStatus, updatePaymentStatus } from '@/app/actions/admin'
import { MapPin } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'
import { formatWhatsAppNumber } from '@/lib/whatsapp'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders()
        setOrders(data)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId: number, status: string) => {
    if (confirm('Anda yakin ingin mengubah status pesanan ini?')) {
      await updateOrderStatus(orderId, status)
      const data = await getAllOrders()
      setOrders(data)
    }
  }

  const handlePaymentChange = async (orderId: number, status: string) => {
    if (confirm('Anda yakin ingin mengubah status pembayaran ini?')) {
      await updatePaymentStatus(orderId, status)
      const data = await getAllOrders()
      setOrders(data)
    }
  }

  const sendWhatsAppUpdate = (order: any) => {
    const phone = order.customerPhone || order.whatsappNumber
    if (!phone) {
      alert('Nomor telepon pelanggan tidak tersedia.')
      return
    }

    const formattedPhone = formatWhatsAppNumber(phone)
    const statusText =
      order.orderStatus === 'completed'
        ? 'Selesai / Terkirim'
        : order.orderStatus === 'processing'
        ? 'Sedang Diproses'
        : 'Pesanan Diterima (Pending)'

    const orderDate = new Date(order.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB'

    const addressText = order.notes?.includes('Alamat:')
      ? order.notes.split('\n')[0].replace('Alamat:', '').trim()
      : '-'

    let message = `Halo Kak ${order.customerName},\nKami dari FreshBox menginformasikan detail pesanan Anda:\n\n`
    message += `PESANAN FRESHBOX\n\n`
    message += `ID Order : #FB-${String(order.id).padStart(4, '0')}\n`
    message += `Nama     : ${order.customerName}\n`
    message += `No HP    : ${order.customerPhone || '-'}\n`
    message += `Alamat   : ${addressText}\n`
    message += `Total    : Rp ${parseFloat(order.totalPrice).toLocaleString('id-ID')}\n`
    message += `Status   : ${statusText}\n`
    message += `Tanggal  : ${orderDate}\n\n`
    message += `Pesanan Anda sedang kami proses. Terima kasih telah memesan di FreshBox.`

    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-sans">Manajemen Pesanan</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola pesanan pelanggan dan kirim notifikasi update via WhatsApp dengan 1-klik.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">ID Pesanan</th>
                <th className="px-6 py-4 font-semibold">Pelanggan</th>
                <th className="px-6 py-4 font-semibold">Total (Rp)</th>
                <th className="px-6 py-4 font-semibold">Metode</th>
                <th className="px-6 py-4 font-semibold">Status Bayar</th>
                <th className="px-6 py-4 font-semibold">Status Pesanan</th>
                <th className="px-6 py-4 font-semibold">Aksi WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Memuat pesanan...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Belum ada pesanan masuk.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">
                        #FB-{order.id.toString().padStart(4, '0')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.customerPhone}</div>
                      {order.notes && (
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="mt-1 text-[11px] text-emerald-600 hover:underline flex items-center gap-1 font-medium"
                        >
                          <MapPin size={11} />
                          Lihat Alamat / Catatan
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">
                      {parseFloat(order.totalPrice).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 uppercase font-bold text-[11px] tracking-wider text-gray-700">
                      {order.paymentMethod}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => handlePaymentChange(order.id, e.target.value)}
                        className={`text-xs font-bold rounded-full px-3 py-1 border outline-none cursor-pointer ${
                          order.paymentStatus === 'completed'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold rounded-full px-3 py-1 border outline-none cursor-pointer ${
                          order.orderStatus === 'completed'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : order.orderStatus === 'processing'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => sendWhatsAppUpdate(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors border border-emerald-200"
                        title="Kirim pesan update ke WhatsApp pelanggan"
                      >
                        <WhatsAppIcon size={14} className="text-[#25D366]" />
                        Chat Pelanggan
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View Details / Notes */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              Detail Alamat & Catatan #FB-{String(selectedOrder.id).padStart(4, '0')}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Pelanggan: <span className="font-semibold text-gray-800">{selectedOrder.customerName}</span> ({selectedOrder.customerPhone})
            </p>

            <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-700 whitespace-pre-line leading-relaxed border border-gray-200 mb-6">
              {selectedOrder.notes || 'Tidak ada catatan khusus.'}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  sendWhatsAppUpdate(selectedOrder)
                  setSelectedOrder(null)
                }}
                className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <WhatsAppIcon size={16} className="text-white" />
                Hubungi via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
