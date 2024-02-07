/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains:[
            "utfs.io",
            "res.cloudinary.com"
        ]
    },
    // experimental: {
    //     esmExternals: "loose",
    //     serverComponentsExternalPackages: ["mongoose"]
    // },
    // future: {
    //     webpack5: true
    // },
    // // webpack(config, { isServer, dev }) {
    // //     config.experiments = { asyncWebAssembly: true };
    // //     config.output.webassemblyModuleFilename =
    // //         isServer && !dev ? "../static/wasm/[id].wasm" : "static/wasm/[id].wasm";
    // //     config.optimization.moduleIds = "named";
    // //     return config;
    // // },
    // webpack: (config) => {
    //     config.experiments = {
    //         topLevelAwait: true
    //     };
    //     return config;
    // },
}

module.exports = nextConfig
