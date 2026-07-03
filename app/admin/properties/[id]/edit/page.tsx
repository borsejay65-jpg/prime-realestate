'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Plus, X, Trash2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { generateSlug, PROPERTY_TYPES, PROPERTY_STATUSES, FACING_OPTIONS, OWNERSHIP_OPTIONS } from '@/lib/utils'
import { demoProperties } from '@/lib/demo-data'

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [highlights, setHighlights] = useState<string[]>([''])
  const [images, setImages] = useState<string[]>([''])

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
    thumbnail_url: '',
    brochure_url: '',
    seo_title: '',
    seo_description: '',
    is_featured: false,
    is_published: true
  })

  useEffect(() => {
    const property = demoProperties.find(p => p.id === id)
    if (property) {
      setForm({
        title: property.title || '',
        slug: property.slug || '',
        property_type: property.property_type || 'apartment',
        status: property.status || 'for_sale',
        construction_status: property.construction_status || 'ready_to_move',
        price: String(property.price || ''),
        price_label: property.price_label || '',
        price_negotiable: property.price_negotiable || false,
        area_sqft: String(property.area_sqft || ''),
        bedrooms: String(property.bedrooms || ''),
        bathrooms: String(property.bathrooms || ''),
        balcony: String(property.balcony || ''),
        parking: String(property.parking || ''),
        floor: String(property.floor || ''),
        total_floors: String(property.total_floors || ''),
        facing: property.facing || 'East',
        ownership: property.ownership || 'Freehold',
        possession_date: property.possession_date || '',
        description: property.description || '',
        location: property.location || '',
        city: property.city || 'Jalgaon',
        state: property.state || 'Maharashtra',
        pincode: property.pincode || '',
        map_embed_url: property.map_embed_url || '',
        thumbnail_url: property.thumbnail_url || '',
        brochure_url: property.brochure_url || '',
        seo_title: property.seo_title || '',
        seo_description: property.seo_description || '',
        is_featured: property.is_featured || false,
        is_published: property.is_published || true
      })
      if (property.highlights && property.highlights.length > 0) {
        setHighlights(property.highlights)
      }
      if (property.images && property.images.length > 0) {
        setImages(property.images.map(img => img.url))
      }
    }
  }, [id])

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

  const handleAddImage = () => setImages([...images, ''])
  const handleRemoveImage = (idx: number) => setImages(images.filter((_, i) => i !== idx))
  const handleImageChange = (idx: number, val: string) => {
    const next = [...images]
    next[idx] = val
    setImages(next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) {
      toast.error('Title is required')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Property updated successfully (Demo Mode)!')
    router.push('/admin/properties')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/properties" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Property</h1>
        </div>
        <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2 text-sm">
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2 border-b border-gray-100 dark:border-gray-800 pb-2">Basic Info</h2>
            <div>
              <label className="label">Title *</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Premium 3 BHK Apartment in Baner"
                value={form.title}
                onChange={e => handleTitleChange(e.target.value)}
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Slug</label>
                <input
                  type="text"
                  className="input bg-gray-50/50 dark:bg-gray-800/30"
                  value={form.slug}
                  onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Property Type</label>
                  <select className="select" value={form.property_type} onChange={e => setForm(prev => ({ ...prev, property_type: e.target.value }))}>
                    {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="select" value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}>
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
                  placeholder="e.g. 12500000"
                  value={form.price}
                  onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="label">Price Label (Optional)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. 1.25 Cr"
                  value={form.price_label}
                  onChange={e => setForm(prev => ({ ...prev, price_label: e.target.value }))}
                />
              </div>
              <div className="flex items-center mt-8">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={form.price_negotiable}
                    onChange={e => setForm(prev => ({ ...prev, price_negotiable: e.target.checked }))}
                    className="w-4 h-4 rounded text-gold focus:ring-gold border-gray-300"
                  />
                  <span>Negotiable</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="label">Area (Sq.Ft)</label>
                <input type="number" className="input" placeholder="e.g. 1500" value={form.area_sqft} onChange={e => setForm(prev => ({ ...prev, area_sqft: e.target.value }))} />
              </div>
              <div>
                <label className="label">Bedrooms</label>
                <input type="number" className="input" placeholder="e.g. 3" value={form.bedrooms} onChange={e => setForm(prev => ({ ...prev, bedrooms: e.target.value }))} />
              </div>
              <div>
                <label className="label">Bathrooms</label>
                <input type="number" className="input" placeholder="e.g. 3" value={form.bathrooms} onChange={e => setForm(prev => ({ ...prev, bathrooms: e.target.value }))} />
              </div>
              <div>
                <label className="label">Parking Slots</label>
                <input type="number" className="input" placeholder="e.g. 2" value={form.parking} onChange={e => setForm(prev => ({ ...prev, parking: e.target.value }))} />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="label">Construction Status</label>
                <select className="select" value={form.construction_status} onChange={e => setForm(prev => ({ ...prev, construction_status: e.target.value }))}>
                  <option value="under_construction">Under Construction</option>
                  <option value="ready_to_move">Ready to Move</option>
                  <option value="new_launch">New Launch</option>
                </select>
              </div>
              <div>
                <label className="label">Facing</label>
                <select className="select" value={form.facing} onChange={e => setForm(prev => ({ ...prev, facing: e.target.value }))}>
                  {FACING_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Possession Date</label>
                <input type="date" className="input" value={form.possession_date} onChange={e => setForm(prev => ({ ...prev, possession_date: e.target.value }))} />
              </div>
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                className="textarea"
                rows={5}
                placeholder="Write detailed description of the property..."
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          {/* Location */}
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2 border-b border-gray-100 dark:border-gray-800 pb-2">Location</h2>
            <div>
              <label className="label">Full Address *</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Flat 502, Wing B, Emerald Heights, Baner Road"
                value={form.location}
                onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="label">City</label>
                <input type="text" className="input" value={form.city} onChange={e => setForm(prev => ({ ...prev, city: e.target.value }))} />
              </div>
              <div>
                <label className="label">State</label>
                <input type="text" className="input" value={form.state} onChange={e => setForm(prev => ({ ...prev, state: e.target.value }))} />
              </div>
              <div>
                <label className="label">Pincode</label>
                <input type="text" className="input" placeholder="e.g. 411045" value={form.pincode} onChange={e => setForm(prev => ({ ...prev, pincode: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="label">Google Maps Embed iframe URL</label>
              <input
                type="text"
                className="input"
                placeholder="https://www.google.com/maps/embed?pb=..."
                value={form.map_embed_url}
                onChange={e => setForm(prev => ({ ...prev, map_embed_url: e.target.value }))}
              />
            </div>
          </div>

          {/* Highlights */}
          <div className="card p-6 space-y-4">
            <div className="flex justify-between items-center mb-2 border-b border-gray-100 dark:border-gray-800 pb-2">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Property Highlights</h2>
              <button type="button" onClick={handleAddHighlight} className="text-gold text-sm hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-3">
              {highlights.map((highlight, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    className="input flex-1"
                    placeholder="e.g. Double height living room"
                    value={highlight}
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
        </div>

        <div className="space-y-6">
          {/* Publish & Status */}
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2 border-b border-gray-100 dark:border-gray-800 pb-2">Publish Settings</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={e => setForm(prev => ({ ...prev, is_published: e.target.checked }))}
                  className="w-4 h-4 rounded text-gold focus:ring-gold border-gray-300"
                />
                <span>Active / Published Listing</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={e => setForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="w-4 h-4 rounded text-gold focus:ring-gold border-gray-300"
                />
                <span>Feature on Homepage</span>
              </label>
            </div>
          </div>

          {/* Media Links */}
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2 border-b border-gray-100 dark:border-gray-800 pb-2">Media & Files</h2>
            <div>
              <label className="label">Thumbnail Image URL *</label>
              <input
                type="text"
                className="input"
                placeholder="https://unsplash.com/..."
                value={form.thumbnail_url}
                onChange={e => setForm(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">Brochure PDF URL</label>
              <input
                type="text"
                className="input"
                placeholder="https://..."
                value={form.brochure_url}
                onChange={e => setForm(prev => ({ ...prev, brochure_url: e.target.value }))}
              />
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Gallery Images</span>
                <button type="button" onClick={handleAddImage} className="text-gold text-sm hover:underline flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="space-y-3">
                {images.map((image, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      className="input flex-1"
                      placeholder="Image URL"
                      value={image}
                      onChange={e => handleImageChange(idx, e.target.value)}
                    />
                    {images.length > 1 && (
                      <button type="button" onClick={() => handleRemoveImage(idx)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SEO Info */}
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2 border-b border-gray-100 dark:border-gray-800 pb-2">SEO Meta Data</h2>
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
