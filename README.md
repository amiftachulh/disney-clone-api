# Install Dependencies

To install dependencies:

```sh
bun install
```

# MySQL

Run MySQL server and add `disney_clone` database using GUI or run:

```sql
CREATE DATABASE disney_clone;
```

# Create Tables using Prisma

Run this command to create tables using prisma:

```sh
bunx prisma db push
```

or run migration:

```sh
bunx prisma migrate dev
```

# Prisma Generate

If prisma not generating types after db push or migration, run:

```sh
bunx prisma generate
```

# Set .env

Copy .env.example and rename it to .env

# Run Development Server

To run:

```sh
bun run dev
```

open http://localhost:3000
