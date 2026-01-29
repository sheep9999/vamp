// src/app/[username]/not-found.tsx
import Link from "next/link";
import { UserX, Home, Search } from "lucide-react";

export default function ProfileNotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--vamp-cream)] mb-6">
          <UserX className="w-10 h-10 text-[var(--vamp-grey-light)]" />
        </div>
        
        <h1 className="text-2xl font-bold text-[var(--vamp-black)] mb-2">
          User Not Found
        </h1>
        <p className="text-[var(--vamp-grey)] mb-8 max-w-md">
          The profile you're looking for doesn't exist or may have been removed.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="vamp-btn vamp-btn-primary">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link href="/discover" className="vamp-btn vamp-btn-outline">
            <Search className="w-4 h-4" />
            Discover Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
