// src/app/terms/page.tsx
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | VAMP",
  description: "VAMP Terms of Service - Rules and guidelines for using our platform.",
};

export default function TermsPage() {
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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-4">
          <FileText className="w-4 h-4" />
          <span>Legal</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--vamp-black)] mb-4">
          Terms of Service
        </h1>
        <p className="text-[var(--vamp-grey)]">
          Last updated: January 2025
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div className="vamp-card p-6 mb-8 bg-purple-50 border-purple-200">
          <p className="text-[var(--vamp-grey-dark)] m-0">
            Welcome to VAMP! These Terms of Service govern your use of our platform. 
            By accessing or using VAMP, you agree to be bound by these terms.
          </p>
        </div>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          By creating an account or using VAMP, you agree to these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our platform.
        </p>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">2. Description of Service</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          VAMP is a platform for the vibecoding community that provides:
        </p>
        <ul className="list-disc pl-6 text-[var(--vamp-grey-dark)] space-y-2 mb-4">
          <li>Project submission and discovery features</li>
          <li>Educational resources and tutorials</li>
          <li>Grant programs and funding opportunities</li>
          <li>Community forums and discussions</li>
          <li>User profiles and leaderboards</li>
        </ul>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">3. Account Registration</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          To use certain features of VAMP, you must create an account using GitHub authentication. You agree to:
        </p>
        <ul className="list-disc pl-6 text-[var(--vamp-grey-dark)] space-y-2 mb-4">
          <li>Provide accurate and complete information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Promptly update any changes to your information</li>
          <li>Accept responsibility for all activities under your account</li>
          <li>Notify us immediately of any unauthorized access</li>
        </ul>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">4. User Content</h2>
        
        <h3 className="text-lg font-semibold text-[var(--vamp-black)] mt-6 mb-3">Your Content</h3>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          You retain ownership of content you submit to VAMP, including projects, forum posts, and comments. By posting content, you grant VAMP a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content on our platform.
        </p>

        <h3 className="text-lg font-semibold text-[var(--vamp-black)] mt-6 mb-3">Content Guidelines</h3>
        <p className="text-[var(--vamp-grey-dark)] mb-4">You agree not to post content that:</p>
        <ul className="list-disc pl-6 text-[var(--vamp-grey-dark)] space-y-2 mb-4">
          <li>Is illegal, harmful, threatening, abusive, or harassing</li>
          <li>Infringes on intellectual property rights of others</li>
          <li>Contains malware, viruses, or malicious code</li>
          <li>Is spam, misleading, or fraudulent</li>
          <li>Violates the privacy of others</li>
          <li>Promotes illegal activities or substances</li>
          <li>Contains adult or sexually explicit material</li>
          <li>Discriminates against individuals or groups</li>
        </ul>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">5. Project Submissions</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          When submitting projects to VAMP, you represent and warrant that:
        </p>
        <ul className="list-disc pl-6 text-[var(--vamp-grey-dark)] space-y-2 mb-4">
          <li>You are the creator or have the right to submit the project</li>
          <li>The project does not infringe on any third-party rights</li>
          <li>All information provided is accurate and truthful</li>
          <li>The project complies with all applicable laws and regulations</li>
        </ul>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">6. Grants and Funding</h2>
        
        <h3 className="text-lg font-semibold text-[var(--vamp-black)] mt-6 mb-3">For Applicants</h3>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          Grant applications are subject to review by sponsors. VAMP does not guarantee any funding and is not responsible for decisions made by sponsors. All information in applications must be truthful and accurate.
        </p>

        <h3 className="text-lg font-semibold text-[var(--vamp-black)] mt-6 mb-3">For Sponsors</h3>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          Sponsors agree to fulfill funding commitments for approved applications. VAMP facilitates connections but is not a party to agreements between sponsors and grant recipients.
        </p>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">7. Intellectual Property</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          The VAMP platform, including its design, features, and content created by VAMP, is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute any part of our platform without permission.
        </p>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">8. Prohibited Activities</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">You agree not to:</p>
        <ul className="list-disc pl-6 text-[var(--vamp-grey-dark)] space-y-2 mb-4">
          <li>Use automated systems or bots to access or interact with VAMP</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Interfere with or disrupt the platform or servers</li>
          <li>Manipulate voting, rankings, or engagement metrics</li>
          <li>Create multiple accounts for deceptive purposes</li>
          <li>Impersonate others or misrepresent your affiliation</li>
          <li>Collect user information without consent</li>
          <li>Use VAMP for any illegal purpose</li>
        </ul>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">9. Termination</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          We reserve the right to suspend or terminate your account at any time for violation of these terms or for any other reason at our discretion. You may also delete your account at any time through your settings.
        </p>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">10. Disclaimers</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          VAMP is provided "as is" without warranties of any kind. We do not guarantee that the platform will be uninterrupted, secure, or error-free. We are not responsible for:
        </p>
        <ul className="list-disc pl-6 text-[var(--vamp-grey-dark)] space-y-2 mb-4">
          <li>Content posted by users</li>
          <li>Disputes between users, sponsors, and grant recipients</li>
          <li>Loss of data or service interruptions</li>
          <li>Third-party links or services</li>
        </ul>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">11. Limitation of Liability</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          To the maximum extent permitted by law, VAMP and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.
        </p>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">12. Changes to Terms</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          We may modify these terms at any time. We will notify users of material changes by posting an update on our platform. Continued use of VAMP after changes constitutes acceptance of the new terms.
        </p>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">13. Governing Law</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          These terms are governed by the laws of the State of California, United States, without regard to conflict of law principles.
        </p>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">14. Contact</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          For questions about these Terms of Service, please contact us:
        </p>
        <ul className="list-disc pl-6 text-[var(--vamp-grey-dark)] space-y-2 mb-4">
          <li>Email: <a href="mailto:legal@vamp.dev" className="text-[var(--vamp-orange)] hover:underline">legal@vamp.dev</a></li>
          <li>Website: <a href="https://vamp.dev" className="text-[var(--vamp-orange)] hover:underline">vamp.dev</a></li>
        </ul>
      </div>

      {/* Footer Links */}
      <div className="mt-12 pt-8 border-t border-[var(--vamp-grey-lighter)] flex items-center justify-between text-sm text-[var(--vamp-grey)]">
        <Link href="/privacy" className="hover:text-[var(--vamp-black)] transition-colors">
          ← Privacy Policy
        </Link>
        <Link href="/about" className="hover:text-[var(--vamp-black)] transition-colors">
          About VAMP →
        </Link>
      </div>
    </div>
  );
}
