"use client";

import { useState } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { ThreadReplyItem } from "./thread-reply-item";
import { addThreadReply } from "@/actions/forum";

interface Reply {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    username: string | null;
  };
  replies: {
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      name: string | null;
      image: string | null;
      username: string | null;
    };
  }[];
}

interface ThreadReplySectionProps {
  threadId: string;
  replies: Reply[];
  replyCount: number;
  currentUserId?: string;
}

export function ThreadReplySection({
  threadId,
  replies,
  replyCount,
  currentUserId,
}: ThreadReplySectionProps) {
  const [newReply, setNewReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localReplies, setLocalReplies] = useState(replies);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await addThreadReply(threadId, newReply.trim());
      if (result.success && result.reply) {
        setLocalReplies([...localReplies, result.reply as Reply]);
        setNewReply("");
      }
    } catch (error) {
      console.error("Failed to add reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-[var(--vamp-orange)]" />
        <h2 className="font-semibold text-[var(--vamp-black)]">
          Replies ({replyCount})
        </h2>
      </div>

      {/* Add Reply Form */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Share your thoughts..."
            className="vamp-input min-h-[100px] resize-none"
            maxLength={2000}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!newReply.trim() || isSubmitting}
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
                  Post Reply
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

      {/* Replies List */}
      {localReplies.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-10 h-10 text-[var(--vamp-grey-lighter)] mx-auto mb-2" />
          <p className="text-[var(--vamp-grey)]">No replies yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {localReplies.map((reply) => (
            <ThreadReplyItem
              key={reply.id}
              reply={reply}
              threadId={threadId}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
