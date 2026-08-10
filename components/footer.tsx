export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🥗</span>
              </div>
              <span className="font-bold text-lg">FreshBox</span>
            </div>
            <p className="text-background/80">
              Jus segar dan nasi box berkualitas premium untuk gaya hidup sehat Anda.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Produk</h4>
            <ul className="space-y-2 text-background/80">
              <li><a href="/shop" className="hover:text-background transition-colors">Semua Produk</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Jus Segar</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Nasi Box</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Promo</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Perusahaan</h4>
            <ul className="space-y-2 text-background/80">
              <li><a href="/about" className="hover:text-background transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Karir</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Kontak</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Hubungi Kami</h4>
            <ul className="space-y-2 text-background/80">
              <li>📞 (+62) 8951 7799 841</li>
              <li>✉️ aliffadli703@gmail.com</li>
              <li>📍 Depok, Indonesia</li>
              <li className="pt-2 flex gap-4">
                <a href="#" className="hover:text-background">Facebook</a>
                <a href="#" className="hover:text-background">Instagram</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-background/70 text-sm">
            <p>&copy; 2024 FreshBox. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-background transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-background transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
