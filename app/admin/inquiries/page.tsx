'use client'

import { useState, useEffect } from 'react'
import { Search, Download, Trash2, Eye, Filter, X } from 'lucide-react'
import { getInquiries } from '@/lib/db'
import { updateInquiryStatusAction, deleteInquiryAction } from '@/lib/actions'
import { formatDate, getInquiryStatusColor, getInquiryStatusLabel } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Inquiry {
  id: string; name: string; phone: string; email?: string; property_title?: string; property_slug?: string; message?: string; source: string; status: string; created_at: string
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)

  const fetchInquiries = () => {
    getInquiries().then(list => {
      const mapped = list.map((inq: any) => ({
        ...inq,
        name: inq.name || inq.customer_name || 'Anonymous',
        phone: inq.phone || inq.customer_phone || '',
        email: inq.email || inq.customer_email || ''
      }))
      setInquiries(mapped)
      
      // Update selected inquiry state reference if it is open
      if (selectedInquiry) {
        const found = mapped.find(i => i.id === selectedInquiry.id)
        if (found) setSelectedInquiry(found)
      }
    })
  }

  useEffect(() => {
    fetchInquiries()
  }, [])

  const filtered = inquiries.filter(inq => {
    const matchesSearch = inq.name.toLowerCase().includes(search.toLowerCase()) || (inq.property_title || '').toLowerCase().includes(search.toLowerCase()) || inq.phone.includes(search)
    const matchesStatus = statusFilter ? inq.status === statusFilter : true
    const matchesSource = sourceFilter ? inq.source === sourceFilter : true
    return matchesSearch && matchesStatus && matchesSource
  })

  const handleUpdateStatus = async (id: string, nextStatus: string) => {
    const res = await updateInquiryStatusAction(id, nextStatus)
    if (res.success) {
      toast.success('Inquiry status updated successfully!')
      fetchInquiries()
    } else {
      toast.error(res.error || 'Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      const res = await deleteInquiryAction(id)
      if (res.success) {
        toast.success('Inquiry deleted successfully!')
        if (selectedInquiry?.id === id) setSelectedInquiry(null)
        fetchInquiries()
      } else {
        toast.error(res.error || 'Failed to delete inquiry')
      }
    }
  }

  const handleExportCSV = () => {
    try {
      const headers = 'ID,Name,Phone,Email,Property,Source,Status,Created At,Message\n'
      const rows = filtered.map(inq => {
        return `"${inq.id}","${inq.name}","${inq.phone}","${inq.email || ''}","${inq.property_title || ''}","${inq.source}","${inq.status}","${inq.created_at}","${(inq.message || '').replace(/"/g, '""')}"`
      }).join('\n')

      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `primeaxis_leads_${new Date().toISOString().slice(0,10)}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('CSV Export downloaded!')
    } catch {
      toast.error('Failed to export CSV')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Lead Management (CRM)</h1>
        <button onClick={handleExportCSV} className="btn-outline text-sm flex items-center gap-1.5">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Table list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, property, or phone..."
                  className="input pl-10"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                <select className="select min-w-0" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="closed">Closed / Won</option>
                  <option value="lost">Lost</option>
                </select>
                <select className="select min-w-0" value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
                  <option value="">All Sources</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Call">Direct Call</option>
                  <option value="Form">Inquiry Form</option>
                  <option value="Contact Form">Contact Page</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                    <th className="text-left p-4 text-gray-500 font-medium">Lead</th>
                    <th className="text-left p-4 text-gray-500 font-medium hidden md:table-cell">Property</th>
                    <th className="text-left p-4 text-gray-500 font-medium">Source</th>
                    <th className="text-left p-4 text-gray-500 font-medium">Status</th>
                    <th className="text-right p-4 text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(inq => (
                    <tr
                      key={inq.id}
                      onClick={() => setSelectedInquiry(inq)}
                      className={`border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${selectedInquiry?.id === inq.id ? 'bg-gold/5 dark:bg-gold/5 border-l-4 border-l-gold pl-3' : ''}`}
                    >
                      <td className="p-4">
                        <div className="font-semibold text-gray-800 dark:text-white">{inq.name}</div>
                        <div className="text-xs text-gray-500">{inq.phone}</div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400 hidden md:table-cell max-w-[160px] truncate">
                        {inq.property_title || 'General / Contact Page'}
                      </td>
                      <td className="p-4">
                        <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{inq.source}</span>
                      </td>
                      <td className="p-4">
                        <span className={`badge ${getInquiryStatusColor(inq.status)}`}>
                          {getInquiryStatusLabel(inq.status)}
                        </span>
                      </td>
                      <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setSelectedInquiry(inq)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(inq.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        No leads found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Lead details panel */}
        <div className="lg:col-span-1">
          {selectedInquiry ? (
            <div className="card p-6 space-y-5 sticky top-24 animate-fade-in">
              <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">{selectedInquiry.name}</h2>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(selectedInquiry.created_at)}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`badge ${getInquiryStatusColor(selectedInquiry.status)}`}>
                    {getInquiryStatusLabel(selectedInquiry.status)}
                  </span>
                  <button onClick={() => setSelectedInquiry(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400 block text-xs">Phone</span>
                  <a href={`tel:${selectedInquiry.phone}`} className="font-semibold text-primary dark:text-gold hover:underline">{selectedInquiry.phone}</a>
                </div>
                {selectedInquiry.email && (
                  <div>
                    <span className="text-gray-400 block text-xs">Email</span>
                    <a href={`mailto:${selectedInquiry.email}`} className="font-semibold hover:underline">{selectedInquiry.email}</a>
                  </div>
                )}
                {selectedInquiry.property_title && (
                  <div>
                    <span className="text-gray-400 block text-xs">Property of Interest</span>
                    <span className="font-semibold block">{selectedInquiry.property_title}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-400 block text-xs">Lead Source</span>
                  <span className="font-semibold">{selectedInquiry.source}</span>
                </div>
                {selectedInquiry.message && (
                  <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                    <span className="text-gray-400 block text-xs mb-1">Message</span>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">&ldquo;{selectedInquiry.message}&rdquo;</p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
                <label className="label">Update Action Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleUpdateStatus(selectedInquiry.id, 'contacted')} className="btn-outline text-xs py-2">Mark Contacted</button>
                  <button onClick={() => handleUpdateStatus(selectedInquiry.id, 'qualified')} className="btn-outline text-xs py-2 text-green-500 hover:text-green-600">Mark Qualified</button>
                  <button onClick={() => handleUpdateStatus(selectedInquiry.id, 'closed')} className="btn-primary text-xs py-2 col-span-2">Mark Closed / Won</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-8 text-center text-gray-400 sticky top-24">
              Select a lead from the table to view detail info, message content, and update status.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
