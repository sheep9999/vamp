// src/app/dashboard/grants/page.tsx
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { 
  Gift, 
  Plus, 
  Eye,
  Calendar,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Settings
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export const metadata = {
  title: "Manage Grants | VAMP",
  description: "Manage your sponsored grants and review applications",
};

export const dynamic = "force-dynamic";

const STATUS_STYLES = {
  OPEN: { label: "Open", color: "bg-green-100 text-green-700", icon: CheckCircle },
  CLOSED: { label: "Closed", color: "bg-gray-100 text-gray-600", icon: XCircle },
  PAUSED: { label: "Paused", color: "bg-yellow-100 text-yellow-700", icon: AlertCircle },
};

export default async function ManageGrantsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/dashboard/grants");
  }

  // Check if user is a sponsor
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "SPONSOR") {
    redirect("/");
  }

  // Fetch all grants created by this sponsor
  const grants = await prisma.grant.findMany({
    where: { sponsorId: session.user.id },
    include: {
      applications: {
        include: {
          project: {
            select: { id: true, title: true, tagline: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { applications: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate stats
  const totalGrants = grants.length;
  const openGrants = grants.filter(g => g.status === "OPEN").length;
  const totalApplications = grants.reduce((sum, g) => sum + g._count.applications, 0);
  const totalFunding = grants.reduce((sum, g) => sum + Number(g.amount), 0);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-in">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <Gift className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--vamp-black)]">Manage Grants</h1>
          </div>
          <p className="text-[var(--vamp-grey)]">
            View and manage your sponsored grants and applications
          </p>
        </div>

        <Link
          href="/grants/create"
          className="vamp-btn vamp-btn-primary"
        >
          <Plus className="w-4 h-4" />
          Create New Grant
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="vamp-card p-5 animate-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--vamp-black)]">{totalGrants}</div>
              <div className="text-sm text-[var(--vamp-grey)]">Total Grants</div>
            </div>
          </div>
        </div>
        
        <div className="vamp-card p-5 animate-in" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--vamp-black)]">{openGrants}</div>
              <div className="text-sm text-[var(--vamp-grey)]">Active Grants</div>
            </div>
          </div>
        </div>
        
        <div className="vamp-card p-5 animate-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--vamp-black)]">{totalApplications}</div>
              <div className="text-sm text-[var(--vamp-grey)]">Applications</div>
            </div>
          </div>
        </div>
        
        <div className="vamp-card p-5 animate-in" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)]">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--vamp-black)]">${totalFunding.toLocaleString()}</div>
              <div className="text-sm text-[var(--vamp-grey)]">Total Funding</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grants List */}
      {grants.length === 0 ? (
        <div className="vamp-card p-12 text-center animate-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
            <Gift className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--vamp-black)] mb-2">
            No grants yet
          </h2>
          <p className="text-[var(--vamp-grey)] mb-6 max-w-md mx-auto">
            Create your first grant to start funding vibecoded projects and support the community.
          </p>
          <Link href="/grants/create" className="vamp-btn vamp-btn-primary">
            <Plus className="w-4 h-4" />
            Create Your First Grant
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {grants.map((grant, index) => {
            const statusStyle = STATUS_STYLES[grant.status as keyof typeof STATUS_STYLES];
            const StatusIcon = statusStyle.icon;
            const pendingApplications = grant.applications.filter(a => a.status === "PENDING").length;
            
            return (
              <div 
                key={grant.id} 
                className="vamp-card overflow-hidden animate-in"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                {/* Grant Header */}
                <div className="p-6 border-b border-[var(--vamp-grey-lighter)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-[var(--vamp-black)]">
                          {grant.title}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusStyle.label}
                        </span>
                      </div>
                      <p className="text-[var(--vamp-grey)] line-clamp-2 mb-3">
                        {grant.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-[var(--vamp-grey)]">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${Number(grant.amount).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Deadline: {format(new Date(grant.deadline), "MMM d, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {grant._count.applications} applications
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/grants/${grant.id}`}
                        className="vamp-btn vamp-btn-outline py-1.5 px-3 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                      <Link
                        href={`/dashboard/grants/${grant.id}`}
                        className="vamp-btn vamp-btn-primary py-1.5 px-3 text-sm"
                      >
                        <Settings className="w-4 h-4" />
                        Manage
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Applications Preview */}
                {grant.applications.length > 0 ? (
                  <div className="p-6 bg-[var(--vamp-cream)]/50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-[var(--vamp-black)] flex items-center gap-2">
                        <Users className="w-4 h-4 text-[var(--vamp-grey)]" />
                        Recent Applications
                        {pendingApplications > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-[var(--vamp-orange)] text-white text-xs">
                            {pendingApplications} pending
                          </span>
                        )}
                      </h4>
                      <Link
                        href={`/dashboard/grants/${grant.id}`}
                        className="text-sm text-[var(--vamp-orange)] hover:underline flex items-center gap-1"
                      >
                        View all
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                    
                    <div className="space-y-2">
                      {grant.applications.slice(0, 3).map((app) => (
                        <div 
                          key={app.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-white border border-[var(--vamp-grey-lighter)]"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[var(--vamp-black)] truncate">
                              {app.project.title}
                            </div>
                            <div className="text-sm text-[var(--vamp-grey)] truncate">
                              {app.project.tagline}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              app.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                              app.status === "APPROVED" ? "bg-green-100 text-green-700" :
                              app.status === "REJECTED" ? "bg-red-100 text-red-700" :
                              "bg-gray-100 text-gray-600"
                            }`}>
                              {app.status}
                            </span>
                            <span className="text-xs text-[var(--vamp-grey)]">
                              {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-[var(--vamp-cream)]/50 text-center">
                    <p className="text-sm text-[var(--vamp-grey)]">
                      No applications yet. Share your grant to attract projects!
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
