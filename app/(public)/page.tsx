import HeroSection from '@/components/home/HeroSection'
import FeaturedCarousel from '@/components/home/FeaturedCarousel'
import CategoryGrid from '@/components/home/CategoryGrid'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import StatsCounter from '@/components/home/StatsCounter'
import TestimonialSlider from '@/components/home/TestimonialSlider'
import FAQSection from '@/components/home/FAQSection'
import ContactCTA from '@/components/home/ContactCTA'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCarousel />
      <CategoryGrid />
      <WhyChooseUs />
      <StatsCounter />
      <TestimonialSlider />
      <FAQSection />
      <ContactCTA />
    </>
  )
}
