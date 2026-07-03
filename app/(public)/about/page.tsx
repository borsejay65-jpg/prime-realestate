'use client'

import { motion } from 'framer-motion'
import { Compass, Eye, Award, Check, Phone, MessageCircle } from 'lucide-react'

export default function AboutPage() {
  const whyChooseUs = [
    'Transparent & Ethical Business Practices',
    'Personalized Property Consultation',
    'Local Market Expertise in Jalgaon & Maharashtra',
    'Technology-Driven Property Solutions',
    'Dedicated After-Sales Support',
    'Customer-First Approach'
  ]

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      {/* Page Header */}
      <div className="bg-[#0f2860] text-white py-24 pt-36 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">About Prime Real Estate</h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto px-4">Transparency, Trust, and Exceptional Property Solutions</p>
      </div>

      {/* Founder Profile Section */}
      <section className="section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Founder Photo Card */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative group max-w-sm w-full"
              >
                {/* Gold Gradient Outer Glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-gold via-gold-light to-gold rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                
                {/* Main Card Wrapper */}
                <div className="relative bg-white dark:bg-surface-dark p-3.5 rounded-3xl shadow-glass border border-white/20 overflow-hidden">
                  <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden relative">
                    <img 
                      src="/images/founder.jpg" 
                      alt="Jay Rajput - Founder & CEO" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    
                    {/* Floating Info */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-xs uppercase tracking-widest text-gold font-bold">Founder & CEO</p>
                      <h3 className="text-lg font-bold">Jay Rajput</h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Founder Bio text */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-gold uppercase tracking-[0.2em] text-xs font-semibold block mb-1">Meet Our Founder</span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">Jay Rajput</h2>
                <p className="text-sm font-semibold text-gold mt-1">Founder & CEO | Prime Real Estate</p>
                <div className="section-gold-line mt-4 mb-6" />
              </div>

              <div className="text-gray-600 dark:text-gray-400 space-y-4 leading-relaxed text-sm sm:text-base">
                <p>
                  Real estate is more than a profession for me—it's a lifelong passion. Every property tells a story, every client has a dream, and every successful deal is an opportunity to create lasting value.
                </p>
                <p>
                  My name is <strong className="text-gray-800 dark:text-white">Jay Rajput</strong>, and I am a <strong>Bachelor of Science (B.Sc.) graduate</strong> with a strong interest in technology, innovation, and real estate. While my academic background is in computer science, my heart has always been drawn to the world of real estate.
                </p>
                <p>
                  Based in <strong>Jalgaon, Maharashtra</strong>, I founded <strong>Prime Real Estate</strong> with a clear mission: to build a company that delivers transparency, trust, and exceptional property solutions. My long-term vision is ambitious—to establish <strong>Asia's No. 1 Real Estate Company</strong>, recognized for innovation, customer satisfaction, and world-class service.
                </p>
                <p>
                  I firmly believe that real estate is not just about buying and selling properties. It is about helping people build their future, achieve financial growth, and find a place they proudly call home.
                </p>
                <p>
                  By combining modern technology with a customer-first approach, our goal is to simplify the property journey and provide every client with a seamless, transparent, and premium experience.
                </p>
              </div>

              {/* Founder Statement Blockquote */}
              <div className="border-l-4 border-gold pl-4 py-1.5 bg-gray-50 dark:bg-gray-900/40 rounded-r-xl italic text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                &ldquo;Real estate is not just my profession—it's my passion, my purpose, and the vision I am dedicated to building every single day.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="section bg-gray-50 dark:bg-gray-900/50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div className="card p-8 space-y-4 border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-800 dark:text-white">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                To become <strong>Asia's most trusted and innovative real estate company</strong>, empowering individuals and businesses with premium property solutions while setting new standards of excellence in the industry.
              </p>
            </div>

            {/* Mission Card */}
            <div className="card p-8 space-y-4 border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center">
                <Compass className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-800 dark:text-white">Our Mission</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span>Deliver honest and transparent real estate services.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span>Build long-term relationships based on trust.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span>Leverage technology to simplify property transactions.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span>Provide premium investment opportunities.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span>Create exceptional customer experiences from consultation to ownership.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us & Quote Section */}
      <section className="section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Why Choose Us list */}
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-3xl font-bold text-gray-800 dark:text-white">Why Clients Choose Us</h2>
                <div className="section-gold-line mt-3 mb-6" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {whyChooseUs.map((item) => (
                  <div key={item} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Premium Quote Block */}
            <div className="flex items-center justify-center p-6 md:p-8 bg-gold/5 dark:bg-gold/5 border-2 border-dashed border-gold/30 rounded-3xl relative">
              <Award className="w-12 h-12 text-gold/20 absolute top-4 right-4" />
              <div className="text-center space-y-4 max-w-md">
                <span className="text-xs uppercase tracking-widest text-gold font-bold">Founder Quote</span>
                <p className="text-lg md:text-xl font-display text-gray-800 dark:text-white italic leading-relaxed">
                  &ldquo;Success in real estate isn't measured by the number of properties we sell—it's measured by the number of dreams we help people achieve.&rdquo;
                </p>
                <div className="text-sm text-gray-500 font-semibold mt-2">
                  — Jay Rajput
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="section bg-gray-50 dark:bg-gray-900/50">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl font-bold text-gray-800 dark:text-white mb-4">Ready to start your property journey?</h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">Get in touch with Jay Rajput and the team at Prime Real Estate today.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://wa.me/919511802062" target="_blank" rel="noopener noreferrer" className="btn-whatsapp"><MessageCircle className="w-5 h-5" /> WhatsApp Us</a>
            <a href="tel:+919511802062" className="btn-primary"><Phone className="w-5 h-5" /> Call Now</a>
          </div>
        </div>
      </section>
    </div>
  )
}
