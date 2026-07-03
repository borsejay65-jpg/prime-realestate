import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-background-dark pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-display text-4xl font-bold text-gray-800 dark:text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: January 1, 2024</p>
        <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using the PrimeAxis Realty website (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, please do not use our Service.</p>
          <h2>2. Description of Services</h2>
          <p>PrimeAxis Realty provides real estate brokerage services including property listings, buyer-seller matching, property visits, legal assistance, and loan support for properties in Jalgaon, Maharashtra, India.</p>
          <h2>3. User Responsibilities</h2>
          <ul><li>Provide accurate information when submitting inquiries</li><li>Use the Service for lawful purposes only</li><li>Respect the intellectual property rights of PrimeAxis Realty</li><li>Not attempt to disrupt or compromise the Service</li></ul>
          <h2>4. Property Listings</h2>
          <p>While we strive for accuracy, PrimeAxis Realty does not guarantee the completeness or accuracy of property listings. Prices, availability, and specifications are subject to change. All information should be independently verified before making any property decisions.</p>
          <h2>5. Pricing and Fees</h2>
          <p>Brokerage charges are applicable as per industry standards and will be communicated transparently before any transaction. All fees are subject to applicable GST and taxes as per Indian law.</p>
          <h2>6. Limitation of Liability</h2>
          <p>PrimeAxis Realty shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability shall not exceed the fees paid by you for our services.</p>
          <h2>7. Intellectual Property</h2>
          <p>All content on this website, including text, images, logos, and design, is the property of PrimeAxis Realty and is protected by Indian intellectual property laws. Unauthorized reproduction or distribution is prohibited.</p>
          <h2>8. Governing Law</h2>
          <p>These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Jalgaon, Maharashtra.</p>
          <h2>9. Contact Information</h2>
          <p>For questions about these Terms, contact us at <a href="mailto:legal@primeaxis.in">legal@primeaxis.in</a> or call <a href="tel:+919511802062">+91 9511802062</a>.</p>
        </div>
        <div className="mt-8"><Link href="/" className="text-primary dark:text-gold hover:underline">&larr; Back to Home</Link></div>
      </div>
    </div>
  )
}
