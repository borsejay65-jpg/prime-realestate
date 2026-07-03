'use client'

import { motion } from 'framer-motion'
import { SearchX } from 'lucide-react'
import Link from 'next/link'
import PropertyCard from './PropertyCard'
import type { Property } from '@/types/database'

export default function PropertyGrid({ properties }: { properties: Property[] }) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-20">
        <SearchX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Properties Found</h3>
        <p className="text-gray-500 mb-6">Try adjusting your filters to find what you&apos;re looking for</p>
        <Link href="/properties" className="btn-primary">Clear Filters</Link>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">{properties.length} Properties Found</p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}>
            <PropertyCard property={p} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
