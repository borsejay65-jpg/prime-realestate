'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, Save, X, Star } from 'lucide-react'
import { demoTestimonials } from '@/lib/demo-data'
import toast from 'react-hot-toast'

interface Testimonial {
  id: string; customer_name: string; customer_image?: string; rating: number; review: string; property_type: string; location: string; is_active?: boolean
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    demoTestimonials.map(t => ({ ...t, is_active: true }))
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)

  const [form, setForm] = useState({
    customer_name: '',
    customer_image: '',
    rating: 5,
    review: '',
    property_type: 'Residential',
    location: '',
    is_active: true
  })

  const openAddModal = () => {
    setEditingItem(null)
    setForm({
      customer_name: '',
      customer_image: '',
      rating: 5,
      review: '',
      property_type: 'Residential',
      location: '',
      is_active: true
    })
    setIsModalOpen(true)
  }

  const openEditModal = (item: Testimonial) => {
    setEditingItem(item)
    setForm({
      customer_name: item.customer_name,
      customer_image: item.customer_image || '',
      rating: item.rating,
      review: item.review,
      property_type: item.property_type,
      location: item.location,
      is_active: item.is_active !== false
    })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customer_name || !form.review) {
      toast.error('Name and Review are required')
      return
    }

    if (editingItem) {
      setTestimonials(prev => prev.map(t => t.id === editingItem.id ? { ...t, ...form } : t))
      toast.success('Testimonial updated successfully!')
    } else {
      const newItem: Testimonial = {
        ...form,
        id: Math.random().toString(36).substring(2)
      }
      setTestimonials(prev => [newItem, ...prev])
      toast.success('Testimonial added successfully!')
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      setTestimonials(prev => prev.filter(t => t.id !== id))
      toast.success('Testimonial deleted successfully!')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Testimonials</h1>
        <button onClick={openAddModal} className="btn-gold text-sm flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(item => (
          <div key={item.id} className="card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <img src={item.customer_image || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{item.customer_name}</h3>
                    <p className="text-xs text-gray-500">{item.property_type} • {item.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className={`w-3.5 h-3.5 ${idx < item.rating ? 'text-gold fill-gold' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic line-clamp-4 mb-4">&ldquo;{item.review}&rdquo;</p>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4 mt-auto">
              <span className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                {item.is_active ? 'Active' : 'Hidden'}
              </span>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(item)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-primary dark:text-gold transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
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
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">{editingItem ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="label">Customer Name *</label>
                <input
                  type="text"
                  className="input"
                  value={form.customer_name}
                  onChange={e => setForm(prev => ({ ...prev, customer_name: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Property Category Purchased</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. 3 BHK Apartment"
                    value={form.property_type}
                    onChange={e => setForm(prev => ({ ...prev, property_type: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">Location</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Baner, Jalgaon"
                    value={form.location}
                    onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Rating (1-5)</label>
                  <select
                    className="select"
                    value={form.rating}
                    onChange={e => setForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                  >
                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Customer Avatar URL</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Image URL"
                    value={form.customer_image}
                    onChange={e => setForm(prev => ({ ...prev, customer_image: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="label">Review Message *</label>
                <textarea
                  className="textarea"
                  rows={4}
                  value={form.review}
                  onChange={e => setForm(prev => ({ ...prev, review: e.target.value }))}
                  required
                />
              </div>
              <div className="flex items-center mt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={e => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 rounded text-gold focus:ring-gold border-gray-300"
                  />
                  <span>Display on homepage</span>
                </label>
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
