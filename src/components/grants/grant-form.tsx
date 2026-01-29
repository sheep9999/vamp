"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createGrant, type GrantFormState } from "@/actions/grants";
import { Loader2, DollarSign, Calendar, Users, FileText } from "lucide-react";

interface GrantFormProps {
  sponsorName: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full vamp-btn vamp-btn-primary py-3 text-base"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Creating Grant...
        </>
      ) : (
        <>
          <DollarSign className="w-5 h-5" />
          Create Grant
        </>
      )}
    </button>
  );
}

export function GrantForm({ sponsorName }: GrantFormProps) {
  const router = useRouter();
  const [state, formAction] = useFormState<GrantFormState | null, FormData>(
    createGrant,
    null
  );

  useEffect(() => {
    if (state?.success && state?.grantId) {
      router.push(`/grants/${state.grantId}`);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6">
      {/* Success Message */}
      {state?.success && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          {state.message}
        </div>
      )}

      {/* Error Message */}
      {state && !state.success && state.message && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {state.message}
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-[var(--vamp-black)]">
          Grant Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="e.g., AI Developer Tools Grant"
          className="vamp-input"
          required
        />
        {state?.errors?.title && (
          <p className="text-sm text-red-600">{state.errors.title[0]}</p>
        )}
      </div>

      {/* Amount & Recipients Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Amount */}
        <div className="space-y-2">
          <label htmlFor="amount" className="block text-sm font-medium text-[var(--vamp-black)]">
            Grant Amount (USD) *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--vamp-grey-light)]" />
            <input
              type="number"
              id="amount"
              name="amount"
              min="1"
              step="1"
              placeholder="500"
              className="vamp-input pl-9"
              required
            />
          </div>
          {state?.errors?.amount && (
            <p className="text-sm text-red-600">{state.errors.amount[0]}</p>
          )}
        </div>

        {/* Max Recipients */}
        <div className="space-y-2">
          <label htmlFor="maxRecipients" className="block text-sm font-medium text-[var(--vamp-black)]">
            Number of Recipients
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--vamp-grey-light)]" />
            <input
              type="number"
              id="maxRecipients"
              name="maxRecipients"
              min="1"
              defaultValue="1"
              className="vamp-input pl-9"
            />
          </div>
          <p className="text-xs text-[var(--vamp-grey-light)]">
            How many projects can receive this grant
          </p>
        </div>
      </div>

      {/* Deadline */}
      <div className="space-y-2">
        <label htmlFor="deadline" className="block text-sm font-medium text-[var(--vamp-black)]">
          Application Deadline
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--vamp-grey-light)]" />
          <input
            type="date"
            id="deadline"
            name="deadline"
            min={new Date().toISOString().split("T")[0]}
            className="vamp-input pl-9"
          />
        </div>
        <p className="text-xs text-[var(--vamp-grey-light)]">
          Leave empty for no deadline (rolling applications)
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-[var(--vamp-black)]">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          placeholder="Describe what this grant is for, what types of projects you're looking to fund, and any other relevant details..."
          className="vamp-input resize-none"
          required
        />
        <p className="text-xs text-[var(--vamp-grey-light)]">
          Supports Markdown formatting
        </p>
        {state?.errors?.description && (
          <p className="text-sm text-red-600">{state.errors.description[0]}</p>
        )}
      </div>

      {/* Requirements */}
      <div className="space-y-2">
        <label htmlFor="requirements" className="block text-sm font-medium text-[var(--vamp-black)]">
          Requirements
        </label>
        <textarea
          id="requirements"
          name="requirements"
          rows={4}
          placeholder="List any specific requirements or eligibility criteria for applicants..."
          className="vamp-input resize-none"
        />
        <p className="text-xs text-[var(--vamp-grey-light)]">
          Optional: Add specific eligibility requirements
        </p>
        {state?.errors?.requirements && (
          <p className="text-sm text-red-600">{state.errors.requirements[0]}</p>
        )}
      </div>

      {/* Preview */}
      <div className="p-4 rounded-lg bg-[var(--vamp-cream)] border border-[var(--vamp-grey-lighter)]">
        <div className="flex items-center gap-2 text-sm text-[var(--vamp-grey)]">
          <FileText className="w-4 h-4" />
          <span>This grant will be published by <strong className="text-[var(--vamp-black)]">{sponsorName}</strong></span>
        </div>
      </div>

      {/* Submit */}
      <SubmitButton />
    </form>
  );
}
