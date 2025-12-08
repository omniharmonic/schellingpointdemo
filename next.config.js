/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  reactStrictMode: true,
  // Only use static export and basePath for production builds (GitHub Pages)
  ...(isProd && {
    output: 'export',
    basePath: '/schellingpointdemo',
  }),
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
