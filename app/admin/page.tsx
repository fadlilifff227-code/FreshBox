import { getDashboardStats } from '@/app/actions/admin'
import { DollarSign, ShoppingBag, Package, Users } from 'lucide-react'

import AdminChart from './admin-chart'

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 font-sans">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-semibold text-sm uppercase">Total Pendapatan</h3>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold font-sans">
            Rp {stats.totalRevenue.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-semibold text-sm uppercase">Total Pesanan</h3>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <ShoppingBag size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold font-sans">
            {stats.totalOrders}
          </p>
        </div>

        {/* Products Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-semibold text-sm uppercase">Produk Aktif</h3>
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <Package size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold font-sans">
            {stats.activeProducts}
          </p>
        </div>

        {/* Customers Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-semibold text-sm uppercase">Total Pelanggan</h3>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Users size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold font-sans">
            {stats.totalCustomers}
          </p>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 font-sans">Statistik Penjualan 7 Hari Terakhir</h2>
        <AdminChart />
      </div>
    </div>
  )
}
