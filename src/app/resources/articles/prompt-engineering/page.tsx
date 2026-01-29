// src/app/resources/articles/prompt-engineering/page.tsx
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, User, Lightbulb, Code, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Prompt Engineering for Vibecoding | VAMP",
  description: "Master the art of writing effective prompts that generate better code.",
};

export default function PromptEngineeringArticle() {
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
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            Beginner
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            Article
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--vamp-black)] mb-4">
          Prompt Engineering for Vibecoding
        </h1>
        
        <p className="text-lg text-[var(--vamp-grey)] mb-6">
          Master the art of writing effective prompts that generate better code. Learn the patterns and techniques used by top vibecoders.
        </p>

        <div className="flex items-center gap-4 text-sm text-[var(--vamp-grey)]">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            VAMP Team
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            8 min read
          </span>
        </div>
      </header>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none">
        <div className="vamp-card p-8 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-[var(--vamp-orange)] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-[var(--vamp-black)] mb-1">Key Takeaway</h3>
              <p className="text-[var(--vamp-grey)]">
                The quality of your AI-generated code is directly proportional to the quality of your prompts. Better prompts = better code.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">Why Prompt Engineering Matters</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          When vibecoding, your prompts are your primary tool for communicating with AI. Unlike traditional coding where you write exact instructions, vibecoding requires you to describe what you want in natural language. The AI then interprets your intent and generates code accordingly.
        </p>
        <p className="text-[var(--vamp-grey-dark)] mb-6">
          Poor prompts lead to code that misses the mark, requires extensive debugging, or simply doesn't work. Great prompts produce clean, functional code that often works on the first try.
        </p>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">The Anatomy of a Great Prompt</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          Every effective vibecoding prompt contains three essential elements:
        </p>
        <ul className="list-disc pl-6 text-[var(--vamp-grey-dark)] space-y-2 mb-6">
          <li><strong>Context:</strong> What are you building? What's the current state of your project?</li>
          <li><strong>Intent:</strong> What specific feature or change do you want?</li>
          <li><strong>Constraints:</strong> Any specific technologies, patterns, or requirements to follow?</li>
        </ul>

        <div className="vamp-card p-6 bg-[var(--vamp-cream)] mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-5 h-5 text-[var(--vamp-orange)]" />
            <h4 className="font-semibold text-[var(--vamp-black)]">Example Prompt</h4>
          </div>
          <p className="text-[var(--vamp-grey-dark)] italic">
            "I'm building a Next.js app with Tailwind CSS. Create a responsive navigation component that includes a logo on the left, navigation links in the center, and a login button on the right. On mobile, it should collapse into a hamburger menu. Use the existing color scheme from my globals.css."
          </p>
        </div>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">Five Pro Tips for Better Prompts</h2>
        
        <h3 className="text-lg font-semibold text-[var(--vamp-black)] mt-6 mb-2">1. Be Specific, Not Vague</h3>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          Instead of "make it look better," say "add rounded corners, a subtle shadow, and increase the padding to 24px." Specific instructions lead to predictable results.
        </p>

        <h3 className="text-lg font-semibold text-[var(--vamp-black)] mt-6 mb-2">2. Provide Examples</h3>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          Reference existing designs, components, or patterns. "Style it like the cards on Stripe's pricing page" gives the AI a clear visual target.
        </p>

        <h3 className="text-lg font-semibold text-[var(--vamp-black)] mt-6 mb-2">3. Break Down Complex Tasks</h3>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          Don't ask for an entire feature at once. Build incrementally: first the structure, then the styling, then the interactivity.
        </p>

        <h3 className="text-lg font-semibold text-[var(--vamp-black)] mt-6 mb-2">4. Specify the Tech Stack</h3>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          Always mention your framework, libraries, and any relevant versions. This prevents the AI from suggesting incompatible code.
        </p>

        <h3 className="text-lg font-semibold text-[var(--vamp-black)] mt-6 mb-2">5. Include Error Messages</h3>
        <p className="text-[var(--vamp-grey-dark)] mb-6">
          When debugging, paste the actual error message. The AI can often identify the issue immediately from the error text.
        </p>

        <div className="vamp-card p-6 border-l-4 border-[var(--vamp-orange)] mb-8">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-[var(--vamp-orange)]" />
            <h4 className="font-semibold text-[var(--vamp-black)]">Remember</h4>
          </div>
          <p className="text-[var(--vamp-grey-dark)]">
            Vibecoding is a conversation. If the first result isn't perfect, iterate. Refine your prompt, add more context, or ask for specific changes. Each interaction teaches you what works best.
          </p>
        </div>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">Start Practicing Today</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-6">
          The best way to improve your prompt engineering is through practice. Start with simple components, pay attention to what works, and gradually tackle more complex features. Before long, you'll develop an intuition for crafting prompts that generate exactly what you need.
        </p>
      </article>

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
