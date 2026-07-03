'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Home, ChevronRight, MapPin, Check, Share2, MessageCircle } from 'lucide-react'
import { demoProperties } from '@/lib/demo-data'
import { formatPrice, getStatusBadgeClass, getStatusLabel, getWhatsAppLink, getPropertyWhatsAppMessage } from '@/lib/utils'
import ImageGallery from '@/components/property/ImageGallery'
import PropertySpecs from '@/components/property/PropertySpecs'
import AmenitiesGrid from '@/components/property/AmenitiesGrid'
import InquiryForm from '@/components/property/InquiryForm'
import StickyCTA from '@/components/property/StickyCTA'
import MortgageCalculator from '@/components/property/MortgageCalculator'
import RelatedProperties from '@/components/property/RelatedProperties'
import toast from 'react-hot-toast'

export default function PropertyDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const property = demoProperties.find(p => p.slug === slug)

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark pt-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Property Not Found</h1>
          <p className="text-gray-500 mb-6">This property may have been sold or removed.</p>
          <Link href="/properties" className="btn-primary">Browse Properties</Link>
        </div>
      </div>
    )
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const handleShare = () => { navigator.clipboard.writeText(shareUrl); toast.success('Link copied!') }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: shareUrl,
    image: property.thumbnail_url,
    offers: { '@type': 'Offer', price: property.price, priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
    address: { '@type': 'PostalAddress', addressLocality: property.city, addressRegion: property.state, addressCountry: 'IN' },
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark pt-24 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container-custom">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-primary flex items-center gap-1"><Home className="w-4 h-4" /> Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/properties" className="hover:text-primary">Properties</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 dark:text-white font-medium line-clamp-1">{property.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ImageGallery images={property.images || []} />

            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={getStatusBadgeClass(property.status)}>{getStatusLabel(property.status)}</span>
                    {property.is_featured && <span className="badge-featured">Featured</span>}
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">{property.title}</h1>
                  <p className="flex items-center gap-1 text-gray-500 mt-2"><MapPin className="w-5 h-5" /> {property.location}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleShare} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <a href={getWhatsAppLink(`Check out this property: ${property.title} - ${shareUrl}`)} target="_blank" rel="noopener"
                    className="p-3 bg-[#25d366] text-white rounded-xl hover:bg-[#20bd5a] transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <p className="font-display text-4xl font-bold text-primary dark:text-gold">
                  {property.price_label || formatPrice(property.price)}
                </p>
                {property.price_negotiable && <span className="badge bg-green-100 text-green-700 text-xs">Negotiable</span>}
              </div>
            </div>

            {property.description && (
              <div>
                <h2 className="font-display text-2xl font-bold text-gray-800 dark:text-white mb-4">Description</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {property.highlights && property.highlights.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-gray-800 dark:text-white mb-4">Highlights</h2>
                <ul className="grid md:grid-cols-2 gap-2">
                  {property.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-green-600 dark:text-green-400" /></div> {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h2 className="font-display text-2xl font-bold text-gray-800 dark:text-white mb-4">Specifications</h2>
              <PropertySpecs property={property} />
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-gray-800 dark:text-white mb-4">Amenities</h2>
              <AmenitiesGrid />
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-gray-800 dark:text-white mb-4">Location</h2>
              <div className="rounded-2xl overflow-hidden shadow-card">
                <iframe
                  src={property.map_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.019073773987!2d73.83291021485!3d18.559473787381!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf61fdc6f!2sBaner%2C+Jalgaon!5e0!3m2!1sen!2sin'}
                  width="100%" height="350" style={{ border: 0 }} allowFullScreen loading="lazy" title="Property Location" />
              </div>
            </div>

            <MortgageCalculator propertyPrice={property.price} />
            <RelatedProperties currentId={property.id} propertyType={property.property_type} city={property.city} />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <InquiryForm propertyTitle={property.title} propertySlug={property.slug} brochureUrl={property.brochure_url} />
            </div>
          </div>
        </div>
      </div>
      <StickyCTA propertyTitle={property.title} propertySlug={property.slug} />
    </div>
  )
}
