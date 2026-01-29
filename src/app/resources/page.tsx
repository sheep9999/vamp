// src/app/resources/page.tsx
import Link from "next/link";
import { 
  BookOpen, 
  Video, 
  Star, 
  GraduationCap, 
  Users, 
  ExternalLink,
  Play,
  FileText,
  Sparkles,
  Crown,
  Zap,
  Rocket
} from "lucide-react";

export const metadata = {
  title: "Resources | VAMP",
  description: "Learn vibecoding from the best. Tutorials, guides, and expert directory.",
};

// Tutorial data - Top 3 are videos, Bottom 3 are articles
const TUTORIALS = [
  {
    id: 1,
    title: "Complete Guide to Cursor For Non-Coders",
    description: "The most comprehensive vibecoding tutorial - 250 minutes covering Cursor basics, 4 complete projects, deployment to Vercel, and database integration.",
    difficulty: "Beginner",
    type: "Video",
    duration: "250 min",
    author: "Riley Brown",
    url: "https://www.youtube.com/watch?v=2FJlhoDYNPE",
    isExternal: true,
  },
  {
    id: 2,
    title: "Building Apps with Zero Coding Knowledge",
    description: "Learn how to build complete applications from scratch using only AI assistance. Perfect for absolute beginners who want to start vibecoding.",
    difficulty: "Beginner",
    type: "Video",
    duration: "45 min",
    author: "Riley Brown",
    url: "https://www.youtube.com/watch?v=p-KM4P-6Hmg",
    isExternal: true,
  },
  {
    id: 3,
    title: "The New Cursor Agent Tutorial",
    description: "Deep dive into Cursor's powerful Agent mode - learn how to let AI handle entire development workflows autonomously.",
    difficulty: "Intermediate",
    type: "Video",
    duration: "30 min",
    author: "Riley Brown",
    url: "https://www.youtube.com/watch?v=faezjTHA5SU",
    isExternal: true,
  },
  {
    id: 4,
    title: "Prompt Engineering for Vibecoding",
    description: "Master the art of writing effective prompts that generate better code. Learn patterns and techniques used by top vibecoders.",
    difficulty: "Beginner",
    type: "Article",
    duration: "8 min read",
    author: "VAMP Team",
    url: "/resources/articles/prompt-engineering",
    isExternal: false,
  },
  {
    id: 5,
    title: "10 Rules for Better AI-Generated Code",
    description: "Essential best practices for vibecoding that will save you hours of debugging and produce cleaner, more maintainable code.",
    difficulty: "Intermediate",
    type: "Article",
    duration: "6 min read",
    author: "VAMP Team",
    url: "/resources/articles/10-rules",
    isExternal: false,
  },
  {
    id: 6,
    title: "From Idea to Deployment in One Day",
    description: "A complete walkthrough of shipping your first vibecoded app - from initial concept to live deployment on Vercel.",
    difficulty: "Intermediate",
    type: "Article",
    duration: "10 min read",
    author: "VAMP Team",
    url: "/resources/articles/idea-to-deployment",
    isExternal: false,
  },
];

// Expert data
const EXPERTS = [
  {
    name: "Riley Brown",
    tagline: "The Vibe Architect",
    handle: "rileybrownai",
    avatar: "/experts/riley-brown.jpg",
    url: "https://www.youtube.com/@rileybrownai",
    specialty: "Vibecoding Pioneer",
    platform: "youtube",
  },
  {
    name: "Andrej Karpathy",
    tagline: "The AI Visionary",
    handle: "karpathy",
    avatar: "/experts/andrej-karpathy.jpg",
    url: "https://x.com/karpathy",
    specialty: "Deep Learning",
    platform: "x",
  },
  {
    name: "Pietro Schirano",
    tagline: "Design-First Builder",
    handle: "skirano",
    avatar: "/experts/pietro-schirano.jpg",
    url: "https://x.com/skirano",
    specialty: "AI + Design",
    platform: "x",
  },
  {
    name: "Mckay Wrigley",
    tagline: "Open Source Agentic Dev",
    handle: "mckaywrigley",
    avatar: "/experts/mckay-wrigley.jpg",
    url: "https://x.com/mckaywrigley",
    specialty: "AI Tools",
    platform: "x",
  },
  {
    name: "Linus Ekenstam",
    tagline: "AI Product Specialist",
    handle: "LinusEkenstam",
    avatar: "/experts/linus-ekenstam.jpg",
    url: "https://x.com/LinusEkenstam",
    specialty: "Product + AI",
    platform: "x",
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 text-green-700";
    case "Intermediate":
      return "bg-yellow-100 text-yellow-700";
    case "Advanced":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12 animate-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)] text-sm font-medium mb-4">
          <BookOpen className="w-4 h-4" />
          <span>Learn & Grow</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--vamp-black)] tracking-tight mb-3">
          Resources & <span className="vamp-gradient-text">Academy</span>
        </h1>
        
        <p className="text-[var(--vamp-grey)] max-w-2xl mx-auto">
          Master vibecoding with tutorials from industry experts. Learn to build 
          amazing projects using AI-assisted development.
        </p>
      </div>

      {/* ==================== */}
      {/* VIBECODER ACADEMY */}
      {/* ==================== */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8 animate-in">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[var(--vamp-orange)] to-orange-500 text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--vamp-black)]">Vibecoder Academy</h2>
            <p className="text-sm text-[var(--vamp-grey)]">Curated tutorials from Riley Brown & more</p>
          </div>
        </div>

        {/* Featured Video */}
        <div className="vamp-card p-6 mb-8 animate-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Video Embed Placeholder */}
            <div className="lg:w-2/3">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--vamp-black)] group">
                {/* Placeholder Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--vamp-orange)] to-orange-600 opacity-20" />
                
                {/* Play Button Overlay */}
                <a 
                  href="https://www.youtube.com/@rileybrownai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex flex-col items-center justify-center text-white group-hover:scale-105 transition-transform"
                >
                  <div className="w-20 h-20 rounded-full bg-[var(--vamp-orange)] flex items-center justify-center mb-4 shadow-lg group-hover:bg-orange-500 transition-colors">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                  <span className="text-lg font-semibold">Watch on YouTube</span>
                  <span className="text-sm text-white/70">@rileybrownai</span>
                </a>

                {/* Corner Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  FEATURED
                </div>
              </div>
            </div>

            {/* Featured Info */}
            <div className="lg:w-1/3 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-[var(--vamp-orange)] fill-current" />
                <span className="text-sm font-medium text-[var(--vamp-orange)]">Featured Creator</span>
              </div>
              
              <h3 className="text-xl font-bold text-[var(--vamp-black)] mb-2">
                Riley Brown
              </h3>
              
              <p className="text-[var(--vamp-grey)] mb-4">
                The original vibecoder. Riley pioneered the movement of building 
                complete applications with AI assistance. His tutorials break down 
                complex concepts into digestible, actionable content.
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-[var(--vamp-cream)] text-[var(--vamp-grey-dark)] text-sm">
                  🚀 50+ Tutorials
                </span>
                <span className="px-3 py-1 rounded-full bg-[var(--vamp-cream)] text-[var(--vamp-grey-dark)] text-sm">
                  ⚡ Weekly Updates
                </span>
              </div>

              <a
                href="https://www.youtube.com/@rileybrownai"
                target="_blank"
                rel="noopener noreferrer"
                className="vamp-btn vamp-btn-primary w-fit"
              >
                <Video className="w-4 h-4" />
                Subscribe on YouTube
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Tutorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TUTORIALS.map((tutorial, index) => {
            const CardWrapper = tutorial.isExternal ? 'a' : Link;
            const cardProps = tutorial.isExternal 
              ? { href: tutorial.url, target: "_blank", rel: "noopener noreferrer" }
              : { href: tutorial.url, target: "_blank" };
            
            return (
              <CardWrapper
                key={tutorial.id}
                {...cardProps}
                className="vamp-card p-5 group hover:border-[var(--vamp-orange)] transition-all animate-in"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    tutorial.type === "Video" 
                      ? "bg-red-100 text-red-600" 
                      : "bg-blue-100 text-blue-600"
                  }`}>
                    {tutorial.type === "Video" ? (
                      <Video className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                    {tutorial.difficulty}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-semibold text-[var(--vamp-black)] mb-2 group-hover:text-[var(--vamp-orange)] transition-colors line-clamp-2">
                  {tutorial.title}
                </h3>
                
                <p className="text-sm text-[var(--vamp-grey)] mb-4 line-clamp-2">
                  {tutorial.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--vamp-grey-lighter)]">
                  <div className="flex items-center gap-2 text-xs text-[var(--vamp-grey)]">
                    <span>{tutorial.type}</span>
                    <span>•</span>
                    <span>{tutorial.duration}</span>
                  </div>
                  <div className="text-[var(--vamp-orange)] opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </CardWrapper>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-8">
          <a
            href="https://www.youtube.com/@rileybrownai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[var(--vamp-orange)] font-medium hover:underline"
          >
            View all tutorials on YouTube
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ==================== */}
      {/* VIBE EXPERTS */}
      {/* ==================== */}
      <section>
        <div className="flex items-center gap-3 mb-8 animate-in">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--vamp-black)]">Vibe Experts</h2>
            <p className="text-sm text-[var(--vamp-grey)]">Learn from the best in AI-assisted development</p>
          </div>
        </div>

        {/* Expert Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {EXPERTS.map((expert, index) => (
            <a
              key={expert.handle}
              href={expert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="vamp-card p-5 text-center group hover:border-[var(--vamp-orange)] hover:-translate-y-1 transition-all animate-in"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <img
                  src={expert.avatar}
                  alt={expert.name}
                  className="w-20 h-20 rounded-full ring-4 ring-[var(--vamp-cream)] group-hover:ring-[var(--vamp-orange-20)] transition-all object-cover"
                />
                {index === 0 && (
                  <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-[var(--vamp-orange)] text-white">
                    <Crown className="w-3 h-3" />
                  </div>
                )}
              </div>

              {/* Name & Tagline */}
              <h3 className="font-semibold text-[var(--vamp-black)] group-hover:text-[var(--vamp-orange)] transition-colors">
                {expert.name}
              </h3>
              
              <p className="text-sm text-[var(--vamp-orange)] font-medium mb-1">
                {expert.tagline}
              </p>
              
              <p className="text-xs text-[var(--vamp-grey)] mb-3">
                {expert.specialty}
              </p>

              {/* Handle - YouTube or X */}
              <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--vamp-cream)] text-[var(--vamp-grey-dark)] text-sm group-hover:bg-[var(--vamp-orange-10)] group-hover:text-[var(--vamp-orange)] transition-colors">
                {expert.platform === "youtube" ? (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    @{expert.handle}
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    @{expert.handle}
                  </>
                )}
              </div>
            </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-[var(--vamp-orange)] to-orange-500 text-white text-center animate-in">
          <Sparkles className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h3 className="text-2xl font-bold mb-2">Ready to Start Vibecoding?</h3>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Join thousands of developers building the future with AI assistance. 
            Submit your first project today!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-[var(--vamp-orange)] font-medium hover:bg-white/90 transition-colors"
            >
              <Rocket className="w-4 h-4" />
              Submit Your Project
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/20 text-white font-medium hover:bg-white/30 transition-colors"
            >
              <Zap className="w-4 h-4" />
              Explore Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
