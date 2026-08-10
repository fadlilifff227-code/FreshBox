# FreshBox - Jus Segar & Nasi Box E-Commerce Platform

Selamat datang di **FreshBox**, platform e-commerce modern untuk penjualan jus segar dan nasi box berkualitas premium. Dibangun dengan teknologi terkini untuk memberikan pengalaman berbelanja terbaik.

## 🌟 Fitur Utama

### Untuk Pelanggan
- **🛍️ Belanja Mudah** - Interface yang user-friendly untuk browsing dan memilih produk
- **🥗 Produk Berkualitas** - Jus segar dan nasi box dibuat dari bahan-bahan premium terbaik
- **💳 Pembayaran Fleksibel** - Dua metode pembayaran tersedia:
  - **Stripe**: Pembayaran kartu kredit/debit yang aman
  - **WhatsApp**: Hubungi admin via WhatsApp untuk konfirmasi pesanan
- **🛒 Keranjang Pintar** - Kelola keranjang belanja dengan mudah
- **📦 Tracking Pesanan** - Lihat status pesanan secara real-time
- **👤 Akun Pribadi** - Riwayat pesanan dan profil yang aman

### Untuk Admin
- **📊 Dashboard Admin** - Kelola produk dan pesanan dengan mudah
- **🏷️ Manajemen Produk** - Tambah, edit, atau hapus produk
- **🎯 Manajemen Kategori** - Organisir produk ke dalam kategori
- **📋 Manajemen Pesanan** - Pantau dan proses semua pesanan
- **🎁 Promo & Diskon** - Buat kode promo untuk pelanggan
- **🔐 Sistem Keamanan** - Autentikasi yang aman dengan Better Auth

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS v4, shadcn/ui |
| **Backend** | Next.js API Routes, Server Actions |
| **Database** | Neon PostgreSQL |
| **ORM** | Drizzle ORM |
| **Auth** | Better Auth (Email + Password) |
| **Payment** | Stripe, WhatsApp Integration |
| **Icons** | Lucide React |

## 📋 Struktur Proyek

```
freshbox/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles dengan design system
│   ├── api/auth/[...all]/     # Better Auth handler
│   ├── sign-in/page.tsx       # Login page
│   ├── sign-up/page.tsx       # Registration page
│   ├── shop/
│   │   ├── page.tsx           # Shop listing
│   │   └── [id]/page.tsx      # Product detail
│   ├── cart/page.tsx          # Shopping cart
│   ├── checkout/
│   │   ├── page.tsx           # Checkout form
│   │   ├── success/page.tsx    # Payment success
│   │   └── cancel/page.tsx     # Payment canceled
│   ├── orders/page.tsx        # Order history
│   ├── about/page.tsx         # About page
│   └── actions/
│       ├── products.ts        # Product server actions
│       └── orders.ts          # Order server actions
├── components/
│   ├── navbar.tsx             # Navigation bar
│   ├── hero.tsx               # Hero section
│   ├── product-grid.tsx       # Product showcase
│   ├── footer.tsx             # Footer
│   ├── auth-form.tsx          # Auth form
│   └── ui/                    # shadcn components
├── lib/
│   ├── auth.ts               # Better Auth config
│   ├── auth-client.ts        # Auth client hooks
│   └── db/
│       ├── index.ts          # Drizzle client
│       └── schema.ts         # Database schema
└── public/                   # Static assets
```

## 🗄️ Database Schema

### Tabel Utama

**users** (Better Auth)
- id, email, name, image, emailVerified, createdAt, updatedAt

**products**
- id, name, description, price, categoryId, imageUrl, stock, isActive, createdAt, updatedAt

**categories**
- id, name, description, imageUrl, createdAt, updatedAt

**orders**
- id, userId, customerName, customerEmail, customerPhone, totalPrice, paymentMethod, paymentStatus, orderStatus, notes, whatsappNumber, stripePaymentId, createdAt, updatedAt

**order_items**
- id, orderId, productId, quantity, pricePerItem, createdAt

**promos**
- id, code, discountPercentage, discountAmount, maxUses, currentUses, isActive, expiresAt, createdAt, updatedAt

## 🎨 Desain & Brand

### Warna
- **Primary (Green)**: `#22C55E` - Kesegaran dan kesehatan
- **Secondary (Orange)**: `#F97316` - Energi dan kelezatan
- **Background**: `#FFFFFF` - Bersih dan modern
- **Foreground**: `#1F2937` - Teks gelap untuk readability

### Font
- **Heading**: Poppins (Bold, 600-800)
- **Body**: Inter (Regular, 400-600)

## ⚙️ Setup & Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd freshbox
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root project:

```env
# Database
DATABASE_URL=your_neon_postgresql_url

# Better Auth
BETTER_AUTH_SECRET=your_secret_key (generate: openssl rand -base64 32)
BETTER_AUTH_URL=http://localhost:3000

# Stripe (optional)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Setup Database

```bash
# Schema sudah dibuat via Neon MCP
# Jalankan seed data jika perlu
pnpm db:seed
```

### 5. Jalankan Dev Server
```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 🚀 Deployment

### Deploy ke Vercel

```bash
# Push ke GitHub
git push origin main

# Vercel akan auto-deploy dari GitHub
# Set environment variables di Vercel dashboard
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/sign-up` - Registrasi
- `POST /api/auth/sign-in` - Login
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Get session

### Products
- `GET /api/products` - List semua produk
- `GET /api/products/[id]` - Detail produk
- `POST /api/products` - Create (admin)
- `PUT /api/products/[id]` - Update (admin)
- `DELETE /api/products/[id]` - Delete (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List orders user
- `GET /api/orders/[id]` - Detail order
- `PUT /api/orders/[id]` - Update status (admin)

## 🔐 Keamanan

- **Email Verification**: Better Auth menangani verifikasi email
- **Session Management**: Secure session cookies dengan SameSite protection
- **Per-User Scoping**: Setiap query difilter berdasarkan userId
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM
- **CORS Protection**: Configured untuk production

## 📱 Mobile Responsive

Desain fully responsive untuk:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## ✅ Checklist Fitur

### MVP (Minimum Viable Product)
- [x] Homepage dengan hero section
- [x] Product listing & filtering
- [x] Product detail page
- [x] Shopping cart
- [x] User authentication
- [x] Checkout flow
- [x] Order history
- [x] Stripe integration
- [x] WhatsApp integration
- [x] Admin dashboard (basic)

### Phase 2 (Planned)
- [ ] Advanced admin dashboard
- [ ] Analytics & reporting
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Subscription plans
- [ ] Reviews & ratings
- [ ] Wishlist
- [ ] Referral program
- [ ] Loyalty points

## 🐛 Troubleshooting

### Database Connection Error
```
Error: could not connect to database
```
**Solusi**: Periksa `DATABASE_URL` di `.env.local` dan pastikan Neon project active.

### Auth Secret Missing
```
Error: BETTER_AUTH_SECRET is not set
```
**Solusi**: Generate secret dengan `openssl rand -base64 32` dan set di `.env.local`.

### Stripe Payment Failed
```
Error: Stripe API key invalid
```
**Solusi**: Pastikan `STRIPE_SECRET_KEY` benar dan environment adalah test/production yang konsisten.

## 📞 Support & Contact

- 📧 Email: support@freshbox.id
- 📞 Telepon: (021) 1234-5678
- 📍 Lokasi: Jakarta, Indonesia
- 🌐 Website: https://freshbox.id

## 📄 License

MIT License - Bebas digunakan untuk project komersial maupun personal.

## 🙏 Terima Kasih

Dibangun dengan ❤️ menggunakan:
- Next.js 16
- Neon PostgreSQL
- Tailwind CSS
- Stripe
- Better Auth

---

**Happy Coding! 🚀**
