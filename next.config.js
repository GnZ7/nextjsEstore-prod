/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },

  images: {
    remotePatterns: [
      {
        hostname: 'm.media-amazon.com'
      },
      {
        hostname: 'lh3.googleusercontent.com'
      },
      {
        hostname: 'firebasestorage.googleapis.com'
      }
    ]
  },
  reactStrictMode: false
}

module.exports = nextConfig
