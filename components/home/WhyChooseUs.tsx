'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ShieldCheck, UserCheck, Scale, Landmark, BadgePercent, Handshake, Headphones, Award } from 'lucide-react'

const features = [
  { icon: ShieldCheck, title: 'Verified Listings', desc: 'Every property is thoroughly verified and documented for your complete peace of mind.' },
  { icon: UserCheck, title: 'Expert Guidance', desc: 'Our experienced agents guide you through every step of your property journey.' },
  { icon: Scale, title: 'Legal Assistance', desc: 'Complete legal support including documentation, verification, and registration.' },
  { icon: Landmark, title: 'Loan Support', desc: 'We help you get the best home loan rates with our banking partnerships.' },
  { icon: BadgePercent, title: 'Best Deals', desc: 'We negotiate the best possible price ensuring maximum value for your investment.' },
  { icon: Handshake, title: 'Negotiation Support', desc: 'Expert negotiators work to get you the best deal on every property.' },
  { icon: Headphones, title: 'After Sales Support', desc: 'Our relationship continues with full support even after the transaction.' },
  { icon: Award, title: 'Trust & Transparency', desc: 'Complete transparency in every transaction with no hidden costs.' },
]

export default function WhyChooseUs() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="section bg-white dark:bg-background-dark" ref={ref}>
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-center mb-12">
          <h2 className="section-title">Why Choose PrimeAxis</h2>
          <div className="section-gold-line mx-auto mt-4 mb-4" />
          <p className="section-subtitle mx-auto">We go above and beyond to make your property journey seamless</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card p-6 text-center group">
              <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                <f.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">{f.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
