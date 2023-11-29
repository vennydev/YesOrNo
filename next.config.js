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
  }
}

module.exports = nextConfig
