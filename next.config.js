const path = require('path');

const nextConfig = {
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "styles/_variables.scss";`, 
  },
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         {
  //           key: 'Access-Control-Allow-Origin',
  //           value: '*'
  //         }
  //       ],
  //     }
  //   ]
  // },
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
    return [
      {
        source: process.env.SOURCE_PATH,
        destination: process.env.DESTINATION_URL,
      },
      {
        source: '/robots.txt',
        destination: '/api/robots'
      },
      // {
      //   source: '/naverf335ec117f99b96a4081f7fe74674ac6.html',
      //   destination: '/api/naver'
      // }
    ];
    // if (process.env.NODE_ENV !== 'production')
    // else return [
    //   {
    //     source: process.env.SERVICE_SOURCE_PATH,
    //     destination: process.env.SERVICE_DESTINATION_URL,
    //   }
    // ]
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      }
    ]
  }
};

module.exports = nextConfig;
