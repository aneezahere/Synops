/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      HUGGING_FACE_API_KEY: process.env.HUGGING_FACE_API_KEY,
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
}

export default nextConfig;
