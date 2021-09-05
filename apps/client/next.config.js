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
    path: 'https://res.cloudinary.com/dcfzgnkj8/image/upload',
  },
};

module.exports = withNx(nextConfig);
