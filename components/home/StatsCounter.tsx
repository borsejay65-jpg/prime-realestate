'use client'

import { Building2, Users, Calendar, UserCheck } from 'lucide-react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'

const stats = [
  { end: 500, suffix: '+', label: 'Properties Listed', icon: Building2 },
  { end: 2000, suffix: '+', label: 'Happy Clients', icon: Users },
  { end: 6, suffix: '+', label: 'Years Experience', icon: Calendar },
  { end: 50, suffix: '+', label: 'Expert Agents', icon: UserCheck },
]

export default function StatsCounter() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <section className="py-16 bg-[#0f2860]" ref={ref}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center text-white">
              <s.icon className="w-10 h-10 text-gold mx-auto mb-3" />
              <div className="text-4xl md:text-5xl font-bold font-display">
                {inView ? <CountUp end={s.end} duration={2.5} suffix={s.suffix} /> : `0${s.suffix}`}
              </div>
              <p className="text-white/70 text-sm mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
