'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, Save, X, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

interface Slide {
  id: string; title: string; subtitle: string; image_url: string; button_text: string; button_url: string; display_order: number; is_active: boolean
}

const initialSlides: Slide[] = [
  {
    id: '1',
    title: 'Find Your Dream Property Today',
    subtitle: 'Premium properties in Pune starting from 80 Lakhs',
    image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop',
    button_text: 'View Properties',
    button_url: '/properties',
    display_order: 1,
    is_active: true
  },
  {
    id: '2',
    title: 'Modern Luxury Villas',
    subtitle: 'Exclusive villa communities with private pools and landscaped gardens',
    image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&h=1080&fit=crop',
    button_text: 'Explore Villas',
    button_url: '/properties?type=villa',
    display_order: 2,
    is_active: true
  }
]

export default function CarouselManagementPage() {
  const [slides, setSlides] = useState<Slide[]>(initialSlides)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null)

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    button_text: 'View Details',
    button_url: '/properties',
    display_order: 1,
    is_active: true
  })

  const openAddModal = () => {
    setEditingSlide(null)
    setForm({
      title: '',
      subtitle: '',
      image_url: '',
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
      title: slide.title,
      subtitle: slide.subtitle,
      image_url: slide.image_url,
      button_text: slide.button_text,
      button_url: slide.button_url,
      display_order: slide.display_order,
      is_active: slide.is_active
    })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.image_url) {
      toast.error('Title and Image URL are required')
      return
    }

    if (editingSlide) {
      setSlides(prev => prev.map(s => s.id === editingSlide.id ? { ...s, ...form } : s))
      toast.success('Slide updated successfully!')
    } else {
      const newSlide: Slide = {
        ...form,
        id: Math.random().toString(36).substring(2)
      }
      setSlides(prev => [...prev, newSlide])
      toast.success('Slide added successfully!')
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      setSlides(prev => prev.filter(s => s.id !== id))
      toast.success('Slide deleted successfully!')
    }
  }

  const handleToggleActive = (id: string) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s))
    toast.success('Status updated!')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Homepage Carousel</h1>
        <button onClick={openAddModal} className="btn-gold text-sm flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Slide
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {slides.map(slide => (
          <div key={slide.id} className="card overflow-hidden flex flex-col">
            <div className="relative aspect-[16/9] bg-gray-100 dark:bg-gray-800">
              <img src={slide.image_url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end text-white">
                <span className="text-xs text-gold uppercase tracking-wider font-semibold">Order: {slide.display_order}</span>
                <h3 className="font-display font-bold text-lg leading-tight mt-1">{slide.title}</h3>
                <p className="text-xs text-white/80 line-clamp-1 mt-0.5">{slide.subtitle}</p>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 mt-auto">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={slide.is_active}
                  onChange={() => handleToggleActive(slide.id)}
                  className="w-4 h-4 rounded text-gold focus:ring-gold border-gray-300"
                />
                <span>Active</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(slide)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-primary dark:text-gold transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-dark w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-scale-in">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">{editingSlide ? 'Edit Slide' : 'Add New Slide'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="label">Title *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Slide Headline"
                  value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="label">Subtitle</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Secondary supporting text"
                  value={form.subtitle}
                  onChange={e => setForm(prev => ({ ...prev, subtitle: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Image URL *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Image URL"
                  value={form.image_url}
                  onChange={e => setForm(prev => ({ ...prev, image_url: e.target.value }))}
                  required
                />
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
                  <label className="label">Button URL</label>
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
                    <span>Active</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline text-sm">Cancel</button>
                <button type="submit" className="btn-gold text-sm flex items-center gap-1">
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
