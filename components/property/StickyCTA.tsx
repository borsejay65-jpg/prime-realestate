'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MessageCircle } from 'lucide-react'
import { getWhatsAppLink, getPropertyWhatsAppMessage, getCallLink } from '@/lib/utils'

export default function StickyCTA({ propertyTitle, propertySlug }: { propertyTitle: string; propertySlug: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const waLink = getWhatsAppLink(getPropertyWhatsAppMessage(propertyTitle, propertySlug))

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark shadow-float p-3 z-40 flex gap-3">
          <a href={waLink} target="_blank" rel="noopener" className="flex-1 btn-whatsapp text-center">
            <MessageCircle className="w-5 h-5" /> WhatsApp
          </a>
          <a href={getCallLink()} className="flex-1 btn-call text-center">
            <Phone className="w-5 h-5" /> Call Now
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
