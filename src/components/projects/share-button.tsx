"use client";

import { useState } from "react";
import { Share2, Check, Copy, Twitter, Linkedin } from "lucide-react";

interface ShareButtonProps {
  title: string;
  url: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fullUrl = typeof window !== "undefined" 
    ? `${window.location.origin}${url}`
    : url;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareTwitter = () => {
    const text = `Check out "${title}" on VAMP! 🚀`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullUrl)}`,
      "_blank"
    );
  };

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
      "_blank"
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="vamp-btn vamp-btn-outline"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-xl shadow-lg border border-[var(--vamp-grey-lighter)] z-20">
            <button
              onClick={handleCopy}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[var(--vamp-grey-dark)] hover:bg-[var(--vamp-cream)] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </button>
            <button
              onClick={shareTwitter}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[var(--vamp-grey-dark)] hover:bg-[var(--vamp-cream)] transition-colors"
            >
              <Twitter className="w-4 h-4" />
              Share on X
            </button>
            <button
              onClick={shareLinkedIn}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[var(--vamp-grey-dark)] hover:bg-[var(--vamp-cream)] transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              Share on LinkedIn
            </button>
          </div>
        </>
      )}
    </div>
  );
}
