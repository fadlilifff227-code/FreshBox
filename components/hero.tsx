'use client'

import Link from 'next/link'
import { CupSoda, Package } from 'lucide-react'

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-emerald-600 via-teal-600 via-amber-600 to-orange-600 py-24 px-4 relative overflow-hidden">
      {/* Decorative ambient blobs */}
      <div className="absolute -top-12 -left-12 w-72 h-72 bg-emerald-400/25 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-teal-300/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 right-12 w-80 h-80 bg-amber-400/25 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-lg">
          <span className="text-white font-semibold text-sm">✨ Kesehatan & Kelezatan Dimulai dari Sini</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-md">
          <span className="inline-block bg-gradient-to-r from-emerald-100 to-teal-200 bg-clip-text text-transparent mr-2">
            Jus Segar
          </span>
          <span className="text-white/80 font-normal">&</span>{' '}
          <span className="inline-block bg-gradient-to-r from-amber-100 to-orange-200 bg-clip-text text-transparent ml-1">
            Nasi Box
          </span>
          <span className="block text-4xl md:text-6xl mt-2 text-white font-bold">
            Berkualitas Tinggi
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-white/95 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-medium">
          Nikmati minuman dan makanan segar berkualitas premium yang dibuat khusus untuk memenuhi nutrisi optimal Anda setiap hari.
        </p>

        {/* Category Highlights */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-10">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-950/40 border border-emerald-300/40 backdrop-blur-md shadow-lg text-white">
            <div className="p-2 rounded-xl bg-emerald-500/30 text-emerald-200">
              <CupSoda className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-xs uppercase tracking-wider text-emerald-200 font-bold">Kategori 1</p>
              <p className="text-base font-bold text-white">Jus Buah Murni 100%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-950/40 border border-amber-300/40 backdrop-blur-md shadow-lg text-white">
            <div className="p-2 rounded-xl bg-amber-500/30 text-amber-200">
              <Package className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-xs uppercase tracking-wider text-amber-200 font-bold">Kategori 2</p>
              <p className="text-base font-bold text-white">Nasi Box Komplit</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-white text-emerald-800 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-all duration-200 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            Mulai Berbelanja
          </Link>
          <Link
            href="#why-us"
            className="inline-flex items-center justify-center border-2 border-white/80 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all duration-200 text-lg backdrop-blur-sm shadow-md"
          >
            Pelajari Lebih Lanjut
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 pt-12 border-t border-white/25">
          {[
            { number: '500+', label: 'Pelanggan Puas' },
            { number: '100%', label: 'Bahan Segar' },
            { number: '24/7', label: 'Layanan Siap' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.number}</div>
              <p className="text-white/90 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

