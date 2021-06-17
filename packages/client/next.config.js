module.exports = {
  webpack5: true,
  images: {
    domains: ['res.cloudinary.com', 'localhost'],
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/dcfzgnkj8/image/upload',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // Matched parameters can be used in the destination
      },
    ];
  },
};
