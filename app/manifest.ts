import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Portfolio',
    short_name: 'Portfolio',
    description: 'A portfolio of technology, research, and creative work.',
    start_url: '/',
    display: 'standalone',
    background_color: '#071326',
    theme_color: '#071326',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  }
}
