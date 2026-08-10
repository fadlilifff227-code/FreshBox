import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './lib/db/schema'
import * as dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
const db = drizzle(pool, { schema })

async function seed() {
  console.log('Seeding data...')
  
  // Clear existing data to avoid duplicates
  await db.delete(schema.orderItems)
  await db.delete(schema.orders)
  await db.delete(schema.products)
  await db.delete(schema.categories)

  // Insert Categories
  const insertedCategories = await db.insert(schema.categories).values([
    {
      name: 'Jus Segar',
      description: 'Minuman jus buah segar pilihan yang dibuat dari buah asli 100%.',
      imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80'
    },
    {
      name: 'Nasi Box',
      description: 'Paket nasi kotak dengan lauk pauk lezat dan bergizi untuk acara atau makan siang Anda.',
      imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&q=80'
    }
  ]).returning()
  
  const jusCatId = insertedCategories[0].id
  const nasiBoxCatId = insertedCategories[1].id
  
  // Insert Products (12 items total)
  await db.insert(schema.products).values([
    // JUICES
    {
      name: 'Jus Jeruk Peras Asli',
      description: 'Jus jeruk segar yang diperas langsung dari jeruk pilihan berkualitas manis, kaya vitamin C.',
      price: '15000.00',
      categoryId: jusCatId,
      imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80',
      stock: 50,
      isActive: true,
    },
    {
      name: 'Jus Melon Hijau',
      description: 'Sensasi kesegaran buah melon hijau manis dengan es yang menyejukkan dahaga.',
      price: '16000.00',
      categoryId: jusCatId,
      imageUrl: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=800&q=80',
      stock: 45,
      isActive: true,
    },
    {
      name: 'Jus Strawberry Manis',
      description: 'Campuran strawberry segar dengan sedikit susu kental manis yang menghasilkan rasa asam manis pas.',
      price: '18000.00',
      categoryId: jusCatId,
      imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&q=80',
      stock: 30,
      isActive: true,
    },
    {
      name: 'Jus Mangga Harum Manis',
      description: 'Terbuat dari mangga harum manis matang pohon, kental, manis, dan mengenyangkan.',
      price: '18000.00',
      categoryId: jusCatId,
      imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&q=80',
      stock: 40,
      isActive: true,
    },
    {
      name: 'Jus Semangka Segar',
      description: 'Sari buah semangka asli tanpa tambahan gula merah, murni manis dan menyegarkan.',
      price: '15000.00',
      categoryId: jusCatId,
      imageUrl: 'https://images.unsplash.com/photo-1638176066423-774f76dc9145?w=800&q=80',
      stock: 35,
      isActive: true,
    },
    {
      name: 'Jus Alpukat Coklat Legit',
      description: 'Perpaduan sempurna alpukat mentega segar dengan taburan susu kental manis coklat yang legit.',
      price: '20000.00',
      categoryId: jusCatId,
      imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=800&q=80',
      stock: 25,
      isActive: true,
    },
    
    // NASI BOX
    {
      name: 'Nasi Box Ayam Bakar Madu',
      description: 'Nasi putih pulen disajikan dengan ayam bakar madu spesial, tahu, tempe, lalapan segar, dan sambal terasi.',
      price: '28000.00',
      categoryId: nasiBoxCatId,
      imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&q=80',
      stock: 30,
      isActive: true,
    },
    {
      name: 'Nasi Box Rendang Sapi Asli',
      description: 'Paket nasi lengkap dengan rendang daging sapi empuk bumbu Padang, daun singkong rebus, dan sambal ijo.',
      price: '35000.00',
      categoryId: nasiBoxCatId,
      imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80',
      stock: 20,
      isActive: true,
    },
    {
      name: 'Nasi Kuning Komplit',
      description: 'Nasi kuning gurih dengan lauk ayam goreng, telur iris, kering tempe, perkedel, dan sambal goreng.',
      price: '25000.00',
      categoryId: nasiBoxCatId,
      imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80',
      stock: 25,
      isActive: true,
    },
    {
      name: 'Nasi Box Ayam Geprek Mozzarella',
      description: 'Nasi hangat dengan ayam geprek renyah pedas level sedang, dilelehkan keju mozzarella di atasnya.',
      price: '30000.00',
      categoryId: nasiBoxCatId,
      imageUrl: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=800&q=80',
      stock: 35,
      isActive: true,
    },
    {
      name: 'Nasi Box Gurame Asam Manis',
      description: 'Fillet gurame goreng tepung disiram saus asam manis lezat, dilengkapi sayur capcay dan kerupuk udang.',
      price: '40000.00',
      categoryId: nasiBoxCatId,
      imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80',
      stock: 15,
      isActive: true,
    },
    {
      name: 'Nasi Liwet Sunda',
      description: 'Nasi liwet khas Sunda yang wangi, dengan ikan asin peda, tahu goreng, lalapan daun pohpohan, dan sambal terasi.',
      price: '27000.00',
      categoryId: nasiBoxCatId,
      imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80',
      stock: 20,
      isActive: true,
    }
  ])
  
  console.log('Seeding completed successfully!')
  process.exit(0)
}

seed().catch(err => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
