import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        authInterrupts: true,
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },

    serverExternalPackages: ["cloudinary"],

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],
    },

    // Mejorar Fast Refresh
    reactStrictMode: true,

    // Configuración para desarrollo
    ...(process.env.NODE_ENV === "development" && {
        onDemandEntries: {
            maxInactiveAge: 25 * 1000,
            pagesBufferLength: 2,
        },
    }),
};

export default nextConfig;
