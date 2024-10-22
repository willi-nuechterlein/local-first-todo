/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@electric-sql/pglite-react",
    "@electric-sql/pglite",
  ],
};

export default nextConfig;
