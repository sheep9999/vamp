"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Reply, Send, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { addComment } from "@/actions/comments";

interface CommentItemProps {
  comment: {
    id: string;
    text: string;
    createdAt: Date;
    user: {
      id: string;
      name: string | null;
      image: string | null;
      username: string | null;
    };
    replies: {
      id: string;
      text: string;
      createdAt: Date;
      user: {
        id: string;
        name: string | null;
        image: string | null;
        username: string | null;
      };
    }[];
  };
  projectId: string;
  currentUserId?: string;
  isReply?: boolean;
}

export function CommentItem({ comment, projectId, currentUserId, isReply = false }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localReplies, setLocalReplies] = useState(comment.replies || []);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await addComment(projectId, replyText.trim(), comment.id);
      if (result.success && result.comment) {
        setLocalReplies([...localReplies, result.comment as any]);
        setReplyText("");
        setShowReplyForm(false);
      }
    } catch (error) {
      console.error("Failed to add reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${isReply ? "ml-10 pl-4 border-l-2 border-[var(--vamp-grey-lighter)]" : ""}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <Link href={`/${comment.user.username}`} className="flex-shrink-0">
          {comment.user.image ? (
            <img
              src={comment.user.image}
              alt={comment.user.name || "User"}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[var(--vamp-orange)] flex items-center justify-center text-white text-sm font-bold">
              {comment.user.name?.charAt(0) || "?"}
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/${comment.user.username}`}
              className="font-medium text-sm text-[var(--vamp-black)] hover:text-[var(--vamp-orange)]"
            >
              {comment.user.name || comment.user.username}
            </Link>
            <span className="text-xs text-[var(--vamp-grey-light)]">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>

          <p className="text-sm text-[var(--vamp-grey-dark)] whitespace-pre-wrap">
            {comment.text}
          </p>

          {/* Actions */}
          {!isReply && currentUserId && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1 mt-2 text-xs text-[var(--vamp-grey)] hover:text-[var(--vamp-orange)] transition-colors"
            >
              <Reply className="w-3 h-3" />
              Reply
            </button>
          )}

          {/* Reply Form */}
          {showReplyForm && (
            <form onSubmit={handleReply} className="mt-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="vamp-input text-sm min-h-[60px] resize-none"
                maxLength={500}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="text-sm text-[var(--vamp-grey)] hover:text-[var(--vamp-black)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!replyText.trim() || isSubmitting}
                  className="vamp-btn vamp-btn-primary py-1 px-3 text-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Send className="w-3 h-3" />
                  )}
                  Reply
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Replies */}
      {!isReply && localReplies.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-xs text-[var(--vamp-grey)] hover:text-[var(--vamp-orange)] mb-2"
          >
            {showReplies ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
            {localReplies.length} {localReplies.length === 1 ? "reply" : "replies"}
          </button>
          
          {showReplies && (
            <div className="space-y-3">
              {localReplies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={{ ...reply, replies: [] }}
                  projectId={projectId}
                  currentUserId={currentUserId}
                  isReply
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
