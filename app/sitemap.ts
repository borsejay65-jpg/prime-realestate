import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://primeaxis.in'
  
  const staticPages = ['', '/properties', '/blog', '/contact', '/about', '/privacy', '/terms'].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))

  let propertyPages: any[] = []
  let blogPages: any[] = []

  try {
    const supabase = createAdminClient()
    const { data: properties } = await supabase
      .from('properties')
      .select('slug, updated_at')
      .eq('is_active', true)
      .eq('is_draft', false)

    if (properties) {
      propertyPages = properties.map(p => ({
        url: `${baseUrl}/properties/${p.slug}`,
        lastModified: new Date(p.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }))
    }

    const { data: blogs } = await supabase
      .from('blogs')
      .select('slug, updated_at')
      .eq('status', 'published')

    if (blogs) {
      blogPages = blogs.map(b => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: new Date(b.updated_at || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    }
  } catch (e) {
    console.error('Sitemap generation failed:', e)
  }

  return [...staticPages, ...propertyPages, ...blogPages]
}
