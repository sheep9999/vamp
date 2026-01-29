// src/app/grants/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GrantCard } from "@/components/grants/grant-card";
import { Gift, Plus, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Grants | VAMP",
  description: "Discover funding opportunities for your vibecoded projects",
};

export default async function GrantsPage() {
  const session = await getServerSession(authOptions);
  
  // Get user role if logged in
  let userRole: string | null = null;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    userRole = user?.role || null;
  }

  const isSponsor = userRole === "SPONSOR" || userRole === "ADMIN";

  // Fetch active grants with application counts
  const grants = await prisma.grant.findMany({
    where: {
      status: "OPEN",
    },
    include: {
      sponsor: {
        select: {
          id: true,
          name: true,
          image: true,
          username: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: [
      { amount: "desc" },
      { createdAt: "desc" },
    ],
  });

  // Calculate total funding available
  const totalFunding = grants.reduce(
    (sum, grant) => sum + Number(grant.amount),
    0
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12 animate-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)] text-sm font-medium mb-4">
          <Gift className="w-4 h-4" />
          <span>Funding for Makers</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--vamp-black)] tracking-tight mb-3">
          Grants & <span className="vamp-gradient-text">Sponsorships</span>
        </h1>
        
        <p className="text-[var(--vamp-grey)] max-w-2xl mx-auto">
          Get funded for your vibecoded creations. Sponsors are looking to support 
          innovative projects built with AI assistance.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="vamp-card p-4 text-center animate-in" style={{ animationDelay: "0.1s" }}>
          <div className="text-2xl font-bold text-[var(--vamp-orange)]">
            ${totalFunding.toLocaleString()}
          </div>
          <div className="text-sm text-[var(--vamp-grey)]">Available Funding</div>
        </div>
        <div className="vamp-card p-4 text-center animate-in" style={{ animationDelay: "0.15s" }}>
          <div className="text-2xl font-bold text-[var(--vamp-black)]">
            {grants.length}
          </div>
          <div className="text-sm text-[var(--vamp-grey)]">Active Grants</div>
        </div>
        <div className="vamp-card p-4 text-center animate-in" style={{ animationDelay: "0.2s" }}>
          <div className="text-2xl font-bold text-[var(--vamp-black)]">
            {grants.reduce((sum, g) => sum + g._count.applications, 0)}
          </div>
          <div className="text-sm text-[var(--vamp-grey)]">Applications</div>
        </div>
        <div className="vamp-card p-4 text-center animate-in" style={{ animationDelay: "0.25s" }}>
          <div className="text-2xl font-bold text-[var(--vamp-black)]">
            {new Set(grants.map(g => g.sponsorId)).size}
          </div>
          <div className="text-sm text-[var(--vamp-grey)]">Sponsors</div>
        </div>
      </div>

      {/* Sponsor CTA */}
      {isSponsor && (
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-[var(--vamp-orange)] to-orange-500 text-white animate-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Ready to support the community?</h3>
                <p className="text-white/80 text-sm">Create a grant and fund innovative vibecoded projects.</p>
              </div>
            </div>
            <Link
              href="/grants/create"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-[var(--vamp-orange)] font-medium hover:bg-white/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Grant
            </Link>
          </div>
        </div>
      )}

      {/* Grants Grid */}
      {grants.length === 0 ? (
        <div className="vamp-card p-12 text-center animate-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--vamp-cream)] mb-4">
            <Gift className="w-8 h-8 text-[var(--vamp-grey-light)]" />
          </div>
          <h3 className="font-semibold text-[var(--vamp-black)] mb-2">
            No active grants yet
          </h3>
          <p className="text-sm text-[var(--vamp-grey)] mb-4">
            Check back soon for new funding opportunities!
          </p>
          {isSponsor && (
            <Link href="/grants/create" className="vamp-btn vamp-btn-primary">
              <Plus className="w-4 h-4" />
              Create the First Grant
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {grants.map((grant, index) => (
            <div 
              key={grant.id} 
              className="animate-in"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <GrantCard
                grant={{
                  id: grant.id,
                  title: grant.title,
                  description: grant.description,
                  amount: Number(grant.amount),
                  currency: grant.currency,
                  deadline: grant.deadline,
                  maxRecipients: grant.maxRecipients,
                  sponsor: grant.sponsor,
                  applicationCount: grant._count.applications,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Bottom CTA for non-sponsors */}
      {!isSponsor && session && (
        <div className="mt-12 text-center animate-in">
          <p className="text-[var(--vamp-grey)] mb-2">
            Are you a company or individual looking to support makers?
          </p>
          <Link
            href="/onboarding"
            className="text-[var(--vamp-orange)] font-medium hover:underline"
          >
            Become a Sponsor →
          </Link>
        </div>
      )}
    </div>
  );
}
