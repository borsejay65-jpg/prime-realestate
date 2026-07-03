'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import { demoFAQs } from '@/lib/demo-data'
import toast from 'react-hot-toast'

interface FAQ {
  id: string; question: string; answer: string; category?: string; display_order?: number; is_active?: boolean
}

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(
    demoFAQs.map((f, i) => ({ ...f, category: 'General', display_order: i + 1, is_active: true }))
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FAQ | null>(null)

  const [form, setForm] = useState({
    question: '',
    answer: '',
    category: 'General',
    display_order: 1,
    is_active: true
  })

  const openAddModal = () => {
    setEditingItem(null)
    setForm({
      question: '',
      answer: '',
      category: 'General',
      display_order: faqs.length + 1,
      is_active: true
    })
    setIsModalOpen(true)
  }

  const openEditModal = (item: FAQ) => {
    setEditingItem(item)
    setForm({
      question: item.question,
      answer: item.answer,
      category: item.category || 'General',
      display_order: item.display_order || 1,
      is_active: item.is_active !== false
    })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.question || !form.answer) {
      toast.error('Question and Answer are required')
      return
    }

    if (editingItem) {
      setFaqs(prev => prev.map(f => f.id === editingItem.id ? { ...f, ...form } : f))
      toast.success('FAQ updated successfully!')
    } else {
      const newItem: FAQ = {
        ...form,
        id: Math.random().toString(36).substring(2)
      }
      setFaqs(prev => [...prev, newItem])
      toast.success('FAQ added successfully!')
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(prev => prev.filter(f => f.id !== id))
      toast.success('FAQ deleted successfully!')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage FAQs</h1>
        <button onClick={openAddModal} className="btn-gold text-sm flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="space-y-4 p-6">
          {faqs.map(faq => (
            <div key={faq.id} className="border border-gray-100 dark:border-gray-800 rounded-xl p-5 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex gap-2 items-center mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gold bg-gold/10 px-2 py-0.5 rounded">
                      {faq.category}
                    </span>
                    <span className="text-[10px] text-gray-400">Order: {faq.display_order}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{faq.question}</h3>
                  <p className="text-sm text-gray-500 mt-2">{faq.answer}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEditModal(faq)} className="p-2 text-primary dark:text-gold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(faq.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-dark w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-scale-in">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">{editingItem ? 'Edit FAQ' : 'Add FAQ'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="label">Category</label>
                <select
                  className="select"
                  value={form.category}
                  onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="General">General</option>
                  <option value="Buying">Property Buying</option>
                  <option value="Selling">Property Selling</option>
                  <option value="Legal">Legal & RERA</option>
                  <option value="Loans">Home Loans</option>
                </select>
              </div>
              <div>
                <label className="label">Question *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. What is RERA?"
                  value={form.question}
                  onChange={e => setForm(prev => ({ ...prev, question: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="label">Answer *</label>
                <textarea
                  className="textarea"
                  rows={4}
                  placeholder="Detailed answer text..."
                  value={form.answer}
                  onChange={e => setForm(prev => ({ ...prev, answer: e.target.value }))}
                  required
                />
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
                    <span>Active / Published</span>
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
