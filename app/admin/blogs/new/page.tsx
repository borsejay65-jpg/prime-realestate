'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { generateSlug } from '@/lib/utils'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    status: 'published',
    tags: '',
    seo_title: '',
    seo_description: ''
  })

  const handleTitleChange = (val: string) => {
    setForm(prev => ({
      ...prev,
      title: val,
      slug: generateSlug(val)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) {
      toast.error('Title is required')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    
    try {
      const { getBlogs, saveBlogs } = require('@/lib/db')
      const currentList = getBlogs()
      const newId = Math.random().toString(36).substr(2, 9)
      const newPost = {
        id: newId,
        title: form.title,
        slug: form.slug || generateSlug(form.title),
        excerpt: form.excerpt,
        content: form.content,
        featured_image: form.featured_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
        status: form.status,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        views: 0,
        seo_title: form.seo_title || form.title,
        seo_description: form.seo_description || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      saveBlogs([newPost, ...currentList])
      toast.success('Blog post created successfully!')
      router.push('/admin/blogs')
    } catch (err) {
      console.error(err)
      toast.error('Failed to create post')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/blogs" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">New Blog Post</h1>
        </div>
        <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2 text-sm">
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Post'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-4">
            <div>
              <label className="label">Post Title *</label>
              <input
                type="text"
                className="input text-lg font-semibold"
                placeholder="e.g. 5 Things to Check Before Buying an Apartment in Jalgaon"
                value={form.title}
                onChange={e => handleTitleChange(e.target.value)}
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Slug</label>
                <input
                  type="text"
                  className="input bg-gray-50/50 dark:bg-gray-800/30"
                  value={form.slug}
                  onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Tags (Comma-separated)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Jalgaon, Buying Guide, RERA"
                  value={form.tags}
                  onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="label">Excerpt / Short Description</label>
              <textarea
                className="textarea"
                rows={3}
                placeholder="Brief summary of the article for listings..."
                value={form.excerpt}
                onChange={e => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Full Content (HTML/Markdown supported)</label>
              <textarea
                className="textarea font-mono text-sm"
                rows={12}
                placeholder="Write full article here..."
                value={form.content}
                onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white border-b pb-2">Publish Settings</h2>
            <div>
              <label className="label">Status</label>
              <select className="select" value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="label">Featured Image URL</label>
              <input
                type="text"
                className="input"
                placeholder="https://..."
                value={form.featured_image}
                onChange={e => setForm(prev => ({ ...prev, featured_image: e.target.value }))}
              />
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white border-b pb-2">SEO Settings</h2>
            <div>
              <label className="label">SEO Meta Title</label>
              <input
                type="text"
                className="input"
                placeholder="Meta title"
                value={form.seo_title}
                onChange={e => setForm(prev => ({ ...prev, seo_title: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">SEO Meta Description</label>
              <textarea
                className="textarea"
                rows={4}
                placeholder="Meta description"
                value={form.seo_description}
                onChange={e => setForm(prev => ({ ...prev, seo_description: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
