'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Building2, Users, Calendar, UserCheck, Compass, Eye, Award, Phone, MessageCircle } from 'lucide-react'
import CountUp from 'react-countup'
import Link from 'next/link'

const team = [
  { name: 'Rajesh Sharma', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  { name: 'Priya Patil', role: 'Head of Sales', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop' },
  { name: 'Anil Kulkarni', role: 'Legal Advisor', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop' },
  { name: 'Sneha Deshmukh', role: 'Marketing Head', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop' },
]

const values = [
  { icon: Compass, title: 'Our Mission', desc: 'To make property buying seamless and trustworthy for every Indian family.' },
  { icon: Eye, title: 'Our Vision', desc: "To be India's most trusted real estate brokerage, setting new standards of excellence." },
  { icon: Award, title: 'Our Values', desc: 'Integrity, Excellence, Customer First — the pillars that guide every interaction.' },
]

export default function AboutPage() {
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <div className="bg-[#0f2860] text-white py-20 pt-32 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">About PrimeAxis</h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto px-4">Your trusted partner in premium real estate since 2018</p>
      </div>

      <section className="section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop" alt="PrimeAxis Office"
              className="rounded-2xl shadow-card w-full aspect-[4/3] object-cover" />
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-800 dark:text-white mb-4">Our Story</h2>
              <div className="section-gold-line mb-6" />
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Founded in 2018, PrimeAxis Realty has grown from a small team of passionate real estate professionals to one of Pune&apos;s most trusted property brokerages.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We believe that finding the perfect property should be an exciting journey, not a stressful experience. That&apos;s why we&apos;ve built our entire business around transparency, trust, and customer satisfaction.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                With over 500 properties listed and 2000+ happy clients, we continue to set the benchmark for excellence in real estate services. Our team of 50+ expert agents provides end-to-end support, from property search to loan assistance, legal verification, and post-sale service.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-gray-50 dark:bg-gray-900/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">What Drives Us</h2>
            <div className="section-gold-line mx-auto mt-4 mb-4" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map(v => (
              <div key={v.title} className="card p-8 text-center">
                <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-800 dark:text-white mb-3">{v.title}</h3>
                <p className="text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0f2860]" ref={statsRef}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[{ end: 500, suffix: '+', label: 'Properties', icon: Building2 }, { end: 2000, suffix: '+', label: 'Happy Clients', icon: Users },
              { end: 6, suffix: '+', label: 'Years', icon: Calendar }, { end: 50, suffix: '+', label: 'Agents', icon: UserCheck }].map(s => (
              <div key={s.label}>
                <s.icon className="w-10 h-10 text-gold mx-auto mb-3" />
                <div className="text-4xl font-bold font-display">{statsInView ? <CountUp end={s.end} duration={2.5} suffix={s.suffix} /> : `0${s.suffix}`}</div>
                <p className="text-white/70 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Meet Our Team</h2>
            <div className="section-gold-line mx-auto mt-4 mb-4" />
            <p className="section-subtitle mx-auto">Dedicated professionals committed to finding your perfect property</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map(m => (
              <div key={m.name} className="card p-6 text-center group">
                <img src={m.img} alt={m.name} className="w-24 h-24 rounded-full mx-auto object-cover mb-4 group-hover:ring-4 ring-gold/30 transition-all" />
                <h3 className="font-semibold text-gray-800 dark:text-white">{m.name}</h3>
                <p className="text-sm text-gold">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-gray-50 dark:bg-gray-900/50">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl font-bold text-gray-800 dark:text-white mb-4">Ready to find your dream property?</h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">Get in touch with our expert team and start your property journey today.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://wa.me/919511802062" target="_blank" rel="noopener" className="btn-whatsapp"><MessageCircle className="w-5 h-5" /> WhatsApp Us</a>
            <a href="tel:+919511802062" className="btn-primary"><Phone className="w-5 h-5" /> Call Now</a>
          </div>
        </div>
      </section>
    </div>
  )
}
