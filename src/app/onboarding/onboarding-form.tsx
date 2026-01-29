"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { setUserRole, type OnboardingState } from "@/actions/users";
import { Code2, Wallet, ArrowRight, Loader2, Check } from "lucide-react";

interface OnboardingFormProps {
  userName: string;
}

function SubmitButton({ role }: { role: string }) {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full vamp-btn vamp-btn-primary py-3 text-base mt-6"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Setting up...
        </>
      ) : (
        <>
          Continue as {role}
          <ArrowRight className="w-5 h-5" />
        </>
      )}
    </button>
  );
}

export function OnboardingForm({ userName }: OnboardingFormProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [state, formAction] = useFormState<OnboardingState | null, FormData>(
    setUserRole,
    null
  );

  useEffect(() => {
    if (state?.success && !isRedirecting) {
      setIsRedirecting(true);
      // Full page reload to get fresh session
      window.location.href = "/";
    }
  }, [state, isRedirecting]);

  if (isRedirecting) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--vamp-orange)] mx-auto mb-4" />
        <p className="text-[var(--vamp-grey)]">Setting up your account...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error message */}
      {state && !state.success && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-in">
          {state.message}
        </div>
      )}

      {/* Vibecoder Option */}
      <form action={formAction}>
        <input type="hidden" name="role" value="VIBECODER" />
        <div className="vamp-card p-6 hover:border-[var(--vamp-orange)] cursor-pointer transition-all group">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)] group-hover:bg-[var(--vamp-orange)] group-hover:text-white transition-colors">
              <Code2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-[var(--vamp-black)] mb-1">
                I'm a Vibecoder
              </h3>
              <p className="text-sm text-[var(--vamp-grey)] mb-4">
                I build projects with AI assistance and want to share my creations, 
                get feedback, and connect with other makers.
              </p>
              <ul className="space-y-2 text-sm text-[var(--vamp-grey-dark)]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--vamp-orange)]" />
                  Submit unlimited projects
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--vamp-orange)]" />
                  Apply for grants and sponsorships
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--vamp-orange)]" />
                  Build your maker reputation
                </li>
              </ul>
              <SubmitButton role="Vibecoder" />
            </div>
          </div>
        </div>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-[var(--vamp-grey-lighter)]" />
        <span className="text-xs text-[var(--vamp-grey-light)] font-medium">OR</span>
        <div className="flex-1 h-px bg-[var(--vamp-grey-lighter)]" />
      </div>

      {/* Sponsor Option */}
      <form action={formAction}>
        <input type="hidden" name="role" value="SPONSOR" />
        <div className="vamp-card p-6 hover:border-[var(--vamp-orange)] cursor-pointer transition-all group">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[var(--vamp-orange-10)] text-[var(--vamp-orange)] group-hover:bg-[var(--vamp-orange)] group-hover:text-white transition-colors">
              <Wallet className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-[var(--vamp-black)] mb-1">
                I'm a Sponsor
              </h3>
              <p className="text-sm text-[var(--vamp-grey)] mb-4">
                I want to support the vibecoding community by offering grants, 
                bounties, and sponsorships to talented builders.
              </p>
              <ul className="space-y-2 text-sm text-[var(--vamp-grey-dark)]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--vamp-orange)]" />
                  Create and manage grants
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--vamp-orange)]" />
                  Discover talented makers
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--vamp-orange)]" />
                  Support open source projects
                </li>
              </ul>
              <SubmitButton role="Sponsor" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
