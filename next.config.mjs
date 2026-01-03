/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  generateBuildId: async () => {
    // Force a new build ID to bust cache
    return `build-${Date.now()}`
  },
}

export default nextConfig
