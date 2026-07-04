'use client'

import { useState, useEffect } from 'react'
import PropertyCard from './PropertyCard'
import { getProperties } from '@/lib/db'

export default function RelatedProperties({ currentId, propertyType, city }: { currentId: string; propertyType: string; city?: string }) {
  const [related, setRelated] = useState<any[]>([])

  useEffect(() => {
    getProperties().then(list => {
      const filtered = list.filter(p => p.id !== currentId && p.is_active && !p.is_draft && (p.property_type === propertyType || p.city === city)).slice(0, 4)
      setRelated(filtered)
    })
  }, [currentId, propertyType, city])

  if (!related.length) return null

  return (
    <div>
      <h3 className="font-display text-2xl font-bold text-gray-800 dark:text-white mb-6">Similar Properties</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {related.map(p => (
          <div key={p.id} className="w-full">
            <PropertyCard property={p} />
          </div>
        ))}
      </div>
    </div>
  )
}
