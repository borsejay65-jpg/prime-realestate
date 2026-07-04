'use client'

import { useState } from 'react'
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Link2, Youtube, Eye, Code } from 'lucide-react'

interface Props {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder = 'Start writing...' }: Props) {
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')

  const insertTag = (openTag: string, closeTag: string = '') => {
    const textarea = document.getElementById('rich-textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selected = text.substring(start, end)
    
    const replacement = `${openTag}${selected}${closeTag}`
    const newValue = text.substring(0, start) + replacement + text.substring(end)
    
    onChange(newValue)

    // Reset cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + selected.length)
    }, 50)
  }

  const addLink = () => {
    const url = prompt('Enter link URL (e.g., https://example.com):')
    if (url) {
      insertTag(`<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">`, '</a>')
    }
  }

  const addYoutube = () => {
    const videoUrl = prompt('Enter YouTube video URL or embed code:')
    if (videoUrl) {
      let embedId = ''
      if (videoUrl.includes('embed/')) {
        embedId = videoUrl.split('embed/')[1]?.split(/[?#]/)[0] || ''
      } else if (videoUrl.includes('v=')) {
        embedId = videoUrl.split('v=')[1]?.split('&')[0] || ''
      } else if (videoUrl.includes('youtu.be/')) {
        embedId = videoUrl.split('youtu.be/')[1]?.split(/[?#]/)[0] || ''
      }
      
      if (embedId) {
        const iframe = `<div class="aspect-video my-4"><iframe class="w-full h-full rounded-2xl" src="https://www.youtube.com/embed/${embedId}" frameborder="0" allowfullscreen></iframe></div>`
        insertTag(iframe)
      } else {
        alert('Invalid YouTube URL')
      }
    }
  }

  return (
    <div className="border border-gray-250 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-surface-dark">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-850">
        <div className="flex items-center gap-1 flex-wrap">
          <button type="button" onClick={() => insertTag('<h1>', '</h1>')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-850 rounded-lg text-gray-500 transition-colors" title="Heading 1"><Heading1 className="w-4 h-4" /></button>
          <button type="button" onClick={() => insertTag('<h2>', '</h2>')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-855 rounded-lg text-gray-500 transition-colors" title="Heading 2"><Heading2 className="w-4 h-4" /></button>
          <button type="button" onClick={() => insertTag('<strong>', '</strong>')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-855 rounded-lg text-gray-500 transition-colors" title="Bold"><Bold className="w-4 h-4" /></button>
          <button type="button" onClick={() => insertTag('<em>', '</em>')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-855 rounded-lg text-gray-500 transition-colors" title="Italic"><Italic className="w-4 h-4" /></button>
          <button type="button" onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-855 rounded-lg text-gray-500 transition-colors" title="Bullet List"><List className="w-4 h-4" /></button>
          <button type="button" onClick={() => insertTag('<ol>\n  <li>', '</li>\n</ol>')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-855 rounded-lg text-gray-500 transition-colors" title="Numbered List"><ListOrdered className="w-4 h-4" /></button>
          <button type="button" onClick={addLink} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-855 rounded-lg text-gray-500 transition-colors" title="Insert Link"><Link2 className="w-4 h-4" /></button>
          <button type="button" onClick={addYoutube} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-855 rounded-lg text-gray-500 transition-colors" title="Insert YouTube"><Youtube className="w-4 h-4" /></button>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg">
          <button type="button" onClick={() => setTab('edit')} className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition-all ${tab === 'edit' ? 'bg-white dark:bg-gray-700 shadow text-primary dark:text-white' : 'text-gray-500 hover:text-gray-850'}`}><Code className="w-3.5 h-3.5" /> Edit</button>
          <button type="button" onClick={() => setTab('preview')} className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition-all ${tab === 'preview' ? 'bg-white dark:bg-gray-700 shadow text-primary dark:text-white' : 'text-gray-500 hover:text-gray-850'}`}><Eye className="w-3.5 h-3.5" /> Preview</button>
        </div>
      </div>

      {/* Editor Content Area */}
      {tab === 'edit' ? (
        <textarea
          id="rich-textarea"
          className="w-full min-h-[300px] p-4 text-sm bg-transparent border-0 focus:ring-0 resize-y outline-none font-mono leading-relaxed"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      ) : (
        <div
          className="w-full min-h-[302px] p-4 prose dark:prose-invert max-w-none text-sm leading-relaxed overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: value || `<p class="text-gray-400 italic">Nothing to preview yet.</p>` }}
        />
      )}
    </div>
  )
}
