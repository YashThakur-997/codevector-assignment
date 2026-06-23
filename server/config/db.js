const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// FIX THIS LINE HERE: Point it to the standard Prisma Client location
const { PrismaClient } = require('../generated/prisma'); // Keeping your exact generated path

const connectionString = process.env.DATABASE_URL;

// Environment checker
const isProduction = process.env.NODE_ENV === 'production' || connectionString.includes('supabase.com');

const pool = new Pool({ 
  connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = { prisma };