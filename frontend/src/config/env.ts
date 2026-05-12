const env = {
  VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  VITE_STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
}

export default env
