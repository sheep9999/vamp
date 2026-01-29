// src/app/grants/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  ArrowLeft, 
  ExternalLink,
  Clock,
  CheckCircle,
  Rocket
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface GrantDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: GrantDetailPageProps) {
  const grant = await prisma.grant.findUnique({
    where: { id: params.id },
    select: { title: true, description: true },
  });

  if (!grant) {
    return { title: "Grant Not Found" };
  }

  return {
    title: `${grant.title} | VAMP Grants`,
    description: grant.description.substring(0, 160),
  };
}

export default async function GrantDetailPage({ params }: GrantDetailPageProps) {
  const session = await getServerSession(authOptions);

  const grant = await prisma.grant.findUnique({
    where: { id: params.id },
    include: {
      sponsor: {
        select: {
          id: true,
          name: true,
          image: true,
          username: true,
          bio: true,
        },
      },
      applications: {
        include: {
          project: {
            select: {
              id: true,
              title: true,
              tagline: true,
              user: {
                select: { name: true, image: true, username: true },
              },
            },
          },
        },
        take: 10,
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { applications: true },
      },
    },
  });

  if (!grant) {
    notFound();
  }

  const isOwner = session?.user?.id === grant.sponsorId;
  const isDeadlinePassed = grant.deadline && new Date(grant.deadline) < new Date();
  const isDeadlineSoon = grant.deadline && 
    new Date(grant.deadline).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Link */}
      <Link
        href="/grants"
        className="inline-flex items-center gap-2 text-sm text-[var(--vamp-grey)] hover:text-[var(--vamp-black)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Grants
      </Link>

      {/* Header Card */}
      <div className="vamp-card p-6 md:p-8 mb-6 animate-in">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Title & Sponsor */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              {grant.status === "OPEN" && !isDeadlinePassed ? (
                <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  Open for Applications
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-[var(--vamp-grey-lighter)] text-[var(--vamp-grey)] text-xs font-medium">
                  {grant.status}
                </span>
              )}
              {isDeadlineSoon && !isDeadlinePassed && (
                <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                  Ending Soon
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-[var(--vamp-black)] mb-4">
              {grant.title}
            </h1>

            {/* Sponsor Info */}
            <Link
              href={`/${grant.sponsor.username}`}
              className="inline-flex items-center gap-3 p-3 rounded-lg bg-[var(--vamp-cream)] hover:bg-[var(--vamp-grey-lighter)] transition-colors"
            >
              {grant.sponsor.image ? (
                <img
                  src={grant.sponsor.image}
                  alt={grant.sponsor.name || "Sponsor"}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[var(--vamp-orange)] flex items-center justify-center text-white font-bold">
                  {grant.sponsor.name?.charAt(0) || "S"}
                </div>
              )}
              <div>
                <div className="text-sm text-[var(--vamp-grey)]">Sponsored by</div>
                <div className="font-medium text-[var(--vamp-black)]">
                  {grant.sponsor.name || grant.sponsor.username}
                </div>
              </div>
            </Link>
          </div>

          {/* Amount Badge */}
          <div className="flex-shrink-0 text-center md:text-right">
            <div className="inline-block px-6 py-4 rounded-xl bg-[var(--vamp-orange)] text-white">
              <div className="text-sm opacity-80">Grant Amount</div>
              <div className="text-3xl font-bold">
                ${Number(grant.amount).toLocaleString()}
              </div>
              <div className="text-sm opacity-80">{grant.currency}</div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[var(--vamp-grey-lighter)]">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-[var(--vamp-grey)] mb-1">
              <Rocket className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold text-[var(--vamp-black)]">
              {grant._count.applications}
            </div>
            <div className="text-xs text-[var(--vamp-grey)]">Applications</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-[var(--vamp-grey)] mb-1">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold text-[var(--vamp-black)]">
              {grant.maxRecipients}
            </div>
            <div className="text-xs text-[var(--vamp-grey)]">
              {grant.maxRecipients === 1 ? "Recipient" : "Recipients"}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-[var(--vamp-grey)] mb-1">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold text-[var(--vamp-black)]">
              {grant.deadline 
                ? format(new Date(grant.deadline), "MMM d") 
                : "Rolling"}
            </div>
            <div className="text-xs text-[var(--vamp-grey)]">Deadline</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <div className="vamp-card p-6 animate-in" style={{ animationDelay: "0.1s" }}>
            <h2 className="font-semibold text-[var(--vamp-black)] mb-4">About This Grant</h2>
            <div className="prose prose-sm max-w-none text-[var(--vamp-grey-dark)]">
              {grant.description.split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Requirements */}
          {grant.requirements && (
            <div className="vamp-card p-6 animate-in" style={{ animationDelay: "0.15s" }}>
              <h2 className="font-semibold text-[var(--vamp-black)] mb-4">Requirements</h2>
              <div className="prose prose-sm max-w-none text-[var(--vamp-grey-dark)]">
                {grant.requirements.split("\n").map((line, i) => (
                  <p key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--vamp-orange)] mt-0.5 flex-shrink-0" />
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Recent Applications (Owner Only) */}
          {isOwner && grant.applications.length > 0 && (
            <div className="vamp-card p-6 animate-in" style={{ animationDelay: "0.2s" }}>
              <h2 className="font-semibold text-[var(--vamp-black)] mb-4">
                Recent Applications ({grant._count.applications})
              </h2>
              <div className="space-y-3">
                {grant.applications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/project/${app.project.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[var(--vamp-cream)] hover:bg-[var(--vamp-grey-lighter)] transition-colors"
                  >
                    {app.project.user.image ? (
                      <img
                        src={app.project.user.image}
                        alt={app.project.user.name || "User"}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[var(--vamp-orange)]" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[var(--vamp-black)] truncate">
                        {app.project.title}
                      </div>
                      <div className="text-xs text-[var(--vamp-grey)]">
                        by {app.project.user.name || app.project.user.username}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      app.status === "APPROVED" 
                        ? "bg-green-100 text-green-700"
                        : app.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {app.status}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply CTA */}
          <div className="vamp-card p-6 animate-in" style={{ animationDelay: "0.1s" }}>
            {grant.status === "OPEN" && !isDeadlinePassed ? (
              <>
                <h3 className="font-semibold text-[var(--vamp-black)] mb-2">
                  Apply for this Grant
                </h3>
                <p className="text-sm text-[var(--vamp-grey)] mb-4">
                  Submit your project to be considered for this grant.
                </p>
                <Link
                  href={`/submit?grant=${grant.id}`}
                  className="w-full vamp-btn vamp-btn-primary justify-center"
                >
                  Submit a Project
                </Link>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-[var(--vamp-black)] mb-2">
                  Applications Closed
                </h3>
                <p className="text-sm text-[var(--vamp-grey)]">
                  This grant is no longer accepting applications.
                </p>
              </>
            )}
          </div>

          {/* Timeline */}
          <div className="vamp-card p-6 animate-in" style={{ animationDelay: "0.15s" }}>
            <h3 className="font-semibold text-[var(--vamp-black)] mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <div>
                  <div className="text-sm font-medium text-[var(--vamp-black)]">Created</div>
                  <div className="text-xs text-[var(--vamp-grey)]">
                    {format(new Date(grant.createdAt), "MMMM d, yyyy")}
                  </div>
                </div>
              </div>
              {grant.deadline && (
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    isDeadlinePassed ? "bg-red-500" : "bg-[var(--vamp-orange)]"
                  }`} />
                  <div>
                    <div className="text-sm font-medium text-[var(--vamp-black)]">
                      {isDeadlinePassed ? "Deadline Passed" : "Deadline"}
                    </div>
                    <div className="text-xs text-[var(--vamp-grey)]">
                      {format(new Date(grant.deadline), "MMMM d, yyyy")}
                      {!isDeadlinePassed && (
                        <span className="ml-1">
                          ({formatDistanceToNow(new Date(grant.deadline), { addSuffix: true })})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
