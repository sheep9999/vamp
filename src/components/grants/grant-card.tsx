// src/components/grants/grant-card.tsx
import Link from "next/link";
import { Calendar, Users, ArrowRight, DollarSign } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface GrantCardProps {
  grant: {
    id: string;
    title: string;
    description: string;
    amount: number;
    currency: string;
    deadline: Date | null;
    maxRecipients: number;
    sponsor: {
      id: string;
      name: string | null;
      image: string | null;
      username: string | null;
    };
    applicationCount: number;
  };
}

export function GrantCard({ grant }: GrantCardProps) {
  const isDeadlineSoon = grant.deadline && 
    new Date(grant.deadline).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000; // 7 days

  const progress = grant.maxRecipients > 0 
    ? Math.min((grant.applicationCount / (grant.maxRecipients * 5)) * 100, 100) // Assume 5x applications per slot
    : 0;

  return (
    <Link href={`/grants/${grant.id}`} className="block group">
      <div className="vamp-card p-6 h-full hover:border-[var(--vamp-orange)] transition-all">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-[var(--vamp-black)] group-hover:text-[var(--vamp-orange)] transition-colors line-clamp-1">
              {grant.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {grant.sponsor.image ? (
                <img
                  src={grant.sponsor.image}
                  alt={grant.sponsor.name || "Sponsor"}
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[var(--vamp-grey-lighter)]" />
              )}
              <span className="text-sm text-[var(--vamp-grey)]">
                {grant.sponsor.name || grant.sponsor.username}
              </span>
            </div>
          </div>
          
          {/* Amount Badge */}
          <div className="flex-shrink-0">
            <div className="px-3 py-1.5 rounded-lg bg-[var(--vamp-orange)] text-white font-bold text-lg">
              ${grant.amount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--vamp-grey-dark)] line-clamp-2 mb-4">
          {grant.description}
        </p>

        {/* Progress Bar - Vibe Meter */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[var(--vamp-grey)]">
              <span className="font-medium text-[var(--vamp-black)]">{grant.applicationCount}</span> projects applied
            </span>
            <span className="text-[var(--vamp-grey)]">
              {grant.maxRecipients} {grant.maxRecipients === 1 ? "slot" : "slots"}
            </span>
          </div>
          <div className="h-2 bg-[var(--vamp-grey-lighter)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[var(--vamp-orange)] to-orange-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(progress, 5)}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--vamp-grey-lighter)]">
          <div className="flex items-center gap-4 text-xs text-[var(--vamp-grey)]">
            {grant.deadline && (
              <div className={`flex items-center gap-1 ${isDeadlineSoon ? "text-red-500 font-medium" : ""}`}>
                <Calendar className="w-3.5 h-3.5" />
                {isDeadlineSoon ? (
                  <span>Ends {formatDistanceToNow(new Date(grant.deadline!), { addSuffix: true })}</span>
                ) : (
                  <span>{format(new Date(grant.deadline!), "MMM d, yyyy")}</span>
                )}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{grant.maxRecipients} {grant.maxRecipients === 1 ? "recipient" : "recipients"}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-sm font-medium text-[var(--vamp-orange)] group-hover:gap-2 transition-all">
            View Details
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
