const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../generated/prisma'); 

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ ERROR: DATABASE_URL is undefined in your environment variables!");
}

const isProduction = process.env.NODE_ENV === 'production' || (connectionString && connectionString.includes('supabase.com'));

const pool = new Pool({ 
  connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

console.log("=== DB.JS DIAGNOSTIC ===");
console.log("Is Production Detection:", isProduction);
console.log("Prisma Client Defined:", !!prisma);
console.log("========================");

module.exports = { prisma };