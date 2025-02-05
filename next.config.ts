const withPWA = require("next-pwa")({
  dest: "public",
  customWorkerDir: "./workers",
});

module.exports = withPWA({
  // Your Next.js config
});