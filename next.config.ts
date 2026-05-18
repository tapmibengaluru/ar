/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ar-experience',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;