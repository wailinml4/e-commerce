import Redis from 'ioredis'
import env from './env.js'

interface RedisClient {
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<'OK'>
  del(key: string): Promise<number>
}

const mockRedis: RedisClient = {
  get: async () => null,
  set: async () => 'OK',
  del: async () => 1,
}

const redis: RedisClient = (() => {
  if (env.REDIS_URL) {
    try {
      const redisClient = new Redis(env.REDIS_URL)
      console.log('Redis connected successfully')
      return redisClient
    } catch (error) {
      console.warn('Redis connection failed, using mock Redis:', (error as Error).message)
      return mockRedis
    }
  } else {
    console.warn('Redis URL not provided. Running without Redis cache.')
    return mockRedis
  }
})()

export default redis
