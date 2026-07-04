'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Phone, ArrowRight } from 'lucide-react'
import { PROPERTY_TYPES } from '@/lib/utils'
import { getCarouselSlides, getSettings } from '@/lib/db'

const defaultImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop',
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } } }
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }

export default function HeroSection() {
  const [slides, setSlides] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [searchType, setSearchType] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [phone, setPhone] = useState('+919511802062')

  useEffect(() => {
    getCarouselSlides().then(list => {
      const active = list.filter(s => s.is_active)
      if (active.length > 0) {
        setSlides(active)
      } else {
        setSlides(defaultImages.map((img, idx) => ({
          media_url: img,
          title: 'Find Your Dream Property Today',
          subtitle: 'Your trusted partner for premium properties in Jalgaon. Verified listings, expert guidance, and the best deals on residential & commercial real estate.',
          button_text: 'View Properties',
          button_url: '/properties'
        })))
      }
    })

    getSettings().then(dict => {
      if (dict.phone_primary) setPhone(dict.phone_primary.replace(/\s+/g, ''))
    })
  }, [])

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => setCurrent(p => (p + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [slides])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchType) params.set('type', searchType)
    if (searchLocation) params.set('search', searchLocation)
    window.location.href = `/properties?${params.toString()}`
  }

  const currentSlide = slides[current] || null

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {slides.map((slide, i) => (
        <img key={i} src={slide.media_url} alt={slide.title || 'Luxury property'}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      <motion.div variants={container} initial="hidden" animate="show"
        className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4 max-w-5xl mx-auto pt-20">
        <motion.p variants={item} className="text-gold uppercase tracking-[0.2em] text-xs sm:text-sm font-semibold mb-3">
          Premium Real Estate Brokerage
        </motion.p>
        {currentSlide && (
          <>
            <motion.h1 variants={item} className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 tracking-tight">
              {currentSlide.title}
            </motion.h1>
            <motion.p variants={item} className="text-sm sm:text-base md:text-lg text-white/85 max-w-xl mb-6 leading-relaxed">
              {currentSlide.subtitle}
            </motion.p>
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 mb-8 w-full sm:w-auto justify-center">
              <Link href={currentSlide.button_url || '/properties'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-gold text-primary-900 font-semibold rounded-xl shadow-gold hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm">
                {currentSlide.button_text || 'View Details'} <ArrowRight className="w-4 h-4" />
              </Link>
              <a href={`tel:${phone}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-sm">
                <Phone className="w-4 h-4" /> Call Now
              </a>
            </motion.div>
          </>
        )}

        <motion.div variants={item} className="w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <select value={searchType} onChange={e => setSearchType(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/15 border border-white/25 rounded-xl text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 appearance-none cursor-pointer">
              <option value="" className="text-gray-800">All Property Types</option>
              {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value} className="text-gray-800">{t.label}</option>)}
            </select>
            <input type="text" placeholder="Search by location..." value={searchLocation}
              onChange={e => setSearchLocation(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/15 border border-white/25 rounded-xl text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
            <button onClick={handleSearch}
              className="px-6 py-3 bg-gradient-gold text-primary-900 font-semibold rounded-xl hover:shadow-gold transition-all flex items-center justify-center gap-2 text-sm">
              <Search className="w-4.5 h-4.5" /> Search
            </button>
          </div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-gold' : 'w-2 bg-white/50'}`} />
        ))}
      </div>
    </section>
  )
}
