'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) { toast.error('Name and phone are required'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('Message sent! We will contact you shortly.')
    setForm({ name: '', phone: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  const contacts = [
    { icon: Phone, label: 'Phone', value: '+91 9511802062', href: 'tel:+919511802062' },
    { icon: Mail, label: 'Email', value: 'info@primeaxis.in', href: 'mailto:info@primeaxis.in' },
    { icon: MapPin, label: 'Address', value: 'Office 101, Central Plaza, Court Road, Jalgaon, Maharashtra - 425001' },
    { icon: Clock, label: 'Hours', value: 'Mon-Sat: 9AM-7PM | Sun: 10AM-5PM' },
  ]

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <div className="bg-[#0f2860] text-white py-20 pt-32 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto px-4">Have questions about a property or need expert guidance? We&apos;re here to help.</p>
      </div>
      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="card p-8">
            <h2 className="font-display text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="label">Full Name *</label><input type="text" className="input" placeholder="Your name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required /></div>
                <div><label className="label">Phone *</label><input type="tel" className="input" placeholder="+91 XXXXXXXXXX" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required /></div>
              </div>
              <div><label className="label">Email</label><input type="email" className="input" placeholder="your@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
              <div><label className="label">Subject</label>
                <select className="select" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option><option value="property">Property Inquiry</option>
                  <option value="visit">Schedule Visit</option><option value="loan">Loan Assistance</option><option value="sell">Sell My Property</option>
                </select>
              </div>
              <div><label className="label">Message</label><textarea className="textarea" rows={4} placeholder="How can we help?" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} /></div>
              <button type="submit" disabled={loading} className="btn-gold w-full"><Send className="w-4 h-4" /> {loading ? 'Sending...' : 'Send Message'}</button>
            </form>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contacts.map(c => (
                <div key={c.label} className="card p-4">
                  {c.href ? (
                    <a href={c.href} className="flex items-start gap-3 group">
                      <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0"><c.icon className="w-5 h-5 text-gold" /></div>
                      <div><p className="text-xs text-gray-500">{c.label}</p><p className="font-semibold text-sm group-hover:text-primary transition-colors">{c.value}</p></div>
                    </a>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0"><c.icon className="w-5 h-5 text-gold" /></div>
                      <div><p className="text-xs text-gray-500">{c.label}</p><p className="font-semibold text-sm">{c.value}</p></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="rounded-2xl overflow-hidden shadow-card">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59614.3725838048!2d75.527555!3d21.007658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd90fa4a1eab90f%3A0x37f67bd21bff0a3c!2sJalgaon%2C+Maharashtra!5e0!3m2!1sen!2sin"
                width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" title="PrimeAxis Location" />
            </div>
            <div className="flex gap-3">
              <a href="https://wa.me/919511802062?text=Hi%20PrimeAxis!" target="_blank" rel="noopener" className="btn-whatsapp flex-1"><MessageCircle className="w-5 h-5" /> WhatsApp</a>
              <a href="tel:+919511802062" className="btn-call flex-1"><Phone className="w-5 h-5" /> Call Now</a>
            </div>
            <div className="flex gap-3 justify-center">
              {[Facebook, Instagram, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gold/10 hover:text-gold transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
