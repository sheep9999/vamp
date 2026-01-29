// src/app/grants/create/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { GrantForm } from "@/components/grants/grant-form";
import { Gift, Sparkles, Shield } from "lucide-react";

export const metadata = {
  title: "Create Grant | VAMP",
  description: "Create a new grant to fund vibecoded projects",
};

export default async function CreateGrantPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/grants/create");
  }

  // Check if user is a sponsor
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, name: true },
  });

  if (user?.role !== "SPONSOR" && user?.role !== "ADMIN") {
    // Not a sponsor - show upgrade prompt
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="vamp-card p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--vamp-orange-10)] mb-6">
            <Shield className="w-8 h-8 text-[var(--vamp-orange)]" />
          </div>
          
          <h1 className="text-2xl font-bold text-[var(--vamp-black)] mb-3">
            Sponsor Access Required
          </h1>
          
          <p className="text-[var(--vamp-grey)] mb-6 max-w-md mx-auto">
            Creating grants is only available to sponsors. If you'd like to support 
            the vibecoding community by offering grants, please upgrade your account.
          </p>
          
          <a
            href="mailto:support@vamp.dev?subject=Sponsor%20Account%20Request"
            className="vamp-btn vamp-btn-primary"
          >
            Contact Us to Become a Sponsor
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10 animate-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)] text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Support the community</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--vamp-black)] tracking-tight mb-3">
          Create a <span className="vamp-gradient-text">Grant</span>
        </h1>
        
        <p className="text-[var(--vamp-grey)] max-w-lg mx-auto">
          Fund innovative projects built with AI assistance. Your grant will help 
          makers bring their ideas to life.
        </p>
      </div>

      {/* Form Card */}
      <div className="vamp-card p-6 md:p-8 animate-in" style={{ animationDelay: "0.1s" }}>
        <GrantForm sponsorName={user.name || "Sponsor"} />
      </div>

      {/* Tips */}
      <div className="mt-8 p-6 rounded-xl bg-[var(--vamp-orange-10)] border border-[var(--vamp-orange-20)] animate-in" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[var(--vamp-orange)] text-white">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--vamp-black)] mb-1">
              Tips for a great grant
            </h3>
            <ul className="text-sm text-[var(--vamp-grey-dark)] space-y-1">
              <li>• Be specific about what types of projects you're looking to fund</li>
              <li>• Set clear requirements so applicants know if they qualify</li>
              <li>• Consider offering multiple smaller grants to support more makers</li>
              <li>• A longer deadline gives more projects time to apply</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
