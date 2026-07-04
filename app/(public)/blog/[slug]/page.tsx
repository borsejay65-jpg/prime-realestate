import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Home, ChevronRight, Eye, Calendar, Phone, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getBlogBySlug, getBlogs, getSettings } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import ShareButtons from '@/components/property/ShareButtons'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient()
  const blog = await getBlogBySlug(params.slug, supabase)
  if (!blog) return { title: 'Blog Post Not Found' }

  return {
    title: blog.seo_title || `${blog.title} | PrimeAxis`,
    description: blog.seo_description || blog.excerpt,
    alternates: {
      canonical: `/blog/${blog.slug}`
    },
    openGraph: {
      title: blog.seo_title || blog.title,
      description: blog.seo_description || blog.excerpt,
      images: blog.featured_image ? [{ url: blog.featured_image }] : []
    }
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const supabase = await createClient()
  const blog = await getBlogBySlug(params.slug, supabase)

  if (!blog || blog.status !== 'published') {
    notFound()
  }

  const allBlogs = await getBlogs(supabase)
  const related = allBlogs.filter(b => b.id !== blog.id && b.status === 'published').slice(0, 2)
  const settings = await getSettings(supabase)
  
  const phone = (settings.phone_primary || '+919511802062').replace(/\s+/g, '')
  const whatsapp = (settings.whatsapp_number || '919511802062').replace(/\D/g, '')

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://primeaxis.in'
  const shareUrl = `${baseUrl}/blog/${blog.slug}`

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark pt-24 pb-16">
      <div className="container-custom max-w-4xl">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-primary flex items-center gap-1"><Home className="w-4 h-4" /> Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/blog" className="hover:text-primary">Blog</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 dark:text-white font-medium line-clamp-1">{blog.title}</span>
        </nav>
        {blog.featured_image && (
          <img src={blog.featured_image} alt={blog.title} className="w-full aspect-[21/9] object-cover rounded-2xl" />
        )}
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mt-6">{blog.title}</h1>
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 flex-wrap">
          {blog.published_at && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(blog.published_at)}</span>}
          <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {blog.views} views</span>
          {blog.tags?.map(t => <span key={t} className="bg-primary/10 text-primary dark:bg-gold/10 dark:text-gold px-2 py-1 rounded-full text-xs">{t}</span>)}
        </div>
        
        <div 
          className="prose prose-lg max-w-none mt-8 dark:prose-invert text-gray-600 dark:text-gray-400" 
          dangerouslySetInnerHTML={{ __html: blog.content || '' }} 
        />
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-start">
          <ShareButtons title={blog.title} url={shareUrl} />
        </div>
        
        <div className="card bg-primary-900 text-white p-8 rounded-2xl mt-12 text-center">
          <h2 className="font-display text-2xl font-bold mb-2">Looking for Properties?</h2>
          <p className="text-white/70 mb-6">Contact PrimeAxis for expert guidance on property buying and investment.</p>
          <div className="flex gap-3 justify-center">
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
            <a href={`tel:${phone}`} className="btn-white flex items-center gap-1"><Phone className="w-4 h-4" /> Call Now</a>
          </div>
        </div>
        
        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="font-display text-2xl font-bold text-gray-800 dark:text-white mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {related.map(r => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="card group block">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={r.featured_image || ''} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors text-gray-800 dark:text-white">{r.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
