// src/app/dashboard/projects/page.tsx
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import Link from "next/link";
import { 
  Folder, 
  Plus, 
  Eye,
  Calendar,
  Triangle,
  Gift,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Edit,
  MessageSquare,
  Zap
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export const metadata = {
  title: "Manage Projects | VAMP",
  description: "Manage your submitted projects and grant applications",
};

export const dynamic = "force-dynamic";

const PROJECT_STATUS_STYLES = {
  DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-600", icon: Edit },
  PUBLISHED: { label: "Published", color: "bg-green-100 text-green-700", icon: CheckCircle },
  ARCHIVED: { label: "Archived", color: "bg-yellow-100 text-yellow-700", icon: AlertCircle },
};

const APPLICATION_STATUS_STYLES = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  REVIEWING: { label: "Under Review", color: "bg-blue-100 text-blue-700", icon: Eye },
  APPROVED: { label: "Approved! 🎉", color: "bg-green-100 text-green-700", icon: CheckCircle },
  REJECTED: { label: "Not Selected", color: "bg-red-100 text-red-700", icon: XCircle },
  WITHDRAWN: { label: "Withdrawn", color: "bg-gray-100 text-gray-600", icon: AlertCircle },
};

export default async function ManageProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/dashboard/projects");
  }

  // Fetch all projects created by this user
  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      grantApplications: {
        include: {
          grant: {
            select: { 
              id: true, 
              title: true, 
              amount: true,
              status: true,
              sponsor: {
                select: { name: true, image: true }
              }
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { 
          comments: true,
          upvotes: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate stats
  const totalProjects = projects.length;
  const publishedProjects = projects.filter(p => p.status === "PUBLISHED").length;
  const totalUpvotes = projects.reduce((sum, p) => sum + p.upvoteCount, 0);
  const totalApplications = projects.reduce((sum, p) => sum + p.grantApplications.length, 0);
  const approvedGrants = projects.reduce(
    (sum, p) => sum + p.grantApplications.filter(a => a.status === "APPROVED").length, 
    0
  );
  const pendingApplications = projects.reduce(
    (sum, p) => sum + p.grantApplications.filter(a => a.status === "PENDING" || a.status === "REVIEWING").length,
    0
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-in">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)]">
              <Folder className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--vamp-black)]">My Projects</h1>
          </div>
          <p className="text-[var(--vamp-grey)]">
            Manage your projects and track grant applications
          </p>
        </div>

        <Link
          href="/submit"
          className="vamp-btn vamp-btn-primary"
        >
          <Plus className="w-4 h-4" />
          Submit New Project
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="vamp-card p-4 animate-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)]">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-bold text-[var(--vamp-black)]">{totalProjects}</div>
              <div className="text-xs text-[var(--vamp-grey)]">Total Projects</div>
            </div>
          </div>
        </div>
        
        <div className="vamp-card p-4 animate-in" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-bold text-[var(--vamp-black)]">{publishedProjects}</div>
              <div className="text-xs text-[var(--vamp-grey)]">Published</div>
            </div>
          </div>
        </div>
        
        <div className="vamp-card p-4 animate-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <Triangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-bold text-[var(--vamp-black)]">{totalUpvotes}</div>
              <div className="text-xs text-[var(--vamp-grey)]">Total Upvotes</div>
            </div>
          </div>
        </div>
        
        <div className="vamp-card p-4 animate-in" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-bold text-[var(--vamp-black)]">{totalApplications}</div>
              <div className="text-xs text-[var(--vamp-grey)]">Grant Apps</div>
            </div>
          </div>
        </div>
        
        <div className="vamp-card p-4 animate-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-bold text-green-600">{approvedGrants}</div>
              <div className="text-xs text-[var(--vamp-grey)]">Grants Won</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Applications Alert */}
      {pendingApplications > 0 && (
        <div className="vamp-card p-4 mb-6 bg-yellow-50 border-yellow-200 animate-in">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div>
              <span className="font-medium text-yellow-800">
                {pendingApplications} grant {pendingApplications === 1 ? "application" : "applications"} pending review
              </span>
              <span className="text-yellow-700 text-sm ml-2">
                — Sponsors are reviewing your submissions
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="vamp-card p-12 text-center animate-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--vamp-orange-10)] mb-4">
            <Folder className="w-8 h-8 text-[var(--vamp-orange)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--vamp-black)] mb-2">
            No projects yet
          </h2>
          <p className="text-[var(--vamp-grey)] mb-6 max-w-md mx-auto">
            Submit your first vibecoded project to share with the community and apply for grants.
          </p>
          <Link href="/submit" className="vamp-btn vamp-btn-primary">
            <Plus className="w-4 h-4" />
            Submit Your First Project
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project, index) => {
            const statusStyle = PROJECT_STATUS_STYLES[project.status as keyof typeof PROJECT_STATUS_STYLES];
            const StatusIcon = statusStyle.icon;
            
            return (
              <div 
                key={project.id} 
                className="vamp-card overflow-hidden animate-in"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                {/* Project Header */}
                <div className="p-6 border-b border-[var(--vamp-grey-lighter)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <Link 
                          href={`/project/${project.id}`}
                          className="text-xl font-semibold text-[var(--vamp-black)] hover:text-[var(--vamp-orange)] transition-colors"
                        >
                          {project.title}
                        </Link>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusStyle.label}
                        </span>
                        {project.category && (
                          <span className="px-2 py-0.5 rounded-full bg-[var(--vamp-cream)] text-[var(--vamp-grey-dark)] text-xs">
                            {project.category.replace("_", " ")}
                          </span>
                        )}
                      </div>
                      <p className="text-[var(--vamp-grey)] line-clamp-2 mb-3">
                        {project.tagline}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-[var(--vamp-grey)]">
                        <span className="flex items-center gap-1">
                          <Triangle className="w-4 h-4" />
                          {project.upvoteCount} upvotes
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {project._count.comments} comments
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {project.viewCount} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/project/${project.id}`}
                        className="vamp-btn vamp-btn-outline py-1.5 px-3 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                      {project.status === "PUBLISHED" && (
                        <Link
                          href="/grants"
                          className="vamp-btn vamp-btn-primary py-1.5 px-3 text-sm"
                        >
                          <Gift className="w-4 h-4" />
                          Apply for Grant
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Grant Applications */}
                {project.grantApplications.length > 0 ? (
                  <div className="p-6 bg-[var(--vamp-cream)]/50">
                    <h4 className="font-medium text-[var(--vamp-black)] mb-4 flex items-center gap-2">
                      <Gift className="w-4 h-4 text-purple-600" />
                      Grant Applications ({project.grantApplications.length})
                    </h4>
                    
                    <div className="space-y-3">
                      {project.grantApplications.map((app) => {
                        const appStatusStyle = APPLICATION_STATUS_STYLES[app.status as keyof typeof APPLICATION_STATUS_STYLES];
                        const AppStatusIcon = appStatusStyle.icon;
                        
                        return (
                          <div 
                            key={app.id}
                            className={`flex items-center justify-between p-4 rounded-lg bg-white border ${
                              app.status === "APPROVED" 
                                ? "border-green-300 bg-green-50/50" 
                                : "border-[var(--vamp-grey-lighter)]"
                            }`}
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              {/* Sponsor Avatar */}
                              {app.grant.sponsor.image ? (
                                <img
                                  src={app.grant.sponsor.image}
                                  alt={app.grant.sponsor.name || "Sponsor"}
                                  className="w-10 h-10 rounded-full"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                  {app.grant.sponsor.name?.charAt(0) || "S"}
                                </div>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/grants/${app.grant.id}`}
                                  className="font-medium text-[var(--vamp-black)] hover:text-[var(--vamp-orange)] transition-colors"
                                >
                                  {app.grant.title}
                                </Link>
                                <div className="text-sm text-[var(--vamp-grey)]">
                                  by {app.grant.sponsor.name} • ${Number(app.grant.amount).toLocaleString()}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="text-xs text-[var(--vamp-grey)]">
                                Applied {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                              </span>
                              <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${appStatusStyle.color}`}>
                                <AppStatusIcon className="w-3 h-3" />
                                {appStatusStyle.label}
                              </span>
                              <Link
                                href={`/grants/${app.grant.id}`}
                                className="text-[var(--vamp-grey)] hover:text-[var(--vamp-orange)] transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : project.status === "PUBLISHED" ? (
                  <div className="p-6 bg-[var(--vamp-cream)]/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-[var(--vamp-grey)]">
                        <Gift className="w-4 h-4" />
                        No grant applications yet
                      </div>
                      <Link
                        href="/grants"
                        className="text-sm text-[var(--vamp-orange)] hover:underline flex items-center gap-1"
                      >
                        Browse available grants
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-10 vamp-card p-6 animate-in">
        <h3 className="font-semibold text-[var(--vamp-black)] mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[var(--vamp-orange)]" />
          Tips for Getting Grants
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded-lg bg-[var(--vamp-cream)]">
            <div className="font-medium text-[var(--vamp-black)] mb-1">Complete Your Project</div>
            <p className="text-[var(--vamp-grey)]">
              Add a detailed description, demo link, and tech stack to stand out
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--vamp-cream)]">
            <div className="font-medium text-[var(--vamp-black)] mb-1">Write a Good Application</div>
            <p className="text-[var(--vamp-grey)]">
              Explain why your project deserves the grant and how you'll use the funds
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--vamp-cream)]">
            <div className="font-medium text-[var(--vamp-black)] mb-1">Get More Upvotes</div>
            <p className="text-[var(--vamp-grey)]">
              Projects with more community support are more likely to win grants
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
