const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your custom config here (optional)
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);