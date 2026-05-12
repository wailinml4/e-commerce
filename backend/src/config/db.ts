import { sql } from 'drizzle-orm'
import { db } from '../db/client.js'

const connectDB = async (): Promise<void> => {
  try {
    await db.execute(sql`select 1`)
    console.log('Neon Postgres connected')
  } catch (error) {
    console.error('Error connecting to Postgres:', (error as Error).message)
    process.exit(1)
  }
}

export default connectDB
