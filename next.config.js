/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains:[
            "utfs.io",
            "res.cloudinary.com"
        ]
    },
    experimental: {
        esmExternals: "loose",
        serverComponentsExternalPackages: ["mongoose"]
    },
    future: {
        webpack5: true
    },
    webpack: (config) => {
        config.experiments = {
            topLevelAwait: true
        };
        return config;
    },
}

module.exports = nextConfig
