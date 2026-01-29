// src/app/leaderboard/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Trophy, 
  Zap, 
  Folder, 
  Gift, 
  TrendingUp,
  Medal,
  Crown,
  Star,
  ChevronRight
} from "lucide-react";

export const metadata = {
  title: "Leaderboard | VAMP",
  description: "Top vibecoders ranked by vibe score, projects, and grants",
};

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  // Fetch all vibecoders with their stats
  const users = await prisma.user.findMany({
    where: {
      role: "VIBECODER",
      projects: {
        some: { status: "PUBLISHED" },
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
      username: true,
      bio: true,
      createdAt: true,
      projects: {
        where: { status: "PUBLISHED" },
        select: { 
          id: true,
          upvoteCount: true,
          title: true,
          grantApplications: {
            where: { status: "APPROVED" },
            select: {
              grant: {
                select: { amount: true }
              }
            }
          }
        },
      },
    },
  });

  // Calculate stats and sort by vibe score
  const leaderboard = users
    .map((user) => {
      const vibeScore = user.projects.reduce((sum, p) => sum + p.upvoteCount, 0);
      const projectCount = user.projects.length;
      const grantsReceived = user.projects.reduce(
        (sum, p) => sum + p.grantApplications.length,
        0
      );
      const totalGrantAmount = user.projects.reduce(
        (sum, p) => sum + p.grantApplications.reduce(
          (gSum, app) => gSum + Number(app.grant.amount),
          0
        ),
        0
      );
      const topProject = user.projects.sort((a, b) => b.upvoteCount - a.upvoteCount)[0];

      return {
        ...user,
        vibeScore,
        projectCount,
        grantsReceived,
        totalGrantAmount,
        topProject,
      };
    })
    .sort((a, b) => b.vibeScore - a.vibeScore);

  // Get top 3 for podium
  const podium = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  // Stats
  const totalVibeScore = leaderboard.reduce((sum, u) => sum + u.vibeScore, 0);
  const totalProjects = leaderboard.reduce((sum, u) => sum + u.projectCount, 0);
  const totalGrantsAwarded = leaderboard.reduce((sum, u) => sum + u.grantsReceived, 0);

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bg: "bg-gradient-to-br from-yellow-400 to-yellow-500",
          ring: "ring-yellow-300",
          badge: "bg-yellow-100 text-yellow-700 border-yellow-300",
          icon: Crown,
        };
      case 2:
        return {
          bg: "bg-gradient-to-br from-gray-300 to-gray-400",
          ring: "ring-gray-300",
          badge: "bg-gray-100 text-gray-600 border-gray-300",
          icon: Medal,
        };
      case 3:
        return {
          bg: "bg-gradient-to-br from-orange-400 to-orange-500",
          ring: "ring-orange-300",
          badge: "bg-orange-100 text-orange-700 border-orange-300",
          icon: Medal,
        };
      default:
        return {
          bg: "bg-[var(--vamp-cream)]",
          ring: "ring-[var(--vamp-grey-lighter)]",
          badge: "bg-[var(--vamp-cream)] text-[var(--vamp-grey)]",
          icon: Star,
        };
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-10 animate-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)] text-sm font-medium mb-4">
          <Trophy className="w-4 h-4" />
          <span>Community Rankings</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--vamp-black)] tracking-tight mb-3">
          Vibecoder <span className="vamp-gradient-text">Leaderboard</span>
        </h1>
        
        <p className="text-[var(--vamp-grey)] max-w-2xl mx-auto">
          The top builders in the vibecoding community, ranked by their total vibe score
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="vamp-card p-5 text-center animate-in">
          <div className="text-3xl font-bold text-[var(--vamp-orange)] mb-1">
            {totalVibeScore.toLocaleString()}
          </div>
          <div className="text-sm text-[var(--vamp-grey)]">Total Vibe Score</div>
        </div>
        <div className="vamp-card p-5 text-center animate-in" style={{ animationDelay: "0.05s" }}>
          <div className="text-3xl font-bold text-[var(--vamp-black)] mb-1">
            {totalProjects}
          </div>
          <div className="text-sm text-[var(--vamp-grey)]">Projects Shipped</div>
        </div>
        <div className="vamp-card p-5 text-center animate-in" style={{ animationDelay: "0.1s" }}>
          <div className="text-3xl font-bold text-green-600 mb-1">
            {totalGrantsAwarded}
          </div>
          <div className="text-sm text-[var(--vamp-grey)]">Grants Awarded</div>
        </div>
      </div>

      {/* Podium - Top 3 */}
      {podium.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-10 items-end">
          {/* 2nd Place */}
          <div className="animate-in" style={{ animationDelay: "0.1s" }}>
            <PodiumCard user={podium[1]} rank={2} />
          </div>
          
          {/* 1st Place */}
          <div className="animate-in" style={{ animationDelay: "0.05s" }}>
            <PodiumCard user={podium[0]} rank={1} isFirst />
          </div>
          
          {/* 3rd Place */}
          <div className="animate-in" style={{ animationDelay: "0.15s" }}>
            <PodiumCard user={podium[2]} rank={3} />
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="vamp-card overflow-hidden animate-in" style={{ animationDelay: "0.2s" }}>
        <div className="p-5 border-b border-[var(--vamp-grey-lighter)]">
          <h2 className="font-semibold text-[var(--vamp-black)] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--vamp-orange)]" />
            Full Rankings
          </h2>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-[var(--vamp-cream)] text-xs font-medium text-[var(--vamp-grey)] uppercase tracking-wider">
          <div className="col-span-1">Rank</div>
          <div className="col-span-4">Vibecoder</div>
          <div className="col-span-2 text-center">Vibe Score</div>
          <div className="col-span-2 text-center">Projects</div>
          <div className="col-span-2 text-center">Grants</div>
          <div className="col-span-1"></div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-[var(--vamp-grey-lighter)]">
          {leaderboard.map((user, index) => {
            const rank = index + 1;
            const rankStyle = getRankStyle(rank);
            
            return (
              <Link
                key={user.id}
                href={`/${user.username}`}
                className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-[var(--vamp-cream)] transition-colors group"
              >
                {/* Rank */}
                <div className="col-span-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${rankStyle.badge}`}>
                    {rank <= 3 ? (
                      <rankStyle.icon className="w-4 h-4" />
                    ) : (
                      rank
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div className="col-span-4 flex items-center gap-3">
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
                  <div className="min-w-0">
                    <div className="font-medium text-[var(--vamp-black)] truncate group-hover:text-[var(--vamp-orange)] transition-colors">
                      {user.name || user.username}
                    </div>
                    <div className="text-xs text-[var(--vamp-grey)] truncate">
                      @{user.username}
                    </div>
                  </div>
                </div>

                {/* Vibe Score */}
                <div className="col-span-2 text-center">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)] font-bold">
                    <Zap className="w-4 h-4" />
                    {user.vibeScore.toLocaleString()}
                  </div>
                </div>

                {/* Projects */}
                <div className="col-span-2 text-center">
                  <div className="inline-flex items-center gap-1 text-[var(--vamp-grey-dark)]">
                    <Folder className="w-4 h-4 text-[var(--vamp-grey)]" />
                    {user.projectCount}
                  </div>
                </div>

                {/* Grants */}
                <div className="col-span-2 text-center">
                  {user.grantsReceived > 0 ? (
                    <div className="inline-flex items-center gap-1 text-green-600">
                      <Gift className="w-4 h-4" />
                      {user.grantsReceived}
                      {user.totalGrantAmount > 0 && (
                        <span className="text-xs text-[var(--vamp-grey)]">
                          (${user.totalGrantAmount.toLocaleString()})
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[var(--vamp-grey-light)]">—</span>
                  )}
                </div>

                {/* Arrow */}
                <div className="col-span-1 text-right">
                  <ChevronRight className="w-5 h-5 text-[var(--vamp-grey-light)] group-hover:text-[var(--vamp-orange)] transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {leaderboard.length === 0 && (
          <div className="p-12 text-center">
            <Trophy className="w-12 h-12 text-[var(--vamp-grey-lighter)] mx-auto mb-4" />
            <h3 className="font-semibold text-[var(--vamp-black)] mb-2">
              No vibecoders yet
            </h3>
            <p className="text-sm text-[var(--vamp-grey)] mb-4">
              Be the first to submit a project and claim the top spot!
            </p>
            <Link href="/submit" className="vamp-btn vamp-btn-primary">
              Submit Your Project
            </Link>
          </div>
        )}
      </div>

      {/* How Scoring Works */}
      <div className="mt-10 vamp-card p-6 animate-in" style={{ animationDelay: "0.25s" }}>
        <h3 className="font-semibold text-[var(--vamp-black)] mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[var(--vamp-orange)]" />
          How Vibe Score Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded-lg bg-[var(--vamp-cream)]">
            <div className="font-medium text-[var(--vamp-black)] mb-1">Upvotes = Points</div>
            <p className="text-[var(--vamp-grey)]">
              Each upvote on your projects adds 1 point to your vibe score
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--vamp-cream)]">
            <div className="font-medium text-[var(--vamp-black)] mb-1">Ship More, Score More</div>
            <p className="text-[var(--vamp-grey)]">
              The more projects you ship, the more opportunities to earn upvotes
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--vamp-cream)]">
            <div className="font-medium text-[var(--vamp-black)] mb-1">Quality Wins</div>
            <p className="text-[var(--vamp-grey)]">
              Great projects attract more upvotes and climb the leaderboard faster
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Podium Card Component
function PodiumCard({ 
  user, 
  rank, 
  isFirst = false 
}: { 
  user: any; 
  rank: number; 
  isFirst?: boolean;
}) {
  const heights = {
    1: "h-48",
    2: "h-40",
    3: "h-36",
  };

  const bgColors = {
    1: "from-yellow-400/20 to-yellow-500/10 border-yellow-300",
    2: "from-gray-300/20 to-gray-400/10 border-gray-300",
    3: "from-orange-400/20 to-orange-500/10 border-orange-300",
  };

  return (
    <Link href={`/${user.username}`} className="block group">
      <div className={`vamp-card p-5 text-center bg-gradient-to-b ${bgColors[rank as keyof typeof bgColors]} hover:scale-105 transition-transform ${heights[rank as keyof typeof heights]} flex flex-col justify-end`}>
        {/* Crown for #1 */}
        {isFirst && (
          <div className="mb-2">
            <Crown className="w-8 h-8 text-yellow-500 mx-auto" />
          </div>
        )}

        {/* Avatar */}
        <div className="relative inline-block mx-auto mb-3">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className={`rounded-full ring-4 ${
                rank === 1 ? "w-16 h-16 ring-yellow-400" : 
                rank === 2 ? "w-14 h-14 ring-gray-400" : 
                "w-12 h-12 ring-orange-400"
              }`}
            />
          ) : (
            <div className={`rounded-full bg-[var(--vamp-orange)] flex items-center justify-center text-white font-bold ${
              rank === 1 ? "w-16 h-16 text-xl" : 
              rank === 2 ? "w-14 h-14 text-lg" : 
              "w-12 h-12"
            }`}>
              {user.name?.charAt(0) || "?"}
            </div>
          )}
          {/* Rank Badge */}
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            rank === 1 ? "bg-yellow-500 text-white" :
            rank === 2 ? "bg-gray-500 text-white" :
            "bg-orange-500 text-white"
          }`}>
            {rank}
          </div>
        </div>

        {/* Name */}
        <div className="font-semibold text-[var(--vamp-black)] truncate group-hover:text-[var(--vamp-orange)] transition-colors">
          {user.name || user.username}
        </div>

        {/* Score */}
        <div className="flex items-center justify-center gap-1 text-[var(--vamp-orange)] font-bold mt-1">
          <Zap className="w-4 h-4" />
          {user.vibeScore.toLocaleString()}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-3 mt-2 text-xs text-[var(--vamp-grey)]">
          <span>{user.projectCount} projects</span>
          {user.grantsReceived > 0 && (
            <span className="text-green-600">{user.grantsReceived} grants</span>
          )}
        </div>
      </div>
    </Link>
  );
}
