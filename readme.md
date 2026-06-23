# Product Pagination Backend

A simple, high-performance Node.js backend built with Express and Prisma to handle efficient product data pagination.

## 📁 Directory Structure

```text
codevector-assignment/
└── server/
    ├── config/
    │   └── db.js          # Initializes and exports the Prisma database client
    ├── controllers/
    │   └── products.js    # Logic for handling product pagination queries
    ├── generated/
    │   └── prisma/        # Custom output folder where the Prisma Client is built
    ├── routes/
    │   └── products.js    # Maps the API endpoints to the controllers
    ├── prisma/
    │   └── schema.prisma  # Database models and custom output configuration
    ├── .env               # Local environment variables (DATABASE_URL, etc.)
    └── index.js           # Server entry point (app initialization & port listener)