"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { updateApplicationStatus } from "@/actions/grants";

interface ApplicationActionsProps {
  applicationId: string;
  grantId: string;
  currentStatus: string;
}

export function ApplicationActions({ 
  applicationId, 
  grantId,
  currentStatus 
}: ApplicationActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [actionType, setActionType] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: "APPROVED" | "REJECTED") => {
    setActionType(newStatus);
    startTransition(async () => {
      const result = await updateApplicationStatus(applicationId, grantId, newStatus);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.message || "Failed to update status");
      }
      setActionType(null);
    });
  };

  // If already decided, show different UI
  if (currentStatus === "APPROVED") {
    return (
      <button
        onClick={() => handleStatusChange("REJECTED")}
        disabled={isPending}
        className="vamp-btn py-1.5 px-3 text-sm bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
      >
        {isPending && actionType === "REJECTED" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <XCircle className="w-4 h-4" />
        )}
        Revoke Approval
      </button>
    );
  }

  if (currentStatus === "REJECTED") {
    return (
      <button
        onClick={() => handleStatusChange("APPROVED")}
        disabled={isPending}
        className="vamp-btn py-1.5 px-3 text-sm bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
      >
        {isPending && actionType === "APPROVED" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CheckCircle className="w-4 h-4" />
        )}
        Approve Instead
      </button>
    );
  }

  // For pending/reviewing status
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleStatusChange("APPROVED")}
        disabled={isPending}
        className="vamp-btn py-1.5 px-3 text-sm bg-green-600 text-white hover:bg-green-700"
      >
        {isPending && actionType === "APPROVED" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CheckCircle className="w-4 h-4" />
        )}
        Approve
      </button>
      <button
        onClick={() => handleStatusChange("REJECTED")}
        disabled={isPending}
        className="vamp-btn py-1.5 px-3 text-sm bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
      >
        {isPending && actionType === "REJECTED" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <XCircle className="w-4 h-4" />
        )}
        Reject
      </button>
    </div>
  );
}
