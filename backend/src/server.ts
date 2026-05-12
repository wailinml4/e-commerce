import app from './app.js'
import connectDB from './config/db.js'
import env from './config/env.js'

const PORT = env.PORT

const startServer = () => {
  app.listen(PORT, () => {
    console.log('Server is running on http://localhost:' + PORT)
    connectDB()
  })
}

startServer()
