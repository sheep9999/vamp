"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Search,
  TrendingUp,
  Compass,
  Gift,
  MessageSquare,
  BookOpen,
  User,
  LogOut,
  ChevronDown,
  Zap,
  Settings,
  Rocket,
  Award,
  X,
  Folder,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Trending", icon: TrendingUp },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/grants", label: "Grants", icon: Gift },
  { href: "/forum", label: "Forum", icon: MessageSquare },
  { href: "/resources", label: "Resources", icon: BookOpen },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get role info
  const userRole = (session?.user as any)?.role as string | undefined;
  const roleMap = {
    VIBECODER: { label: "Vibecoder", icon: Rocket, color: "text-[var(--vamp-orange)]" },
    SPONSOR: { label: "Sponsor", icon: Award, color: "text-purple-600" },
    ADMIN: { label: "Admin", icon: Zap, color: "text-blue-600" },
  } as const;
  const roleInfo = (userRole && userRole in roleMap) 
    ? roleMap[userRole as keyof typeof roleMap] 
    : { label: "Member", icon: User, color: "text-[var(--vamp-grey)]" };

  // Handle keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        searchInputRef.current?.blur();
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      searchInputRef.current?.blur();
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-start)]/95 to-[var(--bg-mid)]/90 backdrop-blur-md border-b border-[var(--vamp-grey-lighter)]/30" />

      <nav className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--vamp-orange)] rounded-lg blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative flex items-center justify-center w-9 h-9 bg-[var(--vamp-orange)] rounded-lg shadow-md group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--vamp-black)] group-hover:text-[var(--vamp-orange)] transition-colors">
              VAMP
            </span>
          </Link>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className={cn(
              "hidden md:flex items-center relative flex-1 max-w-md mx-4 transition-all duration-300",
              isSearchFocused && "max-w-xl"
            )}
          >
            <Search className="absolute left-3 w-4 h-4 text-[var(--vamp-grey-light)] pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, grants..."
              className="vamp-search w-full"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 p-0.5 rounded hover:bg-[var(--vamp-grey-lighter)] text-[var(--vamp-grey-light)] hover:text-[var(--vamp-grey)]"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="absolute right-3 hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-[var(--vamp-grey-light)] bg-[var(--vamp-grey-lighter)]/50 rounded border border-[var(--vamp-grey-lighter)]">
                ⌘K
              </kbd>
            )}
          </form>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn("vamp-nav-link flex items-center gap-1.5", isActive && "active")}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {/* Submit/Sponsor Button - Always visible when logged in */}
            {session && (
              <Link
                href={userRole === "SPONSOR" ? "/grants/create" : "/submit"}
                className="hidden sm:flex vamp-btn vamp-btn-primary py-1.5 px-3 text-sm"
              >
                {userRole === "SPONSOR" ? (
                  <>
                    <Gift className="w-4 h-4" />
                    <span>Sponsor</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Submit</span>
                  </>
                )}
              </Link>
            )}

            {status === "loading" ? (
              <div className="w-9 h-9 rounded-full bg-[var(--vamp-grey-lighter)] animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-[var(--vamp-cream)] transition-colors"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-9 h-9 rounded-full ring-2 ring-[var(--vamp-orange)]/20"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[var(--vamp-orange)] flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <ChevronDown className={cn(
                    "w-4 h-4 text-[var(--vamp-grey)] transition-transform",
                    isProfileOpen && "rotate-180"
                  )} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 py-2 bg-white rounded-xl shadow-lg border border-[var(--vamp-grey-lighter)]/50 z-20 animate-in">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-[var(--vamp-grey-lighter)]/50">
                        <div className="flex items-center gap-3">
                          {session.user?.image ? (
                            <img
                              src={session.user.image}
                              alt={session.user.name || "User"}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[var(--vamp-orange)] flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[var(--vamp-black)] truncate">
                              {session.user?.name}
                            </p>
                            <div className={cn("flex items-center gap-1 text-xs", roleInfo.color)}>
                              <roleInfo.icon className="w-3 h-3" />
                              {roleInfo.label}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          href={`/${(session.user as any)?.username || ''}`}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--vamp-grey-dark)] hover:bg-[var(--vamp-cream)] hover:text-[var(--vamp-black)] transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Your Profile
                        </Link>
                        
                        <Link
                          href={userRole === "SPONSOR" ? "/grants/create" : "/submit"}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--vamp-orange)] hover:bg-[var(--vamp-orange-10)] transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          {userRole === "SPONSOR" ? (
                            <>
                              <Gift className="w-4 h-4" />
                              Sponsor Project
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4" />
                              Submit Project
                            </>
                          )}
                        </Link>
                        
                        {userRole === "SPONSOR" && (
                          <Link
                            href="/dashboard/grants"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            Manage Grants
                          </Link>
                        )}
                        
                        {userRole === "VIBECODER" && (
                          <Link
                            href="/dashboard/projects"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Folder className="w-4 h-4" />
                            Manage Projects
                          </Link>
                        )}
                        
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--vamp-grey-dark)] hover:bg-[var(--vamp-cream)] hover:text-[var(--vamp-black)] transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                      </div>

                      {/* Sign Out */}
                      <div className="border-t border-[var(--vamp-grey-lighter)]/50 pt-1 mt-1">
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[var(--vamp-grey-dark)] hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn("github", { callbackUrl: "/" })}
                className="vamp-btn vamp-btn-primary"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
