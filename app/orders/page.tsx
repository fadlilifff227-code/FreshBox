'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { authClient } from '@/lib/auth-client'
import { Package, LogIn, FileCheck, Clock, CheckCircle2, Truck } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'
import { createWhatsAppStatusInquiryUrl, getAdminWhatsAppNumber } from '@/lib/whatsapp'

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const adminPhone = getAdminWhatsAppNumber()

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await authClient.getSession()
        setSession(data.data)

        if (!data.data?.user) {
          router.push('/sign-in')
          return
        }

        const ordersData = await getOrders()
        setOrders(ordersData)
      } catch (error) {
        console.error('Error loading orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar session={session} />
        <div className="text-center py-20">Sedang memuat riwayat pesanan...</div>
        <Footer />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar session={null} />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <LogIn size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 font-sans">Silakan Login</h1>
          <p className="text-muted-foreground mb-6">
            Anda perlu login untuk melihat riwayat pesanan Anda.
          </p>
          <Link
            href="/sign-in"
            className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Masuk Sekarang
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar session={session} />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 font-sans">Pesanan Saya</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Pantau status pesanan dan konfirmasi pengiriman langsung ke WhatsApp Admin FreshBox.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border">
            <Package size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2 font-sans">Belum Ada Pesanan</h2>
            <p className="text-muted-foreground mb-6">
              Anda belum memiliki pesanan aktif. Yuk coba jus segar dan menu lezat FreshBox!
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Mulai Berbelanja
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => {
              const whatsappInquiryUrl = createWhatsAppStatusInquiryUrl({
                orderId: order.id,
                customerName: order.customerName,
                customerPhone: order.customerPhone,
                customerAddress: order.notes?.includes('Alamat:')
                  ? order.notes.split('\n')[0].replace('Alamat:', '').trim()
                  : undefined,
                total: order.totalPrice,
                status: order.orderStatus === 'completed'
                  ? 'Selesai / Terkirim'
                  : order.orderStatus === 'processing'
                  ? 'Sedang Diproses'
                  : 'Pending (Menunggu Konfirmasi)',
                date: order.createdAt,
                phone: order.whatsappNumber || adminPhone,
              })

              const isCompleted = order.orderStatus === 'completed'
              const isProcessing = order.orderStatus === 'processing'

              return (
                <div
                  key={order.id}
                  className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-md">
                          #FB-{String(order.id).padStart(4, '0')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold font-sans mt-2 text-foreground">
                        {order.customerName}
                      </h3>
                    </div>

                    <div className="text-right w-full sm:w-auto">
                      <div className="text-2xl font-black text-primary font-sans">
                        Rp {parseFloat(order.totalPrice).toLocaleString('id-ID')}
                      </div>
                      <div className="mt-1 flex items-center justify-end gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            order.paymentStatus === 'completed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {order.paymentStatus === 'completed' ? 'Terbayar' : 'Menunggu Konfirmasi'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Progress Flow */}
                  <div className="my-6 p-4 bg-muted/30 rounded-xl border border-border/60">
                    <div className="overflow-hidden h-2 mb-3 text-xs flex rounded-full bg-border">
                      <div
                        style={{
                          width: isCompleted ? '100%' : isProcessing ? '50%' : '15%',
                        }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-500"
                      ></div>
                    </div>
                    <div className="grid grid-cols-3 text-xs font-bold text-center">
                      <div className={`flex flex-col items-center gap-1 ${order.orderStatus === 'pending' ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                        <Clock size={15} />
                        <span>Pesanan Masuk</span>
                      </div>
                      <div className={`flex flex-col items-center gap-1 ${isProcessing ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                        <Truck size={15} />
                        <span>Sedang Diproses</span>
                      </div>
                      <div className={`flex flex-col items-center gap-1 ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                        <CheckCircle2 size={15} />
                        <span>Selesai / Terkirim</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Meta info */}
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs border-t border-border pt-4 text-muted-foreground">
                    <div>
                      <span className="block font-medium text-foreground">Metode Bayar:</span>
                      <span className="capitalize">
                        {order.paymentMethod === 'stripe'
                          ? 'Kartu Kredit'
                          : order.paymentMethod === 'qris'
                          ? 'QRIS Standard'
                          : 'WhatsApp Transfer'}
                      </span>
                    </div>
                    <div>
                      <span className="block font-medium text-foreground">Kontak Penerima:</span>
                      <span>{order.customerPhone}</span>
                    </div>
                    {order.notes && (
                      <div className="sm:col-span-2 md:col-span-3 bg-muted/20 p-2.5 rounded-lg">
                        <span className="font-semibold text-foreground">Catatan / Alamat:</span>
                        <p className="mt-0.5 whitespace-pre-line text-foreground/80">{order.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="border-t border-border pt-4 mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <FileCheck size={14} className="text-primary" />
                      Status update otomatis dari admin
                    </div>

                    <a
                      href={whatsappInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold text-xs transition-colors shadow-sm"
                    >
                      <WhatsAppIcon size={16} className="text-white" />
                      Tanya Status via WhatsApp
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
