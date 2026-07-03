import { Check } from 'lucide-react'

const defaultAmenities = ['Swimming Pool', 'Gym / Fitness Center', 'Clubhouse', '24/7 Security', 'CCTV Surveillance', 'Power Backup', 'Water Supply 24/7', 'Reserved Parking', 'Lift / Elevator', 'Children Play Area', 'Garden / Landscaping', 'Jogging Track']

export default function AmenitiesGrid({ amenities }: { amenities?: string[] }) {
  const list = amenities && amenities.length > 0 ? amenities : defaultAmenities

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {list.map(a => (
        <div key={a} className="flex items-center gap-2 p-2">
          <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-green-600 dark:text-green-400" /></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">{a}</span>
        </div>
      ))}
    </div>
  )
}
