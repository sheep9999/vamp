"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { OnboardingCheck } from "@/components/auth/onboarding-check";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <OnboardingCheck />
      {children}
    </SessionProvider>
  );
}
