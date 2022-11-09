/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['duck.art', 'duck.mypinata.cloud'],
    unoptimized: true,
  }
}

module.exports = nextConfig