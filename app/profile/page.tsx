import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { User, Mail, Calendar, LogOut } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session?.user) {
    redirect('/sign-in')
  }

  const { user } = session

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 font-sans">Profil Saya</h1>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-primary/10 px-8 py-12 flex flex-col items-center justify-center border-b border-primary/20">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary text-4xl font-bold shadow-md mb-4 border-4 border-primary/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-primary font-medium">{(user as any).role === 'admin' ? 'Administrator' : 'Pelanggan Setia'}</p>
            </div>
            
            <div className="p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Informasi Akun</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg text-gray-600">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Nama Lengkap</p>
                    <p className="text-gray-900 font-semibold">{user.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg text-gray-600">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <p className="text-gray-900 font-semibold">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg text-gray-600">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Bergabung Sejak</p>
                    <p className="text-gray-900 font-semibold">
                      {new Date(user.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row gap-4">
                <Link href="/orders" className="flex-1 bg-primary text-white text-center py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm">
                  Lihat Riwayat Pesanan
                </Link>
                <Link href="/sign-in" className="flex-1 bg-red-50 text-red-600 text-center py-3 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                  <LogOut size={18} />
                  Keluar Akun
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
