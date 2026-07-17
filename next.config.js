const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : 'localhost'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: supabaseHostname },
      { protocol: 'https', hostname: 'openweathermap.org' },
      { protocol: 'https', hostname: 'openrouter.ai' },
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
