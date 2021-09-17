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
  images: {
    domains: ['res.cloudinary.com', 'localhost'],
    loader: 'cloudinary',
    path: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/api/:path*`, // Matched parameters can be used in the destination
      },
    ];
  },
};

module.exports = withNx(nextConfig);
