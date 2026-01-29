// src/app/discover/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { ProjectCard } from "@/components/projects/project-card";
import { TopVibecoders } from "@/components/discover/top-vibecoders";
import { CategoryFilter } from "@/components/discover/category-filter";
import { Compass, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Discover | VAMP",
  description: "Discover amazing vibecoded projects built with AI assistance",
};

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { value: "ALL", label: "All Projects", icon: "🌟" },
  { value: "ENGINEERING", label: "Engineering", icon: "⚙️" },
  { value: "LLMS", label: "LLMs", icon: "🤖" },
  { value: "PRODUCTIVITY", label: "Productivity", icon: "📈" },
  { value: "MARKETING", label: "Marketing & Sales", icon: "📣" },
  { value: "DESIGN", label: "Design", icon: "🎨" },
  { value: "SOCIAL", label: "Social", icon: "👥" },
  { value: "FINANCE", label: "Finance", icon: "💰" },
  { value: "AI_AGENTS", label: "AI Agents", icon: "🤖" },
  { value: "OTHER", label: "Other", icon: "✨" },
];

interface DiscoverPageProps {
  searchParams: { category?: string; sort?: string };
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;
  
  const selectedCategory = searchParams.category || "ALL";
  const sortBy = searchParams.sort || "trending";

  // Build where clause
  const whereClause: any = {
    status: "PUBLISHED",
  };
  
  if (selectedCategory !== "ALL") {
    whereClause.category = selectedCategory;
  }

  // Determine sort order
  let orderBy: any;
  switch (sortBy) {
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "mostUpvoted":
      orderBy = { upvoteCount: "desc" };
      break;
    case "trending":
    default:
      orderBy = [{ upvoteCount: "desc" }, { createdAt: "desc" }];
  }

  // Fetch projects
  const projects = await prisma.project.findMany({
    where: whereClause,
    include: {
      user: {
        select: { id: true, name: true, image: true, username: true },
      },
      upvotes: currentUserId
        ? { where: { userId: currentUserId }, select: { id: true } }
        : false,
    },
    orderBy,
    take: 30,
  });

  // Fetch trending projects (top 5 by upvotes in last 7 days)
  const trendingProjects = await prisma.project.findMany({
    where: {
      status: "PUBLISHED",
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    include: {
      user: {
        select: { id: true, name: true, image: true, username: true },
      },
      upvotes: currentUserId
        ? { where: { userId: currentUserId }, select: { id: true } }
        : false,
    },
    orderBy: { upvoteCount: "desc" },
    take: 5,
  });

  // Fetch top vibecoders
  const topVibecoders = await prisma.user.findMany({
    where: {
      role: "VIBECODER",
      projects: {
        some: { status: "PUBLISHED" },
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
      username: true,
      projects: {
        where: { status: "PUBLISHED" },
        select: { upvoteCount: true },
      },
    },
    take: 20,
  });

  // Calculate vibe scores and sort
  const vibecodersWithScores = topVibecoders
    .map((user) => ({
      ...user,
      vibeScore: user.projects.reduce((sum, p) => sum + p.upvoteCount, 0),
      projectCount: user.projects.length,
    }))
    .sort((a, b) => b.vibeScore - a.vibeScore)
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 animate-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)]">
            <Compass className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--vamp-black)]">Discover</h1>
        </div>
        <p className="text-[var(--vamp-grey)]">
          Explore amazing projects built with AI assistance
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Trending Section */}
          {trendingProjects.length > 0 && selectedCategory === "ALL" && (
            <section className="mb-10 animate-in">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[var(--vamp-orange)]" />
                <h2 className="font-semibold text-[var(--vamp-black)]">Trending This Week</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingProjects.slice(0, 3).map((project, index) => (
                  <div key={project.id} className="animate-in" style={{ animationDelay: `${0.1 * index}s` }}>
                    <ProjectCard
                      project={project}
                      rank={index + 1}
                      userUpvoted={
                        currentUserId && project.upvotes
                          ? project.upvotes.length > 0
                          : false
                      }
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Category Filter */}
          <CategoryFilter 
            categories={CATEGORIES} 
            selected={selectedCategory}
            sortBy={sortBy}
          />

          {/* Projects Grid */}
          <section className="mt-6">
            {projects.length === 0 ? (
              <div className="vamp-card p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--vamp-cream)] mb-4">
                  <Sparkles className="w-8 h-8 text-[var(--vamp-grey-light)]" />
                </div>
                <h3 className="font-semibold text-[var(--vamp-black)] mb-2">
                  No projects found
                </h3>
                <p className="text-sm text-[var(--vamp-grey)] mb-4">
                  {selectedCategory !== "ALL"
                    ? `No projects in this category yet. Be the first to submit one!`
                    : "No projects yet. Be the first to submit one!"}
                </p>
                <Link href="/submit" className="vamp-btn vamp-btn-primary">
                  Submit Your Project
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {projects.map((project, index) => (
                  <div 
                    key={project.id} 
                    className="animate-in"
                    style={{ animationDelay: `${0.05 * index}s` }}
                  >
                    <ProjectCard
                      project={project}
                      userUpvoted={
                        currentUserId && project.upvotes
                          ? project.upvotes.length > 0
                          : false
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-80 space-y-6">
          {/* Top Vibecoders */}
          <TopVibecoders vibecoders={vibecodersWithScores} />

          {/* Submit CTA */}
          <div className="vamp-card p-6 bg-gradient-to-br from-[var(--vamp-orange)] to-orange-500 text-white">
            <h3 className="font-semibold mb-2">Ready to share?</h3>
            <p className="text-sm text-white/80 mb-4">
              Submit your AI-powered project and get discovered by the community.
            </p>
            <Link
              href="/submit"
              className="block w-full py-2 px-4 rounded-lg bg-white text-[var(--vamp-orange)] font-medium text-center hover:bg-white/90 transition-colors"
            >
              Submit Project
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
