import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead 
        title="Privacy Policy"
        description="Learn how LUVNEST protects your privacy and handles your personal data."
      />
      <Header />
      
      <main className="flex-1 py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <Shield className="h-8 w-8" />
            </div>
             <h1 className="text-4xl font-display font-bold mb-4">Privacy Policy</h1>
             <p className="text-muted-foreground">Last updated: February 5, 2026</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">💕 1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to LUVNEST ("we", "our", or "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">📋 2. Information We Collect</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p><strong>2.1 Personal Information:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name and email address</li>
                  <li>Account credentials</li>
                  <li>Profile information</li>
                  <li>Content you create (love letters, photos, messages)</li>
                </ul>
                
                <p><strong>2.2 Usage Data:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and location data</li>
                  <li>Pages visited and features used</li>
                  <li>Date and time of visits</li>
                </ul>

                <p><strong>2.3 Cookies and Tracking:</strong></p>
                <p>We use cookies and similar technologies to enhance your experience, analyze usage, and personalize content.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">🔐 3. How We Use Your Information</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>We use the collected information to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send administrative messages and updates</li>
                  <li>Respond to your comments and questions</li>
                  <li>Personalize your experience</li>
                  <li>Monitor and analyze trends and usage</li>
                  <li>Detect, prevent, and address technical issues</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">🤝 4. Sharing Your Information</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our platform</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger or acquisition</li>
                </ul>
                <p className="mt-4">We do not sell your personal information to third parties.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">🛡️ 5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">⚖️ 6. Your Rights</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">👶 7. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">🔄 8. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

             <section>
               <h2 className="text-2xl font-display font-bold mb-4">💳 9. Refund & Cancellation Policy</h2>
               <div className="text-muted-foreground leading-relaxed">
                 <p><strong>All purchases on LUVNEST are final.</strong></p>
                 <ul className="list-disc pl-6 space-y-2 mt-2">
                   <li>No refunds will be issued for any purchases</li>
                   <li>No cancellations are permitted after payment</li>
                   <li>Exceptions may apply only where required by applicable law</li>
                 </ul>
                 <p className="mt-4">
                   By making a purchase, you acknowledge and agree to this policy.
                 </p>
               </div>
             </section>
 
             <section>
               <h2 className="text-2xl font-display font-bold mb-4">📧 10. Contact Us</h2>
               <p className="text-muted-foreground leading-relaxed">
                 If you have questions about this Privacy Policy, please contact us at:{" "}
                 <a href="mailto:lovelevnest@gmail.com" className="text-primary hover:underline">
                   lovelevnest@gmail.com
                 </a>
               </p>
             </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
