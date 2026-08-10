import { requireAdmin } from '@/lib/admin-auth'
import Link from 'next/link'
import { LayoutDashboard, ShoppingBag, Package, LogOut, ArrowLeft, Tag, Users } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col hidden md:flex text-gray-300">
        <div className="h-16 flex items-center px-6 border-b border-gray-800 bg-gray-950">
          <Link href="/" className="text-xl font-bold text-white font-sans flex items-center gap-2 hover:text-primary transition-colors">
            <ArrowLeft size={18} />
            FreshBox Admin
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-all font-medium">
            <LayoutDashboard size={20} className="text-gray-400" />
            Dashboard
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-all font-medium">
            <ShoppingBag size={20} className="text-gray-400" />
            Pesanan
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-all font-medium">
            <Package size={20} className="text-gray-400" />
            Produk
          </Link>
          <Link href="/admin/promos" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-all font-medium">
            <Tag size={20} className="text-gray-400" />
            Promo
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-all font-medium">
            <Users size={20} className="text-gray-400" />
            Pengguna
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800 bg-gray-950">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-inner">
              {admin.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{admin.name}</p>
              <p className="text-xs text-gray-500 truncate">{admin.email}</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors font-medium w-full">
            <LogOut size={20} />
            Keluar Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold text-primary font-sans">
            FreshBox Admin
          </Link>
          <div className="flex gap-4">
             <Link href="/admin/orders"><ShoppingBag size={24} className="text-gray-700" /></Link>
             <Link href="/admin/products"><Package size={24} className="text-gray-700" /></Link>
          </div>
        </div>
        
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
