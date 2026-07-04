'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { generateSlug, PROPERTY_TYPES, PROPERTY_STATUSES, FACING_OPTIONS, OWNERSHIP_OPTIONS } from '@/lib/utils'
import { createPropertyAction } from '@/lib/actions'
import RichTextEditor from '@/components/shared/RichTextEditor'
import MediaUploader from '@/components/property/MediaUploader'

interface PropertyImage {
  url: string
  is_thumbnail: boolean
  display_order: number
}

export default function NewPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [propertyId] = useState(() => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9))
  
  const [highlights, setHighlights] = useState<string[]>([''])
  const [images, setImages] = useState<PropertyImage[]>([])

  const [form, setForm] = useState({
    title: '',
    slug: '',
    property_type: 'apartment',
    status: 'for_sale',
    construction_status: 'ready_to_move',
    price: '',
    price_label: '',
    price_negotiable: false,
    area_sqft: '',
    bedrooms: '',
    bathrooms: '',
    balcony: '',
    parking: '',
    floor: '',
    total_floors: '',
    facing: 'East',
    ownership: 'Freehold',
    possession_date: '',
    description: '',
    location: '',
    city: 'Jalgaon',
    state: 'Maharashtra',
    pincode: '',
    map_embed_url: '',
    brochure_url: '',
    floorplan_url: '',
    seo_title: '',
    seo_description: '',
    is_featured: false,
    is_published: true
  })

  const handleTitleChange = (val: string) => {
    setForm(prev => ({
      ...prev,
      title: val,
      slug: generateSlug(val)
    }))
  }

  const handleAddHighlight = () => setHighlights([...highlights, ''])
  const handleRemoveHighlight = (idx: number) => setHighlights(highlights.filter((_, i) => i !== idx))
  const handleHighlightChange = (idx: number, val: string) => {
    const next = [...highlights]
    next[idx] = val
    setHighlights(next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) {
      toast.error('Title is required')
      return
    }
    setLoading(true)

    try {
      const featuredImage = images.find(img => img.is_thumbnail) || images[0]
      const thumbnailUrl = featuredImage ? featuredImage.url : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'

      const newProperty = {
        id: propertyId,
        title: form.title,
        slug: form.slug || generateSlug(form.title),
        description: form.description,
        highlights: highlights.filter(h => h.trim() !== ''),
        property_type: form.property_type,
        status: form.status,
        construction_status: form.construction_status,
        price: Number(form.price) || 0,
        price_label: form.price_label || '',
        price_negotiable: form.price_negotiable,
        area_sqft: Number(form.area_sqft) || 0,
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        balcony: Number(form.balcony) || 0,
        parking: Number(form.parking) || 0,
        floor: Number(form.floor) || 0,
        total_floors: Number(form.total_floors) || 0,
        facing: form.facing,
        ownership: form.ownership,
        possession_date: form.possession_date || null,
        address: form.location,
        location: form.location,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        map_embed_url: form.map_embed_url,
        thumbnail_url: thumbnailUrl,
        brochure_url: form.brochure_url || null,
        is_featured: form.is_featured,
        is_active: form.is_published,
        is_draft: !form.is_published,
        seo_title: form.seo_title || form.title,
        seo_description: form.seo_description || '',
        views: 0,
        inquiry_count: 0
      }

      const res = await createPropertyAction(newProperty, images)
      if (res.success) {
        toast.success('Property created successfully!')
        router.push('/admin/properties')
      } else {
        toast.error(res.error || 'Failed to save property')
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to create property')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/properties" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Property</h1>
        </div>
        <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2 text-sm font-semibold">
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Property'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-850 dark:text-white mb-2 border-b border-gray-100 dark:border-gray-800 pb-2">Basic Info</h2>
            
            <div>
              <label className="label">Property Title *</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. 3 BHK Luxury Villa in Baner"
                value={form.title}
                onChange={e => handleTitleChange(e.target.value)}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Slug (URL)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="3-bhk-luxury-villa-in-baner"
                  value={form.slug}
                  onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label">Property Type</label>
                  <select
                    className="select"
                    value={form.property_type}
                    onChange={e => setForm(prev => ({ ...prev, property_type: e.target.value }))}
                  >
                    {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Listing Status</label>
                  <select
                    className="select"
                    value={form.status}
                    onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                  >
                    {PROPERTY_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="label">Price (INR) *</label>
                <input
                  type="number"
                  className="input"
                  placeholder="e.g. 15000000"
                  value={form.price}
                  onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="label">Price Display Label</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. 1.5 Cr, 45k/mo"
                  value={form.price_label}
                  onChange={e => setForm(prev => ({ ...prev, price_label: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2 h-full pt-6">
                <input
                  id="negotiable"
                  type="checkbox"
                  checked={form.price_negotiable}
                  onChange={e => setForm(prev => ({ ...prev, price_negotiable: e.target.checked }))}
                  className="w-4 h-4 rounded text-gold focus:ring-gold border-gray-300"
                />
                <label htmlFor="negotiable" className="text-sm font-semibold text-gray-700 dark:text-gray-300 select-none">Price Negotiable</label>
              </div>
            </div>

            <div>
              <label className="label">Property Description</label>
              <RichTextEditor
                value={form.description}
                onChange={val => setForm(prev => ({ ...prev, description: val }))}
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-850 dark:text-white mb-2 border-b border-gray-100 dark:border-gray-800 pb-2">Specs & Details</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="label">Area (Sq.Ft.)</label>
                <input
                  type="number"
                  className="input"
                  value={form.area_sqft}
                  onChange={e => setForm(prev => ({ ...prev, area_sqft: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Bedrooms</label>
                <input
                  type="number"
                  className="input"
                  value={form.bedrooms}
                  onChange={e => setForm(prev => ({ ...prev, bedrooms: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Bathrooms</label>
                <input
                  type="number"
                  className="input"
                  value={form.bathrooms}
                  onChange={e => setForm(prev => ({ ...prev, bathrooms: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Balconies</label>
                <input
                  type="number"
                  className="input"
                  value={form.balcony}
                  onChange={e => setForm(prev => ({ ...prev, balcony: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="label">Parkings</label>
                <input
                  type="number"
                  className="input"
                  value={form.parking}
                  onChange={e => setForm(prev => ({ ...prev, parking: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Floor No.</label>
                <input
                  type="number"
                  className="input"
                  value={form.floor}
                  onChange={e => setForm(prev => ({ ...prev, floor: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Total Floors</label>
                <input
                  type="number"
                  className="input"
                  value={form.total_floors}
                  onChange={e => setForm(prev => ({ ...prev, total_floors: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Facing Direction</label>
                <select
                  className="select"
                  value={form.facing}
                  onChange={e => setForm(prev => ({ ...prev, facing: e.target.value }))}
                >
                  {FACING_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="label">Ownership Type</label>
                <select
                  className="select"
                  value={form.ownership}
                  onChange={e => setForm(prev => ({ ...prev, ownership: e.target.value }))}
                >
                  {OWNERSHIP_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Construction Status</label>
                <select
                  className="select"
                  value={form.construction_status}
                  onChange={e => setForm(prev => ({ ...prev, construction_status: e.target.value }))}
                >
                  <option value="ready_to_move">Ready To Move</option>
                  <option value="under_construction">Under Construction</option>
                  <option value="new_launch">New Launch</option>
                  <option value="resale">Resale</option>
                </select>
              </div>
              <div>
                <label className="label">Possession Date</label>
                <input
                  type="date"
                  className="input"
                  value={form.possession_date}
                  onChange={e => setForm(prev => ({ ...prev, possession_date: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Media Uploader System */}
          <MediaUploader
            propertyId={propertyId}
            images={images}
            onChange={setImages}
            brochureUrl={form.brochure_url}
            onBrochureChange={url => setForm(prev => ({ ...prev, brochure_url: url }))}
            floorPlanUrl={form.floorplan_url}
            onFloorPlanChange={url => setForm(prev => ({ ...prev, floorplan_url: url }))}
          />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Location details */}
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-855 dark:text-white mb-2 border-b border-gray-100 dark:border-gray-800 pb-2">Location</h2>
            
            <div>
              <label className="label">Address / Locality *</label>
              <textarea
                className="textarea"
                rows={2}
                placeholder="Locality area name"
                value={form.location}
                onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label">City</label>
                <input
                  type="text"
                  className="input"
                  value={form.city}
                  onChange={e => setForm(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Pincode</label>
                <input
                  type="text"
                  className="input"
                  value={form.pincode}
                  onChange={e => setForm(prev => ({ ...prev, pincode: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="label">Google Maps Embed URL</label>
              <input
                type="text"
                className="input"
                placeholder="https://google.com/maps/embed..."
                value={form.map_embed_url}
                onChange={e => setForm(prev => ({ ...prev, map_embed_url: e.target.value }))}
              />
            </div>
          </div>

          {/* Highlights */}
          <div className="card p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
              <h2 className="text-lg font-bold text-gray-855 dark:text-white">Highlights</h2>
              <button type="button" onClick={handleAddHighlight} className="text-gold text-sm hover:underline flex items-center gap-0.5">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {highlights.map((h, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    className="input flex-1"
                    placeholder="Bullet highlight point"
                    value={h}
                    onChange={e => handleHighlightChange(idx, e.target.value)}
                  />
                  {highlights.length > 1 && (
                    <button type="button" onClick={() => handleRemoveHighlight(idx)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Visibility settings */}
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-855 dark:text-white mb-2 border-b border-gray-100 dark:border-gray-800 pb-2">Visibility Settings</h2>
            
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={e => setForm(prev => ({ ...prev, is_published: e.target.checked }))}
                  className="w-4 h-4 rounded text-gold focus:ring-gold border-gray-300"
                />
                <span className="font-semibold text-gray-700 dark:text-gray-350">Active / Published Listing</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={e => setForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="w-4 h-4 rounded text-gold focus:ring-gold border-gray-300"
                />
                <span className="font-semibold text-gray-700 dark:text-gray-350">Feature on Homepage</span>
              </label>
            </div>
          </div>

          {/* SEO Info */}
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-855 dark:text-white mb-2 border-b border-gray-100 dark:border-gray-800 pb-2">SEO Meta Data</h2>
            <div>
              <label className="label">Meta Title</label>
              <input
                type="text"
                className="input"
                placeholder="Title search engines show"
                value={form.seo_title}
                onChange={e => setForm(prev => ({ ...prev, seo_title: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Meta Description</label>
              <textarea
                className="textarea"
                rows={3}
                placeholder="Description search engines show"
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
