/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias["three/examples/jsm/loaders/FontLoader.js"] =
      require("path").resolve("./public/jsm/loaders/FontLoader.js");
    return config;
  },
};

module.exports = nextConfig;
