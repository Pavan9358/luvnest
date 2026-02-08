import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { FileText } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Terms and Conditions"
        description="Read the terms and conditions for using LUVNEST platform."
      />
      <Header />

      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-display font-bold mb-4">Terms and Conditions</h1>
            <p className="text-muted-foreground">Last updated: February 5, 2026</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">💕 1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using LUVNEST ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">📝 2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                LUVNEST is a platform that allows users to create personalized digital love pages to share with their loved ones. Our services include love letter creation, photo galleries, timelines, and AI-powered content generation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">👤 3. User Accounts</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p><strong>3.1 Registration:</strong> You must provide accurate and complete information when creating an account.</p>
                <p className="mt-2"><strong>3.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials.</p>
                <p className="mt-2"><strong>3.3 Age Requirement:</strong> You must be at least 13 years old to use our services.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">✍️ 4. User Content</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p><strong>4.1 Ownership:</strong> You retain ownership of content you create on the Platform.</p>
                <p className="mt-2"><strong>4.2 License:</strong> By posting content, you grant us a non-exclusive license to use, display, and distribute your content for operating the service.</p>
                <p className="mt-2"><strong>4.3 Prohibited Content:</strong> You may not post content that is:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Illegal, harmful, or offensive</li>
                  <li>Infringing on intellectual property rights</li>
                  <li>Containing malware or harmful code</li>
                  <li>Harassing, threatening, or defamatory</li>
                  <li>Sexually explicit or pornographic</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">🚫 5. Prohibited Activities</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Use the Platform for any unlawful purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Platform's operation</li>
                  <li>Use automated systems to access the Platform without permission</li>
                  <li>Impersonate another person or entity</li>
                  <li>Share your account with others</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">💳 6. Payments and Subscriptions</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p><strong>6.1 Pricing:</strong> Some features require a paid subscription. Prices are displayed on our pricing page.</p>
                <p className="mt-2"><strong>6.2 Billing:</strong> Subscriptions are billed in advance on a recurring basis.</p>
                <p className="mt-2"><strong>6.3 Refunds:</strong> Refund requests are handled on a case-by-case basis. Contact support for assistance.</p>
                <p className="mt-2"><strong>6.4 Cancellation:</strong> You may cancel your subscription at any time from your account settings.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">🤖 7. AI-Generated Content</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p><strong>7.1</strong> Our Platform uses AI to help generate content. AI-generated content is provided as suggestions only.</p>
                <p className="mt-2"><strong>7.2</strong> You are responsible for reviewing and editing AI-generated content before use.</p>
                <p className="mt-2"><strong>7.3</strong> We do not guarantee the accuracy or appropriateness of AI-generated content.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">⚠️ 8. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">🛡️ 9. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, LUVNEST SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">🔒 10. Intellectual Property</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p><strong>10.1</strong> The Platform and its original content, features, and functionality are owned by LUVNEST.</p>
                <p className="mt-2"><strong>10.2</strong> Our trademarks and trade dress may not be used without prior written permission.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">❌ 11. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">⚖️ 12. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by the laws of India. Any disputes arising from these Terms shall be resolved in the courts of India.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">🔄 13. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-4">💳 14. Refund & Cancellation Policy</h2>
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

            <section id="contact" className="scroll-mt-24">
              <h2 className="text-2xl font-display font-bold mb-4">📧 15. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about these Terms, please contact us at:{" "}
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
