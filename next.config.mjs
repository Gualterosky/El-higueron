/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    const securityHeaders = [
      // Fuerza HTTPS y evita advertencias de conexión insegura
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      // Evita que el navegador "adivine" tipos MIME (vector común de malware)
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      // Impide que el sitio se cargue dentro de iframes maliciosos (clickjacking)
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      // Controla cuánta información de referencia se envía
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      // Restringe APIs sensibles del navegador
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ]

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
