"use client";

import { useOptimistic, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Triangle, Zap } from "lucide-react";
import { upvoteProject } from "@/actions/projects";
import { cn } from "@/lib/utils";

interface UpvoteButtonProps {
  projectId: string;
  initialCount: number;
  initialUpvoted: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function UpvoteButton({
  projectId,
  initialCount,
  initialUpvoted,
  size = "md",
  showLabel = false,
}: UpvoteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Optimistic state for instant UI feedback
  const [optimisticState, addOptimistic] = useOptimistic(
    { count: initialCount, upvoted: initialUpvoted },
    (state, newUpvoted: boolean) => ({
      count: newUpvoted ? state.count + 1 : state.count - 1,
      upvoted: newUpvoted,
    })
  );

  const handleUpvote = () => {
    if (!session?.user) {
      // Redirect to sign in
      router.push("/sign-in?callbackUrl=/");
      return;
    }

    startTransition(async () => {
      // Optimistically update UI immediately
      addOptimistic(!optimisticState.upvoted);
      
      // Then perform the actual server action
      const result = await upvoteProject(projectId);
      
      if (!result.success) {
        // If failed, the optimistic update will be reverted automatically
        // when the component re-renders with the correct server state
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

  if (showLabel) {
    return (
      <button
        onClick={handleUpvote}
        disabled={isPending}
        className={cn(
          "flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg font-medium transition-all",
          optimisticState.upvoted
            ? "bg-[var(--vamp-orange)] text-white"
            : "bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)] hover:bg-[var(--vamp-orange-20)]",
          isPending && "opacity-70"
        )}
        aria-label={optimisticState.upvoted ? "Remove upvote" : "Upvote project"}
      >
        <Zap
          className={cn(
            "w-5 h-5 transition-transform",
            optimisticState.upvoted && "fill-current",
            isPending && "animate-pulse"
          )}
        />
        <span>
          {optimisticState.upvoted ? "Upvoted" : "Upvote"}
        </span>
        <span className="font-bold tabular-nums">
          ({optimisticState.count})
        </span>
      </button>
    );
  }

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
      aria-label={optimisticState.upvoted ? "Remove upvote" : "Upvote project"}
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
