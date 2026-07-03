'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROPERTY_TYPES, PROPERTY_STATUSES, PRICE_RANGES, BEDROOM_OPTIONS } from '@/lib/utils'

interface Filters {
  search: string; type: string; status: string; minPrice: string; maxPrice: string; bedrooms: string; sort: string
}

export default function PropertyFilters({ onFilterChange }: { onFilterChange: (f: Filters) => void }) {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({ search: '', type: '', status: '', minPrice: '', maxPrice: '', bedrooms: '', sort: 'newest' })

  const update = (key: keyof Filters, value: string) => {
    const next = { ...filters, [key]: value }
    setFilters(next)
    onFilterChange(next)
  }

  const clear = () => {
    const empty: Filters = { search: '', type: '', status: '', minPrice: '', maxPrice: '', bedrooms: '', sort: 'newest' }
    setFilters(empty)
    onFilterChange(empty)
  }

  const filterContent = (
    <div className="space-y-5">
      <div>
        <label className="label">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" className="input pl-10" placeholder="Search properties..." value={filters.search}
            onChange={e => update('search', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="label">Property Type</label>
        <select className="select" value={filters.type} onChange={e => update('type', e.target.value)}>
          <option value="">All Types</option>
          {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Status</label>
        <select className="select" value={filters.status} onChange={e => update('status', e.target.value)}>
          <option value="">All Statuses</option>
          {PROPERTY_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Price Range</label>
        <select className="select" onChange={e => {
          const r = PRICE_RANGES.find(p => p.label === e.target.value)
          if (r) { update('minPrice', String(r.min)); update('maxPrice', String(r.max)) }
          else { update('minPrice', ''); update('maxPrice', '') }
        }}>
          <option value="">Any Price</option>
          {PRICE_RANGES.map(r => <option key={r.label} value={r.label}>{r.label}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Bedrooms</label>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => update('bedrooms', '')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!filters.bedrooms ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>Any</button>
          {BEDROOM_OPTIONS.map(b => (
            <button key={b} onClick={() => update('bedrooms', String(b))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filters.bedrooms === String(b) ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>{b}+</button>
          ))}
        </div>
      </div>
      <div>
        <label className="label">Sort By</label>
        <select className="select" value={filters.sort} onChange={e => update('sort', e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="featured">Featured First</option>
        </select>
      </div>
      <button onClick={clear} className="btn-ghost w-full text-sm">Clear All Filters</button>
    </div>
  )

  return (
    <>
      <button onClick={() => setOpen(!open)} className="lg:hidden btn-outline mb-4 w-full">
        <SlidersHorizontal className="w-4 h-4" /> {open ? 'Hide Filters' : 'Show Filters'}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden mb-6">
            <div className="card p-5">{filterContent}</div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="hidden lg:block card p-5 sticky top-24">{filterContent}</div>
    </>
  )
}
