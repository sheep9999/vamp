// src/app/dashboard/grants/[id]/page.tsx
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import Link from "next/link";
import { 
  Gift, 
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Trophy,
  Eye
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ApplicationActions } from "@/components/grants/application-actions";

interface GrantManagePageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: GrantManagePageProps) {
  const grant = await prisma.grant.findUnique({
    where: { id: params.id },
    select: { title: true },
  });

  return {
    title: grant ? `Manage: ${grant.title} | VAMP` : "Grant Not Found",
  };
}

const STATUS_STYLES = {
  PENDING: { label: "Pending Review", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  REVIEWING: { label: "Under Review", color: "bg-blue-100 text-blue-700", icon: Eye },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-700", icon: CheckCircle },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
  WITHDRAWN: { label: "Withdrawn", color: "bg-gray-100 text-gray-600", icon: AlertCircle },
};

const GRANT_STATUS_STYLES = {
  OPEN: { label: "Open", color: "bg-green-100 text-green-700" },
  CLOSED: { label: "Closed", color: "bg-gray-100 text-gray-600" },
  PAUSED: { label: "Paused", color: "bg-yellow-100 text-yellow-700" },
};

export default async function GrantManagePage({ params }: GrantManagePageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/dashboard/grants");
  }

  const grant = await prisma.grant.findUnique({
    where: { id: params.id },
    include: {
      sponsor: {
        select: { id: true, name: true, image: true },
      },
      applications: {
        include: {
          project: {
            include: {
              user: {
                select: { id: true, name: true, image: true, username: true, github: true, twitter: true, website: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!grant) {
    notFound();
  }

  // Check if current user is the sponsor
  if (grant.sponsorId !== session.user.id) {
    redirect("/dashboard/grants");
  }

  // Group applications by status
  const pendingApps = grant.applications.filter(a => a.status === "PENDING" || a.status === "REVIEWING");
  const approvedApps = grant.applications.filter(a => a.status === "APPROVED");
  const rejectedApps = grant.applications.filter(a => a.status === "REJECTED");
  const withdrawnApps = grant.applications.filter(a => a.status === "WITHDRAWN");

  const grantStatusStyle = GRANT_STATUS_STYLES[grant.status as keyof typeof GRANT_STATUS_STYLES];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <Link
        href="/dashboard/grants"
        className="inline-flex items-center gap-2 text-sm text-[var(--vamp-grey)] hover:text-[var(--vamp-black)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Grants
      </Link>

      {/* Grant Header */}
      <div className="vamp-card p-6 mb-8 animate-in">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-[var(--vamp-black)]">
                {grant.title}
              </h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${grantStatusStyle.color}`}>
                {grantStatusStyle.label}
              </span>
            </div>
            <p className="text-[var(--vamp-grey)]">{grant.description}</p>
          </div>
          <Link
            href={`/grants/${grant.id}`}
            className="vamp-btn vamp-btn-outline py-1.5 px-3 text-sm"
            target="_blank"
          >
            <ExternalLink className="w-4 h-4" />
            View Public Page
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[var(--vamp-grey-lighter)]">
          <div>
            <div className="text-sm text-[var(--vamp-grey)] mb-1">Amount</div>
            <div className="font-semibold text-[var(--vamp-black)] flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              ${Number(grant.amount).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-[var(--vamp-grey)] mb-1">Deadline</div>
            <div className="font-semibold text-[var(--vamp-black)] flex items-center gap-1">
              <Calendar className="w-4 h-4 text-[var(--vamp-orange)]" />
              {format(new Date(grant.deadline), "MMM d, yyyy")}
            </div>
          </div>
          <div>
            <div className="text-sm text-[var(--vamp-grey)] mb-1">Total Applications</div>
            <div className="font-semibold text-[var(--vamp-black)] flex items-center gap-1">
              <Users className="w-4 h-4 text-blue-600" />
              {grant.applications.length}
            </div>
          </div>
          <div>
            <div className="text-sm text-[var(--vamp-grey)] mb-1">Winners Selected</div>
            <div className="font-semibold text-[var(--vamp-black)] flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-600" />
              {approvedApps.length}
            </div>
          </div>
        </div>
      </div>

      {/* Status Tabs Summary */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="vamp-card p-4 text-center border-l-4 border-yellow-400">
          <div className="text-2xl font-bold text-yellow-600">{pendingApps.length}</div>
          <div className="text-xs text-[var(--vamp-grey)]">Pending Review</div>
        </div>
        <div className="vamp-card p-4 text-center border-l-4 border-green-400">
          <div className="text-2xl font-bold text-green-600">{approvedApps.length}</div>
          <div className="text-xs text-[var(--vamp-grey)]">Approved</div>
        </div>
        <div className="vamp-card p-4 text-center border-l-4 border-red-400">
          <div className="text-2xl font-bold text-red-600">{rejectedApps.length}</div>
          <div className="text-xs text-[var(--vamp-grey)]">Rejected</div>
        </div>
        <div className="vamp-card p-4 text-center border-l-4 border-gray-400">
          <div className="text-2xl font-bold text-gray-600">{withdrawnApps.length}</div>
          <div className="text-xs text-[var(--vamp-grey)]">Withdrawn</div>
        </div>
      </div>

      {/* Applications List */}
      {grant.applications.length === 0 ? (
        <div className="vamp-card p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--vamp-cream)] mb-4">
            <Users className="w-8 h-8 text-[var(--vamp-grey-light)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--vamp-black)] mb-2">
            No applications yet
          </h2>
          <p className="text-[var(--vamp-grey)]">
            Share your grant to attract project applications!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Applications */}
          {pendingApps.length > 0 && (
            <section>
              <h2 className="font-semibold text-[var(--vamp-black)] mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                Pending Review ({pendingApps.length})
              </h2>
              <div className="space-y-4">
                {pendingApps.map((app) => (
                  <ApplicationCard key={app.id} application={app} grantId={grant.id} />
                ))}
              </div>
            </section>
          )}

          {/* Approved Applications */}
          {approvedApps.length > 0 && (
            <section>
              <h2 className="font-semibold text-[var(--vamp-black)] mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-green-600" />
                Winners ({approvedApps.length})
              </h2>
              <div className="space-y-4">
                {approvedApps.map((app) => (
                  <ApplicationCard key={app.id} application={app} grantId={grant.id} isWinner />
                ))}
              </div>
            </section>
          )}

          {/* Rejected Applications */}
          {rejectedApps.length > 0 && (
            <section>
              <h2 className="font-semibold text-[var(--vamp-black)] mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Rejected ({rejectedApps.length})
              </h2>
              <div className="space-y-4">
                {rejectedApps.map((app) => (
                  <ApplicationCard key={app.id} application={app} grantId={grant.id} />
                ))}
              </div>
            </section>
          )}

          {/* Withdrawn Applications */}
          {withdrawnApps.length > 0 && (
            <section>
              <h2 className="font-semibold text-[var(--vamp-black)] mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-gray-500" />
                Withdrawn ({withdrawnApps.length})
              </h2>
              <div className="space-y-4 opacity-60">
                {withdrawnApps.map((app) => (
                  <ApplicationCard key={app.id} application={app} grantId={grant.id} disabled />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

// Application Card Component
function ApplicationCard({ 
  application, 
  grantId,
  isWinner = false,
  disabled = false
}: { 
  application: any; 
  grantId: string;
  isWinner?: boolean;
  disabled?: boolean;
}) {
  const statusStyle = STATUS_STYLES[application.status as keyof typeof STATUS_STYLES];
  const StatusIcon = statusStyle.icon;

  return (
    <div className={`vamp-card p-5 ${isWinner ? "border-green-300 bg-green-50/30" : ""} ${disabled ? "pointer-events-none" : ""}`}>
      <div className="flex items-start gap-4">
        {/* Project Creator Avatar */}
        <Link href={`/${application.project.user.username}`}>
          {application.project.user.image ? (
            <img
              src={application.project.user.image}
              alt={application.project.user.name || "User"}
              className="w-12 h-12 rounded-full ring-2 ring-[var(--vamp-grey-lighter)]"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[var(--vamp-orange)] flex items-center justify-center text-white font-bold">
              {application.project.user.name?.charAt(0) || "?"}
            </div>
          )}
        </Link>

        {/* Application Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <Link
                href={`/project/${application.project.id}`}
                className="font-semibold text-lg text-[var(--vamp-black)] hover:text-[var(--vamp-orange)] transition-colors"
                target="_blank"
              >
                {application.project.title}
                {isWinner && <Trophy className="w-4 h-4 inline ml-2 text-yellow-500" />}
              </Link>
              <p className="text-sm text-[var(--vamp-grey)]">
                by{" "}
                <Link 
                  href={`/${application.project.user.username}`}
                  className="text-[var(--vamp-orange)] hover:underline"
                >
                  {application.project.user.name}
                </Link>
                {" "}• Applied {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
              </p>
            </div>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.color}`}>
              <StatusIcon className="w-3 h-3" />
              {statusStyle.label}
            </span>
          </div>

          {/* Project Tagline */}
          <p className="text-[var(--vamp-grey-dark)] mb-3">
            {application.project.tagline}
          </p>

          {/* Application Message */}
          {application.message && (
            <div className="p-3 rounded-lg bg-[var(--vamp-cream)] mb-3">
              <div className="text-xs text-[var(--vamp-grey)] mb-1">Application Message:</div>
              <p className="text-sm text-[var(--vamp-grey-dark)]">{application.message}</p>
            </div>
          )}

          {/* Contact/Social Info */}
          <div className="flex items-center gap-3 text-sm text-[var(--vamp-grey)] mb-4 flex-wrap">
            {application.project.user.github && (
              <a 
                href={application.project.user.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-[var(--vamp-black)] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            )}
            {application.project.user.twitter && (
              <a 
                href={application.project.user.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-[var(--vamp-black)] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Twitter
              </a>
            )}
            {application.project.user.website && (
              <a 
                href={application.project.user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-[var(--vamp-black)] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Website
              </a>
            )}
            <Link 
              href={`/${application.project.user.username}`}
              className="inline-flex items-center gap-1 text-[var(--vamp-orange)] hover:underline"
            >
              @{application.project.user.username}
            </Link>
          </div>

          {/* Actions */}
          {!disabled && (
            <div className="flex items-center gap-3 pt-3 border-t border-[var(--vamp-grey-lighter)]">
              <Link
                href={`/project/${application.project.id}`}
                className="vamp-btn vamp-btn-outline py-1.5 px-3 text-sm"
                target="_blank"
              >
                <ExternalLink className="w-4 h-4" />
                View Project
              </Link>
              
              <ApplicationActions 
                applicationId={application.id}
                grantId={grantId}
                currentStatus={application.status}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
