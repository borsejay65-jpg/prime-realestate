'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react'
import { getBlogs, saveBlogs } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState(() => getBlogs())
  const [search, setSearch] = useState('')

  const filtered = blogs.filter(b => b.title.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      const updated = blogs.filter(b => b.id !== id)
      setBlogs(updated)
      saveBlogs(updated)
      toast.success('Blog post deleted successfully!')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Blog Posts</h1>
        <Link href="/admin/blogs/new" className="btn-gold text-sm flex items-center gap-1">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles by title..."
            className="input pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                <th className="text-left p-4 text-gray-500 font-medium w-16">Cover</th>
                <th className="text-left p-4 text-gray-500 font-medium">Title</th>
                <th className="text-left p-4 text-gray-500 font-medium">Status</th>
                <th className="text-left p-4 text-gray-500 font-medium">Published Date</th>
                <th className="text-center p-4 text-gray-500 font-medium">Views</th>
                <th className="text-right p-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(blog => (
                <tr key={blog.id} className="border-b border-gray-55 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-8 rounded overflow-hidden relative bg-gray-100">
                      <img src={blog.featured_image || '/placeholder.png'} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-800 dark:text-white line-clamp-1">{blog.title}</div>
                    <div className="text-xs text-gray-500">{blog.tags?.join(', ')}</div>
                  </td>
                  <td className="p-4">
                    <span className="badge bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">Published</span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    {blog.published_at ? formatDate(blog.published_at) : 'Draft'}
                  </td>
                  <td className="p-4 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-1 text-xs">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{blog.views}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blogs/${blog.id}`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-primary dark:text-gold transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No articles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
