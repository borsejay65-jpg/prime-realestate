'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Home, ChevronRight, Eye, Calendar, Phone, MessageCircle, Share2 } from 'lucide-react'
import { demoBlogs } from '@/lib/demo-data'
import { formatDate, getWhatsAppLink } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function BlogDetailPage() {
  const params = useParams()
  const blog = demoBlogs.find(b => b.slug === params.slug)

  if (!blog) return (
    <div className="min-h-screen flex items-center justify-center pt-24">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
        <Link href="/blog" className="btn-primary">Back to Blog</Link>
      </div>
    </div>
  )

  const related = demoBlogs.filter(b => b.id !== blog.id).slice(0, 2)

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
        <div className="prose prose-lg max-w-none mt-8 dark:prose-invert" dangerouslySetInnerHTML={{ __html: blog.content || '' }} />
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }}
            className="btn-outline"><Share2 className="w-4 h-4" /> Copy Link</button>
          <a href={getWhatsAppLink(`Check out this article: ${blog.title}`)} target="_blank" rel="noopener" className="btn-whatsapp">
            <MessageCircle className="w-4 h-4" /> Share on WhatsApp</a>
        </div>
        <div className="card bg-primary-900 text-white p-8 rounded-2xl mt-12 text-center">
          <h2 className="font-display text-2xl font-bold mb-2">Looking for Properties?</h2>
          <p className="text-white/70 mb-6">Contact PrimeAxis for expert guidance on property buying and investment.</p>
          <div className="flex gap-3 justify-center">
            <a href="https://wa.me/919511802062" target="_blank" rel="noopener" className="btn-whatsapp"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
            <a href="tel:+919511802062" className="btn-white"><Phone className="w-4 h-4" /> Call Now</a>
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
                    <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{r.title}</h4>
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
