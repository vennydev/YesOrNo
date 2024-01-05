const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      "localhost",
      "firebasestorage.googleapis.com"
    ]
  },
  compiler : {
    styledComponents: true,
  }
}

module.exports = nextConfig
