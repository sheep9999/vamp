// src/types/index.ts
import { User, Project, Comment, Grant, Upvote } from "@prisma/client";

// Extended User type with relations
export type UserWithProjects = User & {
  projects: Project[];
  _count?: {
    projects: number;
    comments: number;
    upvotes: number;
  };
};

// Extended Project type with relations
export type ProjectWithRelations = Project & {
  user: Pick<User, "id" | "name" | "image" | "username">;
  comments: CommentWithUser[];
  upvotes: Upvote[];
  _count?: {
    comments: number;
    upvotes: number;
  };
};

// Comment with user info
export type CommentWithUser = Comment & {
  user: Pick<User, "id" | "name" | "image" | "username">;
  replies?: CommentWithUser[];
};

// Extended Grant type
export type GrantWithSponsor = Grant & {
  sponsor: Pick<User, "id" | "name" | "image" | "username">;
};

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

// Form types
export interface ProjectFormData {
  title: string;
  tagline: string;
  description: string;
  demoUrl?: string;
  repoUrl?: string;
  thumbnail?: string;
  techStack: string[];
  tags: string[];
}

export interface GrantFormData {
  title: string;
  description: string;
  amount: number;
  currency: string;
  requirements?: string;
  deadline?: Date;
  maxRecipients: number;
  applicationUrl?: string;
  websiteUrl?: string;
}

// NextAuth type extensions
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "VIBECODER" | "SPONSOR" | "ADMIN" | null;
      username?: string | null;
    };
  }

  interface User {
    id: string;
    role?: "VIBECODER" | "SPONSOR" | "ADMIN" | null;
    username?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: "VIBECODER" | "SPONSOR" | "ADMIN" | null;
    username?: string | null;
  }
}

// Search & Filter types
export interface ProjectFilters {
  search?: string;
  tags?: string[];
  techStack?: string[];
  sortBy?: "trending" | "newest" | "mostUpvoted";
  timeRange?: "today" | "week" | "month" | "all";
}

export interface GrantFilters {
  status?: "OPEN" | "CLOSED" | "ALL";
  minAmount?: number;
  maxAmount?: number;
  sortBy?: "deadline" | "amount" | "newest";
}
