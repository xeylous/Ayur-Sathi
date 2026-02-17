/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['recharts'],
    experimental: {
        serverComponentsExternalPackages: ['recharts'],
    },
    webpack: (config) => {
        config.externals = [...(config.externals || []), { canvas: 'canvas' }];
        return config;
    },
};

export default nextConfig;
