import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: {
    default: "VAMP - Vibecoding Community",
    template: "%s | VAMP",
  },
  description:
    "The community platform for vibecoding - fast, AI-assisted development. Discover projects, find grants, and connect with makers.",
  keywords: [
    "vibecoding",
    "AI development",
    "coding community",
    "developer tools",
    "open source",
    "indie hackers",
  ],
  authors: [{ name: "VAMP" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vamp.dev",
    siteName: "VAMP",
    title: "VAMP - Vibecoding Community",
    description:
      "The community platform for vibecoding - fast, AI-assisted development.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VAMP - Vibecoding Community",
    description:
      "The community platform for vibecoding - fast, AI-assisted development.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={ibmPlexMono.variable}>
      <body className="font-mono antialiased">
        <Providers>
          {/* Background Pattern Overlay */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.015]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Main App Container */}
          <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="relative mt-auto py-8 border-t border-[var(--vamp-grey-lighter)]/30">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-[var(--vamp-grey)]">
                    <span className="font-semibold text-[var(--vamp-orange)]">
                      VAMP
                    </span>
                    <span>•</span>
                    <span>Built with vibes ⚡</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-[var(--vamp-grey)]">
                    <a
                      href="/about"
                      className="hover:text-[var(--vamp-black)] transition-colors"
                    >
                      About
                    </a>
                    <a
                      href="/privacy"
                      className="hover:text-[var(--vamp-black)] transition-colors"
                    >
                      Privacy
                    </a>
                    <a
                      href="/terms"
                      className="hover:text-[var(--vamp-black)] transition-colors"
                    >
                      Terms
                    </a>
                    <a
                      href="https://github.com/vamp-dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--vamp-black)] transition-colors"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
