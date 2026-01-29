// src/app/resources/articles/10-rules/page.tsx
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, User, CheckCircle, AlertTriangle, Zap } from "lucide-react";

export const metadata = {
  title: "10 Rules for Better AI-Generated Code | VAMP",
  description: "Essential best practices for vibecoding that will save you hours of debugging.",
};

export default function TenRulesArticle() {
  const rules = [
    {
      number: 1,
      title: "Start with a Clear Plan",
      description: "Before writing your first prompt, sketch out what you're building. A simple wireframe or bullet list prevents scope creep and keeps the AI focused."
    },
    {
      number: 2,
      title: "Use Small, Focused Prompts",
      description: "Don't ask for an entire application at once. Break features into small chunks. One component, one function, one feature at a time."
    },
    {
      number: 3,
      title: "Always Specify Your Stack",
      description: "Tell the AI exactly what technologies you're using. 'Next.js 14 with App Router, TypeScript, and Tailwind CSS' prevents incompatible suggestions."
    },
    {
      number: 4,
      title: "Test Early, Test Often",
      description: "Don't wait until you have 500 lines of generated code. Test each small addition before moving on. Catching bugs early saves hours later."
    },
    {
      number: 5,
      title: "Keep Context Windows Small",
      description: "AI models have limited context. When threads get long, start fresh with a summary of what you've built. This maintains code quality."
    },
    {
      number: 6,
      title: "Version Control Everything",
      description: "Commit frequently with meaningful messages. When AI generates bad code (it will), you can easily roll back to a working state."
    },
    {
      number: 7,
      title: "Read the Code You Accept",
      description: "Don't blindly accept generated code. Skim it to understand what it does. This catches obvious errors and teaches you patterns."
    },
    {
      number: 8,
      title: "Use Documentation Links",
      description: "When working with APIs or libraries, paste relevant documentation into your prompt. The AI produces more accurate code with reference material."
    },
    {
      number: 9,
      title: "Embrace the Debug Loop",
      description: "Error messages are your friend. Copy the full error, paste it into the AI, and ask for a fix. This loop is how vibecoding actually works."
    },
    {
      number: 10,
      title: "Know When to Code Manually",
      description: "Sometimes it's faster to write code yourself, especially for simple changes. Vibecoding is a tool, not a religion. Use the right tool for the job."
    }
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Link */}
      <Link
        href="/resources"
        className="inline-flex items-center gap-2 text-sm text-[var(--vamp-grey)] hover:text-[var(--vamp-black)] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Resources
      </Link>

      {/* Article Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
            Intermediate
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            Article
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--vamp-black)] mb-4">
          10 Rules for Better AI-Generated Code
        </h1>
        
        <p className="text-lg text-[var(--vamp-grey)] mb-6">
          Essential best practices for vibecoding that will save you hours of debugging and produce cleaner, more maintainable code.
        </p>

        <div className="flex items-center gap-4 text-sm text-[var(--vamp-grey)]">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            VAMP Team
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            6 min read
          </span>
        </div>
      </header>

      {/* Intro */}
      <div className="vamp-card p-6 bg-gradient-to-r from-[var(--vamp-orange-10)] to-orange-50 border-[var(--vamp-orange-20)] mb-10">
        <div className="flex items-start gap-3">
          <Zap className="w-6 h-6 text-[var(--vamp-orange)] flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-[var(--vamp-black)] mb-1">Why These Rules Matter</h3>
            <p className="text-[var(--vamp-grey-dark)]">
              After analyzing hundreds of vibecoding sessions, we've identified the patterns that separate successful projects from frustrating failures. Follow these rules to dramatically improve your results.
            </p>
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-6">
        {rules.map((rule) => (
          <div key={rule.number} className="vamp-card p-6 hover:border-[var(--vamp-orange)] transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--vamp-orange)] text-white flex items-center justify-center font-bold text-lg">
                {rule.number}
              </div>
              <div>
                <h3 className="font-semibold text-[var(--vamp-black)] text-lg mb-2">
                  {rule.title}
                </h3>
                <p className="text-[var(--vamp-grey-dark)]">
                  {rule.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Warning Box */}
      <div className="vamp-card p-6 border-l-4 border-yellow-500 bg-yellow-50 mt-10">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-[var(--vamp-black)] mb-1">Common Pitfall</h3>
            <p className="text-[var(--vamp-grey-dark)]">
              The biggest mistake new vibecoders make is trying to build too much at once. Resist the urge to prompt for entire features. Small, incremental progress always wins.
            </p>
          </div>
        </div>
      </div>

      {/* Conclusion */}
      <div className="mt-10 p-6 rounded-xl bg-[var(--vamp-cream)]">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-[var(--vamp-black)]">Your Action Plan</h3>
        </div>
        <p className="text-[var(--vamp-grey-dark)]">
          Print this list (or bookmark it). Before your next vibecoding session, review these rules. Pick one or two to focus on improving. Within a week, you'll notice significantly better results.
        </p>
      </div>

      {/* Back to Resources */}
      <div className="mt-12 pt-8 border-t border-[var(--vamp-grey-lighter)]">
        <Link
          href="/resources"
          className="vamp-btn vamp-btn-outline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Resources
        </Link>
      </div>
    </div>
  );
}
