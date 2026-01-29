// src/app/about/page.tsx
import Link from "next/link";
import { 
  Zap, 
  BookOpen, 
  Rocket, 
  Gift, 
  Compass, 
  Users,
  Star,
  ArrowRight,
  Heart,
  Sparkles,
  Target,
  TrendingUp
} from "lucide-react";

export const metadata = {
  title: "About | VAMP",
  description: "VAMP is the home for vibecoders - discover, learn, build, and get funded.",
};

const FEATURES = [
  {
    icon: BookOpen,
    title: "Learn from the Best",
    description: "Access a curated collection of vibecoding resources, tutorials, and expert insights from industry pioneers like Riley Brown and other leading AI-assisted developers.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Rocket,
    title: "Submit Your Projects",
    description: "Showcase your vibecoded creations to the community. Get feedback, earn upvotes, and build your reputation as a vibecoder.",
    color: "bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)]",
  },
  {
    icon: Gift,
    title: "Apply for Grants",
    description: "Submit your projects for grant funding opportunities. Get financial support to take your vibecoded ideas to the next level.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Star,
    title: "Sponsor Projects",
    description: "Support the vibecoding movement by creating grant programs. Fund innovative projects and help builders bring their visions to life.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Compass,
    title: "Discover Amazing Work",
    description: "Explore a growing library of vibecoded projects across categories like AI agents, productivity tools, design systems, and more.",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: Users,
    title: "Get Discovered",
    description: "Build your profile, climb the leaderboard, and get noticed by sponsors, collaborators, and the broader tech community.",
    color: "bg-yellow-100 text-yellow-700",
  },
];

const STATS = [
  { value: "1000+", label: "Vibecoders" },
  { value: "500+", label: "Projects" },
  { value: "$50K+", label: "Grants Awarded" },
  { value: "50+", label: "Sponsors" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 animate-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)] text-sm font-medium mb-6">
          <Zap className="w-4 h-4" />
          <span>About VAMP</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--vamp-black)] tracking-tight mb-6">
          The Home for <span className="vamp-gradient-text">Vibecoders</span>
        </h1>
        
        <p className="text-xl text-[var(--vamp-grey)] max-w-3xl mx-auto mb-8">
          VAMP is where AI-assisted builders come to learn, create, and thrive. 
          We're building the premier platform for the vibecoding movement — connecting 
          creators with resources, funding, and community.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/submit" className="vamp-btn vamp-btn-primary">
            <Rocket className="w-4 h-4" />
            Submit Your Project
          </Link>
          <Link href="/discover" className="vamp-btn vamp-btn-outline">
            <Compass className="w-4 h-4" />
            Explore Projects
          </Link>
        </div>
      </div>

      {/* What is Vibecoding */}
      <div className="vamp-card p-8 md:p-12 mb-16 animate-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-[var(--vamp-orange)] text-white">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--vamp-black)]">What is Vibecoding?</h2>
        </div>
        
        <div className="prose prose-lg max-w-none text-[var(--vamp-grey-dark)]">
          <p className="mb-4">
            Vibecoding is a revolutionary approach to software development where you build applications 
            using AI assistance — often without writing traditional code. Instead of memorizing syntax 
            and debugging semicolons, vibecoders describe what they want in natural language and let 
            AI tools like Cursor, Claude, and GPT generate the code.
          </p>
          <p className="mb-4">
            The term was coined by <strong>Andrej Karpathy</strong> and popularized by creators like 
            <strong> Riley Brown</strong>, who demonstrated that anyone — regardless of their coding 
            background — can build functional, beautiful applications by "vibing" with AI.
          </p>
          <p>
            At VAMP, we believe vibecoding is democratizing software development. We're here to 
            accelerate that movement by providing the tools, resources, and community that vibecoders 
            need to succeed.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {STATS.map((stat, index) => (
          <div 
            key={stat.label}
            className="vamp-card p-6 text-center animate-in"
            style={{ animationDelay: `${0.1 + index * 0.05}s` }}
          >
            <div className="text-3xl font-bold text-[var(--vamp-orange)] mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-[var(--vamp-grey)]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--vamp-black)] mb-3">
            What You Can Do on VAMP
          </h2>
          <p className="text-[var(--vamp-grey)] max-w-2xl mx-auto">
            Everything you need to grow as a vibecoder, all in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title}
                className="vamp-card p-6 hover:border-[var(--vamp-orange)] transition-all animate-in"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <div className={`inline-flex p-3 rounded-xl ${feature.color} mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg text-[var(--vamp-black)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[var(--vamp-grey)]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mission */}
      <div className="vamp-card p-8 md:p-12 mb-16 bg-gradient-to-br from-[var(--vamp-orange-10)] to-orange-50 border-[var(--vamp-orange-20)] animate-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-[var(--vamp-orange)] text-white">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--vamp-black)]">Our Mission</h2>
        </div>
        
        <p className="text-lg text-[var(--vamp-grey-dark)] mb-6">
          We're on a mission to make software development accessible to everyone. By providing 
          a platform where vibecoders can learn, build, share, and get funded, we're helping 
          create a future where anyone with an idea can bring it to life — no CS degree required.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-white/60">
            <TrendingUp className="w-5 h-5 text-[var(--vamp-orange)] mb-2" />
            <div className="font-medium text-[var(--vamp-black)]">Grow</div>
            <p className="text-sm text-[var(--vamp-grey)]">Level up your skills with curated resources</p>
          </div>
          <div className="p-4 rounded-lg bg-white/60">
            <Rocket className="w-5 h-5 text-[var(--vamp-orange)] mb-2" />
            <div className="font-medium text-[var(--vamp-black)]">Build</div>
            <p className="text-sm text-[var(--vamp-grey)]">Ship projects and get real feedback</p>
          </div>
          <div className="p-4 rounded-lg bg-white/60">
            <Gift className="w-5 h-5 text-[var(--vamp-orange)] mb-2" />
            <div className="font-medium text-[var(--vamp-black)]">Earn</div>
            <p className="text-sm text-[var(--vamp-grey)]">Get funded through grants and sponsorships</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center p-10 rounded-2xl bg-gradient-to-r from-[var(--vamp-orange)] to-orange-500 text-white animate-in">
        <Heart className="w-10 h-10 mx-auto mb-4 opacity-80" />
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Join the Vibecoding Movement</h2>
        <p className="text-white/80 mb-6 max-w-lg mx-auto">
          Whether you're a seasoned developer exploring AI tools or a complete beginner 
          with a dream, VAMP is your home.
        </p>
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[var(--vamp-orange)] font-medium hover:bg-white/90 transition-colors"
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Footer Links */}
      <div className="mt-12 pt-8 border-t border-[var(--vamp-grey-lighter)] text-center text-sm text-[var(--vamp-grey)]">
        <p className="mb-2">
          Have questions? Reach out to us at{" "}
          <a href="mailto:hello@vamp.dev" className="text-[var(--vamp-orange)] hover:underline">
            hello@vamp.dev
          </a>
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/privacy" className="hover:text-[var(--vamp-black)] transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-[var(--vamp-black)] transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
