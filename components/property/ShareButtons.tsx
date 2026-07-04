'use client'

import { Share2, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { getWhatsAppLink } from '@/lib/utils'

interface Props {
  title: string
  url: string
}

export default function ShareButtons({ title, url }: Props) {
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleShare}
        className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title="Copy Link"
      >
        <Share2 className="w-5 h-5 text-gray-700 dark:text-gray-350" />
      </button>
      <a
        href={getWhatsAppLink(`Check out this property: ${title} - ${url}`)}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 bg-[#25d366] text-white rounded-xl hover:bg-[#20bd5a] transition-colors"
        title="Share on WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
      </a>
    </div>
  )
}
