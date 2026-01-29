// src/app/submit/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/projects/project-form";
import { Zap, Sparkles } from "lucide-react";

export const metadata = {
  title: "Submit Your Project",
  description: "Share your vibecoded creation with the community",
};

// Disable caching for this page to always get fresh grants
export const dynamic = "force-dynamic";

export default async function SubmitPage() {
  const session = await getServerSession(authOptions);

  // Redirect to sign in if not authenticated
  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/submit");
  }

  // Check if user has completed onboarding
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  // If no role, redirect to onboarding
  if (!user?.role) {
    redirect("/onboarding");
  }

  // Fetch active grants for the dropdown
  // Simplified query - just get all OPEN grants
  const grants = await prisma.grant.findMany({
    where: {
      status: "OPEN",
    },
    select: {
      id: true,
      title: true,
      amount: true,
      deadline: true,
    },
    orderBy: { amount: "desc" },
  });

  // Filter out expired grants and convert Decimal to number
  const now = new Date();
  const grantsForForm = grants
    .filter((g: { deadline: Date | null }) => !g.deadline || new Date(g.deadline) >= now)
    .map((g: { id: string; title: string; amount: any }) => ({
      id: g.id,
      title: g.title,
      amount: Number(g.amount),
    }));

  // Debug log - check server console
  console.log(`[Submit Page] Found ${grantsForForm.length} active grants:`, grantsForForm);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10 animate-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)] text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Share your creation</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--vamp-black)] tracking-tight mb-3">
          Submit Your{" "}
          <span className="vamp-gradient-text">Vibe Project</span>
        </h1>
        
        <p className="text-[var(--vamp-grey)] max-w-lg mx-auto">
          Built something cool with AI assistance? Share it with the vibecoding 
          community and get feedback from fellow makers.
        </p>
      </div>

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-4 p-3 rounded bg-blue-50 border border-blue-200 text-blue-800 text-sm">
          Debug: Found {grantsForForm.length} active grants
        </div>
      )}

      {/* Form Card */}
      <div className="vamp-card p-6 md:p-8 animate-in" style={{ animationDelay: "0.1s" }}>
        <ProjectForm user={session.user} grants={grantsForForm} />
      </div>

      {/* Tips */}
      <div className="mt-8 p-6 rounded-xl bg-[var(--vamp-orange-10)] border border-[var(--vamp-orange-20)] animate-in" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[var(--vamp-orange)] text-white">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--vamp-black)] mb-1">
              Tips for a great submission
            </h3>
            <ul className="text-sm text-[var(--vamp-grey-dark)] space-y-1">
              <li>• Write a catchy tagline that explains what your project does</li>
              <li>• Include a demo link so people can try it out</li>
              <li>• Share your GitHub repo to inspire other builders</li>
              <li>• Tag all the AI tools you used in your workflow</li>
              {grantsForForm.length > 0 && (
                <li>• Apply for an active grant to get funding for your project!</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
