'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import PropertyFilters from '@/components/property/PropertyFilters'
import PropertyGrid from '@/components/property/PropertyGrid'
import { getProperties } from '@/lib/db'
import type { Property } from '@/types/database'

export default function PropertiesPage() {
  const [filters, setFilters] = useState({ search: '', type: '', status: '', minPrice: '', maxPrice: '', bedrooms: '', sort: 'newest' })

  const filtered = useMemo(() => {
    let result = [...getProperties()]
    if (filters.search) result = result.filter(p => p.title.toLowerCase().includes(filters.search.toLowerCase()) || p.location.toLowerCase().includes(filters.search.toLowerCase()))
    if (filters.type) result = result.filter(p => p.property_type === filters.type)
    if (filters.status) result = result.filter(p => p.status === filters.status)
    if (filters.minPrice) result = result.filter(p => p.price >= Number(filters.minPrice))
    if (filters.maxPrice) result = result.filter(p => p.price <= Number(filters.maxPrice))
    if (filters.bedrooms) result = result.filter(p => (p.bedrooms || 0) >= Number(filters.bedrooms))
    switch (filters.sort) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break
      case 'price_desc': result.sort((a, b) => b.price - a.price); break
      case 'featured': result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)); break
      default: result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
    return result
  }, [filters])

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark pt-24 pb-16">
      <div className="container-custom">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary flex items-center gap-1"><Home className="w-4 h-4" /> Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 dark:text-white font-medium">Properties</span>
        </nav>
        <h1 className="section-title mb-8">Our Properties</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-72 flex-shrink-0">
            <PropertyFilters onFilterChange={setFilters} />
          </div>
          <div className="flex-1">
            <PropertyGrid properties={filtered} />
          </div>
        </div>
      </div>
    </div>
  )
}
