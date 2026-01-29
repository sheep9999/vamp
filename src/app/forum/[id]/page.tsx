// src/app/forum/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TopVibecoders } from "@/components/discover/top-vibecoders";
import { ThreadUpvoteButton } from "@/components/forum/thread-upvote-button";
import { ThreadReplySection } from "@/components/forum/thread-reply-section";
import { 
  ArrowLeft, 
  MessageSquare, 
  Eye, 
  Calendar,
  Sparkles,
  HelpCircle,
  Megaphone,
  Pin,
  Zap
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface ThreadDetailPageProps {
  params: { id: string };
}

const CATEGORY_STYLES: Record<string, { label: string; color: string; icon: any }> = {
  GENERAL: { label: "General", color: "bg-blue-100 text-blue-700", icon: MessageSquare },
  VIBE_CHECKS: { label: "Vibe Check", color: "bg-purple-100 text-purple-700", icon: Sparkles },
  SHOW_TELL: { label: "Show & Tell", color: "bg-green-100 text-green-700", icon: Megaphone },
  TECHNICAL: { label: "Technical", color: "bg-orange-100 text-orange-700", icon: HelpCircle },
};

export async function generateMetadata({ params }: ThreadDetailPageProps) {
  const thread = await prisma.forumThread.findUnique({
    where: { id: params.id },
    select: { title: true },
  });

  if (!thread) {
    return { title: "Thread Not Found" };
  }

  return {
    title: `${thread.title} | VAMP Forum`,
  };
}

export default async function ThreadDetailPage({ params }: ThreadDetailPageProps) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const thread = await prisma.forumThread.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          username: true,
          bio: true,
          _count: {
            select: {
              projects: { where: { status: "PUBLISHED" } },
            },
          },
        },
      },
      upvotes: currentUserId
        ? { where: { userId: currentUserId }, select: { id: true } }
        : false,
      replies: {
        where: { parentId: null },
        include: {
          user: {
            select: { id: true, name: true, image: true, username: true },
          },
          replies: {
            include: {
              user: {
                select: { id: true, name: true, image: true, username: true },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      _count: {
        select: { replies: true },
      },
    },
  });

  if (!thread) {
    notFound();
  }

  // Increment view count
  prisma.forumThread.update({
    where: { id: params.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  const userUpvoted = currentUserId && thread.upvotes
    ? thread.upvotes.length > 0
    : false;

  const categoryStyle = CATEGORY_STYLES[thread.category] || CATEGORY_STYLES.GENERAL;
  const CategoryIcon = categoryStyle.icon;

  // Fetch user's vibe score
  const userProjects = await prisma.project.findMany({
    where: { userId: thread.user.id, status: "PUBLISHED" },
    select: { upvoteCount: true },
  });
  const userVibeScore = userProjects.reduce((sum, p) => sum + p.upvoteCount, 0);

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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <Link
        href="/forum"
        className="inline-flex items-center gap-2 text-sm text-[var(--vamp-grey)] hover:text-[var(--vamp-black)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Forum
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Thread Header */}
          <div className="vamp-card p-6 md:p-8 mb-6 animate-in">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {thread.isPinned && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--vamp-orange)] text-white text-xs font-medium">
                  <Pin className="w-3 h-3" />
                  Pinned
                </span>
              )}
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${categoryStyle.color}`}>
                <CategoryIcon className="w-3 h-3" />
                {categoryStyle.label}
              </span>
            </div>

            {/* Title & Upvote */}
            <div className="flex items-start gap-4 mb-6">
              <ThreadUpvoteButton
                threadId={thread.id}
                initialCount={thread.upvoteCount}
                initialUpvoted={userUpvoted}
                size="lg"
              />
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--vamp-black)] flex-1">
                {thread.title}
              </h1>
            </div>

            {/* Author & Meta */}
            <div className="flex items-center gap-4 pb-6 border-b border-[var(--vamp-grey-lighter)]">
              <Link
                href={`/${thread.user.username}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                {thread.user.image ? (
                  <img
                    src={thread.user.image}
                    alt={thread.user.name || "User"}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[var(--vamp-orange)] flex items-center justify-center text-white font-bold">
                    {thread.user.name?.charAt(0) || "?"}
                  </div>
                )}
                <div>
                  <div className="font-medium text-[var(--vamp-black)]">
                    {thread.user.name}
                  </div>
                  <div className="text-sm text-[var(--vamp-grey)]">
                    @{thread.user.username}
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-4 ml-auto text-sm text-[var(--vamp-grey)]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {thread.viewCount} views
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {thread._count.replies} replies
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="pt-6 prose prose-sm max-w-none text-[var(--vamp-grey-dark)]">
              {thread.content.split("\n").map((paragraph, i) => {
                if (paragraph.startsWith("## ")) {
                  return (
                    <h3 key={i} className="text-lg font-semibold text-[var(--vamp-black)] mt-6 mb-2">
                      {paragraph.replace("## ", "")}
                    </h3>
                  );
                }
                if (paragraph.startsWith("- ")) {
                  return (
                    <li key={i} className="ml-4">
                      {paragraph.replace("- ", "")}
                    </li>
                  );
                }
                if (paragraph.trim() === "") {
                  return <br key={i} />;
                }
                return <p key={i} className="mb-3">{paragraph}</p>;
              })}
            </div>
          </div>

          {/* Replies Section */}
          <div className="vamp-card p-6 md:p-8 animate-in" style={{ animationDelay: "0.1s" }}>
            <ThreadReplySection
              threadId={thread.id}
              replies={thread.replies}
              replyCount={thread._count.replies}
              currentUserId={currentUserId}
            />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-80 space-y-6">
          {/* Author Card */}
          <div className="vamp-card p-6 animate-in">
            <h3 className="text-sm font-medium text-[var(--vamp-grey)] mb-4">THREAD AUTHOR</h3>
            <Link
              href={`/${thread.user.username}`}
              className="flex items-center gap-3 p-3 -mx-3 rounded-lg hover:bg-[var(--vamp-cream)] transition-colors"
            >
              {thread.user.image ? (
                <img
                  src={thread.user.image}
                  alt={thread.user.name || "User"}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[var(--vamp-orange)] flex items-center justify-center text-white font-bold text-lg">
                  {thread.user.name?.charAt(0) || "?"}
                </div>
              )}
              <div>
                <div className="font-medium text-[var(--vamp-black)]">
                  {thread.user.name}
                </div>
                <div className="text-sm text-[var(--vamp-grey)]">
                  @{thread.user.username}
                </div>
              </div>
            </Link>
            
            {thread.user.bio && (
              <p className="text-sm text-[var(--vamp-grey-dark)] mt-3">
                {thread.user.bio}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[var(--vamp-grey-lighter)]">
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--vamp-black)]">
                  {thread.user._count.projects}
                </div>
                <div className="text-xs text-[var(--vamp-grey)]">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--vamp-orange)]">
                  {userVibeScore}
                </div>
                <div className="text-xs text-[var(--vamp-grey)]">Vibe Score</div>
              </div>
            </div>
          </div>

          {/* Top Vibecoders */}
          <TopVibecoders vibecoders={vibecodersWithScores} />
        </aside>
      </div>
    </div>
  );
}
