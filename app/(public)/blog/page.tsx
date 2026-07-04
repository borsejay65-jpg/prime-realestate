'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Home } from 'lucide-react'
import { getBlogs } from '@/lib/db'
import { formatDate } from '@/lib/utils'

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([])

  useEffect(() => {
    getBlogs().then(list => setBlogs(list.filter(b => b.status === 'published')))
  }, [])

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark pt-24 pb-16">
      <div className="container-custom">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary flex items-center gap-1"><Home className="w-4 h-4" /> Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 dark:text-white font-medium">Blog</span>
        </nav>
        <div className="text-center mb-12">
          <h1 className="section-title">Real Estate Insights & Guides</h1>
          <div className="section-gold-line mx-auto mt-4 mb-4" />
          <p className="section-subtitle mx-auto">Expert advice and market insights for property buyers and investors</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <Link key={blog.id} href={`/blog/${blog.slug}`} className="card group block">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={blog.featured_image || ''} alt={blog.title} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                {blog.tags && (
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {blog.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="bg-primary/10 text-primary dark:bg-gold/10 dark:text-gold text-xs px-2 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
                <h2 className="font-semibold text-xl text-gray-800 dark:text-white line-clamp-2 group-hover:text-primary dark:group-hover:text-gold transition-colors">{blog.title}</h2>
                <p className="text-gray-500 line-clamp-3 mt-2 text-sm">{blog.excerpt}</p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-400">{blog.published_at ? formatDate(blog.published_at) : ''}</span>
                  <span className="text-primary dark:text-gold font-medium text-sm flex items-center gap-1">Read More <ArrowRight className="w-4 h-4" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
