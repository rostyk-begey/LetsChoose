const withPlugins = require('next-compose-plugins');
const withOptimizedImages = require('next-optimized-images');

module.exports = withPlugins([[withOptimizedImages]], {
  future: {
    webpack5: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // Matched parameters can be used in the destination
      },
    ];
  },
});
