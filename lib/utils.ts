import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { PropertyStatus, PropertyType, InquiryStatus } from '@/types/database'

// ============================================================
// Class Name Utility
// ============================================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================
// Price Formatting
// ============================================================

export function formatPrice(price: number): string {
  if (price >= 10000000) {
    const cr = price / 10000000
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`
  }
  if (price >= 100000) {
    const lakh = price / 100000
    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2)} Lakh`
  }
  return `₹${price.toLocaleString('en-IN')}`
}

export function formatPriceCompact(price: number): string {
  if (price >= 10000000) return `${(price / 10000000).toFixed(1)}Cr`
  if (price >= 100000) return `${(price / 100000).toFixed(1)}L`
  if (price >= 1000) return `${(price / 1000).toFixed(0)}K`
  return price.toString()
}

// ============================================================
// Area Formatting
// ============================================================

export function formatArea(sqft: number | undefined | null): string {
  if (!sqft) return 'N/A'
  return `${sqft.toLocaleString('en-IN')} sq.ft`
}

// ============================================================
// Slug Generation
// ============================================================

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ============================================================
// Date Formatting
// ============================================================

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ]
  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds)
    if (count >= 1) return `${count} ${i.label}${count > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

// ============================================================
// Status Badge Utilities
// ============================================================

export function getStatusBadgeClass(status: PropertyStatus): string {
  const map: Record<PropertyStatus, string> = {
    for_sale: 'badge-sale',
    for_rent: 'badge-rent',
    sold: 'badge-sold',
    booked: 'badge-booked',
    featured: 'badge-featured',
    new: 'badge-new',
    hot: 'badge-hot',
    price_reduced: 'badge-reduced',
  }
  return map[status] || 'badge'
}

export function getStatusLabel(status: PropertyStatus): string {
  const map: Record<PropertyStatus, string> = {
    for_sale: 'For Sale',
    for_rent: 'For Rent',
    sold: 'Sold',
    booked: 'Booked',
    featured: 'Featured',
    new: 'New',
    hot: 'Hot Property',
    price_reduced: 'Price Reduced',
  }
  return map[status] || status
}

export function getPropertyTypeLabel(type: PropertyType): string {
  const map: Record<PropertyType, string> = {
    residential: 'Residential',
    commercial: 'Commercial',
    plot: 'Plot',
    farmhouse: 'Farm House',
    rental: 'Rental',
    luxury_villa: 'Luxury Villa',
    apartment: 'Apartment',
    independent_house: 'Independent House',
    office_space: 'Office Space',
    warehouse: 'Warehouse',
  }
  return map[type] || type
}

export function getInquiryStatusColor(status: InquiryStatus): string {
  const map: Record<InquiryStatus, string> = {
    new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    interested: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    site_visit: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    negotiation: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    closed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  }
  return map[status] || ''
}

export function getInquiryStatusLabel(status: InquiryStatus): string {
  const map: Record<InquiryStatus, string> = {
    new: 'New',
    contacted: 'Contacted',
    interested: 'Interested',
    site_visit: 'Site Visit',
    negotiation: 'Negotiation',
    closed: 'Closed',
    rejected: 'Rejected',
  }
  return map[status] || status
}

// ============================================================
// WhatsApp Utilities
// ============================================================

export function getWhatsAppLink(message: string, number: string = '919511802062'): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function getPropertyWhatsAppMessage(title: string, slug: string): string {
  return `Hi PrimeAxis! I'm interested in the property "${title}". Please share more details.\n\nProperty: ${typeof window !== 'undefined' ? window.location.origin : ''}/properties/${slug}`
}

export function getCallLink(number: string = '+919511802062'): string {
  return `tel:${number}`
}

// ============================================================
// YouTube Utilities
// ============================================================

export function getYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

export function getYouTubeThumbnail(url: string): string {
  const id = getYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : ''
}

// ============================================================
// Truncate
// ============================================================

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

// ============================================================
// EMI Calculator
// ============================================================

export function calculateEMI(principal: number, ratePercent: number, years: number): number {
  const r = ratePercent / 12 / 100
  const n = years * 12
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

// ============================================================
// Constants
// ============================================================

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'plot', label: 'Plot' },
  { value: 'farmhouse', label: 'Farm House' },
  { value: 'rental', label: 'Rental' },
  { value: 'luxury_villa', label: 'Luxury Villa' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'independent_house', label: 'Independent House' },
  { value: 'office_space', label: 'Office Space' },
  { value: 'warehouse', label: 'Warehouse' },
]

export const PROPERTY_STATUSES: { value: PropertyStatus; label: string }[] = [
  { value: 'for_sale', label: 'For Sale' },
  { value: 'for_rent', label: 'For Rent' },
  { value: 'sold', label: 'Sold' },
  { value: 'booked', label: 'Booked' },
  { value: 'featured', label: 'Featured' },
  { value: 'new', label: 'New' },
  { value: 'hot', label: 'Hot Property' },
  { value: 'price_reduced', label: 'Price Reduced' },
]

export const FACING_OPTIONS = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']

export const OWNERSHIP_OPTIONS = ['Freehold', 'Leasehold', 'Co-operative Society', 'Power of Attorney']

export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5, 6]

export const PRICE_RANGES = [
  { label: 'Under ₹25 Lakh', min: 0, max: 2500000 },
  { label: '₹25-50 Lakh', min: 2500000, max: 5000000 },
  { label: '₹50 Lakh - 1 Cr', min: 5000000, max: 10000000 },
  { label: '₹1-2 Cr', min: 10000000, max: 20000000 },
  { label: '₹2-5 Cr', min: 20000000, max: 50000000 },
  { label: '₹5 Cr+', min: 50000000, max: 999999999 },
]
