'use client'

import PropertyCard from './PropertyCard'
import { demoProperties } from '@/lib/demo-data'

export default function RelatedProperties({ currentId, propertyType, city }: { currentId: string; propertyType: string; city?: string }) {
  const related = demoProperties.filter(p => p.id !== currentId && (p.property_type === propertyType || p.city === city)).slice(0, 4)

  if (!related.length) return null

  return (
    <div>
      <h3 className="font-display text-2xl font-bold text-gray-800 dark:text-white mb-6">Similar Properties</h3>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
        {related.map(p => (
          <div key={p.id} className="min-w-[300px] flex-shrink-0">
            <PropertyCard property={p} />
          </div>
        ))}
      </div>
    </div>
  )
}
