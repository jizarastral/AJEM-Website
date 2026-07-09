/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // ← Add this for static export
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,  // Keep if you want to skip TS errors
  },
}

export default nextConfig