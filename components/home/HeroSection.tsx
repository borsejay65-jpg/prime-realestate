'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Phone, ArrowRight } from 'lucide-react'
import { PROPERTY_TYPES } from '@/lib/utils'

const heroImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop',
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } } }
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [searchType, setSearchType] = useState('')
  const [searchLocation, setSearchLocation] = useState('')

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % heroImages.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchType) params.set('type', searchType)
    if (searchLocation) params.set('search', searchLocation)
    window.location.href = `/properties?${params.toString()}`
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {heroImages.map((img, i) => (
        <img key={i} src={img} alt={`Luxury property ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      <motion.div variants={container} initial="hidden" animate="show"
        className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4 max-w-5xl mx-auto">
        <motion.p variants={item} className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-4">
          Premium Real Estate Brokerage
        </motion.p>
        <motion.h1 variants={item} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
          Find Your Dream<br />Property Today
        </motion.h1>
        <motion.p variants={item} className="text-lg md:text-xl text-white/80 max-w-2xl mb-8">
          Your trusted partner for premium properties in Pune. Verified listings, expert guidance, and the best deals on residential & commercial real estate.
        </motion.p>
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link href="/properties"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-gold text-primary-900 font-semibold rounded-xl shadow-gold hover:shadow-lg hover:-translate-y-0.5 transition-all">
            View Properties <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="tel:+919511802062"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all">
            <Phone className="w-5 h-5" /> Call Now
          </a>
        </motion.div>

        <motion.div variants={item} className="w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <select value={searchType} onChange={e => setSearchType(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 appearance-none">
              <option value="" className="text-gray-800">All Property Types</option>
              {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value} className="text-gray-800">{t.label}</option>)}
            </select>
            <input type="text" placeholder="Search by location..." value={searchLocation}
              onChange={e => setSearchLocation(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
            <button onClick={handleSearch}
              className="px-8 py-3 bg-gradient-gold text-primary-900 font-semibold rounded-xl hover:shadow-gold transition-all flex items-center justify-center gap-2">
              <Search className="w-5 h-5" /> Search
            </button>
          </div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroImages.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-gold' : 'w-2 bg-white/50'}`} />
        ))}
      </div>
    </section>
  )
}
