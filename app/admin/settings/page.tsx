'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { getSettings } from '@/lib/db'
import { saveSettingsAction } from '@/lib/actions'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const [form, setForm] = useState({
    company_name: 'PrimeAxis',
    rera_number: 'P52100023456',
    company_tagline: 'Your Trusted Real Estate Partner',
    company_description: 'PrimeAxis is Jalgaon\'s premier real estate brokerage firm specializing in residential, commercial, and luxury properties.',
    phone_primary: '+91 9511802062',
    phone_secondary: '+91 9511802062',
    whatsapp_number: '+919511802062',
    email_primary: 'info@primeaxis.in',
    email_secondary: 'sales@primeaxis.in',
    address: 'PrimeAxis Realty Pvt. Ltd., Office No. 101, Premium Business Park, Baner Road, Jalgaon - 411045, Maharashtra, India',
    business_hours: 'Mon-Sat: 9:00 AM - 7:00 PM | Sun: 10:00 AM - 5:00 PM',
    facebook_url: 'https://facebook.com/primeaxis',
    instagram_url: 'https://instagram.com/primeaxis',
    twitter_url: 'https://twitter.com/primeaxis',
    linkedin_url: 'https://linkedin.com/company/primeaxis',
    youtube_url: 'https://youtube.com/@primeaxis',
    google_maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.019073773987!2d73.83291021485!3d18.559473787381!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf61fdc6f!2sBaner%2C+Jalgaon!5e0!3m2!1sen!2sin!4v1625000000000!5m2!1sen!2sin',
    logo_url: '',
    favicon_url: '',
    seo_title: 'PrimeAxis | Premium Real Estate Brokerage in Jalgaon',
    seo_description: 'Find your dream property in Jalgaon with PrimeAxis. Expert real estate brokerage for residential, commercial, luxury villas, plots, and rental properties.',
    copyright_text: '© 2026 PrimeAxis Realty. All rights reserved.'
  })

  useEffect(() => {
    getSettings().then(dict => {
      setForm(prev => ({
        ...prev,
        ...dict
      }))
      setFetching(false)
    }).catch(err => {
      console.error(err)
      setFetching(false)
    })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await saveSettingsAction(form)
      if (res.success) {
        toast.success('Site settings saved successfully!')
      } else {
        toast.error(res.error || 'Failed to save settings')
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="p-8 text-center text-gray-500">Loading settings...</div>
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Site Settings</h1>
        <button type="submit" disabled={loading} className="btn-gold flex items-center gap-1.5 text-sm font-semibold">
          <Save className="w-4.5 h-4.5" /> {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Company settings */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-850 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Company Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Brand/Company Name</label>
            <input type="text" className="input" value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))} required />
          </div>
          <div>
            <label className="label">MahaRERA Registration Number</label>
            <input type="text" className="input font-mono" value={form.rera_number} onChange={e => setForm(p => ({ ...p, rera_number: e.target.value }))} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Logo Image URL</label>
            <input type="text" className="input" value={form.logo_url} onChange={e => setForm(p => ({ ...p, logo_url: e.target.value }))} placeholder="e.g. /images/logo.png" />
          </div>
          <div>
            <label className="label">Favicon Image URL</label>
            <input type="text" className="input" value={form.favicon_url} onChange={e => setForm(p => ({ ...p, favicon_url: e.target.value }))} placeholder="e.g. /favicon.ico" />
          </div>
        </div>
        <div>
          <label className="label">Website Tagline</label>
          <input type="text" className="input" value={form.company_tagline} onChange={e => setForm(p => ({ ...p, company_tagline: e.target.value }))} />
        </div>
        <div>
          <label className="label">Company Description</label>
          <textarea className="textarea" rows={3} value={form.company_description} onChange={e => setForm(p => ({ ...p, company_description: e.target.value }))} />
        </div>
      </div>

      {/* Contact info settings */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-855 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Contact & Support Channels</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="label">Primary Phone</label>
            <input type="text" className="input" value={form.phone_primary} onChange={e => setForm(p => ({ ...p, phone_primary: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Secondary Phone</label>
            <input type="text" className="input" value={form.phone_secondary} onChange={e => setForm(p => ({ ...p, phone_secondary: e.target.value }))} />
          </div>
          <div>
            <label className="label">WhatsApp Number (with country code)</label>
            <input type="text" className="input" value={form.whatsapp_number} onChange={e => setForm(p => ({ ...p, whatsapp_number: e.target.value }))} required />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Primary Support Email</label>
            <input type="email" className="input" value={form.email_primary} onChange={e => setForm(p => ({ ...p, email_primary: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Secondary Email</label>
            <input type="email" className="input" value={form.email_secondary} onChange={e => setForm(p => ({ ...p, email_secondary: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="label">Office Physical Address</label>
          <input type="text" className="input" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} required />
        </div>
        <div>
          <label className="label">Business Working Hours</label>
          <input type="text" className="input" value={form.business_hours} onChange={e => setForm(p => ({ ...p, business_hours: e.target.value }))} />
        </div>
        <div>
          <label className="label">Google Maps Embed URL</label>
          <input type="text" className="input" value={form.google_maps_embed} onChange={e => setForm(p => ({ ...p, google_maps_embed: e.target.value }))} />
        </div>
      </div>

      {/* SEO settings */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-855 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Global SEO Configuration</h2>
        <div>
          <label className="label">Default SEO Title</label>
          <input type="text" className="input" value={form.seo_title} onChange={e => setForm(p => ({ ...p, seo_title: e.target.value }))} required />
        </div>
        <div>
          <label className="label">Default SEO Description</label>
          <textarea className="textarea" rows={3} value={form.seo_description} onChange={e => setForm(p => ({ ...p, seo_description: e.target.value }))} required />
        </div>
        <div>
          <label className="label">Copyright Footer Text</label>
          <input type="text" className="input" value={form.copyright_text} onChange={e => setForm(p => ({ ...p, copyright_text: e.target.value }))} />
        </div>
      </div>

      {/* Social networks settings */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-855 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Social Media Links</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Facebook Page URL</label>
            <input type="text" className="input text-xs" value={form.facebook_url} onChange={e => setForm(p => ({ ...p, facebook_url: e.target.value }))} />
          </div>
          <div>
            <label className="label">Instagram Profile URL</label>
            <input type="text" className="input text-xs" value={form.instagram_url} onChange={e => setForm(p => ({ ...p, instagram_url: e.target.value }))} />
          </div>
          <div>
            <label className="label">Twitter / X URL</label>
            <input type="text" className="input text-xs" value={form.twitter_url} onChange={e => setForm(p => ({ ...p, twitter_url: e.target.value }))} />
          </div>
          <div>
            <label className="label">LinkedIn Company Page</label>
            <input type="text" className="input text-xs" value={form.linkedin_url} onChange={e => setForm(p => ({ ...p, linkedin_url: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="label">YouTube Channel URL</label>
            <input type="text" className="input text-xs" value={form.youtube_url} onChange={e => setForm(p => ({ ...p, youtube_url: e.target.value }))} />
          </div>
        </div>
      </div>
    </form>
  )
}
