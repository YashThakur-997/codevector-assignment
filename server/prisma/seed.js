const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../generated/prisma/index.js'); // Keeping your exact generated path

// 1. Initialize the native pg Pool using your environment variable
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Wrap it inside Prisma's PostgreSQL adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter directly into the PrismaClient constructor
const prisma = new PrismaClient({ adapter });

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty'];
const PRODUCT_NAMES = ['Wireless Mouse', 'Running Shoes', 'Smart Watch', 'Coffee Mug', 'Leather Wallet', 'Yoga Mat'];

async function main() {
  console.log('🌱 Starting database seeding...');
  
  // Clean the database before seeding
  await prisma.product.deleteMany({});
  console.log('🗑️ Cleared existing products.');

  const TOTAL_RECORDS = 200000;
  const BATCH_SIZE = 5000; 
  const totalBatches = TOTAL_RECORDS / BATCH_SIZE;

  let baseTime = new Date();

  for (let b = 0; b < totalBatches; b++) {
    const productsChunk = [];

    for (let i = 0; i < BATCH_SIZE; i++) {
      const createdAt = new Date(baseTime.getTime() - (b * BATCH_SIZE + i) * 1000);

      productsChunk.push({
        name: `${PRODUCT_NAMES[i % PRODUCT_NAMES.length]} #${b * BATCH_SIZE + i}`,
        category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
        price: parseFloat((Math.random() * (500 - 10) + 10).toFixed(2)),
        createdAt: createdAt,
        updatedAt: createdAt,
      });
    }

    await prisma.product.createMany({
      data: productsChunk,
      skipDuplicates: true,
    });

    if ((b + 1) % 5 === 0 || b === totalBatches - 1) {
      console.log(`⏳ Progress: ${(((b + 1) / totalBatches) * 100).toFixed(0)}% (${(b + 1) * BATCH_SIZE}/${TOTAL_RECORDS} products seeded)`);
    }
  }

  console.log('✅ Seeding complete! 200,000 products added successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Clean up the pool connection
  });