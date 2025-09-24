/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['socket.io']
  }
}

module.exports = nextConfig
