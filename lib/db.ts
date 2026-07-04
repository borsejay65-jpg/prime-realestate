import { demoProperties, demoInquiries, demoBlogs, demoTestimonials, demoFAQs } from './demo-data'
import type { Property, Inquiry, Blog, Testimonial, FAQ } from '@/types/database'

const KEY_PROPERTIES = 'primeaxis_properties'
const KEY_INQUIRIES = 'primeaxis_inquiries'
const KEY_BLOGS = 'primeaxis_blogs'
const KEY_TESTIMONIALS = 'primeaxis_testimonials'
const KEY_FAQS = 'primeaxis_faqs'

export function getProperties(): Property[] {
  if (typeof window === 'undefined') return demoProperties
  const data = localStorage.getItem(KEY_PROPERTIES)
  if (!data) {
    localStorage.setItem(KEY_PROPERTIES, JSON.stringify(demoProperties))
    return demoProperties
  }
  try {
    return JSON.parse(data)
  } catch {
    return demoProperties
  }
}

export function saveProperties(list: Property[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY_PROPERTIES, JSON.stringify(list))
}

export function getInquiries(): Inquiry[] {
  if (typeof window === 'undefined') return demoInquiries as any
  const data = localStorage.getItem(KEY_INQUIRIES)
  if (!data) {
    localStorage.setItem(KEY_INQUIRIES, JSON.stringify(demoInquiries))
    return demoInquiries as any
  }
  try {
    return JSON.parse(data)
  } catch {
    return demoInquiries as any
  }
}

export function saveInquiries(list: any[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY_INQUIRIES, JSON.stringify(list))
}

export function getBlogs(): Blog[] {
  if (typeof window === 'undefined') return demoBlogs
  const data = localStorage.getItem(KEY_BLOGS)
  if (!data) {
    localStorage.setItem(KEY_BLOGS, JSON.stringify(demoBlogs))
    return demoBlogs
  }
  try {
    return JSON.parse(data)
  } catch {
    return demoBlogs
  }
}

export function saveBlogs(list: Blog[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY_BLOGS, JSON.stringify(list))
}

export function getTestimonials(): Testimonial[] {
  if (typeof window === 'undefined') return demoTestimonials
  const data = localStorage.getItem(KEY_TESTIMONIALS)
  if (!data) {
    localStorage.setItem(KEY_TESTIMONIALS, JSON.stringify(demoTestimonials))
    return demoTestimonials
  }
  try {
    return JSON.parse(data)
  } catch {
    return demoTestimonials
  }
}

export function saveTestimonials(list: Testimonial[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY_TESTIMONIALS, JSON.stringify(list))
}

export function getFAQs(): FAQ[] {
  if (typeof window === 'undefined') return demoFAQs
  const data = localStorage.getItem(KEY_FAQS)
  if (!data) {
    localStorage.setItem(KEY_FAQS, JSON.stringify(demoFAQs))
    return demoFAQs
  }
  try {
    return JSON.parse(data)
  } catch {
    return demoFAQs
  }
}

export function saveFAQs(list: FAQ[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY_FAQS, JSON.stringify(list))
}
