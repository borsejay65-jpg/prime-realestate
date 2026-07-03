-- ============================================================
-- PrimeAxis Real Estate — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE property_status AS ENUM (
  'for_sale', 'for_rent', 'sold', 'booked', 'featured', 'new', 'hot', 'price_reduced'
);

CREATE TYPE property_type AS ENUM (
  'residential', 'commercial', 'plot', 'farmhouse', 'rental', 'luxury_villa',
  'apartment', 'independent_house', 'office_space', 'warehouse'
);

CREATE TYPE construction_status AS ENUM (
  'ready_to_move', 'under_construction', 'new_launch', 'resale'
);

CREATE TYPE inquiry_status AS ENUM (
  'new', 'contacted', 'interested', 'site_visit', 'negotiation', 'closed', 'rejected'
);

CREATE TYPE inquiry_source AS ENUM (
  'website_form', 'whatsapp', 'call', 'email', 'walkin', 'referral'
);

CREATE TYPE slide_type AS ENUM ('image', 'video');

CREATE TYPE blog_status AS ENUM ('draft', 'published', 'archived');

-- ============================================================
-- PROFILES (Admin Users)
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CATEGORIES
-- ============================================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT, -- icon name or SVG string
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LOCATIONS
-- ============================================================

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city TEXT NOT NULL,
  area TEXT,
  state TEXT DEFAULT 'Maharashtra',
  country TEXT DEFAULT 'India',
  pincode TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AMENITIES
-- ============================================================

CREATE TABLE amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT,
  category TEXT, -- 'basic', 'luxury', 'security', etc.
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROPERTIES
-- ============================================================

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id TEXT UNIQUE NOT NULL, -- Human-readable ID like PA-2024-001
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  highlights TEXT[], -- Array of bullet points
  property_type property_type NOT NULL DEFAULT 'residential',
  status property_status NOT NULL DEFAULT 'for_sale',
  construction_status construction_status DEFAULT 'ready_to_move',
  
  -- Pricing
  price NUMERIC(15, 2) NOT NULL DEFAULT 0,
  price_label TEXT, -- e.g. "2.5 Cr", "45,000/month"
  price_negotiable BOOLEAN DEFAULT FALSE,
  
  -- Specifications
  area_sqft NUMERIC(10, 2),
  area_sqyard NUMERIC(10, 2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  balcony INTEGER,
  parking INTEGER,
  floor INTEGER,
  total_floors INTEGER,
  facing TEXT, -- North, South, East, West
  ownership TEXT, -- Freehold, Leasehold, etc.
  possession_date DATE,
  
  -- Location
  address TEXT,
  location TEXT, -- Display location like "Baner, Jalgaon"
  city TEXT,
  state TEXT DEFAULT 'Maharashtra',
  pincode TEXT,
  map_lat DECIMAL(10, 8),
  map_lng DECIMAL(11, 8),
  map_embed_url TEXT,
  
  -- Media
  thumbnail_url TEXT,
  brochure_url TEXT,
  
  -- Categorization
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  
  -- Flags
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_draft BOOLEAN DEFAULT FALSE,
  
  -- Stats
  views INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  
  -- SEO
  seo_title TEXT,
  seo_description TEXT,
  
  -- Metadata
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROPERTY IMAGES
-- ============================================================

CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_thumbnail BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROPERTY VIDEOS
-- ============================================================

CREATE TABLE property_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL, -- YouTube URL or Supabase Storage URL
  video_type TEXT DEFAULT 'youtube' CHECK (video_type IN ('youtube', 'uploaded')),
  title TEXT,
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROPERTY AMENITIES (Junction Table)
-- ============================================================

CREATE TABLE property_amenities (
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, amenity_id)
);

-- ============================================================
-- PROPERTY NEARBY PLACES
-- ============================================================

CREATE TABLE property_nearby (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  place_name TEXT NOT NULL,
  place_type TEXT, -- 'school', 'hospital', 'mall', 'metro', 'airport'
  distance TEXT, -- "2 km", "500 m"
  display_order INTEGER DEFAULT 0
);

-- ============================================================
-- CAROUSEL SLIDES
-- ============================================================

CREATE TABLE carousel_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  subtitle TEXT,
  slide_type slide_type DEFAULT 'image',
  media_url TEXT NOT NULL,
  button_text TEXT,
  button_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  schedule_start TIMESTAMPTZ,
  schedule_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TESTIMONIALS
-- ============================================================

CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_image TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  review TEXT NOT NULL,
  property_type TEXT,
  location TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FAQs
-- ============================================================

CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BLOG CATEGORIES
-- ============================================================

CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BLOGS
-- ============================================================

CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT, -- Rich HTML content from TipTap
  featured_image TEXT,
  status blog_status DEFAULT 'draft',
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  tags TEXT[],
  views INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INQUIRIES (Lead CRM)
-- ============================================================

CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  message TEXT,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  property_title TEXT, -- Snapshot at time of inquiry
  source inquiry_source DEFAULT 'website_form',
  status inquiry_status DEFAULT 'new',
  notes TEXT, -- Admin notes
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  follow_up_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SITE SETTINGS (Key-Value Store)
-- ============================================================

CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_featured ON properties(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_properties_active ON properties(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_created ON properties(created_at DESC);
CREATE INDEX idx_property_images_property ON property_images(property_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_published ON blogs(published_at DESC);
CREATE INDEX idx_carousel_order ON carousel_slides(display_order) WHERE is_active = TRUE;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_nearby ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read active properties, categories, locations, amenities
CREATE POLICY "Public read active properties" ON properties FOR SELECT USING (is_active = TRUE AND is_draft = FALSE);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read locations" ON locations FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read amenities" ON amenities FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read property images" ON property_images FOR SELECT USING (TRUE);
CREATE POLICY "Public read property videos" ON property_videos FOR SELECT USING (TRUE);
CREATE POLICY "Public read property amenities" ON property_amenities FOR SELECT USING (TRUE);
CREATE POLICY "Public read property nearby" ON property_nearby FOR SELECT USING (TRUE);
CREATE POLICY "Public read active carousel" ON carousel_slides FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read published blogs" ON blogs FOR SELECT USING (status = 'published');
CREATE POLICY "Public read blog categories" ON blog_categories FOR SELECT USING (TRUE);
CREATE POLICY "Public read site settings" ON site_settings FOR SELECT USING (TRUE);

-- Inquiries: anyone can insert, only admins can read
CREATE POLICY "Anyone can create inquiry" ON inquiries FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins read inquiries" ON inquiries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins update inquiries" ON inquiries FOR UPDATE USING (auth.role() = 'authenticated');

-- Authenticated users (admins) can do everything else
CREATE POLICY "Admins manage properties" ON properties FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage locations" ON locations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage amenities" ON amenities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage property images" ON property_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage property videos" ON property_videos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage property amenities" ON property_amenities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage property nearby" ON property_nearby FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage carousel" ON carousel_slides FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage blogs" ON blogs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage blog categories" ON blog_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage site settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage profiles" ON profiles FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carousel_updated_at BEFORE UPDATE ON carousel_slides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate sequential property ID
CREATE OR REPLACE FUNCTION generate_property_id()
RETURNS TEXT AS $$
DECLARE
  year TEXT := TO_CHAR(NOW(), 'YYYY');
  seq INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO seq FROM properties WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  RETURN 'PA-' || year || '-' || LPAD(seq::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate property ID
CREATE OR REPLACE FUNCTION set_property_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.property_id IS NULL OR NEW.property_id = '' THEN
    NEW.property_id := generate_property_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_property_id BEFORE INSERT ON properties FOR EACH ROW EXECUTE FUNCTION set_property_id();

-- ============================================================
-- STORAGE BUCKETS (Run via Supabase Dashboard or API)
-- ============================================================
-- Create these buckets in Supabase Storage:
-- 1. "property-images" (public)
-- 2. "property-videos" (public)  
-- 3. "brochures" (public)
-- 4. "carousel" (public)
-- 5. "blog-images" (public)
-- 6. "avatars" (public)
-- 7. "floor-plans" (public)
