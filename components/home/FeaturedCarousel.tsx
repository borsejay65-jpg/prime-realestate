'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, BedDouble, Bath, Maximize, ArrowRight } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { getProperties } from '@/lib/db'
import { formatPrice, formatArea, getStatusBadgeClass, getStatusLabel } from '@/lib/utils'

import { useState, useEffect } from 'react'

export default function FeaturedCarousel() {
  const [featured, setFeatured] = useState<any[]>([])
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    getProperties().then(list => {
      setFeatured(list.filter(p => p.is_featured && p.is_active && !p.is_draft))
    })
  }, [])

  return (
    <section className="section bg-white dark:bg-background-dark" ref={ref}>
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-center mb-12">
          <h2 className="section-title">Featured Properties</h2>
          <div className="section-gold-line mx-auto mt-4 mb-4" />
          <p className="section-subtitle mx-auto">Handpicked premium properties for discerning buyers</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((property, i) => (
            <motion.div key={property.id} initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="w-full">
              <Link href={`/properties/${property.slug}`} className="card group block h-full">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={property.thumbnail_url || ''} alt={property.title} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className={`absolute top-2.5 left-2.5 text-[10px] ${getStatusBadgeClass(property.status)}`}>
                    {getStatusLabel(property.status)}
                  </span>
                  {property.is_featured && (
                    <span className="absolute top-2.5 right-2.5 text-[10px] badge-featured">Featured</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-base text-gray-800 dark:text-white line-clamp-1">{property.title}</h3>
                  <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> {property.location}
                  </p>
                  <p className="font-display text-xl text-primary dark:text-gold font-bold mt-2">
                    {property.price_label || formatPrice(property.price)}
                  </p>
                  <div className="flex items-center gap-3 mt-2.5 text-xs text-gray-500">
                    {property.bedrooms && property.bedrooms > 0 && (
                      <span className="flex items-center gap-0.5"><BedDouble className="w-3.5 h-3.5 text-gray-400" /> {property.bedrooms} Beds</span>
                    )}
                    {property.bathrooms && property.bathrooms > 0 && (
                      <span className="flex items-center gap-0.5"><Bath className="w-3.5 h-3.5 text-gray-400" /> {property.bathrooms} Baths</span>
                    )}
                    {property.area_sqft && (
                      <span className="flex items-center gap-0.5"><Maximize className="w-3.5 h-3.5 text-gray-400" /> {formatArea(property.area_sqft)}</span>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-primary dark:text-gold font-semibold text-xs flex items-center gap-1">
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/properties" className="btn-primary">View All Properties <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </section>
  )
}
