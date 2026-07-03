import { MetadataRoute } from 'next'
import { demoProperties, demoBlogs } from '@/lib/demo-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://primeaxis.in'
  
  const staticPages = ['', '/properties', '/blog', '/contact', '/about', '/privacy', '/terms'].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))

  const propertyPages = demoProperties.map(p => ({
    url: `${baseUrl}/properties/${p.slug}`,
    lastModified: new Date(p.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const blogPages = demoBlogs.map(b => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: new Date(b.updated_at || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...propertyPages, ...blogPages]
}
