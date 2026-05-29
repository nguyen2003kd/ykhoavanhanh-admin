const BUFFER_KEY = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_KEY_BUFFER : ''
const SECRET_KEY = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_KEY_SECRET : ''

if (!BUFFER_KEY || !SECRET_KEY) {
  console.error('Missing env vars: NEXT_PUBLIC_KEY_BUFFER and/or NEXT_PUBLIC_KEY_SECRET')
  throw new Error('Invalid .env variable values')
}

export const envConfig = {
  BUFFER_KEY,
  SECRET_KEY
}
export default envConfig
