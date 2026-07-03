'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactCTA() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) { toast.error('Please fill name and phone'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('Thank you! We will contact you shortly.')
    setForm({ name: '', phone: '', email: '', message: '' })
    setLoading(false)
  }

  return (
    <section className="section bg-gray-50 dark:bg-gray-900/50" id="contact">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Get In Touch</h2>
          <div className="section-gold-line mx-auto mt-4 mb-4" />
          <p className="section-subtitle mx-auto">Ready to find your dream property? Contact us today</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input type="text" className="input" placeholder="Your name" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="label">Phone Number *</label>
                  <input type="tel" className="input" placeholder="+91 XXXXXXXXXX" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="your@email.com" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea className="textarea" placeholder="Tell us what you're looking for..." value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={4} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                <Send className="w-4 h-4" /> {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <a href="tel:+919511802062" className="flex items-center gap-3 p-4 bg-white dark:bg-surface-dark rounded-xl hover:shadow-card transition-shadow">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center"><Phone className="w-5 h-5 text-gold" /></div>
                <div><p className="text-xs text-gray-500">Call Us</p><p className="font-semibold text-sm">+91 9511802062</p></div>
              </a>
              <a href="mailto:info@primeaxis.in" className="flex items-center gap-3 p-4 bg-white dark:bg-surface-dark rounded-xl hover:shadow-card transition-shadow">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center"><Mail className="w-5 h-5 text-gold" /></div>
                <div><p className="text-xs text-gray-500">Email Us</p><p className="font-semibold text-sm">info@primeaxis.in</p></div>
              </a>
            </div>
          </div>

          <div>
            <div className="rounded-2xl overflow-hidden shadow-card h-[400px]">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59614.3725838048!2d75.527555!3d21.007658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd90fa4a1eab90f%3A0x37f67bd21bff0a3c!2sJalgaon%2C+Maharashtra!5e0!3m2!1sen!2sin"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="PrimeAxis Office Location" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <a href="https://wa.me/919511802062?text=Hi%20PrimeAxis!%20I'm%20interested%20in%20your%20properties."
                target="_blank" rel="noopener" className="btn-whatsapp flex-1"><MessageCircle className="w-5 h-5" /> WhatsApp Us</a>
              <a href="tel:+919511802062" className="btn-call flex-1"><Phone className="w-5 h-5" /> Call Now</a>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <p className="text-gray-600 dark:text-gray-400">PrimeAxis Realty, Office 101, Central Plaza, Court Road, Jalgaon, Maharashtra - 425001</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-5 h-5 text-gold flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-400">Mon-Sat: 9:00 AM - 7:00 PM | Sun: 10:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
