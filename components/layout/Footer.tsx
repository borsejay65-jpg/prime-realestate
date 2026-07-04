'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-of-service', label: 'Terms of Service' },
]

const propertyTypes = [
  { slug: 'residential', label: 'Residential' },
  { slug: 'commercial', label: 'Commercial' },
  { slug: 'apartment', label: 'Apartments' },
  { slug: 'luxury_villa', label: 'Luxury Villas' },
  { slug: 'plot', label: 'Plots' },
  { slug: 'farmhouse', label: 'Farm House' },
  { slug: 'office_space', label: 'Office Space' },
]

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/primeaxis', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/primeaxis', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com/primeaxis', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/primeaxis', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com/@primeaxis', label: 'YouTube' },
]

export default function Footer() {
  const [contact, setContact] = useState({
    phone: '+91 9511802062',
    whatsapp: '+91 9511802062',
    email: 'info@primeaxis.in',
    address: 'Office 101, Central Plaza, Court Road, Jalgaon, Maharashtra 425001',
    hours: 'Mon – Sat: 9:30 AM – 7:00 PM'
  })
  const [company, setCompany] = useState({
    name: 'PrimeAxis Realty',
    rera_number: 'RERA: P52100023456'
  })

  useEffect(() => {
    const { createClient } = require('@/lib/supabase/client')
    const supabase = createClient()
    supabase.from('site_settings').select('key, value').then(({ data }) => {
      if (data) {
        const dict = data.reduce((acc: any, r: any) => ({ ...acc, [r.key]: r.value }), {} as any)
        setContact({
          phone: dict.phone_primary || '+91 9511802062',
          whatsapp: dict.whatsapp_number || '+91 9511802062',
          email: dict.email_primary || 'info@primeaxis.in',
          address: dict.address || 'Office 101, Central Plaza, Court Road, Jalgaon, Maharashtra 425001',
          hours: dict.business_hours || 'Mon – Sat: 9:30 AM – 7:00 PM'
        })
        setCompany({
          name: dict.company_name || 'PrimeAxis Realty',
          rera_number: dict.rera_number ? `RERA: ${dict.rera_number}` : 'RERA: P52100023456'
        })
      }
    })
  }, [])

  return (
    <footer className="bg-[#07111f] text-white">
      {/* Gold line at top */}
      <div className="h-1 bg-gradient-to-r from-gold/80 via-gold to-gold/80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-1 mb-4">
              <span className="font-display font-bold text-2xl text-white">
                Prime
              </span>
              <span className="font-display font-bold text-2xl text-gold">
                Axis
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Jalgaon&apos;s premier real estate brokerage, specializing in luxury
              properties, premium residences, and commercial spaces. Your dream
              property, our expertise.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={cn(
                    'flex items-center justify-center w-9 h-9 rounded-lg',
                    'bg-white/5 text-gray-400',
                    'transition-all duration-300',
                    'hover:text-gold hover:bg-gold/10 hover:-translate-y-0.5'
                  )}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm transition-colors duration-300 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Property Types */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold mb-5">
              Property Types
            </h3>
            <ul className="space-y-3">
              {propertyTypes.map((type) => (
                <li key={type.slug}>
                  <Link
                    href={`/properties?type=${type.slug}`}
                    className="text-gray-400 text-sm transition-colors duration-300 hover:text-gold"
                  >
                    {type.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm leading-relaxed">
                  {contact.address}
                </span>
              </li>
              <li>
                <a
                  href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-3 text-gray-400 text-sm transition-colors duration-300 hover:text-gold"
                >
                  <Phone className="h-5 w-5 text-gold flex-shrink-0" />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 text-gray-400 text-sm transition-colors duration-300 hover:text-gold"
                >
                  <Mail className="h-5 w-5 text-gold flex-shrink-0" />
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gold flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  {contact.hours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 {company.name}. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              {company.rera_number.startsWith('RERA:') ? company.rera_number : `RERA: ${company.rera_number}`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
