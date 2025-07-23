import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    // 允许访问 vercel blob 的图片
    remotePatterns: [new URL(process.env.VERCEL_BLOB_DOMAIN as string)],
  },
}

export default nextConfig
