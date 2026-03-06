/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // TODO: Fix all ESLint errors then set to false
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TODO: Fix all TypeScript errors then set to false
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
