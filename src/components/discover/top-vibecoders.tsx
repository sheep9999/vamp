// src/components/discover/top-vibecoders.tsx
import Link from "next/link";
import { Trophy, TrendingUp, Zap } from "lucide-react";

interface Vibecoder {
  id: string;
  name: string | null;
  image: string | null;
  username: string | null;
  vibeScore: number;
  projectCount: number;
}

interface TopVibecordersProps {
  vibecoders: Vibecoder[];
}

export function TopVibecoders({ vibecoders }: TopVibecordersProps) {
  if (vibecoders.length === 0) {
    return null;
  }

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case 2:
        return "bg-gray-100 text-gray-600 border-gray-300";
      case 3:
        return "bg-orange-100 text-orange-700 border-orange-300";
      default:
        return "bg-[var(--vamp-cream)] text-[var(--vamp-grey)]";
    }
  };

  return (
    <div className="vamp-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-[var(--vamp-orange)]" />
        <h3 className="font-semibold text-[var(--vamp-black)]">Top Vibecoders</h3>
      </div>

      <div className="space-y-3">
        {vibecoders.map((user, index) => (
          <Link
            key={user.id}
            href={`/${user.username}`}
            className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-[var(--vamp-cream)] transition-colors group"
          >
            {/* Rank Badge */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${getRankStyle(
                index + 1
              )}`}
            >
              {index + 1}
            </div>

            {/* Avatar */}
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-10 h-10 rounded-full ring-2 ring-[var(--vamp-grey-lighter)] group-hover:ring-[var(--vamp-orange-20)] transition-all"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[var(--vamp-orange)] flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0) || "?"}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-[var(--vamp-black)] truncate group-hover:text-[var(--vamp-orange)] transition-colors">
                {user.name || user.username}
              </div>
              <div className="text-xs text-[var(--vamp-grey)]">
                {user.projectCount} project{user.projectCount !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Vibe Score */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)]">
              <Zap className="w-3 h-3" />
              <span className="text-xs font-bold">{user.vibeScore}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <Link
        href="/leaderboard"
        className="block mt-4 pt-3 border-t border-[var(--vamp-grey-lighter)] text-center text-sm text-[var(--vamp-orange)] font-medium hover:underline"
      >
        View Full Leaderboard →
      </Link>
    </div>
  );
}
