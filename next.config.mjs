/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      HUGGING_FACE_API_KEY: process.env.HUGGING_FACE_API_KEY,
    },
  }
  
  export default nextConfig;
