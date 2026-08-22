import dns from "node:dns";

/**
 * Configure Node.js DNS resolvers to use Google and Cloudflare Public DNS.
 * This resolves `querySrv ECONNREFUSED` issues with MongoDB Atlas on Windows/local ISP DNS.
 */
dns.setServers([
  "8.8.8.8", // Google Primary
  "8.8.4.4", // Google Secondary
  "1.1.1.1", // Cloudflare Primary
  "1.0.0.1", // Cloudflare Secondary
]);

export default dns;
