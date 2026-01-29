"use client";

import { useOptimistic, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Triangle } from "lucide-react";
import { upvoteThread } from "@/actions/forum";
import { cn } from "@/lib/utils";

interface ThreadUpvoteButtonProps {
  threadId: string;
  initialCount: number;
  initialUpvoted: boolean;
  size?: "sm" | "md" | "lg";
}

export function ThreadUpvoteButton({
  threadId,
  initialCount,
  initialUpvoted,
  size = "md",
}: ThreadUpvoteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [optimisticState, addOptimistic] = useOptimistic(
    { count: initialCount, upvoted: initialUpvoted },
    (state, newUpvoted: boolean) => ({
      count: newUpvoted ? state.count + 1 : state.count - 1,
      upvoted: newUpvoted,
    })
  );

  const handleUpvote = () => {
    if (!session?.user) {
      router.push("/sign-in?callbackUrl=/forum");
      return;
    }

    startTransition(async () => {
      addOptimistic(!optimisticState.upvoted);
      const result = await upvoteThread(threadId);
      if (!result.success) {
        console.error(result.message);
      }
    });
  };

  const sizeClasses = {
    sm: "min-w-[50px] py-1 px-2 text-xs",
    md: "min-w-[60px] py-1.5 px-3 text-sm",
    lg: "min-w-[80px] py-2 px-4 text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <button
      onClick={handleUpvote}
      disabled={isPending}
      className={cn(
        "vamp-upvote",
        sizeClasses[size],
        optimisticState.upvoted && "active",
        isPending && "opacity-70"
      )}
      aria-label={optimisticState.upvoted ? "Remove upvote" : "Upvote thread"}
    >
      <Triangle
        className={cn(
          iconSizes[size],
          "transition-transform",
          optimisticState.upvoted && "fill-current",
          isPending && "animate-pulse"
        )}
      />
      <span className="font-semibold tabular-nums">
        {optimisticState.count}
      </span>
    </button>
  );
}
