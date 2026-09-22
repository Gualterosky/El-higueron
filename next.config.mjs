import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

// Hostname del bucket de Cloudflare R2 (imágenes estáticas del sitio: galería,
// boulder, camping, naturaleza, equipos, novedades), derivado de R2_PUBLIC_URL
// para que funcione igual con el subdominio *.r2.dev o con un dominio propio.
const r2Hostname = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL).hostname
  : undefined

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // El contenido del Muro (subido por visitantes) vive en Cloudinary y se
    // renderiza con <img> plano (components/muro/post-media-gallery.tsx), no
    // necesita remotePattern. Con remotePatterns configurado para R2,
    // Next.js/Vercel sí optimiza (resize + WebP/AVIF + cache de borde) las
    // imágenes de next/image sin necesidad de unoptimized:true. Ver
    // system_architecture.md sección 15.
    remotePatterns: r2Hostname ? [{ protocol: "https", hostname: r2Hostname }] : [],
  },
  async headers() {
    const securityHeaders = [
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
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

export default withNextIntl(nextConfig)
