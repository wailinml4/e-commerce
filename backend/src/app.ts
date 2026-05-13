import express, { Express, Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'

import authRoutes from './routes/auth.route.js'
import productRoutes from './routes/product.route.js'
import cartRoutes from './routes/cart.route.js'
import couponRoutes from './routes/coupon.route.js'
import paymentRoutes from './routes/payment.route.js'
import analyticsRoutes from './routes/analytics.route.js'
import orderRoutes from './routes/order.route.js'
import wishlistRoutes from './routes/wishlist.route.js'
import userRoutes from './routes/user.route.js'

import errorHandler from './middleware/errorHandler.js'
import env from './config/env.js'

const app = express()

const __dirname = path.resolve()

app.use(helmet())
if (env.NODE_ENV === 'production') {
  app.use(
    cors({
      origin: [env.FRONTEND_URL, /\.vercel\.app$/],
      credentials: true,
    }),
  )
} else {
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  )
}
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

app.use((req: Request, res: Response, next: NextFunction) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')
  next()
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/users', userRoutes)

app.use(errorHandler)

if (env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')))

  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  })
}

export default app
