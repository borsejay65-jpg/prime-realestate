-- ============================================================
-- PrimeAxis Real Estate — Seed Data
-- Run AFTER schema.sql
-- ============================================================

-- Categories
INSERT INTO categories (name, slug, icon, description, display_order) VALUES
  ('Residential', 'residential', 'home', 'Homes and housing units', 1),
  ('Commercial', 'commercial', 'building-2', 'Commercial properties and spaces', 2),
  ('Plots', 'plots', 'map', 'Land and plot investments', 3),
  ('Farm House', 'farmhouse', 'tree-pine', 'Farm houses and agricultural land', 4),
  ('Rental', 'rental', 'key', 'Properties available for rent', 5),
  ('Luxury Villas', 'luxury-villas', 'crown', 'Premium luxury villas', 6),
  ('Apartments', 'apartments', 'building', 'Flats and apartment units', 7),
  ('Independent House', 'independent-house', 'house', 'Independent bungalows and houses', 8),
  ('Office Space', 'office-space', 'briefcase', 'Office and co-working spaces', 9),
  ('Warehouse', 'warehouse', 'package', 'Warehouses and storage facilities', 10);

-- Locations
INSERT INTO locations (city, area, state, pincode) VALUES
  ('Jalgaon', 'Baner', 'Maharashtra', '411045'),
  ('Jalgaon', 'Wakad', 'Maharashtra', '411057'),
  ('Jalgaon', 'Hinjewadi', 'Maharashtra', '411057'),
  ('Jalgaon', 'Kothrud', 'Maharashtra', '411038'),
  ('Jalgaon', 'Kalyani Nagar', 'Maharashtra', '411006'),
  ('Jalgaon', 'Viman Nagar', 'Maharashtra', '411014'),
  ('Jalgaon', 'Aundh', 'Maharashtra', '411007'),
  ('Jalgaon', 'Koregaon Park', 'Maharashtra', '411001'),
  ('Mumbai', 'Andheri West', 'Maharashtra', '400058'),
  ('Mumbai', 'Powai', 'Maharashtra', '400076');

-- Amenities
INSERT INTO amenities (name, icon, category) VALUES
  ('Swimming Pool', 'waves', 'luxury'),
  ('Gym / Fitness Center', 'dumbbell', 'luxury'),
  ('Clubhouse', 'users', 'luxury'),
  ('24/7 Security', 'shield', 'security'),
  ('CCTV Surveillance', 'camera', 'security'),
  ('Intercom', 'phone', 'security'),
  ('Power Backup', 'zap', 'basic'),
  ('Water Supply 24/7', 'droplets', 'basic'),
  ('Reserved Parking', 'car', 'basic'),
  ('Lift / Elevator', 'arrow-up-down', 'basic'),
  ('Children Play Area', 'smile', 'recreational'),
  ('Garden / Landscaping', 'flower-2', 'recreational'),
  ('Jogging Track', 'footprints', 'recreational'),
  ('Indoor Games', 'gamepad-2', 'recreational'),
  ('Multipurpose Hall', 'layout', 'recreational'),
  ('Wi-Fi Connectivity', 'wifi', 'smart'),
  ('Smart Home Features', 'home', 'smart'),
  ('Solar Panels', 'sun', 'green'),
  ('Rainwater Harvesting', 'cloud-rain', 'green'),
  ('EV Charging', 'battery-charging', 'green');

-- FAQs
INSERT INTO faqs (question, answer, category, display_order) VALUES
  ('How do I schedule a property visit?', 'You can schedule a property visit by clicking the "Schedule Visit" button on any property page, or by contacting us directly via WhatsApp or phone. Our team will confirm your appointment within 2 hours.', 'general', 1),
  ('Is PrimeAxis a verified real estate brokerage?', 'Yes, PrimeAxis is a registered and verified real estate brokerage with years of experience in the Jalgaon property market. All our listings are verified and our team of experts guides you through every step.', 'general', 2),
  ('Do you assist with home loans?', 'Absolutely! We have tie-ups with leading banks and NBFCs to help you get the best home loan rates. Our loan assistance experts will help you with documentation, eligibility, and loan processing at no extra cost.', 'finance', 3),
  ('What is the process to buy a property through PrimeAxis?', 'Our 4-step process: 1) Browse & shortlist properties, 2) Schedule a site visit, 3) Finalize the property with expert negotiation, 4) Complete documentation & registration. We assist at every step.', 'buying', 4),
  ('Do you charge any brokerage fee?', 'Our brokerage fees are competitive and transparent. We charge a standard 1-2% brokerage on successful transactions. For rental properties, it is typically equivalent to one month''s rent. All fees are discussed upfront with no hidden charges.', 'finance', 5),
  ('Can I list my property for sale or rent on PrimeAxis?', 'Yes! Property owners can list their properties with us for free. We provide professional photography, marketing, and buyer/tenant screening services. Contact us to get started.', 'selling', 6),
  ('What documents are needed to buy a property?', 'Generally required: Aadhar Card, PAN Card, Bank statements (6 months), Salary slips (3 months), Form 16, and property documents. Our legal team will provide a complete checklist based on your specific case.', 'legal', 7),
  ('Do you provide legal assistance for property registration?', 'Yes, we provide complete legal assistance including title verification, sale deed drafting, registration, and mutation. We partner with experienced property lawyers to ensure a smooth and secure transaction.', 'legal', 8);

-- Testimonials
INSERT INTO testimonials (customer_name, rating, review, property_type, location, display_order) VALUES
  ('Rajesh Sharma', 5, 'PrimeAxis made our dream of owning a home in Jalgaon a reality. Their team was professional, transparent, and guided us through every step. We found our perfect 3BHK in Baner within 3 weeks!', 'Apartment', 'Baner, Jalgaon', 1),
  ('Priya Mehta', 5, 'Excellent service from start to finish. The agents are knowledgeable and never pushed us into any decisions. The loan assistance they provided saved us significant time and effort.', 'Independent House', 'Kothrud, Jalgaon', 2),
  ('Vikram Patel', 4, 'Very professional team. They showed us properties that truly matched our budget and requirements. The legal assistance was a huge help. Highly recommend PrimeAxis for anyone looking to invest in Jalgaon real estate.', 'Commercial', 'Hinjewadi, Jalgaon', 3),
  ('Anita Desai', 5, 'I was skeptical about buying property remotely, but PrimeAxis made it seamless. Regular updates, video tours, and thorough documentation support. Truly a premium experience!', 'Luxury Villa', 'Kalyani Nagar, Jalgaon', 4),
  ('Suresh Kumar', 5, 'Found our dream farmhouse through PrimeAxis. The team understood exactly what we wanted and presented us with options that exceeded our expectations. The negotiation support saved us lakhs!', 'Farm House', 'Jalgaon Outskirts', 5),
  ('Neha Singh', 4, 'Great experience overall. PrimeAxis has a vast network of verified properties. Their after-sales support continues even after the deal is closed. Very trustworthy brokerage.', 'Apartment', 'Viman Nagar, Jalgaon', 6);

-- Carousel Slides
INSERT INTO carousel_slides (title, subtitle, slide_type, media_url, button_text, button_url, display_order) VALUES
  ('Find Your Dream Property in Jalgaon', 'Verified listings, expert guidance, and the best deals across residential and commercial properties', 'image', '/images/hero-1.jpg', 'View Properties', '/properties', 1),
  ('Luxury Living Redefined', 'Explore our exclusive collection of premium villas, penthouses and luxury apartments', 'image', '/images/hero-2.jpg', 'Explore Luxury', '/properties?type=luxury_villa', 2),
  ('Smart Investment, Better Future', 'Discover high-yield commercial properties and prime plots in Jalgaon''s growth corridors', 'image', '/images/hero-3.jpg', 'Invest Now', '/properties?type=commercial', 3);

-- Site Settings
INSERT INTO site_settings (key, value, description) VALUES
  ('company_name', 'PrimeAxis', 'Company name'),
  ('company_tagline', 'Your Trusted Real Estate Partner', 'Company tagline'),
  ('company_description', 'PrimeAxis is Jalgaon''s premier real estate brokerage firm specializing in residential, commercial, and luxury properties. With years of market expertise and a dedicated team of professionals, we help you find the perfect property.', 'Company description'),
  ('phone_primary', '+91 9511802062', 'Primary phone number'),
  ('phone_secondary', '+91 9511802062', 'Secondary phone number'),
  ('whatsapp_number', '+919511802062', 'WhatsApp number (no spaces)'),
  ('email_primary', 'info@primeaxis.in', 'Primary email'),
  ('email_secondary', 'sales@primeaxis.in', 'Secondary email'),
  ('address', 'PrimeAxis Realty Pvt. Ltd., Office No. 101, Premium Business Park, Baner Road, Jalgaon - 411045, Maharashtra, India', 'Office address'),
  ('business_hours', 'Mon-Sat: 9:00 AM - 7:00 PM | Sun: 10:00 AM - 5:00 PM', 'Business hours'),
  ('facebook_url', 'https://facebook.com/primeaxis', 'Facebook URL'),
  ('instagram_url', 'https://instagram.com/primeaxis', 'Instagram URL'),
  ('twitter_url', 'https://twitter.com/primeaxis', 'Twitter URL'),
  ('linkedin_url', 'https://linkedin.com/company/primeaxis', 'LinkedIn URL'),
  ('youtube_url', 'https://youtube.com/@primeaxis', 'YouTube URL'),
  ('seo_title', 'PrimeAxis | Premium Real Estate Brokerage in Jalgaon', 'Default SEO title'),
  ('seo_description', 'Find your dream property in Jalgaon with PrimeAxis. Expert real estate brokerage for residential, commercial, luxury villas, plots, and rental properties. Call +91 9511802062.', 'Default SEO description'),
  ('google_maps_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.019073773987!2d73.83291021485!3d18.559473787381!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf61fdc6f!2sBaner%2C+Jalgaon!5e0!3m2!1sen!2sin!4v1625000000000!5m2!1sen!2sin', 'Google Maps embed URL'),
  ('rera_number', 'P52100023456', 'RERA Registration Number'),
  ('established_year', '2018', 'Year established'),
  ('total_properties', '500+', 'Total properties handled'),
  ('happy_clients', '2000+', 'Total happy clients'),
  ('years_experience', '6+', 'Years of experience');
