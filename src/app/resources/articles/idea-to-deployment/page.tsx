// src/app/resources/articles/idea-to-deployment/page.tsx
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, User, Rocket, CheckCircle, ArrowRight, Globe, Code, Palette, Database } from "lucide-react";

export const metadata = {
  title: "From Idea to Deployment in One Day | VAMP",
  description: "A complete walkthrough of shipping your first vibecoded app from concept to live deployment.",
};

export default function IdeaToDeploymentArticle() {
  const steps = [
    {
      icon: Palette,
      title: "Morning: Plan & Design",
      time: "2-3 hours",
      tasks: [
        "Define your app's core purpose (one sentence)",
        "Sketch a rough wireframe on paper or Excalidraw",
        "List the 3 essential features for MVP",
        "Choose your tech stack (we recommend Next.js + Tailwind)"
      ]
    },
    {
      icon: Code,
      title: "Afternoon: Build",
      time: "3-4 hours",
      tasks: [
        "Set up your project from a template",
        "Build the UI components one by one",
        "Add interactivity and state management",
        "Implement your core feature"
      ]
    },
    {
      icon: Database,
      title: "Late Afternoon: Polish",
      time: "1-2 hours",
      tasks: [
        "Test on mobile and desktop",
        "Fix any obvious bugs",
        "Add loading states and error handling",
        "Review responsive design"
      ]
    },
    {
      icon: Globe,
      title: "Evening: Deploy",
      time: "30 minutes",
      tasks: [
        "Push code to GitHub",
        "Connect to Vercel",
        "Deploy with one click",
        "Share your live URL!"
      ]
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
          From Idea to Deployment in One Day
        </h1>
        
        <p className="text-lg text-[var(--vamp-grey)] mb-6">
          A complete walkthrough of shipping your first vibecoded app — from initial concept to live deployment on Vercel.
        </p>

        <div className="flex items-center gap-4 text-sm text-[var(--vamp-grey)]">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            VAMP Team
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            10 min read
          </span>
        </div>
      </header>

      {/* Intro */}
      <div className="vamp-card p-6 bg-gradient-to-r from-[var(--vamp-orange-10)] to-orange-50 border-[var(--vamp-orange-20)] mb-10">
        <div className="flex items-start gap-3">
          <Rocket className="w-6 h-6 text-[var(--vamp-orange)] flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-[var(--vamp-black)] mb-1">The One-Day Challenge</h3>
            <p className="text-[var(--vamp-grey-dark)]">
              This isn't about building the perfect app. It's about shipping something real in 24 hours. Constraints breed creativity, and deadlines create momentum. Let's go.
            </p>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none">
        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">Before You Start</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-6">
          Set yourself up for success. Clear your calendar, close unnecessary tabs, and commit to the challenge. You'll need: Cursor (or your preferred AI coding tool), a GitHub account, a Vercel account (free tier works), and 8-10 focused hours.
        </p>

        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">The Timeline</h2>
        <p className="text-[var(--vamp-grey-dark)] mb-6">
          Here's how to structure your day for maximum shipping velocity:
        </p>
      </article>

      {/* Timeline Steps */}
      <div className="space-y-6 my-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-[var(--vamp-grey-lighter)]" />
              )}
              <div className="vamp-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--vamp-orange)] text-white flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-[var(--vamp-black)] text-lg">
                        {step.title}
                      </h3>
                      <span className="text-sm text-[var(--vamp-grey)] bg-[var(--vamp-cream)] px-2 py-1 rounded">
                        {step.time}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {step.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start gap-2 text-[var(--vamp-grey-dark)]">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Tips */}
      <article className="prose prose-lg max-w-none">
        <h2 className="text-xl font-bold text-[var(--vamp-black)] mt-8 mb-4">Keys to Success</h2>
        
        <h3 className="text-lg font-semibold text-[var(--vamp-black)] mt-6 mb-2">Scope Ruthlessly</h3>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          Your app doesn't need user authentication, a database, or payment processing for v1. Pick the single most important feature and nail it. Everything else is a "nice to have" for version 2.
        </p>

        <h3 className="text-lg font-semibold text-[var(--vamp-black)] mt-6 mb-2">Use Templates</h3>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          Don't start from scratch. Use a Next.js starter template with Tailwind already configured. This saves an hour of setup time that's better spent on your actual features.
        </p>

        <h3 className="text-lg font-semibold text-[var(--vamp-black)] mt-6 mb-2">Ship Ugly First</h3>
        <p className="text-[var(--vamp-grey-dark)] mb-4">
          Get the functionality working before you polish the design. A working ugly app beats a beautiful broken one. You can always improve the UI in v1.1.
        </p>

        <h3 className="text-lg font-semibold text-[var(--vamp-black)] mt-6 mb-2">Celebrate the Win</h3>
        <p className="text-[var(--vamp-grey-dark)] mb-6">
          When you deploy, share it! Post on X, show your friends, submit it to VAMP. Most people never ship anything. You just joined the minority who do.
        </p>
      </article>

      {/* CTA */}
      <div className="vamp-card p-8 text-center mt-10 bg-gradient-to-r from-[var(--vamp-orange)] to-orange-500 text-white">
        <Rocket className="w-10 h-10 mx-auto mb-4 opacity-80" />
        <h3 className="text-xl font-bold mb-2">Ready to Ship?</h3>
        <p className="text-white/80 mb-6 max-w-md mx-auto">
          You've got the roadmap. Now pick a weekend, clear your schedule, and build something. Then submit it to VAMP and show the world what you made.
        </p>
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[var(--vamp-orange)] font-medium hover:bg-white/90 transition-colors"
        >
          Submit Your Project
          <ArrowRight className="w-4 h-4" />
        </Link>
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
