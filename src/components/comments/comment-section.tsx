"use client";

import { useState } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { CommentItem } from "./comment-item";
import { addComment } from "@/actions/comments";

interface Comment {
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
}

interface CommentSectionProps {
  projectId: string;
  comments: Comment[];
  commentCount: number;
  currentUserId?: string;
}

export function CommentSection({
  projectId,
  comments,
  commentCount,
  currentUserId,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState(comments);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await addComment(projectId, newComment.trim());
      if (result.success && result.comment) {
        setLocalComments([result.comment as Comment, ...localComments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-[var(--vamp-orange)]" />
        <h2 className="font-semibold text-[var(--vamp-black)]">
          Comments ({commentCount})
        </h2>
      </div>

      {/* Add Comment Form */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="vamp-input min-h-[80px] resize-none"
                maxLength={1000}
              />
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="vamp-btn vamp-btn-primary disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post Comment
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 rounded-lg bg-[var(--vamp-cream)] text-center">
          <p className="text-sm text-[var(--vamp-grey)]">
            <a href="/sign-in" className="text-[var(--vamp-orange)] font-medium hover:underline">
              Sign in
            </a>{" "}
            to join the conversation
          </p>
        </div>
      )}

      {/* Comments List */}
      {localComments.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-10 h-10 text-[var(--vamp-grey-lighter)] mx-auto mb-2" />
          <p className="text-[var(--vamp-grey)]">No comments yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {localComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              projectId={projectId}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
