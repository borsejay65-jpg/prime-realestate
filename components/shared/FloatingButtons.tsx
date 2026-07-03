'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FloatingButtons() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className={cn(
            'fixed z-50 flex flex-col gap-3',
            'bottom-6 right-6',
            'max-sm:bottom-4 max-sm:right-4'
          )}
        >
          {/* WhatsApp Button */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            className="relative"
            onMouseEnter={() => setHoveredButton('whatsapp')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {hoveredButton === 'whatsapp' && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap
                             rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg"
                >
                  Chat on WhatsApp
                </motion.span>
              )}
            </AnimatePresence>
            <a
              href="https://wa.me/919511802062"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className={cn(
                'flex items-center justify-center rounded-full bg-[#25d366] shadow-float',
                'transition-transform duration-200 hover:scale-110',
                'animate-pulse-gold',
                'w-14 h-14 max-sm:w-12 max-sm:h-12'
              )}
            >
              <MessageCircle className="h-6 w-6 text-white max-sm:h-5 max-sm:w-5" />
            </a>
          </motion.div>

          {/* Call Button */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
            className="relative"
            onMouseEnter={() => setHoveredButton('call')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {hoveredButton === 'call' && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap
                             rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg"
                >
                  Call Now
                </motion.span>
              )}
            </AnimatePresence>
            <a
              href="tel:+919511802062"
              aria-label="Call Now"
              className={cn(
                'flex items-center justify-center rounded-full bg-primary shadow-float',
                'transition-transform duration-200 hover:scale-110',
                'w-14 h-14 max-sm:w-12 max-sm:h-12'
              )}
            >
              <Phone className="h-6 w-6 text-white max-sm:h-5 max-sm:w-5" />
            </a>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
