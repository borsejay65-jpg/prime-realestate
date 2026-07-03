'use client'

import { useState } from 'react'
import { Camera } from 'lucide-react'
import type { PropertyImage } from '@/types/database'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

export default function ImageGallery({ images }: { images: PropertyImage[] }) {
  const [active, setActive] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const slides = images.map(img => ({ src: img.url, alt: img.caption || '' }))

  if (!images.length) return (
    <div className="aspect-[16/10] bg-gray-200 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
      <Camera className="w-12 h-12 text-gray-400" />
    </div>
  )

  return (
    <div>
      <div className="relative cursor-pointer rounded-2xl overflow-hidden" onClick={() => setLightboxOpen(true)}>
        <img src={images[active].url} alt={images[active].caption || 'Property'} className="w-full aspect-[16/10] object-cover" />
        <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full text-sm text-white font-medium flex items-center gap-1">
          <Camera className="w-4 h-4" /> {active + 1} / {images.length}
        </div>
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-2">
          {images.map((img, i) => (
            <button key={img.id} onClick={() => setActive(i)}
              className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === active ? 'border-gold shadow-gold' : 'border-transparent opacity-70 hover:opacity-100'}`}>
              <img src={img.url} alt={img.caption || ''} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
      <Lightbox open={lightboxOpen} close={() => setLightboxOpen(false)} slides={slides} index={active} />
    </div>
  )
}
