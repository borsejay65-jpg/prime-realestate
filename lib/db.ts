import { createClient as createBrowserClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Property, Inquiry, Blog, Testimonial, FAQ, CarouselSlide } from '@/types/database'

function getClient(client?: SupabaseClient) {
  if (client) return client
  return createBrowserClient()
}

// 1. Properties
export async function getProperties(client?: SupabaseClient): Promise<Property[]> {
  const supabase = getClient(client)
  const { data, error } = await supabase
    .from('properties')
    .select('*, images:property_images(*), videos:property_videos(*)')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Failed to get properties:', error)
    return []
  }
  return data || []
}

export async function getPropertyBySlug(slug: string, client?: SupabaseClient): Promise<Property | null> {
  const supabase = getClient(client)
  const { data, error } = await supabase
    .from('properties')
    .select('*, images:property_images(*), videos:property_videos(*)')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error(`Failed to get property by slug ${slug}:`, error)
    return null
  }
  return data
}

// 2. Inquiries
export async function getInquiries(client?: SupabaseClient): Promise<Inquiry[]> {
  const supabase = getClient(client)
  const { data, error } = await supabase
    .from('inquiries')
    .select('*, property:properties(*)')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Failed to get inquiries:', error)
    return []
  }
  return data || []
}

// 3. Blogs
export async function getBlogs(client?: SupabaseClient): Promise<Blog[]> {
  const supabase = getClient(client)
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Failed to get blogs:', error)
    return []
  }
  return data || []
}

export async function getBlogBySlug(slug: string, client?: SupabaseClient): Promise<Blog | null> {
  const supabase = getClient(client)
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error(`Failed to get blog by slug ${slug}:`, error)
    return null
  }
  return data
}

// 4. Testimonials
export async function getTestimonials(client?: SupabaseClient): Promise<Testimonial[]> {
  const supabase = getClient(client)
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (error) {
    console.error('Failed to get testimonials:', error)
    return []
  }
  return data || []
}

// 5. FAQs
export async function getFAQs(client?: SupabaseClient): Promise<FAQ[]> {
  const supabase = getClient(client)
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (error) {
    console.error('Failed to get FAQs:', error)
    return []
  }
  return data || []
}

// 6. Carousel Slides
export async function getCarouselSlides(client?: SupabaseClient): Promise<CarouselSlide[]> {
  const supabase = getClient(client)
  const { data, error } = await supabase
    .from('carousel_slides')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (error) {
    console.error('Failed to get carousel slides:', error)
    return []
  }
  return data || []
}

// 7. Settings Key-Value Map
export async function getSettings(client?: SupabaseClient): Promise<Record<string, string>> {
  const supabase = getClient(client)
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
  
  if (error) {
    console.error('Failed to get settings:', error)
    return {}
  }
  
  return (data || []).reduce((acc, row) => {
    acc[row.key] = row.value || ''
    return acc
  }, {} as Record<string, string>)
}
