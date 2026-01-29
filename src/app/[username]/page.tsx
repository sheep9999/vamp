// src/app/[username]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ProjectCard } from "@/components/projects/project-card";
import { 
  Zap, 
  Calendar, 
  Link as LinkIcon, 
  Github, 
  Twitter,
  MapPin,
  Award,
  Rocket,
  TrendingUp,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ProfilePageProps {
  params: { username: string };
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: { name: true, bio: true },
  });

  if (!user) {
    return { title: "User Not Found" };
  }

  return {
    title: `${user.name} | VAMP`,
    description: user.bio || `Check out ${user.name}'s profile on VAMP`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await getSession();
  const currentUserId = session?.user?.id;

  // Fetch user with their projects and stats
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      projects: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, name: true, image: true, username: true },
          },
          upvotes: currentUserId
            ? { where: { userId: currentUserId }, select: { id: true } }
            : false,
        },
      },
      _count: {
        select: {
          projects: { where: { status: "PUBLISHED" } },
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  // Calculate Vibe Score (sum of all upvotes on user's projects)
  const vibeScore = user.projects.reduce(
    (sum, project) => sum + project.upvoteCount,
    0
  );

  const isOwnProfile = currentUserId === user.id;

  // Get role badge info
  const roleBadge = {
    VIBECODER: { label: "Vibecoder", icon: Rocket, color: "orange" },
    SPONSOR: { label: "Sponsor", icon: Award, color: "purple" },
    ADMIN: { label: "Admin", icon: Zap, color: "blue" },
  }[user.role || "VIBECODER"];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="vamp-card p-6 md:p-8 mb-8 animate-in">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl ring-4 ring-[var(--vamp-orange-10)]"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-[var(--vamp-orange)] flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {user.name?.charAt(0) || "?"}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--vamp-black)]">
                  {user.name}
                </h1>
                <p className="text-[var(--vamp-grey)]">@{user.username}</p>
              </div>

              {/* Role Badge */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                roleBadge.color === "orange" 
                  ? "bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)]"
                  : roleBadge.color === "purple"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                <roleBadge.icon className="w-4 h-4" />
                {roleBadge.label}
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="text-[var(--vamp-grey-dark)] mb-4 max-w-2xl">
                {user.bio}
              </p>
            )}

            {/* Links & Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--vamp-grey)]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Joined {formatDate(user.createdAt)}
              </div>
              
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[var(--vamp-orange)] transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  Website
                </a>
              )}
              
              {user.github && (
                <a
                  href={user.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[var(--vamp-black)] transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              )}
              
              {user.twitter && (
                <a
                  href={`https://twitter.com/${user.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  @{user.twitter}
                </a>
              )}
            </div>

            {/* Edit Profile Button */}
            {isOwnProfile && (
              <a
                href="/settings"
                className="inline-flex mt-4 vamp-btn vamp-btn-outline"
              >
                Edit Profile
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="vamp-card p-4 text-center animate-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-[var(--vamp-orange)]" />
            <span className="text-2xl font-bold text-[var(--vamp-black)]">
              {vibeScore}
            </span>
          </div>
          <p className="text-sm text-[var(--vamp-grey)]">Vibe Score</p>
        </div>
        
        <div className="vamp-card p-4 text-center animate-in" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Rocket className="w-5 h-5 text-[var(--vamp-orange)]" />
            <span className="text-2xl font-bold text-[var(--vamp-black)]">
              {user._count.projects}
            </span>
          </div>
          <p className="text-sm text-[var(--vamp-grey)]">Projects</p>
        </div>
        
        <div className="vamp-card p-4 text-center animate-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-[var(--vamp-orange)]" />
            <span className="text-2xl font-bold text-[var(--vamp-black)]">
              {user.projects.length > 0 
                ? Math.round(vibeScore / user.projects.length) 
                : 0}
            </span>
          </div>
          <p className="text-sm text-[var(--vamp-grey)]">Avg. Upvotes</p>
        </div>
      </div>

      {/* Projects Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="vamp-heading flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[var(--vamp-orange)]" />
            Projects
          </h2>
          {isOwnProfile && (
            <a href="/submit" className="vamp-btn vamp-btn-primary">
              <Zap className="w-4 h-4" />
              New Project
            </a>
          )}
        </div>

        {user.projects.length === 0 ? (
          <div className="vamp-card p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--vamp-cream)] mb-4">
              <Rocket className="w-8 h-8 text-[var(--vamp-grey-light)]" />
            </div>
            <h3 className="font-semibold text-[var(--vamp-black)] mb-2">
              No projects yet
            </h3>
            <p className="text-sm text-[var(--vamp-grey)] mb-4">
              {isOwnProfile 
                ? "Share your first vibecoded creation!" 
                : `${user.name} hasn't submitted any projects yet.`}
            </p>
            {isOwnProfile && (
              <a href="/submit" className="vamp-btn vamp-btn-primary">
                Submit Your First Project
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {user.projects.map((project, index) => (
              <div 
                key={project.id} 
                className="animate-in"
                style={{ animationDelay: `${0.1 * index}s` }}
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
  );
}
