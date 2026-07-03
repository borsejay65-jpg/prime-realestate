'use client'

import Link from 'next/link'
import { MapPin, BedDouble, Bath, Maximize, Car, ArrowRight, Share2 } from 'lucide-react'
import { formatPrice, formatArea, getStatusBadgeClass, getStatusLabel } from '@/lib/utils'
import type { Property } from '@/types/database'
import toast from 'react-hot-toast'

export default function PropertyCard({ property }: { property: Property }) {
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/properties/${property.slug}`
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  return (
    <Link href={`/properties/${property.slug}`} className="card group block h-full">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={property.thumbnail_url || 'https://via.placeholder.com/800x600?text=Property'} alt={property.title}
          loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <span className={`absolute top-3 left-3 ${getStatusBadgeClass(property.status)}`}>
          {getStatusLabel(property.status)}
        </span>
        {property.is_featured && <span className="absolute top-3 right-3 badge-featured">Featured</span>}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-white line-clamp-1">{property.title}</h3>
        <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
          <MapPin className="w-4 h-4" /> {property.location}
        </p>
        <p className="font-display text-2xl font-bold text-primary dark:text-gold mt-3">
          {property.price_label || formatPrice(property.price)}
        </p>
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 flex-wrap">
          {(property.bedrooms ?? 0) > 0 && <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" /> {property.bedrooms} Beds</span>}
          {(property.bathrooms ?? 0) > 0 && <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.bathrooms} Baths</span>}
          {property.area_sqft && <span className="flex items-center gap-1"><Maximize className="w-4 h-4" /> {formatArea(property.area_sqft)}</span>}
          {(property.parking ?? 0) > 0 && <span className="flex items-center gap-1"><Car className="w-4 h-4" /> {property.parking}</span>}
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-primary dark:text-gold font-medium text-sm flex items-center gap-1">
            View Details <ArrowRight className="w-4 h-4" />
          </span>
          <button onClick={handleShare} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Share2 className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </Link>
  )
}
