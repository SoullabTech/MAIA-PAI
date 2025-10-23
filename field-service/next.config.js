/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_SERVICE_NAME: 'Akashic Field Service',
  },
}

module.exports = nextConfig
