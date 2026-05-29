import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Omastoppi',
    short_name: 'Omastoppi',
    description: 'Lähimpien pysäkkien lähdöt HSL alueella',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f97316',
    lang: 'fi',
    icons: [
      {
        src: '/apple-icon.png',
        sizes: '128x128',
        type: 'image/png',
      },
    ],
  }
}
