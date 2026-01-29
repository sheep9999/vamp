// src/app/sign-in/page.tsx
"use client";

import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Zap, Github, Loader2 } from "lucide-react";
import { useState, useEffect, Suspense } from "react";

function SignInContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect away from sign-in page
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userRole = (session.user as any)?.role;
      // Small delay to ensure session is fully loaded
      const timer = setTimeout(() => {
        if (!userRole) {
          router.replace("/onboarding");
        } else {
          router.replace(callbackUrl === "/sign-in" ? "/" : callbackUrl);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [session, status, router, callbackUrl]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("github", { callbackUrl: "/" });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  // Show loading while checking session or if authenticated (redirecting)
  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--vamp-orange)] mx-auto mb-4" />
          <p className="text-[var(--vamp-grey)]">
            {status === "authenticated" ? "Redirecting..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-10 animate-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--vamp-orange)] text-white mb-6 shadow-lg">
            <Zap className="w-8 h-8" />
          </div>
          
          <h1 className="text-3xl font-bold text-[var(--vamp-black)] tracking-tight mb-2">
            Sign in to <span className="vamp-gradient-text">VAMP</span>
          </h1>
          
          <p className="text-[var(--vamp-grey)]">
            Join the vibecoding revolution
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-in">
            {error === "OAuthSignin" && "Error starting the sign in process."}
            {error === "OAuthCallback" && "Error during the sign in process."}
            {error === "OAuthCreateAccount" && "Could not create account. Please try again."}
            {error === "OAuthAccountNotLinked" && "This email is already associated with another account."}
            {error === "Default" && "An error occurred. Please try again."}
            {!["OAuthSignin", "OAuthCallback", "OAuthCreateAccount", "OAuthAccountNotLinked", "Default"].includes(error) && error}
          </div>
        )}

        {/* Sign In Card */}
        <div className="vamp-card p-8 animate-in" style={{ animationDelay: "0.1s" }}>
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-lg bg-[var(--vamp-black)] text-white font-medium hover:bg-[var(--vamp-charcoal)] transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Github className="w-5 h-5" />
                Continue with GitHub
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-[var(--vamp-grey-light)]">
              By signing in, you agree to our{" "}
              <a href="/terms" className="text-[var(--vamp-orange)] hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-[var(--vamp-orange)] hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center animate-in" style={{ animationDelay: "0.2s" }}>
          <div>
            <div className="text-2xl font-bold text-[var(--vamp-orange)]">500+</div>
            <div className="text-xs text-[var(--vamp-grey)]">Projects</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--vamp-orange)]">2.5k</div>
            <div className="text-xs text-[var(--vamp-grey)]">Makers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--vamp-orange)]">$50k</div>
            <div className="text-xs text-[var(--vamp-grey)]">In Grants</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignInLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--vamp-orange)] mx-auto mb-4" />
        <p className="text-[var(--vamp-grey)]">Loading...</p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInContent />
    </Suspense>
  );
}
