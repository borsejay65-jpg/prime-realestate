'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, X, ArrowLeft, ArrowRight, Star, FileText, Map, Sparkles, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

interface PropertyImage {
  url: string
  is_thumbnail: boolean
  display_order: number
}

interface Props {
  propertyId: string
  images: PropertyImage[]
  onChange: (images: PropertyImage[]) => void
  brochureUrl?: string
  onBrochureChange?: (url: string) => void
  floorPlanUrl?: string
  onFloorPlanChange?: (url: string) => void
}

export default function MediaUploader({
  propertyId,
  images,
  onChange,
  brochureUrl = '',
  onBrochureChange,
  floorPlanUrl = '',
  onFloorPlanChange
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  // Compress image to WebP client-side
  const compressToWebP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        const MAX_SIZE = 1920
        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width)
            width = MAX_SIZE
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height)
            height = MAX_SIZE
          }
        }
        
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context failure'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          blob => {
            if (blob) resolve(blob)
            else reject(new Error('Compression empty blob'))
          },
          'image/webp',
          0.85
        )
      }
      img.onerror = err => reject(err)
    })
  }

  // Upload file to Supabase Storage
  const uploadToStorage = async (bucket: string, path: string, blob: Blob | File) => {
    const supabase = createClient()
    const { data, error } = await supabase.storage.from(bucket).upload(path, blob, {
      upsert: true
    })
    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
    return publicUrl
  }

  // Handle gallery multiple images upload
  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setUploading(true)
    setProgress(10)
    
    const files = Array.from(e.target.files)
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setProgress(Math.round(10 + (i / files.length) * 80))
        
        let uploadBlob: Blob | File = file
        let ext = file.name.split('.').pop() || 'jpg'
        
        // Compress if it is an image
        if (file.type.startsWith('image/')) {
          try {
            uploadBlob = await compressToWebP(file)
            ext = 'webp'
          } catch (e) {
            console.warn('Compression failed, uploading original', e)
          }
        }

        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
        const path = `properties/${propertyId}/${fileName}`
        const publicUrl = await uploadToStorage('property-images', path, uploadBlob)
        uploadedUrls.push(publicUrl)
      }

      const currentImages = [...images]
      const newImages = uploadedUrls.map((url, index) => ({
        url,
        is_thumbnail: currentImages.length === 0 && index === 0,
        display_order: currentImages.length + index
      }))

      onChange([...currentImages, ...newImages])
      toast.success(`Successfully uploaded ${files.length} images!`)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to upload files')
    } finally {
      setProgress(100)
      setTimeout(() => {
        setUploading(false)
        setProgress(0)
      }, 500)
    }
  }

  // Handle brochure upload
  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files[0] === undefined) return
    const file = e.target.files[0]
    setUploading(true)
    try {
      const fileName = `${Date.now()}-brochure-${file.name}`
      const path = `properties/${propertyId}/${fileName}`
      const publicUrl = await uploadToStorage('brochures', path, file)
      if (onBrochureChange) onBrochureChange(publicUrl)
      toast.success('Brochure uploaded successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload brochure')
    } finally {
      setUploading(false)
    }
  }

  // Handle floor plan upload
  const handleFloorPlanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files[0] === undefined) return
    const file = e.target.files[0]
    setUploading(true)
    try {
      let uploadBlob: Blob | File = file
      let ext = 'webp'
      try {
        uploadBlob = await compressToWebP(file)
      } catch {
        uploadBlob = file
        ext = file.name.split('.').pop() || 'jpg'
      }

      const fileName = `${Date.now()}-floorplan.${ext}`
      const path = `properties/${propertyId}/${fileName}`
      const publicUrl = await uploadToStorage('floor-plans', path, uploadBlob)
      if (onFloorPlanChange) onFloorPlanChange(publicUrl)
      toast.success('Floor plan uploaded successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload floor plan')
    } finally {
      setUploading(false)
    }
  }

  // Set selected image as thumbnail
  const makeFeatured = (url: string) => {
    const updated = images.map(img => ({
      ...img,
      is_thumbnail: img.url === url
    }))
    onChange(updated)
    toast.success('Main cover image updated!')
  }

  // Delete image from local and storage
  const deleteImage = async (url: string) => {
    try {
      const path = url.split('/storage/v1/object/public/property-images/')[1]
      if (path) {
        const supabase = createClient()
        await supabase.storage.from('property-images').remove([path])
      }
    } catch {}
    
    const updated = images.filter(img => img.url !== url).map((img, i) => ({
      ...img,
      display_order: i
    }))
    
    // Ensure at least one thumbnail exists if list is not empty
    if (updated.length > 0 && !updated.some(img => img.is_thumbnail)) {
      updated[0]!.is_thumbnail = true
    }

    onChange(updated)
    toast.success('Image removed!')
  }

  // Shift orders
  const moveImage = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return
    if (direction === 'right' && index === images.length - 1) return

    const targetIdx = direction === 'left' ? index - 1 : index + 1
    const copy = [...images]
    const current = copy[index]!
    const target = copy[targetIdx]!

    // Swap orders
    copy[index] = { ...target, display_order: index }
    copy[targetIdx] = { ...current, display_order: targetIdx }

    onChange(copy)
  }

  return (
    <div className="space-y-6">
      {/* Gallery Uploader Card */}
      <div className="card p-6 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gold mb-2 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Gallery Media
        </h3>
        
        {/* Upload Drop Zone */}
        <label className="border-2 border-dashed border-gray-350 dark:border-gray-700 rounded-2xl p-6 text-center hover:border-gold transition-colors relative cursor-pointer flex flex-col items-center justify-center min-h-[140px] bg-gray-50/20">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImagesUpload}
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader className="w-8 h-8 text-gold animate-spin" />
              <p className="text-sm font-semibold">Uploading & Optimizing...</p>
              <div className="w-48 bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-gold h-full transition-all duration-350" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <>
              <Plus className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Click to upload multiple images</p>
              <p className="text-xs text-gray-500 mt-1">Images are compressed to modern WebP format instantly</p>
            </>
          )}
        </label>

        {/* Thumbnail Preview list */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100 dark:border-gray-850">
            {images.map((image, idx) => (
              <div key={image.url} className={`relative rounded-xl overflow-hidden border bg-gray-50 dark:bg-gray-800 group transition-all ${image.is_thumbnail ? 'border-gold ring-2 ring-gold/20' : 'border-gray-200 dark:border-gray-700'}`}>
                <img src={image.url} className="aspect-square w-full h-full object-cover" alt="" />
                
                {/* Feature banner */}
                {image.is_thumbnail && (
                  <span className="absolute top-2 left-2 bg-gold text-primary-900 text-[10px] px-2 py-0.5 rounded-full font-bold shadow flex items-center gap-1">
                    <Star className="w-3 h-3 fill-primary-900" /> Main Cover
                  </span>
                )}

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => deleteImage(image.url)}
                      className="p-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow"
                      title="Delete Image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveImage(idx, 'left')}
                        disabled={idx === 0}
                        className="p-1 bg-white/10 hover:bg-white/20 text-white rounded-lg disabled:opacity-30"
                        title="Move Left"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(idx, 'right')}
                        disabled={idx === images.length - 1}
                        className="p-1 bg-white/10 hover:bg-white/20 text-white rounded-lg disabled:opacity-30"
                        title="Move Right"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {!image.is_thumbnail && (
                      <button
                        type="button"
                        onClick={() => makeFeatured(image.url)}
                        className="p-1 bg-gold hover:bg-yellow-500 text-primary-900 rounded-lg font-semibold text-xs flex items-center gap-0.5 shadow"
                        title="Set as Main Cover"
                      >
                        Set Main
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brochure & Floor Plan Card */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Floor Plan */}
        <div className="card p-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gold mb-2 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
            <Map className="w-4 h-4" /> Floor Plan Image
          </h3>
          <label className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 text-center hover:border-gold transition-colors relative cursor-pointer flex flex-col items-center justify-center bg-gray-50/20 min-h-[100px]">
            <input type="file" accept="image/*" className="hidden" onChange={handleFloorPlanUpload} disabled={uploading} />
            <Plus className="w-5 h-5 text-gray-400 mb-1" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Upload Floor Plan</span>
          </label>
          {floorPlanUrl && (
            <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 aspect-[16/10] bg-gray-50">
              <img src={floorPlanUrl} className="w-full h-full object-cover" alt="Floor Plan" />
              <button
                type="button"
                onClick={() => onFloorPlanChange && onFloorPlanChange('')}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Brochure PDF */}
        <div className="card p-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gold mb-2 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Brochure PDF Document
          </h3>
          <label className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 text-center hover:border-gold transition-colors relative cursor-pointer flex flex-col items-center justify-center bg-gray-50/20 min-h-[100px]">
            <input type="file" accept="application/pdf" className="hidden" onChange={handleBrochureUpload} disabled={uploading} />
            <Plus className="w-5 h-5 text-gray-400 mb-1" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Upload PDF Brochure</span>
          </label>
          {brochureUrl && (
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50">
              <div className="flex items-center gap-2 overflow-hidden mr-2">
                <FileText className="w-6 h-6 text-red-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{brochureUrl.split('/').pop() || 'brochure.pdf'}</span>
              </div>
              <button
                type="button"
                onClick={() => onBrochureChange && onBrochureChange('')}
                className="p-1 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
