import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingButtons from '@/components/shared/FloatingButtons'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PrimeAxis | Premium Real Estate Brokerage in Jalgaon',
  description:
    'PrimeAxis Realty is Jalgaon\'s premier real estate brokerage specializing in luxury properties, premium residences, commercial spaces, and investment opportunities. Find your dream property with expert guidance.',
  keywords: [
    'real estate Jalgaon',
    'luxury properties Jalgaon',
    'premium real estate',
    'PrimeAxis',
    'Jalgaon properties',
    'buy property Jalgaon',
    'luxury villas Jalgaon',
    'apartments Jalgaon',
    'commercial space Jalgaon',
    'real estate brokerage',
    'RERA registered',
    'Baner properties',
    'Hinjewadi properties',
    'Wakad properties',
  ],
  openGraph: {
    title: 'PrimeAxis | Premium Real Estate Brokerage in Jalgaon',
    description:
      'Jalgaon\'s premier real estate brokerage specializing in luxury properties, premium residences, and commercial spaces.',
    url: 'https://primeaxis.in',
    siteName: 'PrimeAxis Realty',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PrimeAxis Premium Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrimeAxis | Premium Real Estate Brokerage in Jalgaon',
    description:
      'Jalgaon\'s premier real estate brokerage specializing in luxury properties, premium residences, and commercial spaces.',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://primeaxis.in'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} font-sans`}>
      <body>
        <ThemeProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <FloatingButtons />
        </ThemeProvider>
      </body>
    </html>
  )
}
