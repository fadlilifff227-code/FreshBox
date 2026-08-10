'use client'

import Link from 'next/link'
import { ShoppingCart, LogOut, LogIn, Menu, X } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Navbar({ session: propSession }: any) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { data: clientSession } = authClient.useSession()

  const session = propSession || (clientSession ? { user: clientSession.user } : null)

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/'
        },
      },
    })
  }

  return (
    <nav className="bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">🥗</span>
          </div>
          <span className="font-bold text-xl text-foreground hidden sm:inline">FreshBox</span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Beranda
          </Link>
          <Link href="/shop" className="text-foreground hover:text-primary transition-colors">
            Belanja
          </Link>
          <Link href="/about" className="text-foreground hover:text-primary transition-colors">
            Tentang Kami
          </Link>
        </div>

        {/* Auth section */}
        <div className="hidden md:flex items-center gap-4">
          {session?.user ? (
            <>
              <Link
                href="/cart"
                className="relative p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ShoppingCart size={24} className="text-foreground" />
              </Link>
              <Link
                href="/profile"
                className="relative p-2 hover:bg-muted rounded-lg transition-colors"
                title="Profil Saya"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="flex items-center gap-2 px-4 py-2 text-foreground hover:text-primary transition-colors"
              >
                <LogIn size={18} />
                Login
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-4 py-4 space-y-4">
            <Link href="/" className="block text-foreground hover:text-primary">
              Beranda
            </Link>
            <Link href="/shop" className="block text-foreground hover:text-primary">
              Belanja
            </Link>
            <Link href="/about" className="block text-foreground hover:text-primary">
              Tentang Kami
            </Link>
            {session?.user ? (
              <>
                <Link href="/orders" className="block text-foreground hover:text-primary">
                  Pesanan Saya
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="block px-4 py-2 text-foreground border border-border rounded-lg text-center"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  className="block px-4 py-2 bg-primary text-white rounded-lg text-center"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
