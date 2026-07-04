'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'

// Helper to assert admin authentication
async function getAdminClient() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    throw new Error('Unauthorized: Admin access required')
  }
  return supabase
}

export async function initializeStorageAction() {
  try {
    const supabase = createServiceRoleClient()
    const requiredBuckets = [
      'property-images',
      'property-videos',
      'brochures',
      'carousel',
      'blog-images',
      'avatars',
      'floor-plans',
      'media'
    ]

    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    if (listError) throw listError

    for (const bucketName of requiredBuckets) {
      const exists = buckets?.some(b => b.name === bucketName)
      if (!exists) {
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        })
        if (createError) console.error(`Failed to create bucket ${bucketName}:`, createError)
      }
    }
    return { success: true }
  } catch (err: any) {
    console.error('Failed to initialize buckets:', err)
    return { success: false, error: err.message }
  }
}

export async function uploadMediaAction(bucket: string, path: string, base64Data: string, contentType?: string) {
  try {
    const supabase = createServiceRoleClient()
    const buffer = Buffer.from(base64Data, 'base64')
    
    const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType: contentType || 'image/webp',
      upsert: true
    })
    
    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
    return { success: true, url: publicUrl }
  } catch (err: any) {
    console.error(`Upload error on bucket ${bucket}:`, err)
    return { success: false, error: err.message || 'Upload failed' }
  }
}

// ============================================================
// 1. PROPERTIES CRUD
// ============================================================

export async function createPropertyAction(property: any, images: any[], videos: any[] = []) {
  try {
    const supabase = await getAdminClient()
    
    // Insert property
    const { data: newProp, error: propError } = await supabase
      .from('properties')
      .insert([property])
      .select()
      .single()

    if (propError) throw propError

    // Insert images
    if (images && images.length > 0) {
      const imagesData = images.map((img, index) => ({
        property_id: newProp.id,
        url: img.url,
        caption: img.caption || '',
        display_order: index,
        is_thumbnail: img.is_thumbnail || index === 0
      }))
      const { error: imgError } = await supabase.from('property_images').insert(imagesData)
      if (imgError) throw imgError
    }

    // Insert videos
    if (videos && videos.length > 0) {
      const videosData = videos.map((vid, index) => ({
        property_id: newProp.id,
        url: vid.url,
        video_type: vid.video_type || 'youtube',
        title: vid.title || '',
        display_order: index
      }))
      const { error: vidError } = await supabase.from('property_videos').insert(videosData)
      if (vidError) throw vidError
    }

    revalidatePath('/')
    revalidatePath('/properties')
    return { success: true, data: newProp }
  } catch (err: any) {
    console.error('Failed to create property:', err)
    return { success: false, error: err.message || 'Failed to create property' }
  }
}

export async function updatePropertyAction(id: string, property: any, images: any[], videos: any[] = []) {
  try {
    const supabase = await getAdminClient()

    // Update property
    const { error: propError } = await supabase
      .from('properties')
      .update(property)
      .eq('id', id)

    if (propError) throw propError

    // Delete old images and insert new
    await supabase.from('property_images').delete().eq('property_id', id)
    if (images && images.length > 0) {
      const imagesData = images.map((img, index) => ({
        property_id: id,
        url: img.url,
        caption: img.caption || '',
        display_order: index,
        is_thumbnail: img.is_thumbnail || index === 0
      }))
      const { error: imgError } = await supabase.from('property_images').insert(imagesData)
      if (imgError) throw imgError
    }

    // Delete old videos and insert new
    await supabase.from('property_videos').delete().eq('property_id', id)
    if (videos && videos.length > 0) {
      const videosData = videos.map((vid, index) => ({
        property_id: id,
        url: vid.url,
        video_type: vid.video_type || 'youtube',
        title: vid.title || '',
        display_order: index
      }))
      const { error: vidError } = await supabase.from('property_videos').insert(videosData)
      if (vidError) throw vidError
    }

    revalidatePath('/')
    revalidatePath('/properties')
    revalidatePath(`/properties/${property.slug || ''}`)
    return { success: true }
  } catch (err: any) {
    console.error('Failed to update property:', err)
    return { success: false, error: err.message || 'Failed to update property' }
  }
}

export async function deletePropertyAction(id: string) {
  try {
    const supabase = await getAdminClient()

    // Clean up Supabase Storage files under properties/{id}/
    const { data: files } = await supabase.storage
      .from('property-images')
      .list(`properties/${id}`)
    
    if (files && files.length > 0) {
      const pathsToDelete = files.map(f => `properties/${id}/${f.name}`)
      await supabase.storage.from('property-images').remove(pathsToDelete)
    }

    // Delete property (cascades to images/videos)
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/properties')
    return { success: true }
  } catch (err: any) {
    console.error('Failed to delete property:', err)
    return { success: false, error: err.message || 'Failed to delete property' }
  }
}

export async function togglePropertyFeatureAction(id: string, isFeatured: boolean) {
  try {
    const supabase = await getAdminClient()
    const { error } = await supabase
      .from('properties')
      .update({ is_featured: isFeatured })
      .eq('id', id)

    if (error) throw error
    revalidatePath('/')
    revalidatePath('/properties')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function archivePropertyAction(id: string, isDraft: boolean) {
  try {
    const supabase = await getAdminClient()
    const { error } = await supabase
      .from('properties')
      .update({ is_draft: isDraft })
      .eq('id', id)

    if (error) throw error
    revalidatePath('/')
    revalidatePath('/properties')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// ============================================================
// 2. CRM INQUIRIES CRUD
// ============================================================

export async function createInquiryAction(inquiry: any) {
  try {
    const supabase = await createClient() // Allow anonymous inserts
    const { data, error } = await supabase
      .from('inquiries')
      .insert([
        {
          customer_name: inquiry.customer_name,
          customer_phone: inquiry.customer_phone,
          customer_email: inquiry.customer_email || null,
          message: inquiry.message || null,
          property_id: inquiry.property_id || null,
          property_title: inquiry.property_title || null,
          source: inquiry.source || 'website_form',
          status: 'new'
        }
      ])
      .select()

    if (error) throw error

    revalidatePath('/admin')
    revalidatePath('/admin/inquiries')
    return { success: true, data }
  } catch (err: any) {
    console.error('Failed to create inquiry:', err)
    return { success: false, error: err.message }
  }
}

export async function updateInquiryStatusAction(id: string, status: string) {
  try {
    const supabase = await getAdminClient()
    const { error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin')
    revalidatePath('/admin/inquiries')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteInquiryAction(id: string) {
  try {
    const supabase = await getAdminClient()
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin')
    revalidatePath('/admin/inquiries')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// ============================================================
// 3. SETTINGS
// ============================================================

export async function saveSettingsAction(settingsDict: Record<string, string>) {
  try {
    const supabase = await getAdminClient()
    
    // Format payload for upsert
    const upserts = Object.keys(settingsDict).map(k => ({
      key: k,
      value: settingsDict[k]
    }))

    const { error } = await supabase
      .from('site_settings')
      .upsert(upserts)

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/contact')
    revalidatePath('/about')
    return { success: true }
  } catch (err: any) {
    console.error('Failed to save settings:', err)
    return { success: false, error: err.message }
  }
}

// ============================================================
// 4. BLOGS CRUD
// ============================================================

export async function createBlogPostAction(post: any) {
  try {
    const supabase = await getAdminClient()
    const { data, error } = await supabase
      .from('blogs')
      .insert([post])
      .select()
      .single()

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/blog')
    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function updateBlogPostAction(id: string, post: any) {
  try {
    const supabase = await getAdminClient()
    const { error } = await supabase
      .from('blogs')
      .update(post)
      .eq('id', id)

    if (error) throw error

    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug || ''}`)
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteBlogPostAction(id: string) {
  try {
    const supabase = await getAdminClient()
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/blog')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// ============================================================
// 5. TESTIMONIALS CRUD
// ============================================================

export async function createTestimonialAction(testimonial: any) {
  try {
    const supabase = await getAdminClient()
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonial])
      .select()

    if (error) throw error

    revalidatePath('/')
    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function updateTestimonialAction(id: string, testimonial: any) {
  try {
    const supabase = await getAdminClient()
    const { data, error } = await supabase
      .from('testimonials')
      .update(testimonial)
      .eq('id', id)
      .select()

    if (error) throw error

    revalidatePath('/')
    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteTestimonialAction(id: string) {
  try {
    const supabase = await getAdminClient()
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// ============================================================
// 6. FAQs CRUD
// ============================================================

export async function createFAQAction(faq: any) {
  try {
    const supabase = await getAdminClient()
    const { data, error } = await supabase
      .from('faqs')
      .insert([faq])
      .select()

    if (error) throw error

    revalidatePath('/')
    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function updateFAQAction(id: string, faq: any) {
  try {
    const supabase = await getAdminClient()
    const { data, error } = await supabase
      .from('faqs')
      .update(faq)
      .eq('id', id)
      .select()

    if (error) throw error

    revalidatePath('/')
    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteFAQAction(id: string) {
  try {
    const supabase = await getAdminClient()
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// ============================================================
// 7. CAROUSEL SLIDES CRUD
// ============================================================

export async function saveCarouselSlideAction(slide: any) {
  try {
    const supabase = await getAdminClient()
    const { data, error } = await supabase
      .from('carousel_slides')
      .upsert([slide])
      .select()

    if (error) throw error

    revalidatePath('/')
    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteCarouselSlideAction(id: string) {
  try {
    const supabase = await getAdminClient()
    const { error } = await supabase
      .from('carousel_slides')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
