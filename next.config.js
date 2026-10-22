/** @type {import('next').NextConfig} */
const chessAiApiUrl = (process.env.CHESS_AI_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${chessAiApiUrl}/api/:path*` }]
  },
}

module.exports = nextConfig
