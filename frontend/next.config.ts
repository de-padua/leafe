// next.config.js
module.exports = {
  images: {
    domains: [
      "images.unsplash.com",
      "img.olx.com.br",
      "qhljimmosiizyuxvrrlp.supabase.co" // ← Add this line
    ],
    // Optional: add remote patterns for better security
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qhljimmosiizyuxvrrlp.supabase.co',
        port: '',
        pathname: '/storage/v1/object/images/**', // Allows all images from storage
      },
    ],
  },
}