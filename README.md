<h1 align="center">E-Commerce Store 🛒</h1>

![Demo App](/frontend/public/screenshot-for-readme.png)

[Video Tutorial on Youtube](https://youtu.be/sX57TLIPNx8)

About This Course:

- 🚀 Project Setup
- 🗄️ Neon Postgres (Drizzle ORM) & Redis Integration
- 💳 Stripe Payment Setup
- 🔐 Robust Authentication System
- 🔑 JWT with Refresh/Access Tokens
- 📝 User Signup & Login
- 🛒 E-Commerce Core
- 📦 Product & Category Management
- 🛍️ Shopping Cart Functionality
- 💰 Checkout with Stripe
- 🏷️ Coupon Code System
- 👑 Admin Dashboard
- 📊 Sales Analytics
- 🎨 Design with Tailwind
- 🛒 Cart & Checkout Process
- 🔒 Security
- 🛡️ Data Protection
- 🚀Caching with Redis
- ⌛ And a lot more...

### Setup backend .env file

```bash
PORT=5000
DATABASE_URL=your_neon_postgres_connection_string
MONGO_URI=your_mongo_uri_for_one_time_migration_only

UPSTASH_REDIS_URL=your_redis_url

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Backend migration commands

```bash
cd backend
npm run db:generate
npm run db:migrate
npm run migrate:data
npm run verify:migration
```

Cutover procedure is documented in `backend/CUTOVER_RUNBOOK.md`.

### Run this app locally

```shell
npm run build
```

### Start the app

```shell
npm run start
```
