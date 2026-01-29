// src/app/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { Zap, TrendingUp, Flame, Clock, Sparkles, CheckCircle } from "lucide-react";
import { ProjectList } from "@/components/projects/project-list";

// Loading skeleton for projects
function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="vamp-card p-5 animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="w-[60px] h-[70px] rounded-lg bg-[var(--vamp-grey-lighter)]" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-[var(--vamp-grey-lighter)] rounded w-3/4" />
              <div className="h-4 bg-[var(--vamp-grey-lighter)] rounded w-full" />
              <div className="h-4 bg-[var(--vamp-grey-lighter)] rounded w-1/2" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-[var(--vamp-grey-lighter)] rounded-full" />
                <div className="h-6 w-12 bg-[var(--vamp-grey-lighter)] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Success toast component
function SuccessToast() {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500 text-white shadow-lg">
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">Project submitted successfully!</span>
      </div>
    </div>
  );
}

interface HomePageProps {
  searchParams: { submitted?: string };
}

export default function HomePage({ searchParams }: HomePageProps) {
  const justSubmitted = searchParams.submitted === "true";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Toast */}
      {justSubmitted && <SuccessToast />}

      {/* Hero Section */}
      <section className="text-center py-16 animate-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)] text-sm font-medium mb-6">
          <Flame className="w-4 h-4" />
          <span>The vibecoding revolution is here</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-[var(--vamp-black)] tracking-tight mb-4">
          Ship faster with{" "}
          <span className="vamp-gradient-text">VAMP</span>
        </h1>
        
        <p className="text-lg text-[var(--vamp-grey)] max-w-2xl mx-auto mb-8">
          Discover AI-assisted projects, connect with makers, and find grants 
          for your next big idea. The community for rapid prototyping and 
          experimental development.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/submit" className="vamp-btn vamp-btn-primary px-6 py-3">
            <Zap className="w-4 h-4" />
            Submit Your Project
          </Link>
          <Link href="/discover" className="vamp-btn vamp-btn-outline px-6 py-3">
            Explore Projects
          </Link>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--vamp-orange)]" />
            <h2 className="vamp-heading">Trending Today</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-[var(--vamp-grey)]">
              <Clock className="w-4 h-4" />
              <span>Updated hourly</span>
            </div>
            <Link 
              href="/discover" 
              className="text-sm font-medium text-[var(--vamp-orange)] hover:underline"
            >
              View all →
            </Link>
          </div>
        </div>

        {/* Dynamic Project List */}
        <Suspense fallback={<ProjectsSkeleton />}>
          <ProjectList limit={6} sortBy="trending" />
        </Suspense>
      </section>

      {/* CTA Section */}
      <section className="py-12 mt-8">
        <div className="vamp-card p-8 md:p-12 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--vamp-orange-10)] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--vamp-orange-10)] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--vamp-orange)] text-white mb-6">
              <Sparkles className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--vamp-black)] mb-3">
              Built something with AI?
            </h2>
            <p className="text-[var(--vamp-grey)] max-w-md mx-auto mb-6">
              Join hundreds of makers sharing their vibecoded projects. 
              Get feedback, find collaborators, and inspire others.
            </p>
            
            <Link href="/submit" className="vamp-btn vamp-btn-primary px-8 py-3 text-base">
              <Zap className="w-5 h-5" />
              Submit Your Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
