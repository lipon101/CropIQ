/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cncwhlvvpljpjmjindne.supabase.co' },
      { protocol: 'https', hostname: 'openweathermap.org' },
      { protocol: 'https', hostname: 'openrouter.ai' },
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
