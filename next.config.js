const path = require('path');

const nextConfig = {
  reactStrictMode: false,
  // assetPrefix: '.',
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "styles/_variables.scss";`, 
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/community',
        permanent: true,
      },
      {
        source: '/board',
        destination: '/community',
        permanent: true,
      }
    ]
  },
  async rewrites() {
    if (process.env.NODE_ENV !== 'production')
      return [
        {
          source: process.env.SOURCE_PATH,
          destination: process.env.DESTINATION_URL,
        },
      ];
    else return []
  },
};

module.exports = nextConfig;
