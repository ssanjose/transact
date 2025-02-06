const withPWAInit = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

const isDev = process.env.NODE_ENV !== "production";

const withPWA = withPWAInit({
  dest: "public",
  customWorkerDir: "./workers",
  buildExcludes: [/app-build-manifest\.json$/],
  exclude: [
    // add buildExcludes here
    ({ asset, compilation }) => {
      if (
        asset.name.startsWith("server/") ||
        asset.name.match(/^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/)
      ) {
        return true;
      }
      if (isDev && !asset.name.startsWith("static/runtime/")) {
        return true;
      }
      return false;
    }
  ],
});

module.exports = withPWA({
  // Your Next.js config
  pwa: {
    runtimeCaching,
  },
  experimental: {
    optimizeCss: true,
  }
});