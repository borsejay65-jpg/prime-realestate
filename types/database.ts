// ============================================================
// PrimeAxis Real Estate — Database Types
// ============================================================

export type PropertyStatus = 
  | 'for_sale' | 'for_rent' | 'sold' | 'booked' 
  | 'featured' | 'new' | 'hot' | 'price_reduced'

export type PropertyType = 
  | 'residential' | 'commercial' | 'plot' | 'farmhouse' | 'rental'
  | 'luxury_villa' | 'apartment' | 'independent_house' | 'office_space' | 'warehouse'

export type ConstructionStatus = 
  | 'ready_to_move' | 'under_construction' | 'new_launch' | 'resale'

export type InquiryStatus = 
  | 'new' | 'contacted' | 'interested' | 'site_visit' 
  | 'negotiation' | 'closed' | 'rejected'

export type InquirySource = 
  | 'website_form' | 'whatsapp' | 'call' | 'email' | 'walkin' | 'referral'

export type BlogStatus = 'draft' | 'published' | 'archived'

export type SlideType = 'image' | 'video'

export type UserRole = 'super_admin' | 'admin' | 'editor'

// ============================================================
// ENTITIES
// ============================================================

export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  description?: string
  display_order: number
  is_active: boolean
  created_at: string
  property_count?: number
}

export interface Location {
  id: string
  city: string
  area?: string
  state: string
  country: string
  pincode?: string
  is_active: boolean
  created_at: string
}

export interface Amenity {
  id: string
  name: string
  icon?: string
  category?: string
  is_active: boolean
  created_at: string
}

export interface Property {
  id: string
  property_id: string
  title: string
  slug: string
  description?: string
  highlights?: string[]
  property_type: PropertyType
  status: PropertyStatus
  construction_status: ConstructionStatus
  price: number
  price_label?: string
  price_negotiable: boolean
  area_sqft?: number
  area_sqyard?: number
  bedrooms?: number
  bathrooms?: number
  balcony?: number
  parking?: number
  floor?: number
  total_floors?: number
  facing?: string
  ownership?: string
  possession_date?: string
  address?: string
  location: string
  city?: string
  state?: string
  pincode?: string
  map_lat?: number
  map_lng?: number
  map_embed_url?: string
  thumbnail_url?: string
  brochure_url?: string
  category_id?: string
  location_id?: string
  is_featured: boolean
  is_active: boolean
  is_draft: boolean
  views: number
  inquiry_count: number
  seo_title?: string
  seo_description?: string
  created_by?: string
  created_at: string
  updated_at: string
  // Joined
  images?: PropertyImage[]
  videos?: PropertyVideo[]
  amenities?: Amenity[]
  nearby?: PropertyNearby[]
  category?: Category
}

export interface PropertyImage {
  id: string
  property_id: string
  url: string
  caption?: string
  display_order: number
  is_thumbnail: boolean
  created_at: string
}

export interface PropertyVideo {
  id: string
  property_id: string
  url: string
  video_type: 'youtube' | 'uploaded'
  title?: string
  thumbnail_url?: string
  display_order: number
  created_at: string
}

export interface PropertyNearby {
  id: string
  property_id: string
  place_name: string
  place_type?: string
  distance?: string
  display_order: number
}

export interface CarouselSlide {
  id: string
  title?: string
  subtitle?: string
  slide_type: SlideType
  media_url: string
  button_text?: string
  button_url?: string
  display_order: number
  is_active: boolean
  schedule_start?: string
  schedule_end?: string
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  customer_name: string
  customer_image?: string
  rating: number
  review: string
  property_type?: string
  location?: string
  display_order: number
  is_active: boolean
  created_at: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  display_order: number
  is_active: boolean
  created_at: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  featured_image?: string
  status: BlogStatus
  category_id?: string
  tags?: string[]
  views: number
  seo_title?: string
  seo_description?: string
  author_id?: string
  published_at?: string
  created_at: string
  updated_at: string
  // Joined
  category?: BlogCategory
  author?: Profile
}

export interface Inquiry {
  id: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  message?: string
  property_id?: string
  property_title?: string
  source: InquirySource
  status: InquiryStatus
  notes?: string
  assigned_to?: string
  follow_up_date?: string
  created_at: string
  updated_at: string
  // Joined
  property?: Property
  assigned_agent?: Profile
}

export interface SiteSettings {
  [key: string]: string
}

// ============================================================
// FILTERS & SEARCH
// ============================================================

export interface PropertyFilters {
  search?: string
  type?: PropertyType | ''
  status?: PropertyStatus | ''
  city?: string
  location?: string
  min_price?: number
  max_price?: number
  bedrooms?: number
  bathrooms?: number
  is_featured?: boolean
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'featured'
  page?: number
  limit?: number
}

// ============================================================
// API RESPONSES
// ============================================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  count?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  total_pages: number
}

// ============================================================
// FORMS
// ============================================================

export interface InquiryFormData {
  customer_name: string
  customer_phone: string
  customer_email?: string
  message?: string
  property_id?: string
  property_title?: string
  source: InquirySource
}

export interface PropertyFormData {
  title: string
  slug: string
  description?: string
  highlights?: string[]
  property_type: PropertyType
  status: PropertyStatus
  construction_status: ConstructionStatus
  price: number
  price_label?: string
  price_negotiable: boolean
  area_sqft?: number
  bedrooms?: number
  bathrooms?: number
  balcony?: number
  parking?: number
  floor?: number
  total_floors?: number
  facing?: string
  ownership?: string
  possession_date?: string
  address?: string
  location: string
  city?: string
  pincode?: string
  map_lat?: number
  map_lng?: number
  map_embed_url?: string
  category_id?: string
  is_featured: boolean
  is_draft: boolean
  seo_title?: string
  seo_description?: string
}
