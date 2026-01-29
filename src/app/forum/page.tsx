// src/app/forum/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { TopVibecoders } from "@/components/discover/top-vibecoders";
import { ThreadCard } from "@/components/forum/thread-card";
import { 
  MessageSquare, 
  Plus, 
  TrendingUp,
  Sparkles,
  HelpCircle,
  Megaphone,
  Users,
  Zap
} from "lucide-react";

export const metadata = {
  title: "Forum | VAMP",
  description: "Join the vibecoding community discussion",
};

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { 
    value: "GENERAL", 
    label: "General", 
    description: "General discussions about vibecoding",
    icon: MessageSquare,
    color: "bg-blue-100 text-blue-600"
  },
  { 
    value: "VIBE_CHECKS", 
    label: "Vibe Checks", 
    description: "Share your vibe, get feedback from the community",
    icon: Sparkles,
    color: "bg-purple-100 text-purple-600"
  },
  { 
    value: "SHOW_TELL", 
    label: "Show & Tell", 
    description: "Show off your latest projects and creations",
    icon: Megaphone,
    color: "bg-green-100 text-green-600"
  },
  { 
    value: "TECHNICAL", 
    label: "Technical Help", 
    description: "Get help with technical challenges",
    icon: HelpCircle,
    color: "bg-orange-100 text-orange-600"
  },
];

interface ForumPageProps {
  searchParams: { category?: string };
}

export default async function ForumPage({ searchParams }: ForumPageProps) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;
  const selectedCategory = searchParams.category;

  // Build where clause
  const whereClause: any = {};
  if (selectedCategory && selectedCategory !== "ALL") {
    whereClause.category = selectedCategory;
  }

  // Fetch threads
  const threads = await prisma.forumThread.findMany({
    where: whereClause,
    include: {
      user: {
        select: { id: true, name: true, image: true, username: true },
      },
      upvotes: currentUserId
        ? { where: { userId: currentUserId }, select: { id: true } }
        : false,
      _count: {
        select: { replies: true },
      },
    },
    orderBy: [
      { isPinned: "desc" },
      { upvoteCount: "desc" },
      { createdAt: "desc" },
    ],
    take: 30,
  });

  // Fetch category counts
  const categoryCounts = await prisma.forumThread.groupBy({
    by: ["category"],
    _count: { id: true },
  });

  const countMap = Object.fromEntries(
    categoryCounts.map((c) => [c.category, c._count.id])
  );

  // Fetch top vibecoders for sidebar
  const topVibecoders = await prisma.user.findMany({
    where: {
      role: "VIBECODER",
      projects: { some: { status: "PUBLISHED" } },
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-in">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)]">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--vamp-black)]">Community Forum</h1>
          </div>
          <p className="text-[var(--vamp-grey)]">
            Discuss, share, and learn with fellow vibecoders
          </p>
        </div>

        {session && (
          <Link
            href="/forum/new"
            className="vamp-btn vamp-btn-primary"
          >
            <Plus className="w-4 h-4" />
            Start Thread
          </Link>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Category Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {CATEGORIES.map((cat, index) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.value;
              const count = countMap[cat.value] || 0;
              
              return (
                <Link
                  key={cat.value}
                  href={isActive ? "/forum" : `/forum?category=${cat.value}`}
                  className={`vamp-card p-4 text-center group hover:border-[var(--vamp-orange)] transition-all animate-in ${
                    isActive ? "border-[var(--vamp-orange)] bg-[var(--vamp-orange-10)]" : ""
                  }`}
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  <div className={`inline-flex p-2.5 rounded-xl ${cat.color} mb-2 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-medium text-sm text-[var(--vamp-black)]">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-[var(--vamp-grey)] mt-0.5">
                    {count} {count === 1 ? "thread" : "threads"}
                  </p>
                </Link>
              );
            })}
          </div>

          {/* Threads Header */}
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[var(--vamp-orange)]" />
            <h2 className="font-semibold text-[var(--vamp-black)]">
              {selectedCategory 
                ? CATEGORIES.find(c => c.value === selectedCategory)?.label + " Threads"
                : "Trending Threads"}
            </h2>
            {selectedCategory && (
              <Link
                href="/forum"
                className="ml-auto text-sm text-[var(--vamp-orange)] hover:underline"
              >
                View All
              </Link>
            )}
          </div>

          {/* Threads List */}
          {threads.length === 0 ? (
            <div className="vamp-card p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--vamp-cream)] mb-4">
                <MessageSquare className="w-8 h-8 text-[var(--vamp-grey-light)]" />
              </div>
              <h3 className="font-semibold text-[var(--vamp-black)] mb-2">
                No threads yet
              </h3>
              <p className="text-sm text-[var(--vamp-grey)] mb-4">
                Be the first to start a discussion!
              </p>
              {session && (
                <Link href="/forum/new" className="vamp-btn vamp-btn-primary">
                  <Plus className="w-4 h-4" />
                  Start the First Thread
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {threads.map((thread, index) => (
                <div 
                  key={thread.id} 
                  className="animate-in"
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  <ThreadCard
                    thread={{
                      id: thread.id,
                      title: thread.title,
                      category: thread.category,
                      upvoteCount: thread.upvoteCount,
                      replyCount: thread._count.replies,
                      viewCount: thread.viewCount,
                      isPinned: thread.isPinned,
                      createdAt: thread.createdAt,
                      user: thread.user,
                    }}
                    userUpvoted={
                      currentUserId && thread.upvotes
                        ? thread.upvotes.length > 0
                        : false
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:w-80 space-y-6">
          {/* Top Vibecoders */}
          <TopVibecoders vibecoders={vibecodersWithScores} />

          {/* Forum Stats */}
          <div className="vamp-card p-5">
            <h3 className="font-semibold text-[var(--vamp-black)] mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[var(--vamp-orange)]" />
              Forum Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-[var(--vamp-cream)]">
                <div className="text-xl font-bold text-[var(--vamp-black)]">
                  {threads.length}
                </div>
                <div className="text-xs text-[var(--vamp-grey)]">Threads</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-[var(--vamp-cream)]">
                <div className="text-xl font-bold text-[var(--vamp-black)]">
                  {threads.reduce((sum, t) => sum + t._count.replies, 0)}
                </div>
                <div className="text-xs text-[var(--vamp-grey)]">Replies</div>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="vamp-card p-5">
            <h3 className="font-semibold text-[var(--vamp-black)] mb-3">Community Guidelines</h3>
            <ul className="text-sm text-[var(--vamp-grey)] space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[var(--vamp-orange)]">•</span>
                Be respectful and constructive
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--vamp-orange)]">•</span>
                Share your vibecoding journey
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--vamp-orange)]">•</span>
                Help others learn and grow
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--vamp-orange)]">•</span>
                No spam or self-promotion
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
