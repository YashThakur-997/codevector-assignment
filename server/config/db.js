const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../generated/prisma'); // Points to your custom generated folder

const connectionString = process.env.DATABASE_URL;

// Identify if we are running in production on Render
const isProduction = process.env.NODE_ENV === 'production' || (connectionString && connectionString.includes('supabase.com'));

let poolConfig = { connectionString };

if (isProduction) {
  // Path to your newly downloaded certificate file
  const certPath = path.join(__dirname, 'prod-ca-2021.crt');
  
  poolConfig.ssl = {
    rejectUnauthorized: true, // Keep validation on for security
    ca: fs.readFileSync(certPath).toString(), // Inject the Supabase Certificate Authority data
  };
} else {
  // Local environment setup (doesn't use SSL)
  poolConfig.ssl = false;
}

const pool = new Pool(poolConfig);
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = { prisma };