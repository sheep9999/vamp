"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

// This component only handles redirecting users without a role to onboarding
// from public pages like the homepage. Protected pages handle their own redirects.
export function OnboardingCheck() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run when session is loaded and user is authenticated
    if (status !== "authenticated" || !session?.user) return;

    const userRole = (session.user as any).role;
    
    // Pages that handle their own auth/redirect logic
    const selfHandledPages = ["/sign-in", "/onboarding", "/settings", "/submit"];
    const isSelfHandled = selfHandledPages.some(page => pathname.startsWith(page));
    
    if (isSelfHandled) return;

    // If user has no role and is on a public page, redirect to onboarding
    if (!userRole) {
      router.replace("/onboarding");
    }
  }, [session, status, pathname, router]);

  return null;
}
