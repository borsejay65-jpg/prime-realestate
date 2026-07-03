import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-background-dark pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-display text-4xl font-bold text-gray-800 dark:text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: January 1, 2024</p>
        <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4">
          <p>At PrimeAxis Realty (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
          <h2>1. Information We Collect</h2>
          <p><strong>Personal Information:</strong> Name, email address, phone number, and any other information you provide through our contact forms, inquiry forms, or when scheduling property visits.</p>
          <p><strong>Usage Data:</strong> We automatically collect information about how you interact with our website, including IP address, browser type, pages visited, time spent, and referring URL.</p>
          <p><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your browsing experience.</p>
          <h2>2. How We Use Your Information</h2>
          <ul><li>To respond to your property inquiries and contact requests</li><li>To send you property recommendations matching your preferences</li><li>To improve our website and services</li><li>To communicate important updates about properties you&apos;ve expressed interest in</li><li>To comply with legal obligations</li></ul>
          <h2>3. Information Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, provided they agree to keep your information confidential.</p>
          <h2>4. Cookies</h2>
          <p>Our website uses cookies for session management, analytics (Google Analytics), and user preference storage (theme settings). You can control cookie settings through your browser preferences.</p>
          <h2>5. Data Security</h2>
          <p>We implement industry-standard security measures including SSL encryption, secure data storage, and access controls to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
          <h2>6. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time. To exercise these rights, contact us at <a href="mailto:privacy@primeaxis.in">privacy@primeaxis.in</a>.</p>
          <h2>7. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us:</p>
          <ul><li>Email: <a href="mailto:privacy@primeaxis.in">privacy@primeaxis.in</a></li><li>Phone: <a href="tel:+919511802062">+91 9511802062</a></li><li>Address: PrimeAxis Realty, Office 101, Premium Business Park, Baner Road, Jalgaon - 411045</li></ul>
        </div>
        <div className="mt-8"><Link href="/" className="text-primary dark:text-gold hover:underline">&larr; Back to Home</Link></div>
      </div>
    </div>
  )
}
