// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  env: {
    apiUrl: process.env.API_URL,
  },
  serverRuntimeConfig: {
    apiUrl: process.env.API_URL,
  },
  publicRuntimeConfig: {
    apiUrl: process.env.API_URL,
  },
  images: {
    domains: ['res.cloudinary.com', 'localhost'],
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/dcfzgnkj8/image/upload',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://api:5000/api/:path*`, // Matched parameters can be used in the destination
      },
    ];
  },
};

module.exports = withNx(nextConfig);
