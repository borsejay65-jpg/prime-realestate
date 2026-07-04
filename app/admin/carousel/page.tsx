'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Save, X, Upload } from 'lucide-react'
import { getCarouselSlides } from '@/lib/db'
import { saveCarouselSlideAction, deleteCarouselSlideAction } from '@/lib/actions'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface Slide {
  id: string
  title: string
  subtitle: string
  media_url: string
  slide_type: 'image' | 'video'
  button_text: string
  button_url: string
  display_order: number
  is_active: boolean
}

export default function CarouselManagementPage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null)
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    media_url: '',
    slide_type: 'image' as 'image' | 'video',
    button_text: 'View Details',
    button_url: '/properties',
    display_order: 1,
    is_active: true
  })

  const fetchSlides = () => {
    getCarouselSlides().then(list => setSlides(list as any[]))
  }

  useEffect(() => {
    fetchSlides()
  }, [])

  const openAddModal = () => {
    setEditingSlide(null)
    setForm({
      title: '',
      subtitle: '',
      media_url: '',
      slide_type: 'image',
      button_text: 'View Details',
      button_url: '/properties',
      display_order: slides.length + 1,
      is_active: true
    })
    setIsModalOpen(true)
  }

  const openEditModal = (slide: Slide) => {
    setEditingSlide(slide)
    setForm({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      media_url: slide.media_url || '',
      slide_type: slide.slide_type || 'image',
      button_text: slide.button_text || '',
      button_url: slide.button_url || '',
      display_order: slide.display_order || 1,
      is_active: slide.is_active !== false
    })
    setIsModalOpen(true)
  }

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          const res = await uploadMediaAction('carousel', path, base64)
          if (!res.success) throw new Error(res.error || 'Upload failed')
          
          setForm(prev => ({ ...prev, media_url: res.url! }))
          toast.success('Media uploaded successfully!')
        } catch (err: any) {
          console.error(err)
          toast.error(err.message || 'Failed to upload media')
        } finally {
          setUploading(false)
        }
      }
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to process media file')
      setUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.media_url) {
      toast.error('Title and Media URL are required')
      return
    }

    try {
      const payload = {
        ...form,
        id: editingSlide ? editingSlide.id : undefined
      }

      const res = await saveCarouselSlideAction(payload)
      if (res.success) {
        toast.success(editingSlide ? 'Slide updated successfully!' : 'Slide added successfully!')
        fetchSlides()
        setIsModalOpen(false)
      } else {
        toast.error(res.error || 'Failed to save slide')
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'An error occurred')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      try {
        const res = await deleteCarouselSlideAction(id)
        if (res.success) {
          toast.success('Slide deleted successfully!')
          fetchSlides()
        } else {
          toast.error(res.error || 'Failed to delete slide')
        }
      } catch (err: any) {
        toast.error(err.message || 'An error occurred')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Carousel Slides</h1>
        <button onClick={openAddModal} className="btn-gold text-sm flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Slide
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {slides.map(slide => (
          <div key={slide.id} className="card overflow-hidden group flex flex-col justify-between">
            <div className="aspect-[21/9] w-full bg-gray-100 relative overflow-hidden">
              <img src={slide.media_url || '/placeholder.png'} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase font-bold bg-gold text-primary-950 px-2 py-0.5 rounded self-start mb-2">
                  Order: {slide.display_order}
                </span>
                <h3 className="font-semibold text-lg line-clamp-1">{slide.title}</h3>
                <p className="text-xs text-white/70 line-clamp-1">{slide.subtitle}</p>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
              <span className={`text-xs font-semibold ${slide.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                {slide.is_active ? 'Active' : 'Inactive'}
              </span>
              <div className="flex gap-1">
                <button onClick={() => openEditModal(slide)} className="p-2 text-primary dark:text-gold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(slide.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {slides.length === 0 && (
          <div className="card p-8 text-center text-gray-500 col-span-2">
            No slides configured. Add a slide to show on homepage.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-dark w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">{editingSlide ? 'Edit Slide' : 'Add Slide'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSave} className="flex-1 flex flex-col min-h-0">
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="label">Slide Type</label>
                  <select className="select" value={form.slide_type} onChange={e => setForm(prev => ({ ...prev, slide_type: e.target.value as any }))}>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="label">Headline Title *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Find Your Dream Property Today"
                    value={form.title}
                    onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="label">Subtitle / Description</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Premium properties starting from 80 Lakhs"
                    value={form.subtitle}
                    onChange={e => setForm(prev => ({ ...prev, subtitle: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">Slide Media Image/Video File</label>
                  {form.media_url ? (
                    <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden group border border-gray-200">
                      <img src={form.media_url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, media_url: '' }))}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-gray-350 dark:border-gray-700 hover:border-gold rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors">
                      <Plus className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm font-semibold text-gray-500">{uploading ? 'Uploading...' : 'Upload Media File'}</span>
                      <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} className="hidden" />
                    </label>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Button Text</label>
                    <input
                      type="text"
                      className="input"
                      value={form.button_text}
                      onChange={e => setForm(prev => ({ ...prev, button_text: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label">Button Redirect URL</label>
                    <input
                      type="text"
                      className="input"
                      value={form.button_url}
                      onChange={e => setForm(prev => ({ ...prev, button_url: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Display Order</label>
                    <input
                      type="number"
                      className="input"
                      value={form.display_order}
                      onChange={e => setForm(prev => ({ ...prev, display_order: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="flex items-center mt-8">
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={e => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="w-4 h-4 rounded text-gold focus:ring-gold border-gray-300"
                      />
                      <span>Active / Visible</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20 flex-shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline text-sm font-semibold">Cancel</button>
                <button type="submit" className="btn-gold text-sm flex items-center gap-1 font-semibold">
                  <Save className="w-4 h-4" /> Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
