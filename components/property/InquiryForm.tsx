'use client'

import { useState } from 'react'
import { Phone, MessageCircle, CalendarCheck, Download, Send } from 'lucide-react'
import { getWhatsAppLink, getPropertyWhatsAppMessage, getCallLink } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Props { propertyTitle: string; propertySlug: string; brochureUrl?: string }

export default function InquiryForm({ propertyTitle, propertySlug, brochureUrl }: Props) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: `I'm interested in "${propertyTitle}". Please share more details.` })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) { toast.error('Please fill name and phone'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    console.log('Inquiry:', { ...form, property: propertyTitle })
    toast.success('Thank you! Our team will contact you shortly.')
    setLoading(false)
  }

  const waMsg = getPropertyWhatsAppMessage(propertyTitle, propertySlug)
  const waLink = getWhatsAppLink(waMsg)
  const visitMsg = getWhatsAppLink(`Hi PrimeAxis! I'd like to schedule a site visit for "${propertyTitle}". Please confirm the available slots.`)

  return (
    <div className="card p-6">
      <h3 className="font-display text-xl font-bold text-gray-800 dark:text-white mb-4">Interested in this property?</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" className="input" placeholder="Your Name *" value={form.name}
          onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
        <input type="tel" className="input" placeholder="Phone Number *" value={form.phone}
          onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required />
        <input type="email" className="input" placeholder="Email (optional)" value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
        <textarea className="textarea" rows={3} value={form.message}
          onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          <Send className="w-4 h-4" /> {loading ? 'Sending...' : 'Send Inquiry'}
        </button>
      </form>
      <div className="space-y-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <a href={waLink} target="_blank" rel="noopener" className="btn-whatsapp w-full">
          <MessageCircle className="w-4 h-4" /> WhatsApp Us
        </a>
        <a href={getCallLink()} className="btn-call w-full">
          <Phone className="w-4 h-4" /> Call Now
        </a>
        <a href={visitMsg} target="_blank" rel="noopener" className="btn-outline w-full">
          <CalendarCheck className="w-4 h-4" /> Schedule Visit
        </a>
        {brochureUrl && (
          <a href={brochureUrl} target="_blank" rel="noopener" className="btn-ghost w-full">
            <Download className="w-4 h-4" /> Download Brochure
          </a>
        )}
      </div>
    </div>
  )
}
