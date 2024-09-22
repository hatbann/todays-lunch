/** @format */

module.exports = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/",
        destination: "/lunch",
        permanent: true,
      },
    ];
  },
  reactStrictMode: false,
};
