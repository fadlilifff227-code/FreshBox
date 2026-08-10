import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Leaf, Users, Target, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar session={null} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 font-sans">Tentang FreshBox</h1>
          <p className="text-xl text-white/90">
            Kami berkomitmen untuk memberikan jus segar dan nasi box berkualitas tinggi
            dengan bahan-bahan premium terbaik untuk kesehatan Anda
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 font-sans">Kisah Kami</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            FreshBox didirikan dengan visi sederhana namun kuat: membuat makanan dan minuman
            sehat menjadi mudah diakses oleh semua orang. Kami percaya bahwa nutrisi yang baik
            adalah fondasi dari gaya hidup sehat.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Dengan tim profesional yang berpengalaman, kami memilih bahan-bahan terbaik setiap
            hari dari supplier terpercaya. Setiap produk kami dibuat dengan standar kebersihan
            dan kualitas tertinggi.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Hari ini, FreshBox telah melayani ribuan pelanggan yang puas dan terus berkembang
            untuk memberikan layanan terbaik.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center font-sans">Nilai-Nilai Kami</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Leaf className="w-12 h-12 text-primary" />,
                title: 'Kesegaran',
                desc: 'Bahan-bahan terbaik dipilih setiap hari',
              },
              {
                icon: <Target className="w-12 h-12 text-primary" />,
                title: 'Kualitas',
                desc: 'Standar tertinggi dalam setiap produk',
              },
              {
                icon: <Users className="w-12 h-12 text-primary" />,
                title: 'Pelayanan',
                desc: 'Kepuasan pelanggan adalah prioritas kami',
              },
              {
                icon: <Award className="w-12 h-12 text-primary" />,
                title: 'Inovasi',
                desc: 'Terus berkembang untuk memberikan yang terbaik',
              },
            ].map((value, idx) => (
              <div key={idx} className="bg-background rounded-xl p-8 text-center shadow-sm">
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3 font-sans">{value.title}</h3>
                <p className="text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 font-sans">Hubungi Kami</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-3 font-sans flex items-center justify-center gap-2">
                <span>📍</span> Lokasi
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Depok, Indonesia<br />
                Area Layanan: Depok & Sekitarnya
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-3 font-sans flex items-center justify-center gap-2">
                <span>📞</span> Kontak
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Telepon: +62 8951 7799 841<br />
                Email: aliffadli703@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
