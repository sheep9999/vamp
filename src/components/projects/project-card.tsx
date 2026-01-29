"use client";

import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import { UpvoteButton } from "./upvote-button";
import { formatRelativeTime } from "@/lib/utils";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    tagline: string;
    demoUrl: string | null;
    repoUrl: string | null;
    techStack: string[];
    upvoteCount: number;
    createdAt: Date;
    user: {
      id: string;
      name: string | null;
      image: string | null;
      username: string | null;
    };
  };
  userUpvoted: boolean;
  rank?: number;
}

export function ProjectCard({ project, userUpvoted, rank }: ProjectCardProps) {
  return (
    <div className="vamp-card-bounce p-5 group">
      <div className="flex items-start gap-4">
        {/* Upvote Button */}
        <UpvoteButton
          projectId={project.id}
          initialCount={project.upvoteCount}
          initialUpvoted={userUpvoted}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title Row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link 
              href={`/project/${project.id}`}
              className="font-semibold text-[var(--vamp-black)] hover:text-[var(--vamp-orange)] transition-colors line-clamp-1"
            >
              {rank && (
                <span className="text-[var(--vamp-grey-light)] mr-2">
                  #{rank}
                </span>
              )}
              {project.title}
            </Link>
            
            {/* External Links */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md hover:bg-[var(--vamp-cream)] text-[var(--vamp-grey)] hover:text-[var(--vamp-orange)] transition-colors"
                  title="View Demo"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md hover:bg-[var(--vamp-cream)] text-[var(--vamp-grey)] hover:text-[var(--vamp-black)] transition-colors"
                  title="View Repository"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Tagline */}
          <p className="text-sm text-[var(--vamp-grey)] line-clamp-2 mb-3">
            {project.tagline}
          </p>

          {/* Footer: Tags + Meta */}
          <div className="flex items-center justify-between gap-4">
            {/* Tech Stack Tags */}
            <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
              {project.techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="vamp-badge vamp-badge-orange capitalize"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="vamp-badge vamp-badge-grey">
                  +{project.techStack.length - 3}
                </span>
              )}
            </div>

            {/* Author & Time */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {project.user.image && (
                <img
                  src={project.user.image}
                  alt={project.user.name || "User"}
                  className="w-5 h-5 rounded-full ring-1 ring-[var(--vamp-grey-lighter)]"
                />
              )}
              <span className="text-xs text-[var(--vamp-grey-light)]">
                {formatRelativeTime(project.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
