// src/app/forum/new/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NewThreadForm } from "@/components/forum/new-thread-form";
import { MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Start New Thread | VAMP Forum",
  description: "Start a new discussion in the VAMP community forum",
};

export default async function NewThreadPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/forum/new");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Link */}
      <Link
        href="/forum"
        className="inline-flex items-center gap-2 text-sm text-[var(--vamp-grey)] hover:text-[var(--vamp-black)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Forum
      </Link>

      {/* Header */}
      <div className="text-center mb-10 animate-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)] text-sm font-medium mb-4">
          <MessageSquare className="w-4 h-4" />
          <span>Start a Discussion</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--vamp-black)] tracking-tight mb-3">
          New <span className="vamp-gradient-text">Thread</span>
        </h1>
        
        <p className="text-[var(--vamp-grey)] max-w-lg mx-auto">
          Share your thoughts, ask questions, or show off your latest creation.
        </p>
      </div>

      {/* Form Card */}
      <div className="vamp-card p-6 md:p-8 animate-in" style={{ animationDelay: "0.1s" }}>
        <NewThreadForm />
      </div>
    </div>
  );
}
