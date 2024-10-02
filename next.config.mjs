/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      HUGGING_FACE_API_KEY: process.env.HUGGING_FACE_API_KEY,
    },
    eslint: {
      // Ignore ESLint errors during builds
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,  // Ignore TypeScript errors during build
    },
}

export default nextConfig;
