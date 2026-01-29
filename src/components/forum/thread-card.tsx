"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Eye, Pin, Triangle, Sparkles, HelpCircle, Megaphone } from "lucide-react";
import { ThreadUpvoteButton } from "./thread-upvote-button";

interface ThreadCardProps {
  thread: {
    id: string;
    title: string;
    category: string;
    upvoteCount: number;
    replyCount: number;
    viewCount: number;
    isPinned: boolean;
    createdAt: Date;
    user: {
      id: string;
      name: string | null;
      image: string | null;
      username: string | null;
    };
  };
  userUpvoted: boolean;
}

const CATEGORY_STYLES: Record<string, { label: string; color: string; icon: any }> = {
  GENERAL: { label: "General", color: "bg-blue-100 text-blue-700", icon: MessageSquare },
  VIBE_CHECKS: { label: "Vibe Check", color: "bg-purple-100 text-purple-700", icon: Sparkles },
  SHOW_TELL: { label: "Show & Tell", color: "bg-green-100 text-green-700", icon: Megaphone },
  TECHNICAL: { label: "Technical", color: "bg-orange-100 text-orange-700", icon: HelpCircle },
};

export function ThreadCard({ thread, userUpvoted }: ThreadCardProps) {
  const categoryStyle = CATEGORY_STYLES[thread.category] || CATEGORY_STYLES.GENERAL;
  const CategoryIcon = categoryStyle.icon;

  return (
    <div className="vamp-card p-4 hover:border-[var(--vamp-orange)] transition-all group">
      <div className="flex items-start gap-4">
        {/* Upvote */}
        <ThreadUpvoteButton
          threadId={thread.id}
          initialCount={thread.upvoteCount}
          initialUpvoted={userUpvoted}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {thread.isPinned && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--vamp-orange)] text-white text-xs font-medium">
                <Pin className="w-3 h-3" />
                Pinned
              </span>
            )}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${categoryStyle.color}`}>
              <CategoryIcon className="w-3 h-3" />
              {categoryStyle.label}
            </span>
          </div>

          {/* Title */}
          <Link
            href={`/forum/${thread.id}`}
            className="font-semibold text-[var(--vamp-black)] hover:text-[var(--vamp-orange)] transition-colors line-clamp-2 group-hover:text-[var(--vamp-orange)]"
          >
            {thread.title}
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-2 text-sm text-[var(--vamp-grey)]">
            <Link
              href={`/${thread.user.username}`}
              className="flex items-center gap-2 hover:text-[var(--vamp-orange)] transition-colors"
            >
              {thread.user.image ? (
                <img
                  src={thread.user.image}
                  alt={thread.user.name || "User"}
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[var(--vamp-orange)]" />
              )}
              <span>{thread.user.name || thread.user.username}</span>
            </Link>
            
            <span>•</span>
            
            <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>

            <div className="flex items-center gap-3 ml-auto">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {thread.replyCount}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {thread.viewCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
