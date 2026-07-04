'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { getTestimonials } from '@/lib/db'

export default function TestimonialSlider() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    getTestimonials().then(list => setTestimonials(list.filter(t => t.is_active)))
  }, [])

  useEffect(() => {
    if (testimonials.length <= 1) return
    const timer = setInterval(() => setActive(p => (p + 1) % testimonials.length), 5000)
    return () => clearInterval(timer)
  }, [testimonials])

  if (testimonials.length === 0) return null

  const t = testimonials[active]

  return (
    <section className="section bg-gray-50 dark:bg-gray-900/50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">What Our Clients Say</h2>
          <div className="section-gold-line mx-auto mt-4 mb-4" />
          <p className="section-subtitle mx-auto">Real stories from real clients who found their dream property</p>
        </div>

        <div className="max-w-3xl mx-auto relative">
          <button onClick={() => setActive(p => (p - 1 + testimonials.length) % testimonials.length)}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 sm:-translate-x-8 md:-translate-x-12 w-10 h-10 bg-white dark:bg-surface-dark rounded-full shadow-card items-center justify-center hover:shadow-lg transition-shadow z-10">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={() => setActive(p => (p + 1) % testimonials.length)}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 sm:translate-x-8 md:translate-x-12 w-10 h-10 bg-white dark:bg-surface-dark rounded-full shadow-card items-center justify-center hover:shadow-lg transition-shadow z-10">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          <AnimatePresence mode="wait">
            {t && (
              <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
                className="glass-strong p-8 md:p-10 rounded-3xl text-center">
                <Quote className="w-10 h-10 text-gold/30 mx-auto mb-4" />
                <div className="flex justify-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < t.rating ? 'text-gold fill-gold' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic text-lg leading-relaxed mb-6">&ldquo;{t.review}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white text-lg">{t.customer_name}</p>
                  <p className="text-gray-500 text-sm">{t.property_type} • {t.location}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${i === active ? 'w-8 bg-gold' : 'w-2.5 bg-gray-300 dark:bg-gray-600'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
