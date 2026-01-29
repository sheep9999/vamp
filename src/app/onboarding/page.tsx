// src/app/onboarding/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingForm } from "./onboarding-form";
import { Zap, Sparkles } from "lucide-react";

export const metadata = {
  title: "Welcome to VAMP",
  description: "Choose your role and join the vibecoding community",
};

export default async function OnboardingPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/onboarding");
  }

  // Check if user already has a role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role) {
    redirect("/");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10 animate-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--vamp-orange)] text-white mb-6 shadow-lg">
            <Zap className="w-10 h-10" />
          </div>
          
          <h1 className="text-3xl font-bold text-[var(--vamp-black)] tracking-tight mb-3">
            Welcome to{" "}
            <span className="vamp-gradient-text">VAMP</span>
          </h1>
          
          <p className="text-[var(--vamp-grey)]">
            Before we begin, tell us how you'd like to participate in the community.
          </p>
        </div>

        {/* Onboarding Form */}
        <OnboardingForm userName={session.user.name || "there"} />

        {/* Footer note */}
        <p className="text-center text-xs text-[var(--vamp-grey-light)] mt-8">
          You can change your role later in settings
        </p>
      </div>
    </div>
  );
}
