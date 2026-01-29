// src/components/projects/project-list.tsx
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ProjectCard } from "./project-card";
import { Inbox } from "lucide-react";

interface ProjectListProps {
  limit?: number;
  sortBy?: "trending" | "newest" | "mostUpvoted";
}

export async function ProjectList({ 
  limit = 10, 
  sortBy = "trending" 
}: ProjectListProps) {
  const session = await getSession();
  const userId = session?.user?.id;

  // Determine sort order
  const orderBy = 
    sortBy === "newest"
      ? { createdAt: "desc" as const }
      : sortBy === "mostUpvoted"
      ? { upvoteCount: "desc" as const }
      : // "trending" - combination of recency and upvotes
        [
          { upvoteCount: "desc" as const },
          { createdAt: "desc" as const },
        ];

  // Fetch projects with user info
  const projects = await prisma.project.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy,
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          username: true,
        },
      },
      upvotes: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
    },
  });

  if (projects.length === 0) {
    return (
      <div className="vamp-card p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--vamp-cream)] mb-4">
          <Inbox className="w-8 h-8 text-[var(--vamp-grey-light)]" />
        </div>
        <h3 className="font-semibold text-[var(--vamp-black)] mb-2">
          No projects yet
        </h3>
        <p className="text-sm text-[var(--vamp-grey)] mb-4">
          Be the first to share your vibecoded creation!
        </p>
        <a href="/submit" className="vamp-btn vamp-btn-primary">
          Submit Your Project
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={{
            ...project,
            createdAt: project.createdAt,
          }}
          userUpvoted={
            userId && project.upvotes 
              ? project.upvotes.length > 0 
              : false
          }
          rank={index + 1}
        />
      ))}
    </div>
  );
}
