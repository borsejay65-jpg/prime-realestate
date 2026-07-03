'use client'

import Link from 'next/link'
import { Building2, Star, Users, ShieldCheck, Key, Eye, Plus, ArrowRight, TrendingUp } from 'lucide-react'
import { demoInquiries } from '@/lib/demo-data'
import { formatDate, getInquiryStatusColor, getInquiryStatusLabel } from '@/lib/utils'

const kpis = [
  { label: 'Total Properties', value: '156', icon: Building2, color: 'bg-blue-500/10 text-blue-600' },
  { label: 'Featured', value: '24', icon: Star, color: 'bg-amber-500/10 text-amber-600' },
  { label: 'Total Leads', value: '89', icon: Users, color: 'bg-green-500/10 text-green-600' },
  { label: 'Sold', value: '45', icon: ShieldCheck, color: 'bg-emerald-500/10 text-emerald-600' },
  { label: 'For Rent', value: '32', icon: Key, color: 'bg-purple-500/10 text-purple-600' },
  { label: 'Total Views', value: '12.5K', icon: Eye, color: 'bg-orange-500/10 text-orange-600' },
]

const leadData = [
  { month: 'Jan', leads: 12 }, { month: 'Feb', leads: 19 }, { month: 'Mar', leads: 28 },
  { month: 'Apr', leads: 35 }, { month: 'May', leads: 42 }, { month: 'Jun', leads: 56 },
]

export default function AdminDashboard() {
  const maxLeads = Math.max(...leadData.map(d => d.leads))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
        <div className="flex gap-3">
          <Link href="/admin/properties/new" className="btn-gold text-sm"><Plus className="w-4 h-4" /> Add Property</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${k.color}`}>
              <k.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{k.value}</p>
            <p className="text-xs text-gray-500 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2"><TrendingUp className="w-5 h-5 text-gold" /> Leads Over Time</h2>
          </div>
          <div className="flex items-end gap-4 h-48">
            {leadData.map(d => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-gray-600">{d.leads}</span>
                <div className="w-full bg-gold/20 rounded-t-lg relative overflow-hidden" style={{ height: `${(d.leads / maxLeads) * 100}%` }}>
                  <div className="absolute inset-0 bg-gradient-gold" />
                </div>
                <span className="text-xs text-gray-500">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 dark:text-white mb-6">Property Distribution</h2>
          <div className="space-y-4">
            {[{ name: 'For Sale', count: 67, pct: 43, color: 'bg-blue-500' }, { name: 'For Rent', count: 32, pct: 21, color: 'bg-purple-500' },
              { name: 'Sold', count: 45, pct: 29, color: 'bg-emerald-500' }, { name: 'Booked', count: 12, pct: 7, color: 'bg-amber-500' }].map(s => (
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1"><span className="text-gray-600 dark:text-gray-400">{s.name}</span><span className="font-semibold">{s.count}</span></div>
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="font-semibold text-gray-800 dark:text-white">Recent Inquiries</h2>
          <Link href="/admin/inquiries" className="text-sm text-primary dark:text-gold flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left p-4 text-gray-500 font-medium">Name</th>
              <th className="text-left p-4 text-gray-500 font-medium">Phone</th>
              <th className="text-left p-4 text-gray-500 font-medium hidden md:table-cell">Property</th>
              <th className="text-left p-4 text-gray-500 font-medium hidden sm:table-cell">Source</th>
              <th className="text-left p-4 text-gray-500 font-medium">Status</th>
              <th className="text-left p-4 text-gray-500 font-medium hidden lg:table-cell">Date</th>
            </tr></thead>
            <tbody>
              {demoInquiries.slice(0, 8).map((inq: any) => {
                const name = inq.name || inq.customer_name || 'Anonymous'
                const phone = inq.phone || inq.customer_phone || ''
                return (
                  <tr key={inq.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 font-medium text-gray-800 dark:text-white">{name}</td>
                    <td className="p-4"><a href={`tel:${phone}`} className="text-primary dark:text-gold hover:underline">{phone}</a></td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 hidden md:table-cell max-w-[200px] truncate">{inq.property_title}</td>
                    <td className="p-4 hidden sm:table-cell"><span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{inq.source}</span></td>
                    <td className="p-4"><span className={`badge ${getInquiryStatusColor(inq.status)}`}>{getInquiryStatusLabel(inq.status)}</span></td>
                    <td className="p-4 text-gray-500 hidden lg:table-cell">{formatDate(inq.created_at)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
