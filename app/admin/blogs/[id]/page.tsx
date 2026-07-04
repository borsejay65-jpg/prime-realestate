'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { generateSlug } from '@/lib/utils'
import { updateBlogPostAction } from '@/lib/actions'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { createClient } from '@/lib/supabase/client'

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [uploading, setUploading] = useState(false)

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

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data: blog, error }) => {
        if (error) {
          console.error(error)
          toast.error('Failed to load blog post details')
          router.push('/admin/blogs')
          return
        }
        if (blog) {
          setForm({
            title: blog.title || '',
            slug: blog.slug || '',
            excerpt: blog.excerpt || '',
            content: blog.content || '',
            featured_image: blog.featured_image || '',
            status: blog.status || 'published',
            tags: (blog.tags || []).join(', '),
            seo_title: blog.seo_title || '',
            seo_description: blog.seo_description || ''
          })
        }
        setFetching(false)
      })
  }, [id])

  const handleTitleChange = (val: string) => {
    setForm(prev => ({
      ...prev,
      title: val,
      slug: generateSlug(val)
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    
    try {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}.${ext}`
      
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1] || ''
          const { uploadMediaAction } = await import('@/lib/actions')
          const res = await uploadMediaAction('blog-images', path, base64)
          if (!res.success) throw new Error(res.error || 'Upload failed')
          
          setForm(prev => ({ ...prev, featured_image: res.url! }))
          toast.success('Image uploaded successfully!')
        } catch (err: any) {
          console.error(err)
          toast.error(err.message || 'Failed to upload image')
        } finally {
          setUploading(false)
        }
      }
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to process image file')
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) {
      toast.error('Title is required')
      return
    }
    setLoading(true)
    
    try {
      const updatedPost = {
        title: form.title,
        slug: form.slug || generateSlug(form.title),
        excerpt: form.excerpt,
        content: form.content,
        featured_image: form.featured_image,
        status: form.status,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        seo_title: form.seo_title || form.title,
        seo_description: form.seo_description || '',
        updated_at: new Date().toISOString()
      }
      
      const res = await updateBlogPostAction(id, updatedPost)
      if (res.success) {
        toast.success('Blog post updated successfully!')
        router.push('/admin/blogs')
      } else {
        toast.error(res.error || 'Failed to update blog post')
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to update post')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="p-8 text-center text-gray-500">Loading Blog Post details...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/blogs" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Blog Post</h1>
        </div>
        <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2 text-sm font-semibold">
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
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
              <label className="label">Full Content</label>
              <RichTextEditor
                value={form.content}
                onChange={val => setForm(prev => ({ ...prev, content: val }))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-805 dark:text-white border-b pb-2">Publish Settings</h2>
            <div>
              <label className="label">Status</label>
              <select className="select" value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="label">Cover Image</label>
              {form.featured_image ? (
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden group border border-gray-200">
                  <img src={form.featured_image} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, featured_image: '' }))}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-350 dark:border-gray-700 hover:border-gold rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-semibold text-gray-500">{uploading ? 'Uploading...' : 'Upload Cover Image'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-805 dark:text-white border-b pb-2">SEO Settings</h2>
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
