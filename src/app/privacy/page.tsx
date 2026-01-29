// src/app/privacy/page.tsx
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | VAMP",
  description: "VAMP Privacy Policy - How we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[var(--vamp-grey)] hover:text-[var(--vamp-black)] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-4">
          <Shield className="w-4 h-4" />
          <span>Legal</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--vamp-black)] mb-4">
          Privacy Policy
        </h1>
        <p className="text-[var(--vamp-grey)]">
          Last updated: January 2025
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div className="vamp-card p-6 mb-8 bg-blue-50 border-blue-200">
          <p className="text-[var(--vamp-grey-dark)] m-0">
            At VAMP, we take your privacy seriously. This policy describes how we collect, 
            use, and protect your personal information when you use our platform.
          </p>
        </div>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">1. Information We Collect</h2>
        
        <h3 className="text-lg font-semibold text-[var(--vamp-black)] mt-6 mb-3">Information You Provide</h3>
        <ul className="list-disc pl-6 text-[var(--vamp-grey-dark)] space-y-2 mb-4">
          <li><strong>Account Information:</strong> When you sign up via GitHub, we receive your name, email address, username, and profile picture.</li>
          <li><strong>Profile Information:</strong> Any additional information you add to your profile, such as bio, website, and social links.</li>
          <li><strong>Project Information:</strong> Details about projects you submit, including titles, descriptions, links, and tech stack.</li>
          <li><strong>Communications:</strong> Messages you send through our platform, forum posts, and comments.</li>
        </ul>

        <h3 className="text-lg font-semibold text-[var(--vamp-black)] mt-6 mb-3">Information Collected Automatically</h3>
        <ul className="list-disc pl-6 text-[var(--vamp-grey-dark)] space-y-2 mb-4">
          <li><strong>Usage Data:</strong> How you interact with our platform, including pages visited, features used, and time spent.</li>
          <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers.</li>
          <li><strong>Log Data:</strong> IP address, access times, and referring URLs.</li>
        </ul>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">2. How We Use Your Information</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">We use the information we collect to:</p>
        <ul className="list-disc pl-6 text-[var(--vamp-grey-dark)] space-y-2 mb-4">
          <li>Provide, maintain, and improve our services</li>
          <li>Create and manage your account</li>
          <li>Display your profile and projects to other users</li>
          <li>Process grant applications and payments</li>
          <li>Send important notifications about your account or projects</li>
          <li>Respond to your comments, questions, and support requests</li>
          <li>Monitor and analyze trends, usage, and activities</li>
          <li>Detect, prevent, and address technical issues or fraud</li>
        </ul>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">3. Information Sharing</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          We do not sell your personal information. We may share your information in the following circumstances:
        </p>
        <ul className="list-disc pl-6 text-[var(--vamp-grey-dark)] space-y-2 mb-4">
          <li><strong>Public Profile:</strong> Your profile, projects, and forum posts are visible to other users.</li>
          <li><strong>Grant Sponsors:</strong> If you apply for a grant, your application details are shared with the sponsor.</li>
          <li><strong>Service Providers:</strong> We may share information with third-party services that help us operate our platform (e.g., hosting, analytics).</li>
          <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety.</li>
        </ul>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">4. Data Security</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments.
        </p>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">5. Your Rights</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">You have the right to:</p>
        <ul className="list-disc pl-6 text-[var(--vamp-grey-dark)] space-y-2 mb-4">
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your account and associated data</li>
          <li>Export your data in a portable format</li>
          <li>Opt out of marketing communications</li>
        </ul>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          To exercise these rights, please contact us at{" "}
          <a href="mailto:privacy@vamp.dev" className="text-[var(--vamp-orange)] hover:underline">
            privacy@vamp.dev
          </a>.
        </p>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">6. Cookies</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          We use cookies and similar technologies to maintain your session, remember your preferences, and understand how you use our platform. You can control cookies through your browser settings, but disabling them may affect functionality.
        </p>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">7. Third-Party Links</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          Our platform may contain links to third-party websites (e.g., project demos, social profiles). We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
        </p>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">8. Children's Privacy</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          VAMP is not intended for users under 13 years of age. We do not knowingly collect personal information from children. If we learn that we have collected information from a child under 13, we will delete it promptly.
        </p>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">9. Changes to This Policy</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of VAMP after changes constitutes acceptance of the updated policy.
        </p>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">10. Contact Us</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <ul className="list-disc pl-6 text-[var(--vamp-grey-dark)] space-y-2 mb-4">
          <li>Email: <a href="mailto:privacy@vamp.dev" className="text-[var(--vamp-orange)] hover:underline">privacy@vamp.dev</a></li>
          <li>Website: <a href="https://vamp.dev" className="text-[var(--vamp-orange)] hover:underline">vamp.dev</a></li>
        </ul>
      </div>

      {/* Footer Links */}
      <div className="mt-12 pt-8 border-t border-[var(--vamp-grey-lighter)] flex items-center justify-between text-sm text-[var(--vamp-grey)]">
        <Link href="/terms" className="hover:text-[var(--vamp-black)] transition-colors">
          Terms of Service →
        </Link>
        <Link href="/about" className="hover:text-[var(--vamp-black)] transition-colors">
          About VAMP →
        </Link>
      </div>
    </div>
  );
}
