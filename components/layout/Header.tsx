'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, MessageCircle, Phone, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/providers/ThemeProvider'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const isHomepage = pathname === '/'
  const showGlass = isScrolled || !isHomepage

  const [contact, setContact] = useState({
    phone: '+91 9511802062',
    whatsapp: '+91 9511802062',
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
        })
      }
    })
  }, [])

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial state
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleBackdropClick = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          showGlass
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-gray-100 dark:border-gray-800'
            : 'bg-transparent'
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="relative z-10 flex items-center gap-1 group">
              <span
                className={cn(
                  'font-display font-bold text-2xl transition-colors duration-300',
                  showGlass
                    ? 'text-primary dark:text-white'
                    : 'text-white'
                )}
              >
                Prime
              </span>
              <span className="font-display font-bold text-2xl text-gold transition-colors duration-300">
                Axis
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300',
                    showGlass
                      ? isActive(link.href)
                        ? 'text-primary dark:text-gold'
                        : 'text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-gold'
                      : isActive(link.href)
                        ? 'text-gold'
                        : 'text-white/90 hover:text-white'
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gold"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className={cn(
                  'p-2.5 rounded-xl transition-all duration-300',
                  showGlass
                    ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold
                           text-white bg-[#25d366] rounded-xl shadow-md
                           transition-all duration-300 hover:bg-[#20bd5a] hover:shadow-lg hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>

              {/* Call CTA */}
              <a
                href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                className="btn-primary !py-2.5 !text-sm"
              >
                <Phone className="h-4 w-4" />
                <span>Call Now</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'lg:hidden relative z-10 p-2 rounded-xl transition-all duration-300',
                showGlass
                  ? 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-white hover:bg-white/10'
              )}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={handleBackdropClick}
              aria-hidden="true"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={cn(
                'fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-sm lg:hidden',
                'bg-white dark:bg-gray-900 shadow-2xl',
                'flex flex-col overflow-y-auto'
              )}
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                <Link href="/" className="flex items-center gap-1" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="font-display font-bold text-2xl text-primary dark:text-white">
                    Prime
                  </span>
                  <span className="font-display font-bold text-2xl text-gold">
                    Axis
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex-1 px-4 py-6">
                <div className="space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200',
                          isActive(link.href)
                            ? 'bg-primary/10 text-primary dark:bg-gold/10 dark:text-gold'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        )}
                      >
                        {link.label}
                        {isActive(link.href) && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-6 border-t border-gray-100 dark:border-gray-800" />

                {/* Mobile CTAs */}
                <div className="space-y-3 px-2">
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold
                               text-white bg-[#25d366] rounded-xl shadow-md transition-all duration-300 hover:bg-[#20bd5a]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat on WhatsApp
                  </a>
                  <a
                    href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex items-center justify-center gap-2 w-full btn-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Phone className="h-4 w-4" />
                    Call Now
                  </a>
                </div>

                {/* Divider */}
                <div className="my-6 border-t border-gray-100 dark:border-gray-800" />

                {/* Dark Mode Toggle */}
                <div className="px-2">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-sm font-medium
                               text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    <div className="flex items-center gap-2">
                      {theme === 'light' ? (
                        <Moon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Sun className="h-4 w-4 text-yellow-400" />
                      )}
                      <div
                        className={cn(
                          'w-10 h-5 rounded-full transition-colors duration-300 relative',
                          theme === 'dark' ? 'bg-gold' : 'bg-gray-300'
                        )}
                      >
                        <div
                          className={cn(
                            'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300',
                            theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'
                          )}
                        />
                      </div>
                    </div>
                  </button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
