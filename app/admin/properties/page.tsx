'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit2, Trash2, Star, Eye, Copy } from 'lucide-react'
import { getProperties } from '@/lib/db'
import { togglePropertyFeatureAction, deletePropertyAction, createPropertyAction } from '@/lib/actions'
import { formatPrice, getStatusBadgeClass, getStatusLabel, getPropertyTypeLabel } from '@/lib/utils'
import type { Property } from '@/types/database'
import toast from 'react-hot-toast'

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchProperties = () => {
    getProperties().then(setProperties)
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const title = p.title || ''
      const location = p.location || ''
      const matchesSearch = title.toLowerCase().includes(search.toLowerCase()) || location.toLowerCase().includes(search.toLowerCase())
      const matchesType = typeFilter ? p.property_type === typeFilter : true
      const matchesStatus = statusFilter ? p.status === statusFilter : true
      return matchesSearch && matchesType && matchesStatus
    })
  }, [properties, search, typeFilter, statusFilter])

  const handleToggleFeatured = async (id: string) => {
    const prop = properties.find(p => p.id === id)
    if (!prop) return
    const res = await togglePropertyFeatureAction(id, !prop.is_featured)
    if (res.success) {
      toast.success('Property featured status updated!')
      fetchProperties()
    } else {
      toast.error(res.error || 'Failed to update featured status')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this property? This will delete all its images from storage too!')) {
      const res = await deletePropertyAction(id)
      if (res.success) {
        toast.success('Property deleted successfully!')
        fetchProperties()
      } else {
        toast.error(res.error || 'Failed to delete property')
      }
    }
  }

  const handleDuplicate = async (property: Property) => {
    const { id, created_at, updated_at, property_id, ...rest } = property
    const newProperty = {
      ...rest,
      title: `${property.title} (Copy)`,
      slug: `${property.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      is_draft: true
    }
    const propImages = (property.images || []).map(img => ({ url: img.url, caption: img.caption || '', is_thumbnail: img.is_thumbnail }))
    const propVideos = (property.videos || []).map(vid => ({ url: vid.url, video_type: vid.video_type, title: vid.title }))

    const res = await createPropertyAction(newProperty, propImages, propVideos)
    if (res.success) {
      toast.success('Property duplicated successfully as a draft!')
      fetchProperties()
    } else {
      toast.error(res.error || 'Failed to duplicate property')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Properties</h1>
        <Link href="/admin/properties/new" className="btn-gold text-sm flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Property
        </Link>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties by title or location..."
              className="input pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <select
              className="select min-w-0"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="plot">Plot</option>
              <option value="commercial">Commercial</option>
            </select>
            <select
              className="select min-w-0"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="for_sale">For Sale</option>
              <option value="for_rent">For Rent</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                <th className="text-left p-4 text-gray-500 font-medium w-16">Image</th>
                <th className="text-left p-4 text-gray-500 font-medium">Title</th>
                <th className="text-left p-4 text-gray-500 font-medium">Type</th>
                <th className="text-left p-4 text-gray-500 font-medium">Status</th>
                <th className="text-left p-4 text-gray-500 font-medium">Price</th>
                <th className="text-center p-4 text-gray-500 font-medium">Featured</th>
                <th className="text-center p-4 text-gray-500 font-medium">Views</th>
                <th className="text-right p-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map(property => (
                <tr key={property.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden relative bg-gray-100">
                      <img src={property.thumbnail_url || '/placeholder.png'} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-800 dark:text-white">{property.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">{property.location}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-600 dark:text-gray-300">{getPropertyTypeLabel(property.property_type)}</span>
                  </td>
                  <td className="p-4">
                    <span className={`badge ${getStatusBadgeClass(property.status)}`}>
                      {getStatusLabel(property.status)}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-gray-800 dark:text-white">
                    {property.price_label || formatPrice(property.price)}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(property.id)}
                      className={`p-1.5 rounded-lg transition-colors ${property.is_featured ? 'text-amber-500 bg-amber-500/10' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    >
                      <Star className={`w-4 h-4 ${property.is_featured ? 'fill-amber-500' : ''}`} />
                    </button>
                  </td>
                  <td className="p-4 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-1 text-xs">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{Math.floor(Math.random() * 500) + 50}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDuplicate(property)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-primary dark:text-gold transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProperties.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No properties found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
