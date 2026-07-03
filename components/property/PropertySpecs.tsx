import { Hash, Home, Tag, IndianRupee, Maximize, BedDouble, Bath, DoorOpen, Car, Layers, Compass, FileText, HardHat, Calendar } from 'lucide-react'
import { formatPrice, formatArea, getStatusLabel, getPropertyTypeLabel } from '@/lib/utils'
import type { Property } from '@/types/database'

export default function PropertySpecs({ property }: { property: Property }) {
  const specs = [
    { icon: Hash, label: 'Property ID', value: property.property_id },
    { icon: Home, label: 'Type', value: getPropertyTypeLabel(property.property_type) },
    { icon: Tag, label: 'Status', value: getStatusLabel(property.status) },
    { icon: IndianRupee, label: 'Price', value: property.price_label || formatPrice(property.price) },
    { icon: Maximize, label: 'Area', value: property.area_sqft ? formatArea(property.area_sqft) : null },
    { icon: BedDouble, label: 'Bedrooms', value: property.bedrooms || null },
    { icon: Bath, label: 'Bathrooms', value: property.bathrooms || null },
    { icon: DoorOpen, label: 'Balcony', value: property.balcony || null },
    { icon: Car, label: 'Parking', value: property.parking || null },
    { icon: Layers, label: 'Floor', value: property.floor !== undefined && property.floor !== null ? `${property.floor} of ${property.total_floors || '—'}` : null },
    { icon: Compass, label: 'Facing', value: property.facing || null },
    { icon: FileText, label: 'Ownership', value: property.ownership || null },
    { icon: HardHat, label: 'Construction', value: property.construction_status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || null },
    { icon: Calendar, label: 'Possession', value: property.possession_date ? new Date(property.possession_date).toLocaleDateString('en-IN') : null },
  ].filter(s => s.value !== null && s.value !== undefined)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {specs.map(s => (
        <div key={s.label} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <s.icon className="w-4 h-4 text-gold" />
            <span className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</span>
          </div>
          <p className="font-semibold text-gray-800 dark:text-white">{String(s.value)}</p>
        </div>
      ))}
    </div>
  )
}
