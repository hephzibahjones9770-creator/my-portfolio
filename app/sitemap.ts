import type { MetadataRoute } from 'next'

const siteUrl = 'https://hephzibahjones.online'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/resume`, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
