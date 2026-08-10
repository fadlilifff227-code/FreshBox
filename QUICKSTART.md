# ⚡ FreshBox Quick Start

Mulai dalam 5 menit!

## 1️⃣ Install & Run

```bash
pnpm install
pnpm dev
```

Buka: **http://localhost:3000** ✨

## 2️⃣ Create .env.local

```env
DATABASE_URL=your_neon_url
BETTER_AUTH_SECRET=your_secret (generate: openssl rand -base64 32)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
```

## 3️⃣ Create Account

- Buka http://localhost:3000/sign-up
- Isi email & password
- Selesai! ✅

## 4️⃣ Explore

- 🏪 **Shop**: http://localhost:3000/shop
- 🛒 **Cart**: http://localhost:3000/cart
- 📦 **Orders**: http://localhost:3000/orders (perlu login)
- 📖 **About**: http://localhost:3000/about

## 💳 Stripe Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

Exp: Any future date | CVC: Any 3 digits

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Homepage |
| `app/shop/` | Product pages |
| `components/` | UI components |
| `lib/db/schema.ts` | Database tables |
| `app/actions/` | Server logic |

## 🎨 Customize

**Change colors** → `app/globals.css`
**Change brand** → `components/navbar.tsx`
**Add products** → `app/actions/products.ts`

## 🚀 Deploy to Vercel

```bash
git push origin main
# Then connect to Vercel via dashboard
# Set env variables in Vercel
# Done! 🎉
```

## 📞 Need Help?

Check `README.md` or `SETUP.md` for details.

---

**Enjoy building! 🚀**
