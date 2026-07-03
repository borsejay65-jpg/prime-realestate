'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Building2 } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark px-4">
      <div className="text-center">
        <motion.p initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="text-[10rem] font-bold font-display leading-none gradient-text-gold">404</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-800 dark:text-white mb-3">Page Not Found</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-gray-500 mb-8 max-w-md mx-auto">The property you&apos;re looking for might have been sold! Let us help you find something even better.</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex gap-4 justify-center flex-wrap">
          <Link href="/" className="btn-primary"><Home className="w-4 h-4" /> Go Home</Link>
          <Link href="/properties" className="btn-outline"><Building2 className="w-4 h-4" /> View Properties</Link>
        </motion.div>
      </div>
    </div>
  )
}
