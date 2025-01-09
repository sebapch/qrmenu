/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['platosqrmenu.s3.amazonaws.com'], // Reemplaza con el dominio de tu bucket
    },
};

export default nextConfig;
