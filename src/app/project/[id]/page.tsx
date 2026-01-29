// src/app/project/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UpvoteButton } from "@/components/projects/upvote-button";
import { ShareButton } from "@/components/projects/share-button";
import { CommentSection } from "@/components/comments/comment-section";
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Calendar,
  Eye,
  Zap,
  Rocket
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ProjectDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    select: { title: true, tagline: true },
  });

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | VAMP`,
    description: project.tagline,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const project = await prisma.project.findUnique({
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
      comments: {
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
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  if (!project || project.status === "DRAFT") {
    notFound();
  }

  // Increment view count (fire and forget)
  prisma.project.update({
    where: { id: params.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  const userUpvoted = currentUserId && project.upvotes
    ? project.upvotes.length > 0
    : false;

  // Calculate maker's vibe score
  const makerProjects = await prisma.project.findMany({
    where: { userId: project.user.id, status: "PUBLISHED" },
    select: { upvoteCount: true },
  });
  const makerVibeScore = makerProjects.reduce((sum, p) => sum + p.upvoteCount, 0);

  // Get tech stack labels
  const VIBE_TOOLS_MAP: Record<string, string> = {
    claude: "Claude",
    cursor: "Cursor",
    v0: "v0",
    bolt: "Bolt",
    replit: "Replit",
    chatgpt: "ChatGPT",
    copilot: "GitHub Copilot",
    codeium: "Codeium",
    tabnine: "Tabnine",
    windsurf: "Windsurf",
    nextjs: "Next.js",
    react: "React",
    typescript: "TypeScript",
    tailwind: "Tailwind CSS",
    prisma: "Prisma",
    supabase: "Supabase",
    vercel: "Vercel",
    firebase: "Firebase",
    aws: "AWS",
    python: "Python",
    nodejs: "Node.js",
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <Link
        href="/discover"
        className="inline-flex items-center gap-2 text-sm text-[var(--vamp-grey)] hover:text-[var(--vamp-black)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Discover
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="vamp-card p-6 md:p-8 mb-6 animate-in">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--vamp-black)] mb-2">
                  {project.title}
                </h1>
                <p className="text-lg text-[var(--vamp-grey)]">
                  {project.tagline}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-3">
                <UpvoteButton
                  projectId={project.id}
                  initialCount={project.upvoteCount}
                  initialUpvoted={userUpvoted}
                  size="lg"
                />
                <ShareButton 
                  title={project.title}
                  url={`/project/${project.id}`}
                />
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--vamp-grey)] mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {project.viewCount} views
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                {project.upvoteCount} upvotes
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vamp-btn vamp-btn-primary"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Demo
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vamp-btn vamp-btn-outline"
                >
                  <Github className="w-4 h-4" />
                  View Source
                </a>
              )}
            </div>
          </header>

          {/* Built With */}
          <section className="vamp-card p-6 mb-6 animate-in" style={{ animationDelay: "0.1s" }}>
            <h2 className="font-semibold text-[var(--vamp-black)] mb-4 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-[var(--vamp-orange)]" />
              Built With
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-full bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)] text-sm font-medium"
                >
                  {VIBE_TOOLS_MAP[tech] || tech}
                </span>
              ))}
            </div>
          </section>

          {/* Description */}
          <section className="vamp-card p-6 md:p-8 mb-6 animate-in" style={{ animationDelay: "0.15s" }}>
            <h2 className="font-semibold text-[var(--vamp-black)] mb-4">About This Project</h2>
            <div className="prose prose-sm max-w-none text-[var(--vamp-grey-dark)]">
              {project.description.split("\n").map((paragraph, i) => {
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
          </section>

          {/* Comments */}
          <section className="vamp-card p-6 md:p-8 animate-in" style={{ animationDelay: "0.2s" }}>
            <CommentSection
              projectId={project.id}
              comments={project.comments}
              commentCount={project._count.comments}
              currentUserId={currentUserId}
            />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-80 space-y-6">
          {/* Maker Card */}
          <div className="vamp-card p-6 animate-in">
            <h3 className="text-sm font-medium text-[var(--vamp-grey)] mb-4">MAKER</h3>
            <Link
              href={`/${project.user.username}`}
              className="flex items-center gap-3 p-3 -mx-3 rounded-lg hover:bg-[var(--vamp-cream)] transition-colors"
            >
              {project.user.image ? (
                <img
                  src={project.user.image}
                  alt={project.user.name || "User"}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[var(--vamp-orange)] flex items-center justify-center text-white font-bold text-lg">
                  {project.user.name?.charAt(0) || "?"}
                </div>
              )}
              <div>
                <div className="font-medium text-[var(--vamp-black)]">
                  {project.user.name}
                </div>
                <div className="text-sm text-[var(--vamp-grey)]">
                  @{project.user.username}
                </div>
              </div>
            </Link>
            
            {project.user.bio && (
              <p className="text-sm text-[var(--vamp-grey-dark)] mt-3">
                {project.user.bio}
              </p>
            )}

            {/* Maker Stats */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[var(--vamp-grey-lighter)]">
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--vamp-black)]">
                  {project.user._count.projects}
                </div>
                <div className="text-xs text-[var(--vamp-grey)]">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--vamp-orange)]">
                  {makerVibeScore}
                </div>
                <div className="text-xs text-[var(--vamp-grey)]">Vibe Score</div>
              </div>
            </div>

            <Link
              href={`/${project.user.username}`}
              className="block mt-4 text-center text-sm text-[var(--vamp-orange)] font-medium hover:underline"
            >
              View Profile →
            </Link>
          </div>

          {/* Upvote CTA */}
          <div className="vamp-card p-6 text-center animate-in" style={{ animationDelay: "0.1s" }}>
            <Zap className="w-8 h-8 text-[var(--vamp-orange)] mx-auto mb-2" />
            <h3 className="font-semibold text-[var(--vamp-black)] mb-1">
              Like this project?
            </h3>
            <p className="text-sm text-[var(--vamp-grey)] mb-4">
              Show your support with an upvote!
            </p>
            <UpvoteButton
              projectId={project.id}
              initialCount={project.upvoteCount}
              initialUpvoted={userUpvoted}
              size="lg"
              showLabel
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
