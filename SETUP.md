# 🚀 FreshBox Setup Guide

Panduan lengkap untuk setup dan menjalankan FreshBox E-Commerce Platform.

## ✅ Prerequisites

Sebelum memulai, pastikan Anda memiliki:
- Node.js 18+ dan npm/pnpm
- Akun Neon PostgreSQL
- Akun Stripe (untuk payment gateway)
- WhatsApp Business Account (opsional)

## 📦 Step-by-Step Installation

### 1️⃣ Clone dan Setup Project

```bash
# Clone repository
git clone <repository-url>
cd freshbox

# Install dependencies dengan pnpm
pnpm install
```

### 2️⃣ Setup Environment Variables

Buat file `.env.local` di root directory:

```env
# ============== DATABASE ==============
DATABASE_URL=postgresql://user:password@host:5432/neondb

# ============== AUTHENTICATION ==============
BETTER_AUTH_SECRET=generated_secret_key_min_32_chars
BETTER_AUTH_URL=http://localhost:3000

# ============== STRIPE (For Payments) ==============
STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

#### Generate BETTER_AUTH_SECRET

```bash
openssl rand -base64 32
```

### 3️⃣ Database Setup

Database sudah dibuat otomatis via Neon MCP saat development. Jika perlu reset:

```bash
# Via Neon console:
# 1. Buka https://console.neon.tech
# 2. Pilih project
# 3. Reset branch atau drop dan buat ulang database
```

### 4️⃣ Jalankan Development Server

```bash
pnpm dev
```

Akses aplikasi di: **http://localhost:3000**

## 🎯 Demo Credentials

Untuk testing, gunakan credentials ini:

```
Email: test@example.com
Password: test123456
```

Atau buat akun baru via Sign Up page.

## 📁 Directory Structure Highlights

```
freshbox/
├── app/
│   ├── page.tsx              # Homepage
│   ├── shop/                 # Product pages
│   ├── cart/                 # Shopping cart
│   ├── checkout/             # Payment & order
│   ├── orders/               # Order history
│   ├── api/auth/             # Authentication endpoints
│   └── actions/              # Server actions
├── components/
│   ├── navbar.tsx            # Navigation
│   ├── product-grid.tsx      # Product display
│   └── ui/                   # shadcn components
├── lib/
│   ├── auth.ts               # Auth configuration
│   └── db/
│       ├── index.ts          # Database client
│       └── schema.ts         # Database tables
└── README.md                 # Project documentation
```

## 🔧 Configuration

### Update Navbar Branding

Edit `components/navbar.tsx`:
```tsx
<span className="font-bold text-xl">FreshBox</span> // Ubah brand name
```

### Customize Colors

Edit `app/globals.css`:
```css
:root {
  --primary: #22C55E;      // Green
  --secondary: #F97316;    // Orange
  --background: #FFFFFF;
  --foreground: #1F2937;
}
```

### Add More Products

Login sebagai user, kemudian:
1. Edit `app/actions/products.ts`
2. Tambah data via database query
3. Atau gunakan admin panel (development)

## 🧪 Testing

### Test Authentication

```bash
# Sign Up
1. Buka http://localhost:3000/sign-up
2. Isi form dan klik Sign Up
3. Akan redirect ke homepage jika berhasil

# Sign In
1. Buka http://localhost:3000/sign-in
2. Masukkan email & password
3. Akan redirect ke homepage jika berhasil
```

### Test Product Flow

```bash
1. Buka http://localhost:3000/shop
2. Klik product untuk detail
3. Ubah quantity dan "Tambah ke Keranjang"
4. Lihat cart di http://localhost:3000/cart
5. Checkout dengan Stripe atau WhatsApp
```

### Test Orders

```bash
1. Setelah checkout, buka http://localhost:3000/orders
2. Lihat history pesanan
3. Status akan update sesuai payment
```

## 📊 Sample Data

Sample products sudah di-seed otomatis. Data includes:

**Kategori:**
- Jus Segar (4 produk)
- Nasi Box (4 produk)

**Produk Sample:**
- Jus Wortel Jeruk (Rp 35.000)
- Jus Apel Hijau (Rp 40.000)
- Jus Strawberry Banana (Rp 45.000)
- Jus Mangga Lassi (Rp 50.000)
- Nasi Box Ayam Goreng (Rp 65.000)
- Nasi Box Ikan Bakar (Rp 75.000)
- Dan lebih banyak lagi...

## 🚀 Deployment

### Deploy ke Vercel

```bash
# 1. Push ke GitHub
git add .
git commit -m "Initial FreshBox setup"
git push origin main

# 2. Connect ke Vercel
# - Buka vercel.com
# - Import project dari GitHub
# - Set environment variables
# - Deploy!

# 3. Set Environment Variables di Vercel:
# Dashboard → Settings → Environment Variables
# Tambahkan semua .env.local variables
```

### Production Checklist

- [ ] Set `BETTER_AUTH_URL` ke production domain
- [ ] Use production Stripe keys
- [ ] Enable HTTPS
- [ ] Setup email notifications
- [ ] Configure CDN untuk images
- [ ] Setup monitoring & logging
- [ ] Create admin account
- [ ] Test payment flow end-to-end

## 🔐 Security Notes

1. **Never commit .env.local** - Sudah di .gitignore
2. **Use strong BETTER_AUTH_SECRET** - Min 32 characters
3. **Stripe Webhook** - Configure di Stripe dashboard
4. **Database backups** - Enable di Neon console
5. **Admin access** - Restrict ke IP tertentu jika perlu

## 📱 Mobile Optimization

Aplikasi sudah fully responsive:
- ✅ Mobile (320px)
- ✅ Tablet (768px)
- ✅ Desktop (1024px+)

Test dengan Chrome DevTools:
```
F12 → Toggle device toolbar → Select device
```

## 🐛 Common Issues & Solutions

### "Module not found: Can't resolve '@/components/ui/card'"
```bash
# Solusi: Add shadcn components
pnpm dlx shadcn@latest add card input label button -y
```

### "DATABASE_URL is not set"
```bash
# Pastikan .env.local ada dengan DATABASE_URL
# Atau set di Vercel environment variables
```

### "BETTER_AUTH_SECRET is missing"
```bash
# Generate dan set di .env.local
openssl rand -base64 32
```

### Stripe payment tidak bekerja
```bash
# 1. Check Stripe keys di .env.local
# 2. Pastikan mode test/production konsisten
# 3. Lihat error di browser console (F12)
```

### Database query error
```bash
# 1. Check connection string
# 2. Lihat logs di Neon console
# 3. Verify table schema dengan:
SELECT * FROM information_schema.tables WHERE table_schema='public';
```

## 📚 Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Drizzle ORM**: https://orm.drizzle.team
- **Better Auth**: https://better-auth.vercel.app
- **Tailwind CSS**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com
- **Stripe Docs**: https://stripe.com/docs
- **Neon Docs**: https://neon.tech/docs

## 💡 Next Steps

1. ✅ Setup completed
2. ⬜ Customize branding
3. ⬜ Add real products
4. ⬜ Configure admin panel
5. ⬜ Setup email notifications
6. ⬜ Deploy to production
7. ⬜ Monitor & optimize

## 🤝 Support

Jika ada masalah:
1. Check README.md untuk dokumentasi
2. Lihat error di console (F12)
3. Check Neon/Stripe dashboards
4. Lihat `app/actions/` untuk server logic

---

**Ready to launch? Let's go! 🚀**
