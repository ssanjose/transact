import type { MetadataRoute } from 'next'
import { siteConfig } from '../config/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: '/overview',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
    ],
    screenshots: [
      {
        src: '/screenshot-540x810.jpg',
        sizes: '540x810',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Transact App'
      },
      {
        src: '/screenshot-1230x615.jpg',
        sizes: '1230x615',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Transact App'
      },
    ]
  }
}