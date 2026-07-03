'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Home, Building2, Map as MapIcon, TreePine, Key, Crown, Building, Briefcase, Package } from 'lucide-react'
import { demoCategories } from '@/lib/demo-data'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  'home': Home, 'building-2': Building2, 'map': MapIcon, 'tree-pine': TreePine,
  'key': Key, 'crown': Crown, 'building': Building, 'house': Home,
  'briefcase': Briefcase, 'package': Package,
}

export default function CategoryGrid() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="section bg-gray-50 dark:bg-gray-900/50" ref={ref}>
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-center mb-12">
          <h2 className="section-title">Explore Property Categories</h2>
          <div className="section-gold-line mx-auto mt-4 mb-4" />
          <p className="section-subtitle mx-auto">Browse properties by type to find exactly what you need</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {demoCategories.map((cat, i) => {
            const Icon = iconMap[cat.icon || 'home'] || Home
            return (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.05 }}>
                <Link href={`/properties?type=${cat.slug}`}
                  className="group block bg-white dark:bg-surface-dark p-6 rounded-2xl text-center border-2 border-transparent hover:border-gold hover:shadow-gold transition-all duration-300">
                  <div className="w-14 h-14 mx-auto mb-3 bg-primary/5 dark:bg-gold/10 rounded-2xl flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                    <Icon className="w-7 h-7 text-primary dark:text-gold group-hover:text-gold transition-colors" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-primary dark:group-hover:text-gold transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{cat.property_count} Properties</p>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
