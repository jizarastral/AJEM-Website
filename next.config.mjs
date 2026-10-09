/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'development' ? undefined : 'export',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,  // Keep if you want to skip TS errors
  },
}

export default nextConfig