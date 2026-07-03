'use client'

import { useState, useEffect } from 'react'
import { Save, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)

  const [companyInfo, setCompanyInfo] = useState({
    name: 'PrimeAxis Realty',
    tagline: 'Premium Real Estate Brokerage in Pune',
    description: 'Find your dream property with Pune\'s most trusted luxury real estate firm.',
    rera_number: 'P52100023456'
  })

  const [contactInfo, setContactInfo] = useState({
    phone: '+91 9511802062',
    whatsapp: '+91 9511802062',
    email: 'info@primeaxis.in',
    address: 'Office 101, Premium Business Park, Baner Road, Pune - 411045',
    hours: 'Mon-Sat: 9:00 AM - 7:00 PM | Sun: 10:00 AM - 5:00 PM'
  })

  const [socials, setSocials] = useState({
    facebook: 'https://facebook.com/primeaxis',
    instagram: 'https://instagram.com/primeaxis',
    twitter: 'https://twitter.com/primeaxis',
    linkedin: 'https://linkedin.com/company/primeaxis',
    youtube: 'https://youtube.com/primeaxis'
  })

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    const savedCompany = localStorage.getItem('primeaxis_settings_company')
    if (savedCompany) {
      try { setCompanyInfo(JSON.parse(savedCompany)) } catch (e) {}
    }

    const savedContact = localStorage.getItem('primeaxis_settings_contact')
    if (savedContact) {
      try { setContactInfo(JSON.parse(savedContact)) } catch (e) {}
    }

    const savedSocials = localStorage.getItem('primeaxis_settings_socials')
    if (savedSocials) {
      try { setSocials(JSON.parse(savedSocials)) } catch (e) {}
    }
  }, [])

  const handleSave = async (section: string) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    
    if (section === 'Company') {
      localStorage.setItem('primeaxis_settings_company', JSON.stringify(companyInfo))
    } else if (section === 'Contact') {
      localStorage.setItem('primeaxis_settings_contact', JSON.stringify(contactInfo))
    } else if (section === 'Social Media') {
      localStorage.setItem('primeaxis_settings_socials', JSON.stringify(socials))
    }

    // Trigger an event so that other components listening can refresh their states
    window.dispatchEvent(new Event('primeaxis-settings-update'))

    toast.success(`${section} settings saved successfully!`)
    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Site Settings</h1>
      </div>

      {/* Company settings */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Company Information</h2>
          <button onClick={() => handleSave('Company')} className="text-gold hover:underline flex items-center gap-1.5 text-sm">
            <Save className="w-4.5 h-4.5" /> Save
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Brand/Company Name</label>
            <input type="text" className="input" value={companyInfo.name} onChange={e => setCompanyInfo(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="label">MahaRERA Registration Number</label>
            <input type="text" className="input font-mono" value={companyInfo.rera_number} onChange={e => setCompanyInfo(p => ({ ...p, rera_number: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="label">Website Tagline / SEO Title</label>
          <input type="text" className="input" value={companyInfo.tagline} onChange={e => setCompanyInfo(p => ({ ...p, tagline: e.target.value }))} />
        </div>
        <div>
          <label className="label">Site Description / SEO Meta Description</label>
          <textarea className="textarea" rows={3} value={companyInfo.description} onChange={e => setCompanyInfo(p => ({ ...p, description: e.target.value }))} />
        </div>
      </div>

      {/* Contact info settings */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Contact & Support Channels</h2>
          <button onClick={() => handleSave('Contact')} className="text-gold hover:underline flex items-center gap-1.5 text-sm">
            <Save className="w-4.5 h-4.5" /> Save
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="label">Primary Phone (tel: link)</label>
            <input type="text" className="input" value={contactInfo.phone} onChange={e => setContactInfo(p => ({ ...p, phone: e.target.value }))} />
          </div>
          <div>
            <label className="label">WhatsApp Number (with country code)</label>
            <input type="text" className="input" value={contactInfo.whatsapp} onChange={e => setContactInfo(p => ({ ...p, whatsapp: e.target.value }))} />
          </div>
          <div>
            <label className="label">Support Email Address</label>
            <input type="email" className="input" value={contactInfo.email} onChange={e => setContactInfo(p => ({ ...p, email: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="label">Office Physical Address</label>
          <input type="text" className="input" value={contactInfo.address} onChange={e => setContactInfo(p => ({ ...p, address: e.target.value }))} />
        </div>
        <div>
          <label className="label">Business Working Hours</label>
          <input type="text" className="input" value={contactInfo.hours} onChange={e => setContactInfo(p => ({ ...p, hours: e.target.value }))} />
        </div>
      </div>

      {/* Social networks settings */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Social Media Links</h2>
          <button onClick={() => handleSave('Social Media')} className="text-gold hover:underline flex items-center gap-1.5 text-sm">
            <Save className="w-4.5 h-4.5" /> Save
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Facebook Page URL</label>
            <input type="text" className="input text-xs" value={socials.facebook} onChange={e => setSocials(p => ({ ...p, facebook: e.target.value }))} />
          </div>
          <div>
            <label className="label">Instagram Profile URL</label>
            <input type="text" className="input text-xs" value={socials.instagram} onChange={e => setSocials(p => ({ ...p, instagram: e.target.value }))} />
          </div>
          <div>
            <label className="label">Twitter / X URL</label>
            <input type="text" className="input text-xs" value={socials.twitter} onChange={e => setSocials(p => ({ ...p, twitter: e.target.value }))} />
          </div>
          <div>
            <label className="label">LinkedIn Company Page</label>
            <input type="text" className="input text-xs" value={socials.linkedin} onChange={e => setSocials(p => ({ ...p, linkedin: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="label">YouTube Channel URL</label>
            <input type="text" className="input text-xs" value={socials.youtube} onChange={e => setSocials(p => ({ ...p, youtube: e.target.value }))} />
          </div>
        </div>
      </div>
    </div>
  )
}
