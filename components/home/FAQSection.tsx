'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { getFAQs } from '@/lib/db'

export default function FAQSection() {
  const [faqs, setFaqs] = useState<any[]>([])
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useEffect(() => {
    getFAQs().then(list => setFaqs(list.filter(f => f.is_active)))
  }, [])

  return (
    <section className="section bg-white dark:bg-background-dark">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="section-gold-line mx-auto mt-4 mb-4" />
          <p className="section-subtitle mx-auto">Everything you need to know about buying property with PrimeAxis</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, i) => (
            <div key={faq.id} className="border-b border-gray-200 dark:border-gray-700">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center py-5 text-left group" aria-expanded={openIndex === i}>
                <span className="font-semibold text-gray-800 dark:text-white pr-4 group-hover:text-primary dark:group-hover:text-gold transition-colors">
                  {faq.question}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-gold' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <p className="pb-5 text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
