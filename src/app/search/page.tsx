// src/app/search/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { ProjectCard } from "@/components/projects/project-card";
import Link from "next/link";
import { Search, Folder, Gift, ArrowLeft, Frown } from "lucide-react";

export const metadata = {
  title: "Search | VAMP",
  description: "Search for projects and grants on VAMP",
};

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;
  const query = searchParams.q?.trim() || "";

  // If no query, show empty state
  if (!query) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--vamp-cream)] mb-4">
            <Search className="w-8 h-8 text-[var(--vamp-grey-light)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--vamp-black)] mb-2">
            Search VAMP
          </h1>
          <p className="text-[var(--vamp-grey)] mb-6">
            Enter a search term to find projects and grants
          </p>
          <Link href="/discover" className="vamp-btn vamp-btn-primary">
            Browse Projects
          </Link>
        </div>
      </div>
    );
  }

  // Search projects
  const projects = await prisma.project.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { tagline: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { techStack: { hasSome: [query.toLowerCase()] } },
      ],
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
    take: 20,
  });

  // Search grants
  const grants = await prisma.grant.findMany({
    where: {
      status: "OPEN",
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    include: {
      sponsor: {
        select: { id: true, name: true, image: true, username: true },
      },
      _count: {
        select: { applications: true },
      },
    },
    orderBy: { amount: "desc" },
    take: 10,
  });

  const totalResults = projects.length + grants.length;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 text-sm text-[var(--vamp-grey)] hover:text-[var(--vamp-black)] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Discover
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)]">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--vamp-black)]">
              Search results for "{query}"
            </h1>
            <p className="text-sm text-[var(--vamp-grey)]">
              Found {totalResults} {totalResults === 1 ? "result" : "results"}
            </p>
          </div>
        </div>
      </div>

      {/* No Results */}
      {totalResults === 0 && (
        <div className="vamp-card p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--vamp-cream)] mb-4">
            <Frown className="w-8 h-8 text-[var(--vamp-grey-light)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--vamp-black)] mb-2">
            No results found
          </h2>
          <p className="text-[var(--vamp-grey)] mb-6">
            We couldn't find any projects or grants matching "{query}"
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/discover" className="vamp-btn vamp-btn-primary">
              Browse All Projects
            </Link>
            <Link href="/grants" className="vamp-btn vamp-btn-outline">
              View Grants
            </Link>
          </div>
        </div>
      )}

      {/* Projects Results */}
      {projects.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Folder className="w-5 h-5 text-[var(--vamp-orange)]" />
            <h2 className="font-semibold text-[var(--vamp-black)]">
              Projects ({projects.length})
            </h2>
          </div>
          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                userUpvoted={
                  currentUserId && project.upvotes
                    ? project.upvotes.length > 0
                    : false
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* Grants Results */}
      {grants.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-[var(--vamp-orange)]" />
            <h2 className="font-semibold text-[var(--vamp-black)]">
              Grants ({grants.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grants.map((grant) => (
              <Link
                key={grant.id}
                href={`/grants/${grant.id}`}
                className="vamp-card p-5 hover:border-[var(--vamp-orange)] transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-[var(--vamp-black)] group-hover:text-[var(--vamp-orange)] transition-colors">
                    {grant.title}
                  </h3>
                  <span className="px-2 py-1 rounded-full bg-[var(--vamp-orange)] text-white text-sm font-bold">
                    ${Number(grant.amount).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-[var(--vamp-grey)] line-clamp-2 mb-3">
                  {grant.description}
                </p>
                <div className="flex items-center justify-between text-xs text-[var(--vamp-grey)]">
                  <span className="flex items-center gap-1">
                    by {grant.sponsor.name}
                  </span>
                  <span>
                    {grant._count.applications} applications
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
