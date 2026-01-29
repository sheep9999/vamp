// src/app/settings/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./settings-form";
import { Settings, User } from "lucide-react";

export const metadata = {
  title: "Settings",
  description: "Manage your VAMP profile settings",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/settings");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      image: true,
      website: true,
      twitter: true,
      github: true,
      role: true,
    },
  });

  if (!user) {
    redirect("/");
  }

  // If user has no role, redirect to onboarding first
  if (!user.role) {
    redirect("/onboarding");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8 animate-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)]">
            <Settings className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--vamp-black)]">Settings</h1>
        </div>
        <p className="text-[var(--vamp-grey)]">
          Manage your profile and account preferences
        </p>
      </div>

      {/* Profile Section */}
      <section className="vamp-card p-6 md:p-8 mb-6 animate-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--vamp-grey-lighter)]">
          <User className="w-5 h-5 text-[var(--vamp-grey)]" />
          <h2 className="font-semibold text-[var(--vamp-black)]">Profile Information</h2>
        </div>

        <SettingsForm user={user} />
      </section>

      {/* Danger Zone */}
      <section className="vamp-card p-6 border-red-200 animate-in" style={{ animationDelay: "0.2s" }}>
        <h2 className="font-semibold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-[var(--vamp-grey)] mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button 
          className="vamp-btn bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
          disabled
        >
          Delete Account (Coming Soon)
        </button>
      </section>
    </div>
  );
}
