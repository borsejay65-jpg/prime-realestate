'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit2, Trash2, Star, Eye, Copy } from 'lucide-react'
import { demoProperties } from '@/lib/demo-data'
import { formatPrice, getStatusBadgeClass, getStatusLabel, getPropertyTypeLabel } from '@/lib/utils'
import type { Property } from '@/types/database'
import toast from 'react-hot-toast'

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>(demoProperties)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase())
      const matchesType = typeFilter ? p.property_type === typeFilter : true
      const matchesStatus = statusFilter ? p.status === statusFilter : true
      return matchesSearch && matchesType && matchesStatus
    })
  }, [properties, search, typeFilter, statusFilter])

  const handleToggleFeatured = (id: string) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, is_featured: !p.is_featured } : p))
    toast.success('Property featured status updated!')
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      setProperties(prev => prev.filter(p => p.id !== id))
      toast.success('Property deleted successfully!')
    }
  }

  const handleDuplicate = (property: Property) => {
    const duplicated: Property = {
      ...property,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
      title: `${property.title} (Copy)`,
      slug: `${property.slug}-copy`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setProperties(prev => [duplicated, ...prev])
    toast.success('Property duplicated successfully!')
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
          <div className="flex gap-4">
            <select
              className="select min-w-[150px]"
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
              className="select min-w-[150px]"
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
