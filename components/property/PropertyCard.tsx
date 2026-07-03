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
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={property.thumbnail_url || 'https://via.placeholder.com/800x600?text=Property'} alt={property.title}
          loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <span className={`absolute top-2.5 left-2.5 text-[10px] ${getStatusBadgeClass(property.status)}`}>
          {getStatusLabel(property.status)}
        </span>
        {property.is_featured && <span className="absolute top-2.5 right-2.5 text-[10px] badge-featured">Featured</span>}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-base text-gray-800 dark:text-white line-clamp-1">{property.title}</h3>
        <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <MapPin className="w-3.5 h-3.5" /> {property.location}
        </p>
        <p className="font-display text-xl font-bold text-primary dark:text-gold mt-2">
          {property.price_label || formatPrice(property.price)}
        </p>
        <div className="flex items-center gap-3 mt-2.5 text-xs text-gray-500 flex-wrap">
          {(property.bedrooms ?? 0) > 0 && <span className="flex items-center gap-0.5"><BedDouble className="w-3.5 h-3.5 text-gray-400" /> {property.bedrooms} Beds</span>}
          {(property.bathrooms ?? 0) > 0 && <span className="flex items-center gap-0.5"><Bath className="w-3.5 h-3.5 text-gray-400" /> {property.bathrooms} Baths</span>}
          {property.area_sqft && <span className="flex items-center gap-0.5"><Maximize className="w-3.5 h-3.5 text-gray-400" /> {formatArea(property.area_sqft)}</span>}
          {(property.parking ?? 0) > 0 && <span className="flex items-center gap-0.5"><Car className="w-3.5 h-3.5 text-gray-400" /> {property.parking}</span>}
        </div>
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <span className="text-primary dark:text-gold font-semibold text-xs flex items-center gap-1">
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </span>
          <button onClick={handleShare} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Share2 className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>
    </Link>
  )
}
